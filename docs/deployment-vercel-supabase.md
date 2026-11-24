# Plano de produção: Vercel + Supabase

O CRM Central será executado com a interface e a API hospedadas na Vercel, usando o Supabase como PostgreSQL. O GitHub privado `adn0602/crmcentral` permanece como fonte do código.

## Conversão concluída no código

O backend deixou de usar `drizzle-orm/mysql2` e `mysql2` e passou a usar `drizzle-orm/postgres-js` com o pacote `postgres`. O schema usa `pgTable`, `pgEnum`, `serial`, `integer` e `numeric`, compatíveis com PostgreSQL. O upsert de usuários usa `onConflictDoUpdate`, em vez de `onDuplicateKeyUpdate`.

As migrações PostgreSQL foram separadas em `drizzle-pg/`, para não misturar o histórico antigo de MySQL com o banco novo do Supabase. A variável `DATABASE_URL` continuará sendo o ponto de configuração do runtime e também do Drizzle Kit.

## Sequência segura de implantação

Primeiro, o projeto Supabase precisa estar acessível e fornecer uma connection string PostgreSQL privada para o backend. Depois, essa variável deve ser cadastrada como segredo na Vercel, sem ser incluída no GitHub ou no frontend. Em seguida, a migração `drizzle-pg/0000_overrated_maximus.sql` deve ser aplicada ao banco Supabase e validada com uma consulta de saúde.

Após a migração, o backend deve ser ajustado ao modelo de execução da Vercel. A interface Vite pode ser publicada como saída estática, enquanto as rotas tRPC/Express precisam ficar atrás de uma função serverless ou de uma configuração de servidor compatível com Vercel. O endpoint `/api/health` deve continuar retornando sucesso sem autenticação para a verificação de disponibilidade.

Por fim, serão configuradas as variáveis de ambiente da aplicação, o domínio de produção e a autenticação. A importação do Notion e Google Sheets deve acontecer por uma rotina segura no servidor, nunca expondo tokens ou credenciais ao navegador.

## Estado atual

A conversão de código e a geração da migração foram validadas com `pnpm check`, `pnpm build` e `pnpm drizzle-kit generate`. A migração ainda não foi aplicada ao Supabase porque os conectores Vercel e Supabase aparecem desativados nesta tarefa e nenhuma `DATABASE_URL` real foi disponibilizada ao runtime. Nenhuma alteração foi feita no banco de produção.
