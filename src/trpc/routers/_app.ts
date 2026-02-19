import { createTRPCRouter } from '../init';
import { MessagesRouter } from '@/modules/messages/server/procedures';


export const appRouter = createTRPCRouter({
  messages: MessagesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;