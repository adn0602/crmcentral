import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { 
  getCrmCounts, 
  listCrmActivities, 
  listCrmContacts, 
  listCrmLeads, 
  listCrmSources,
  createCrmContact,
  updateCrmContact,
  deleteCrmContact
} from "./db";

export const appRouter = router({
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
    
    // Rotas de Escrita (Insert, Update, Delete) para Contatos
    createContact: publicProcedure
      .input((val: unknown) => val as any) 
      .mutation(({ input }) => createCrmContact(input)),
      
    updateContact: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(({ input }) => updateCrmContact(input.id, input.data)),
      
    deleteContact: publicProcedure
      .input((val: unknown) => val as any)
      .mutation(({ input }) => deleteCrmContact(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
