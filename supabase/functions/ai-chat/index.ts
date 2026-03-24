import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      messages, 
      maxTokens = 350, 
      temperature = 0.85,
      // Custom provider fields (optional)
      customBaseUrl,
      customApiKey,
      customModel,
      customReasoningLevel,
      isAnthropic,
    } = await req.json();

    // If custom provider is specified, use it directly
    if (customBaseUrl && customApiKey && customModel) {
      console.log("Using custom provider:", customBaseUrl, "model:", customModel);

      let response: Response;

      if (isAnthropic) {
        // Anthropic native format
        response = await fetch(`${customBaseUrl}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": customApiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: customModel,
            max_tokens: maxTokens,
            messages,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Custom Anthropic API error:", response.status, errorText);
          return new Response(
            JSON.stringify({ error: `Anthropic API error (${response.status}): ${errorText.substring(0, 200)}` }),
            { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const data = await response.json();
        const content = data.content?.[0]?.text?.trim() || "";
        return new Response(
          JSON.stringify({ content }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        // OpenAI-compatible format
        const body: any = {
          model: customModel,
          messages,
          max_tokens: maxTokens,
          temperature,
        };

        if (customReasoningLevel && customReasoningLevel !== 'none') {
          body.reasoning_effort = customReasoningLevel;
        }

        response = await fetch(`${customBaseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${customApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Custom API error:", response.status, errorText);
          return new Response(
            JSON.stringify({ error: `API error (${response.status}): ${errorText.substring(0, 200)}` }),
            { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Calling Lovable AI Gateway with messages:", messages.length);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI gateway error", details: errorText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || "";
    
    console.log("AI response received:", content.substring(0, 50) + "...");

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("ai-chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
