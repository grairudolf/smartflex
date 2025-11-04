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
    const { courses, preferences } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const prompt = `You are a smart timetable scheduling assistant. Given the following courses and preferences, suggest an optimal weekly schedule from Monday to Saturday, 7 AM to 7 PM.

Courses:
${JSON.stringify(courses, null, 2)}

User Preferences:
${preferences || 'No specific preferences provided'}

Rules:
1. Each course must be scheduled according to its duration (in consecutive hours)
2. Avoid scheduling back-to-back classes if possible
3. Try to balance the workload across days
4. Consider typical peak productivity times (morning and early afternoon)
5. Leave breaks between classes

Return a JSON array of scheduling suggestions in this format:
[
  {
    "courseId": "course_id",
    "day": "Monday",
    "startTime": 9,
    "reason": "Brief explanation why this time works well"
  }
]

Return ONLY the JSON array, no additional text.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a helpful scheduling assistant. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const suggestions = data.choices[0].message.content;
    
    // Try to parse as JSON, if it fails, extract JSON from markdown code blocks
    let parsedSuggestions;
    try {
      parsedSuggestions = JSON.parse(suggestions);
    } catch {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = suggestions.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
      if (jsonMatch) {
        parsedSuggestions = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    }

    return new Response(
      JSON.stringify({ suggestions: parsedSuggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in suggest-schedule:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
