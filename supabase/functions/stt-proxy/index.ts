import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio, providerId, baseUrl, apiKey, model } = await req.json();

    if (!audio || !apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: audio, apiKey" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let transcribedText = "";

    if (providerId === "grok2api-stt" || providerId === "xai-stt") {
      // Use Grok's chat completions with input_audio for transcription
      const effectiveBaseUrl = baseUrl || "https://api.x.ai/v1";
      const effectiveModel = model || "grok-4";

      const response = await fetch(`${effectiveBaseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: effectiveModel,
          messages: [
            {
              role: "system",
              content: "You are a precise speech-to-text transcription assistant. Your ONLY task is to accurately transcribe the audio content. Output ONLY the exact words spoken - no commentary, no formatting, no quotes, no explanations. If the audio is in English, transcribe in English. Preserve natural speech patterns."
            },
            {
              role: "user",
              content: [
                {
                  type: "input_audio",
                  input_audio: {
                    data: `data:audio/webm;base64,${audio}`,
                  }
                },
                {
                  type: "text",
                  text: "Transcribe this audio exactly. Output only the spoken words."
                }
              ]
            }
          ],
          temperature: 0.1,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return new Response(
          JSON.stringify({ error: `Grok STT error (${response.status}): ${errText.substring(0, 300)}` }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      transcribedText = data.choices?.[0]?.message?.content?.trim() || "";

      if (!transcribedText) {
        return new Response(
          JSON.stringify({ error: "Grok returned empty transcription" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      // Generic OpenAI-compatible /audio/transcriptions endpoint
      const effectiveBaseUrl = baseUrl || "https://api.openai.com/v1";

      // Decode base64 audio to binary
      const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
      const audioBlob = new Blob([binaryAudio], { type: "audio/webm" });

      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");
      formData.append("model", model || "whisper-1");

      const response = await fetch(`${effectiveBaseUrl}/audio/transcriptions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errText = await response.text();
        return new Response(
          JSON.stringify({ error: `STT API error (${response.status}): ${errText.substring(0, 300)}` }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      transcribedText = data.text || "";
    }

    return new Response(
      JSON.stringify({ text: transcribedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("stt-proxy error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
