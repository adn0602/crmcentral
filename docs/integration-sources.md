# Fontes autorizadas para integração do CRM Central

## Contas autorizadas

- Notion: workspace `Notion de Alexandre Damasceno do Nascimento`, usuário `Alexandre Damasceno do Nascimento`, e-mail `adn0602@gmail.com`.
- Google Workspace: conta ativa `adn0602@gmail.com`.
- GitHub: conta `adn0602`, repositório privado criado como `https://github.com/adn0602/crmcentral`.

## Notion

### Base principal de leads
- Database: `Leads`
- Database URL: `https://app.notion.com/p/faeb2dbf6c5d44eeb4d601b3b6a5ab79`
- Data source: `collection://00ee2245-b2bf-40e0-8333-426bb719a0b4`
- Campos: título/nome, Bairro Desejado, Data de Entrada, E-mail, Lançamentos, Notas, Objetivo, Origem, Perfil, Prontos, Próxima Ação, Região, Status, Telefone, Temperatura, Tipologia, Valor Estimado/cliente, Última Interação.
- Status encontrados: Primeiro contato, Contato realizado, Qualificado, Curadoria, Opções enviadas, Visita agendada, Visita realizada, Proposta, Negociação, Pós-venda.
- Origens encontradas: Indicação, Facebook, Site, Frio/Telemarketing, Stand, Inforce, Instagram, WhatsApp, Portal, Lista de leads, Tráfego pago, Outro.
- Temperaturas: Quente, Morno, Frio, Sem classificação.

### Bases auxiliares identificadas
- `CRM 2026/2027` simples: `collection://3d8a2225-4193-8048-a780-000be4f0b17c`, contém apenas Nome.
- `CRM 2026/2027` de tarefas: `collection://1aea2225-4193-83be-ad90-87e7d3676990`, contém Nome da tarefa, Descrição, Data de vencimento, Etiquetas, Nível de prioridade, Arquivo e Status. Não é fonte primária de contatos.

## Google Sheets

### CRM Imobiliário - Leads, Imóveis e Atividades
- Spreadsheet ID: `18-TUT2DmJOfxFtSpBCAzl2-lQy66rsx092TLzHJ4KIw`
- URL: `https://docs.google.com/spreadsheets/d/18-TUT2DmJOfxFtSpBCAzl2-lQy66rsx092TLzHJ4KIw/edit`
- Abas relevantes:
  - `Leads`, tabela `tblLeads`: LeadID, DataEntrada, Nome, Telefone, Email, Origem, ImovelID, Empreendimento, TipoInteresse, Valor a partir de, Etapa, Status, UltimaInteracao, ProximaAcao, Prioridade, MotivoPerda, Observacoes.
  - `Imóveis`, tabela `tblImoveis`: ImovelID, Empreendimento, Incorporadora, Bairro, Endereço, Data de Entrega, Linha de tabela, Disponibilidade, Fase da obra, Links, Observações.
  - `Atividades`, tabela `tblAtividades`: AtividadeID, LeadID, Data, TipoAtividade, Resultado, ProximaAcao, DataProximaAcao, Observacoes.
- Amostra observada: leads com origem Inforce, empreendimento e tipo de interesse imobiliário, além de datas e valores em formatos variados.

### CRM Imobiliário - Base de Leads
- Spreadsheet ID: `11gfR4qj0fVSG1oD59CRLeZUjPqaU1GvSmso9wPic9_w`
- URL: `https://docs.google.com/spreadsheets/d/11gfR4qj0fVSG1oD59CRLeZUjPqaU1GvSmso9wPic9_w/edit`
- Aba: `Respostas ao formulário 1`, tabela `Form_Responses`.
- Campos: Carimbo de data/hora, Nome do Cliente, Telefone / WhatsApp, Perfil, Status, Região de Interesse, Bairro de Interesse, Tipologia Desejada, Origem do Lead, Faixa de Valor, Proxima Ação, Data do Próximo Follow-up.
- A aba contém uma base histórica de leads capturados por formulário.

### Gestão_Clientes_2026_Estruturada
- Spreadsheet ID: `1n3L9u06LFOQX-CGw7jZzD6H3k7C8ZxNfRS7G2xPZ5NY`
- URL: `https://docs.google.com/spreadsheets/d/1n3L9u06LFOQX-CGw7jZzD6H3k7C8ZxNfRS7G2xPZ5NY/edit`
- Abas: Dashboard, Clientes, Listas, Follow-up, Kanban e Fórmulas.
- A aba `Clientes` não expõe uma tabela nomeada no metadado; precisa de leitura da primeira linha para determinar os cabeçalhos antes do mapeamento.

## Mapeamento inicial para o CRM Central

- `Nome` / `Nome do Cliente` / título do Notion -> `contacts.name`.
- `Telefone` / `Telefone / WhatsApp` -> `contacts.phone`.
- `Email` / `E-mail` -> `contacts.email`.
- `Empreendimento`, `Região`, `Bairro Desejado` e `Bairro de Interesse` -> empresa/interesse e campos auxiliares.
- `Origem` / `Origem do Lead` -> `leads.source`.
- `Status`, `Etapa`, `Objetivo` e `Temperatura` -> status/etapa/probabilidade do CRM.
- `Valor a partir de`, `Faixa de Valor` e `Valor Estimado/cliente` -> valor estimado.
- `Próxima Ação` / `Proxima Ação` e datas correspondentes -> `activities.nextAction`.
- IDs externos e URL da fonte devem ser preservados para deduplicação e rastreabilidade.

## Regra de segurança

A leitura foi feita sem editar Notion ou Google Sheets. Antes de uma importação persistente, o CRM deve apresentar prévia, contagem, conflitos e regra de deduplicação. As fontes originais não devem ser sobrescritas.

## Resultado da auditoria de leitura

A base do Notion retornou **39 registros**. A aba `Leads` da planilha principal retornou **4 linhas de dados**, além do cabeçalho; `Atividades` retornou **1 atividade**. A aba `Clientes` da planilha estruturada retornou **34 clientes**, além do cabeçalho. A aba `Follow-up` informa que não há follow-ups pendentes, e a aba `Respostas ao formulário 1` está atualmente somente com o cabeçalho, sem respostas.

Foram observados candidatos claros à unificação entre Notion e a planilha estruturada, como Caio Miraldi e Daiana Dias, com telefone coincidente; também há variações de nome como `Analice` e `Analice Braga`, além de diferenças de capitalização, espaços, acentos e formatação de telefone. Há ainda registros duplicados dentro do próprio Notion, como Marcos Pacheco em diferentes páginas e datas, e números de telefone repetidos em registros distintos. Por isso, a importação não deve usar nome isoladamente como chave.

A regra recomendada é aplicar, nesta ordem: e-mail válido normalizado; telefone normalizado com DDI/DDD; e, apenas quando os dois estiverem ausentes, nome normalizado combinado com empreendimento ou bairro. Quando houver conflito de atributos — por exemplo, o mesmo telefone com nomes diferentes — o registro deve ficar em uma fila de revisão, preservando todas as fontes, URLs e IDs externos, sem sobrescrever silenciosamente o dado mais recente.

A fonte inicial de verdade para o pipeline será o Notion `Leads`, por conter o maior conjunto de campos operacionais e os registros mais recentes. As planilhas serão tratadas como fontes complementares: `Clientes` para histórico e campos comerciais; `Leads` para IDs e atividades estruturadas; `Atividades` para timeline; e a base de formulário para futuras entradas. Essa decisão pode ser alterada posteriormente no painel de importação, mas não deve ser aplicada de forma destrutiva.
