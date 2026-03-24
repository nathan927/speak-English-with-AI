import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, providerId, baseUrl, apiKey, model, voiceId, speed, testOnly } = await req.json();

    if (!text || !providerId || !apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: text, providerId, apiKey" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let audioBase64 = "";

    if (providerId === "elevenlabs") {
      const url = `${baseUrl || "https://api.elevenlabs.io/v1"}/text-to-speech/${voiceId}?output_format=mp3_44100_128`;
      const body: any = {
        text,
        model_id: model || "eleven_multilingual_v2",
      };
      if (speed && speed !== 1.0) {
        body.voice_settings = { stability: 0.5, similarity_boost: 0.75, speed };
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "xi-api-key": apiKey, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errText = await response.text();
        return new Response(
          JSON.stringify({ error: `ElevenLabs error (${response.status}): ${errText.substring(0, 200)}` }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const audioBuffer = await response.arrayBuffer();
      audioBase64 = base64Encode(audioBuffer);

    } else if (providerId === "openai-tts") {
      const url = `${baseUrl || "https://api.openai.com/v1"}/audio/speech`;
      const body: any = {
        model: model || "tts-1-hd",
        input: text,
        voice: voiceId || "nova",
        response_format: "mp3",
      };
      if (speed) body.speed = speed;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errText = await response.text();
        return new Response(
          JSON.stringify({ error: `OpenAI TTS error (${response.status}): ${errText.substring(0, 200)}` }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const audioBuffer = await response.arrayBuffer();
      audioBase64 = base64Encode(audioBuffer);

    } else if (providerId === "minimax-tts") {
      const url = `${baseUrl || "https://api.minimax.chat/v1"}/t2a_v2`;
      const body: any = {
        model: model || "speech-02-hd",
        text,
        voice_setting: { voice_id: voiceId || "presenter_female" },
      };
      if (speed) body.audio_setting = { speed: speed };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errText = await response.text();
        return new Response(
          JSON.stringify({ error: `MiniMax TTS error (${response.status}): ${errText.substring(0, 200)}` }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const data = await response.json();
      audioBase64 = data.data?.audio || data.audio_file || "";

      if (!audioBase64) {
        return new Response(
          JSON.stringify({ error: "MiniMax returned no audio data" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

    } else {
      // Generic: try OpenAI-compatible /audio/speech endpoint
      const effectiveBaseUrl = baseUrl || "https://api.openai.com/v1";
      const body: any = {
        model: model || "tts-1",
        input: text,
        voice: voiceId || "alloy",
        response_format: "mp3",
      };
      if (speed) body.speed = speed;

      const response = await fetch(`${effectiveBaseUrl}/audio/speech`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errText = await response.text();
        return new Response(
          JSON.stringify({ error: `TTS API error (${response.status}): ${errText.substring(0, 200)}` }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const audioBuffer = await response.arrayBuffer();
      audioBase64 = base64Encode(audioBuffer);
    }

    if (testOnly) {
      return new Response(
        JSON.stringify({ success: true, message: "TTS test successful", audioLength: audioBase64.length }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ audioContent: audioBase64, format: "mp3" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("tts-proxy error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
