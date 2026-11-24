# CRM Central — Plano de implementação

## Objetivo
Criar um CRM web próprio para organizar clientes, empresas, leads, oportunidades e atividades em um único espaço. A primeira entrega será uma interface funcional com dados demonstrativos e estrutura preparada para persistência e importação autorizada do Notion e Google Sheets.

## Escopo da primeira versão
- Dashboard com indicadores de pipeline, leads, clientes e tarefas.
- Lista de contatos com busca, filtros e visão de detalhes.
- Funil de oportunidades em Kanban, com etapas, valores e responsáveis.
- Atividades recentes e próximas tarefas.
- Área de fontes de dados com Notion e Google Sheets como conexões futuras.
- Importação preparada para normalização, mapeamento de campos e deduplicação.

## Arquitetura
- Frontend: React + TypeScript + Wouter + Tailwind CSS + componentes Radix existentes.
- Backend: Express/tRPC já fornecido pelo template.
- Dados: estado demonstrativo no frontend nesta primeira entrega; schema Drizzle será expandido quando as fontes forem autorizadas e o modelo real de dados for confirmado.
- Rotas: `/` como workspace principal e `/404` como fallback do template.
- Futuro: tabelas `companies`, `contacts`, `leads`, `opportunities`, `activities` e `data_sources`, com importadores isolados para Notion e Google Sheets.

## Design

### Direções consideradas
- **Painel Executivo** — 0,06: azul vibrante, interface operacional e densa.
- **Âmbar Operacional** — 0,04: superfícies claras, tipografia forte e destaques âmbar para prioridade e conversão.
- **Verde Sinal** — 0,08: verde profundo, progresso e crescimento sustentável.

### Direção escolhida: Âmbar Operacional
- **Movimento:** SaaS editorial de operações comerciais, com inspiração em dashboards de revenue operations.
- **Princípios:** leitura rápida; hierarquia por prioridade; densidade confortável; ações sempre próximas do contexto.
- **Filosofia de cor:** base marfim/quente para reduzir a frieza de back-office; âmbar como assinatura de atenção e conversão; carvão e cinzas para contraste e confiabilidade.
- **Paradigma de layout:** navegação lateral fixa, faixa superior contextual e painéis assimétricos que priorizam pipeline e próximas ações; evitar uma grade rígida de cartões iguais.
- **Elementos assinatura:** marca em forma de cometa, chips de status âmbar, barras de progresso com trilha suave e cartões com cantos moderados.
- **Interação:** mudanças de etapa e filtros devem ser instantaneamente legíveis; hover discreto, foco evidente e ações primárias com rótulos claros.
- **Animação:** entrada suave dos painéis (150–220ms), microelevação no hover e transições curtas em barras/contadores; sem animações decorativas contínuas.
- **Tipografia:** Manrope para títulos e números; Inter para dados, navegação e microcopy.
- **Essência:** um cockpit comercial caloroso para transformar dados dispersos em próximos passos claros. Personalidade: preciso, próximo, decisivo.
- **Voz:** direta e encorajadora. Exemplos: “Veja onde agir hoje.” / “Seu pipeline está em movimento.”
- **Wordmark:** “CRM Central” com o C formado por um pequeno cometa âmbar, sugerindo movimento entre fontes e oportunidades.
- **Cor proprietária:** âmbar queimado `#D97706`.

## Estrutura de projeto
- `client/src/pages/Home.tsx`: workspace CRM, navegação interna, dashboard, contatos, pipeline e fontes.
- `client/src/index.css`: tokens visuais, tipografia, superfícies, estados e responsividade.
- `client/src/App.tsx`: composição de tema e roteamento.
- `drizzle/schema.ts`: schema base de usuários; extensão de domínio será feita após validar os campos das fontes reais.
- `server/routers.ts` e `server/db.ts`: ponto de entrada para consultas persistentes, importação e sincronização.
- `public/manus-routes.json`: manifesto de rotas do site.

## Integrações futuras
A conexão com Notion e Google Sheets será feita somente após autorização explícita das contas. O fluxo previsto é: selecionar fonte, inspecionar campos, pré-visualizar registros, mapear colunas, detectar duplicidades, importar para o CRM e registrar origem/última sincronização. O CRM Central será a fonte operacional principal; as fontes externas serão tratadas como origens sincronizáveis.
