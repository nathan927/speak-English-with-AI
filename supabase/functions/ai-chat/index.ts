import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function validateMessages(messages: unknown): messages is Array<{ role: string; content: string }> {
  if (!Array.isArray(messages)) return false;
  if (messages.length === 0 || messages.length > 50) return false;
  for (const msg of messages) {
    if (!msg || typeof msg !== 'object') return false;
    if (!msg.role || typeof msg.role !== 'string') return false;
    if (!['system', 'user', 'assistant'].includes(msg.role)) return false;
    if (!msg.content || typeof msg.content !== 'string') return false;
    if (msg.content.length > 50000) return false;
  }
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { 
      messages, 
      maxTokens, 
      temperature,
      customBaseUrl,
      customApiKey,
      customModel,
      customReasoningLevel,
      isAnthropic,
    } = body;

    // Input validation
    if (!validateMessages(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages must be an array of 1-50 valid message objects" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const safeMaxTokens = Math.max(1, Math.min(Number(maxTokens) || 350, 8192));
    const safeTemperature = Math.max(0, Math.min(Number(temperature) || 0.85, 2));

    // If custom provider is specified, use it directly
    if (customBaseUrl && customApiKey && customModel) {
      console.log("Using custom provider, model:", customModel);

      let response: Response;

      if (isAnthropic) {
        response = await fetch(`${customBaseUrl}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": customApiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: customModel,
            max_tokens: safeMaxTokens,
            messages,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Custom Anthropic API error:", response.status, errorText);
          return new Response(
            JSON.stringify({ error: response.status === 429 ? "Rate limit exceeded, please try again later." : "AI service request failed. Please check your provider settings." }),
            { status: response.status >= 500 ? 502 : response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const data = await response.json();
        const content = data.content?.[0]?.text?.trim() || "";
        return new Response(
          JSON.stringify({ content }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        const reqBody: any = {
          model: customModel,
          messages,
          max_tokens: safeMaxTokens,
          temperature: safeTemperature,
        };

        if (customReasoningLevel && customReasoningLevel !== 'none') {
          reqBody.reasoning_effort = customReasoningLevel;
        }

        response = await fetch(`${customBaseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${customApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reqBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Custom API error:", response.status, errorText);
          return new Response(
            JSON.stringify({ error: response.status === 429 ? "Rate limit exceeded, please try again later." : "AI service request failed. Please check your provider settings." }),
            { status: response.status >= 500 ? 502 : response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content?.trim() || "";
        return new Response(
          JSON.stringify({ content }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // Default: use Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("AI service is not configured");
    }

    console.log("Calling AI gateway with messages:", messages.length);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        max_tokens: safeMaxTokens,
        temperature: safeTemperature,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please check your account." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || "";
    
    console.log("AI response received, length:", content.length);

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("ai-chat error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
