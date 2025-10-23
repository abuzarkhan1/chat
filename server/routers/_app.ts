import { router } from '../trpc';
import { authRouter } from './auth';
import { modelsRouter } from './models';
import { chatRouter } from './chat';

export const appRouter = router({
  auth: authRouter,
  models: modelsRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
