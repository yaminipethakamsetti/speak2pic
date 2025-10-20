import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioData, language } = await req.json();
    
    if (!audioData) {
      throw new Error('No audio data provided');
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    console.log('Transcribing audio with language:', language || 'auto-detect');

    // Extract base64 audio from data URI
    const base64Audio = audioData.split(',')[1];
    
    // Prepare the request for Gemini API
    const prompt = language === 'auto' || !language
      ? "Please transcribe this audio to English. If the audio is in another language, first transcribe it and then translate to English."
      : language === 'en'
      ? "Please transcribe this audio to English."
      : "Please transcribe this audio (it's in Hindi) and translate it to English.";

    // Call Gemini API for transcription
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "audio/webm",
                  data: base64Audio
                }
              }
            ]
          }]
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const result = await response.json();
    console.log('Gemini response:', JSON.stringify(result));

    const transcribedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!transcribedText) {
      throw new Error('No transcription returned from Gemini');
    }

    return new Response(
      JSON.stringify({ text: transcribedText.trim() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in transcribe-audio function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
