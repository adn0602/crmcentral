import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getCrmCounts, listCrmActivities, listCrmContacts, listCrmLeads, listCrmSources } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  crm: router({
    counts: publicProcedure.query(() => getCrmCounts()),
    contacts: publicProcedure.query(() => listCrmContacts()),
    leads: publicProcedure.query(() => listCrmLeads()),
    activities: publicProcedure.query(() => listCrmActivities()),
    sources: publicProcedure.query(() => listCrmSources()),
  }),

});

export type AppRouter = typeof appRouter;
