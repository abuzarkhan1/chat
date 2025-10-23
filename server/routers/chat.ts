import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { supabase } from '@/lib/supabase';
import { TRPCError } from '@trpc/server';

async function callAIModel(prompt: string, modelTag: string): Promise<string> {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (modelTag.startsWith('gpt-')) {
    if (!openaiApiKey) {
      return `You said: "${prompt}"`;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: modelTag,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'OpenAI API request failed');
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || 'No response from model';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return `You said: "${prompt}"`;
    }
  }

  if (modelTag.startsWith('gemini-')) {
    if (!geminiApiKey) {
      return `You said: "${prompt}"`;
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelTag}:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Gemini API request failed');
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from model';
    } catch (error) {
      console.error('Gemini API error:', error);
      return `You said: "${prompt}"`;
    }
  }

  return `You said: "${prompt}"`;
}

export const chatRouter = router({
  send: protectedProcedure
    .input(
      z.object({
        modelTag: z.string(),
        prompt: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data: userMessage, error: userError } = await supabase
        .from('messages')
        .insert({
          user_id: ctx.userId,
          model_tag: input.modelTag,
          role: 'user',
          content: input.prompt,
        })
        .select()
        .single();

      if (userError) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: userError.message,
        });
      }

      let aiResponse: string;
      try {
        aiResponse = await callAIModel(input.prompt, input.modelTag);
      } catch (error) {
        aiResponse = `Error: ${error instanceof Error ? error.message : 'Failed to get AI response'}`;
      }

      const { data: assistantMessage, error: assistantError } = await supabase
        .from('messages')
        .insert({
          user_id: ctx.userId,
          model_tag: input.modelTag,
          role: 'assistant',
          content: aiResponse,
        })
        .select()
        .single();

      if (assistantError) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: assistantError.message,
        });
      }

      return {
        userMessage,
        assistantMessage,
      };
    }),

  history: protectedProcedure.query(async ({ ctx }) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', ctx.userId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }

    return data;
  }),

  deleteMessage: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', input.messageId)
        .eq('user_id', ctx.userId);

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return { success: true };
    }),
});
