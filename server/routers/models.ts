import { router, protectedProcedure } from '../trpc';
import { supabase } from '@/lib/supabase';
import { TRPCError } from '@trpc/server';

export const modelsRouter = router({
  getAvailable: protectedProcedure.query(async () => {
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: error.message,
      });
    }

    return data;
  }),
});
