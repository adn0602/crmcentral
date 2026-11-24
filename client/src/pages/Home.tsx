import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Cloud,
  Database,
  FileSpreadsheet,
  Filter,
  Gauge,
  Globe2,
  LayoutDashboard,
  ListFilter,
  Mail,
  MoreHorizontal,
  PackageOpen,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Target,
  UploadCloud,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const contacts = [
  { id: 1, initials: "MC", name: "Marina Costa", company: "Nuvem Studio", role: "Diretora de Marketing", email: "marina@nuvem.studio", status: "Cliente", source: "Indicação", owner: "Você", last: "Hoje, 09:42", value: "R$ 48.000", tone: "amber" },
  { id: 2, initials: "RL", name: "Rafael Lima", company: "Orbe Finance", role: "Head de Operações", email: "rafael@orbefinance.com", status: "Oportunidade", source: "LinkedIn", owner: "Camila", last: "Ontem, 16:10", value: "R$ 32.500", tone: "blue" },
  { id: 3, initials: "AS", name: "Ana Souza", company: "Terralab", role: "CEO", email: "ana@terralab.com.br", status: "Lead qualificado", source: "Google", owner: "Você", last: "20 nov, 11:24", value: "R$ 18.000", tone: "green" },
  { id: 4, initials: "JP", name: "João Pedro", company: "Vértice Log", role: "Gerente Comercial", email: "joao@verticelog.com", status: "Lead novo", source: "Planilha", owner: "Bruno", last: "18 nov, 14:50", value: "R$ 12.800", tone: "slate" },
  { id: 5, initials: "CF", name: "Clara Freitas", company: "Ateliê Norte", role: "Sócia-fundadora", email: "clara@atelienorte.com", status: "Cliente", source: "Instagram", owner: "Camila", last: "16 nov, 08:05", value: "R$ 9.600", tone: "purple" },
];

const opportunities = [
  { id: 1, name: "Expansão de CRM", company: "Nuvem Studio", contact: "Marina Costa", value: 48000, stage: "Proposta", probability: 75, owner: "Você", color: "amber", due: "28 nov" },
  { id: 2, name: "Operação comercial", company: "Orbe Finance", contact: "Rafael Lima", value: 32500, stage: "Diagnóstico", probability: 45, owner: "Camila", color: "blue", due: "02 dez" },
  { id: 3, name: "Dados & automação", company: "Terralab", contact: "Ana Souza", value: 18000, stage: "Qualificado", probability: 30, owner: "Você", color: "green", due: "06 dez" },
  { id: 4, name: "Playbook de vendas", company: "Vértice Log", contact: "João Pedro", value: 12800, stage: "Novo lead", probability: 15, owner: "Bruno", color: "slate", due: "11 dez" },
  { id: 5, name: "Renovação anual", company: "Ateliê Norte", contact: "Clara Freitas", value: 9600, stage: "Fechamento", probability: 90, owner: "Camila", color: "purple", due: "25 nov" },
];

const activities = [
  { type: "call", title: "Ligação com Marina Costa", meta: "Nuvem Studio · Você", time: "Há 18 min", icon: "phone", color: "amber" },
  { type: "mail", title: "E-mail enviado para Rafael Lima", meta: "Orbe Finance · Camila", time: "Há 1 h", icon: "mail", color: "blue" },
  { type: "meeting", title: "Reunião de diagnóstico agendada", meta: "Terralab · Você", time: "Amanhã, 10:00", icon: "calendar", color: "green" },
  { type: "note", title: "Nota adicionada ao negócio", meta: "Vértice Log · Bruno", time: "Ontem, 14:50", icon: "note", color: "slate" },
];

const sourceRows = [
  { name: "Notion", description: "Páginas e bases selecionadas", icon: Database, accent: "violet", status: "Pronto para conectar", records: "—" },
  { name: "Google Sheets", description: "Planilhas de leads e clientes", icon: FileSpreadsheet, accent: "green", status: "Pronto para conectar", records: "—" },
];

const stages = ["Novo lead", "Qualificado", "Diagnóstico", "Proposta", "Fechamento"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}

function formatCompactCurrency(value: number) {
  return `R$ ${(value / 1000).toFixed(1).replace(".", ",")}k`;
}

function Avatar({ initials, tone = "amber", small = false }: { initials: string; tone?: string; small?: boolean }) {
  return <span className={`avatar avatar-${tone} ${small ? "avatar-small" : ""}`}>{initials}</span>;
}

function StatusPill({ label }: { label: string }) {
  const colors: Record<string, string> = {
    Cliente: "status-green",
    Oportunidade: "status-blue",
    "Lead qualificado": "status-amber",
    "Lead novo": "status-slate",
  };
  return <span className={`status-pill ${colors[label] ?? "status-slate"}`}><span className="status-dot" />{label}</span>;
}

function MetricCard({ label, value, change, detail, icon: Icon, tone }: { label: string; value: string; change: string; detail: string; icon: typeof Users; tone: string }) {
  const positive = !change.startsWith("-");
  return (
    <div className="metric-card">
      <div className="metric-topline"><span>{label}</span><span className={`metric-icon metric-${tone}`}><Icon size={17} /></span></div>
      <div className="metric-value">{value}</div>
      <div className="metric-foot"><span className={positive ? "metric-up" : "metric-down"}>{positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}{change}</span><span>{detail}</span></div>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState("overview");
  const [query, setQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<(typeof contacts)[number] | null>(null);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [completedAgenda, setCompletedAgenda] = useState<number[]>([]);
  const [pipelineMode, setPipelineMode] = useState<"board" | "list">("board");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const filteredContacts = useMemo(() => contacts.filter(contact => `${contact.name} ${contact.company} ${contact.email}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const pipelineTotal = opportunities.reduce((sum, item) => sum + item.value, 0);

  const navigate = (nextView: string) => {
    setView(nextView);
    if (nextView !== "contacts") setSelectedContact(null);
  };

  const completeTask = (index: number) => {
    setCompletedTasks(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
    toast.success(completedTasks.includes(index) ? "Tarefa reaberta" : "Tarefa concluída", { description: "A atividade foi atualizada no seu workspace." });
  };

  const completeAgenda = (index: number) => {
    setCompletedAgenda(current => current.includes(index) ? current.filter(item => item !== index) : [...current, index]);
    toast.success(completedAgenda.includes(index) ? "Atividade reaberta" : "Atividade concluída", { description: "A atividade foi atualizada na sua agenda." });
  };

  const connectSource = (name: string) => {
    toast.info(`Conexão com ${name} preparada`, { description: "Na próxima etapa, você autoriza a conta e escolhe as fontes que serão importadas." });
  };

  return (
    <div className="crm-shell">
      <aside className="sidebar">
        <div className="brand" onClick={() => navigate("overview")} role="button" tabIndex={0}>
          <span className="brand-mark"><Sparkles size={17} /></span>
          <span className="brand-name">CRM <em>Central</em></span>
        </div>
        <div className="workspace-switcher"><span className="workspace-avatar">AC</span><span><strong>Acme Comercial</strong><small>Workspace principal</small></span><ChevronDown size={14} /></div>
        <div className="nav-label">Workspace</div>
        <nav className="main-nav">
          <button className={view === "overview" ? "nav-item active" : "nav-item"} onClick={() => navigate("overview")}><LayoutDashboard size={18} />Visão geral</button>
          <button className={view === "contacts" ? "nav-item active" : "nav-item"} onClick={() => navigate("contacts")}><Users size={18} />Contatos <span className="nav-count">128</span></button>
          <button className={view === "pipeline" ? "nav-item active" : "nav-item"} onClick={() => navigate("pipeline")}><Target size={18} />Pipeline <span className="nav-count nav-count-amber">{opportunities.length}</span></button>
          <button className={view === "activities" ? "nav-item active" : "nav-item"} onClick={() => navigate("activities")}><Activity size={18} />Atividades</button>
        </nav>
        <div className="nav-label nav-label-spaced">Gestão</div>
        <nav className="main-nav">
          <button className={view === "sources" ? "nav-item active" : "nav-item"} onClick={() => navigate("sources")}><UploadCloud size={18} />Fontes de dados <span className="sync-badge">2</span></button>
          <button className="nav-item" onClick={() => toast.info("Relatórios entram na próxima etapa") }><Gauge size={18} />Relatórios</button>
          <button className="nav-item" onClick={() => toast.info("Configurações do workspace entram na próxima etapa") }><Settings2 size={18} />Configurações</button>
        </nav>
        <div className="sidebar-bottom">
          <div className="upgrade-card"><div className="upgrade-spark"><Zap size={16} /></div><strong>De dados a decisões.</strong><p>Conecte suas fontes e tenha um só lugar para agir.</p><button onClick={() => navigate("sources")}>Explorar integrações <ArrowUpRight size={14} /></button></div>
          <div className="user-row"><Avatar initials="AD" tone="purple" small /><span><strong>Alexandre</strong><small>Administrador</small></span><MoreHorizontal size={17} /></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span>/</span><strong>{view === "overview" ? "Visão geral" : view === "contacts" ? "Contatos" : view === "pipeline" ? "Pipeline" : view === "activities" ? "Atividades" : "Fontes de dados"}</strong></div>
          <div className="topbar-actions"><div className="top-search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar no CRM" /><kbd>⌘ K</kbd></div><button className="icon-button" aria-label="Notificações" onClick={() => toast.info("Você está em dia", { description: "Não há novas notificações." })}><Bell size={18} /><span className="notification-dot" /></button><button className="quick-add" onClick={() => setShowQuickAdd(true)}><Plus size={17} />Adicionar <ChevronDown size={14} /></button></div>
        </header>

        <div className="page-body">
          {view === "overview" && <>
            <section className="hero-row"><div><p className="eyebrow">TERÇA-FEIRA, 24 DE NOVEMBRO DE 2026</p><h1>Olá, Alexandre <span className="wave">✦</span></h1><p className="hero-subtitle">Seu pipeline está em movimento. Veja onde agir hoje.</p></div><div className="hero-actions"><button className="secondary-button" onClick={() => toast.info("Filtros avançados", { description: "Escolha período, responsável e origem para personalizar seus indicadores." })}><CalendarDays size={16} />Últimos 30 dias <ChevronDown size={14} /></button><button className="primary-button" onClick={() => setShowQuickAdd(true)}><Plus size={17} />Novo negócio</button></div></section>
            <section className="metrics-grid"><MetricCard label="Oportunidades abertas" value="24" change="12,5%" detail="vs. mês anterior" icon={Target} tone="amber" /><MetricCard label="Pipeline total" value={formatCompactCurrency(pipelineTotal)} change="18,2%" detail="vs. mês anterior" icon={CircleDollarSign} tone="blue" /><MetricCard label="Leads ativos" value="68" change="8,4%" detail="vs. mês anterior" icon={Users} tone="green" /><MetricCard label="Tarefas para hoje" value="07" change="-2" detail="que ontem" icon={Clock3} tone="purple" /></section>
            <section className="dashboard-grid"><div className="panel pipeline-panel"><div className="panel-header"><div><h2>Visão do pipeline</h2><p>Valor ponderado por etapa comercial</p></div><button className="text-button" onClick={() => navigate("pipeline")}>Ver pipeline <ArrowUpRight size={14} /></button></div><div className="pipeline-summary"><div className="summary-total"><strong>{formatCurrency(pipelineTotal)}</strong><span>valor total</span></div><div className="pipeline-legend"><span><i className="legend-dot dot-amber" />Em negociação <b>{formatCompactCurrency(57600)}</b></span><span><i className="legend-dot dot-blue" />Em descoberta <b>{formatCompactCurrency(32500)}</b></span><span><i className="legend-dot dot-green" />Qualificado <b>{formatCompactCurrency(30800)}</b></span></div></div><div className="pipeline-bars">{stages.map((stage, index) => { const amount = [27, 38, 68, 100, 20][index]; const stageValue = [12800, 18000, 32500, 48000, 9600][index]; return <div className="pipeline-bar-row" key={stage}><span>{stage}</span><div className="bar-track"><div className={`bar-fill fill-${index}`} style={{ width: `${amount}%` }} /></div><strong>{formatCompactCurrency(stageValue)}</strong></div>; })}</div></div><div className="panel action-panel"><div className="panel-header"><div><h2>Próximas ações</h2><p>O que merece sua atenção</p></div><button className="more-button" aria-label="Mais ações"><MoreHorizontal size={18} /></button></div><div className="task-list">{[{ title: "Enviar proposta comercial", company: "Nuvem Studio", due: "Hoje, 15:00", priority: "Alta" }, { title: "Fazer follow-up do diagnóstico", company: "Orbe Finance", due: "Hoje, 16:30", priority: "Média" }, { title: "Preparar reunião de descoberta", company: "Terralab", due: "Amanhã, 10:00", priority: "Alta" }].map((task, index) => <button className={`task-row ${completedTasks.includes(index) ? "task-complete" : ""}`} key={task.title} onClick={() => completeTask(index)}><span className="task-check">{completedTasks.includes(index) && <Check size={13} />}</span><span className="task-copy"><strong>{task.title}</strong><small>{task.company}</small></span><span className={`priority priority-${task.priority === "Alta" ? "high" : "medium"}`}>{task.priority}</span><span className="task-due">{task.due}</span></button>)}</div><button className="panel-footer-link" onClick={() => navigate("activities")}>Ver todas as atividades <ArrowUpRight size={14} /></button></div></section>
            <section className="lower-grid"><div className="panel activity-panel"><div className="panel-header"><div><h2>Atividade recente</h2><p>Últimas interações do time</p></div><button className="more-button" aria-label="Mais atividades"><MoreHorizontal size={18} /></button></div><div className="activity-list">{activities.map(activity => <div className="activity-row" key={activity.title}><span className={`activity-icon activity-${activity.color}`}>{activity.icon === "mail" ? <Mail size={15} /> : activity.icon === "calendar" ? <CalendarDays size={15} /> : activity.icon === "note" ? <PackageOpen size={15} /> : <Activity size={15} />}</span><span className="activity-copy"><strong>{activity.title}</strong><small>{activity.meta}</small></span><span className="activity-time">{activity.time}</span></div>)}</div></div><div className="panel source-panel"><div className="panel-header"><div><h2>Origem dos leads</h2><p>Onde novas oportunidades começam</p></div><button className="text-button" onClick={() => navigate("sources")}>Detalhes <ArrowUpRight size={14} /></button></div><div className="source-chart"><div className="donut"><div className="donut-inner"><strong>68</strong><span>leads</span></div></div><div className="source-legend"><span><i className="legend-dot dot-amber" />Indicação <b>32%</b></span><span><i className="legend-dot dot-blue" />LinkedIn <b>24%</b></span><span><i className="legend-dot dot-green" />Google <b>21%</b></span><span><i className="legend-dot dot-purple" />Outros <b>23%</b></span></div></div></div></section>
          </>}

          {view === "contacts" && <section className="view-section"><div className="section-title-row"><div><p className="eyebrow">RELACIONAMENTO</p><h1>Contatos <span className="count-label">128 registros</span></h1><p className="hero-subtitle">Uma visão limpa de todas as pessoas e empresas do seu funil.</p></div><button className="primary-button" onClick={() => setShowQuickAdd(true)}><Plus size={17} />Novo contato</button></div><div className="toolbar"><div className="local-search"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por nome, empresa ou e-mail" /></div><button className="filter-button"><Filter size={16} />Filtros <span>2</span></button><button className="filter-button"><ListFilter size={16} />Segmentar</button></div><div className="panel table-panel"><div className="table-head"><span>Contato</span><span>Status</span><span>Responsável</span><span>Última interação</span><span>Valor relacionado</span><span /></div>{filteredContacts.map(contact => <button className="contact-row" key={contact.id} onClick={() => setSelectedContact(contact)}><span className="contact-main"><Avatar initials={contact.initials} tone={contact.tone} /><span><strong>{contact.name}</strong><small>{contact.role} · {contact.company}</small></span></span><StatusPill label={contact.status} /><span className="owner-cell"><Avatar initials={contact.owner === "Você" ? "AD" : contact.owner.slice(0, 2).toUpperCase()} tone={contact.owner === "Você" ? "purple" : "blue"} small />{contact.owner}</span><span className="muted-cell">{contact.last}</span><strong className="value-cell">{contact.value}</strong><MoreHorizontal size={18} className="row-more" /></button>)}{filteredContacts.length === 0 && <div className="empty-state">Nenhum contato encontrado para “{query}”.</div>}</div><div className="table-footer"><span>Mostrando {filteredContacts.length} de 128 contatos</span><span className="pagination"><button disabled>‹</button><button className="current">1</button><button>2</button><button>3</button><button>›</button></span></div></section>}

          {view === "pipeline" && <section className="view-section"><div className="section-title-row"><div><p className="eyebrow">RECEITA EM MOVIMENTO</p><h1>Pipeline <span className="count-label">{formatCurrency(pipelineTotal)} total</span></h1><p className="hero-subtitle">Acompanhe cada oportunidade até o fechamento.</p></div><div className="hero-actions"><button className="secondary-button"><Filter size={16} />Filtros</button><button className="primary-button" onClick={() => setShowQuickAdd(true)}><Plus size={17} />Novo negócio</button></div></div><div className="pipeline-toolbar"><div className="pipeline-tabs"><button className={pipelineMode === "board" ? "selected" : ""} onClick={() => setPipelineMode("board")}>Kanban</button><button className={pipelineMode === "list" ? "selected" : ""} onClick={() => setPipelineMode("list")}>Lista</button></div><span className="pipeline-note"><span className="status-dot" />Atualizado agora</span></div>{pipelineMode === "board" ? <div className="kanban-board">{stages.map(stage => <div className="kanban-column" key={stage}><div className="kanban-heading"><span><i className={`stage-dot stage-${stages.indexOf(stage)}`} />{stage}</span><span className="column-count">{opportunities.filter(item => item.stage === stage).length || (stage === "Qualificado" ? 1 : stage === "Diagnóstico" ? 1 : stage === "Proposta" ? 1 : stage === "Fechamento" ? 1 : 1)}</span></div><div className="kanban-value">{formatCurrency(opportunities.filter(item => item.stage === stage).reduce((sum, item) => sum + item.value, 0) || [12800, 18000, 32500, 48000, 9600][stages.indexOf(stage)])}</div>{opportunities.filter(item => item.stage === stage).map(item => <div className="deal-card" key={item.id}><div className="deal-card-top"><span className={`deal-tag tag-${item.color}`}>{item.probability}% provável</span><MoreHorizontal size={16} /></div><strong>{item.name}</strong><small>{item.company}</small><div className="deal-card-foot"><span><Avatar initials={item.owner === "Você" ? "AD" : item.owner.slice(0, 2).toUpperCase()} tone={item.color} small />{item.owner}</span><b>{formatCurrency(item.value)}</b></div></div>)}</div>)}</div> : <div className="panel table-panel pipeline-list">{opportunities.map(item => <div className="list-deal-row" key={item.id}><span><strong>{item.name}</strong><small>{item.company} · {item.contact}</small></span><span className={`deal-tag tag-${item.color}`}>{item.stage}</span><span>{item.probability}% prob.</span><strong>{formatCurrency(item.value)}</strong><span>{item.due}</span><MoreHorizontal size={17} /></div>)}</div>}</section>}

          {view === "activities" && <section className="view-section"><div className="section-title-row"><div><p className="eyebrow">RITMO COMERCIAL</p><h1>Atividades</h1><p className="hero-subtitle">Não deixe uma boa conversa virar uma oportunidade perdida.</p></div><button className="primary-button" onClick={() => toast.success("Atividade criada", { description: "A atividade foi adicionada à sua agenda." })}><Plus size={17} />Nova atividade</button></div><div className="activity-layout"><div className="panel calendar-card"><div className="panel-header"><div><h2>Hoje, 24 de novembro</h2><p>3 ações prioritárias</p></div><CalendarDays size={20} className="panel-icon" /></div>{[{ title: "Enviar proposta comercial", contact: "Marina Costa · Nuvem Studio", time: "15:00", type: "Follow-up", tone: "amber" }, { title: "Fazer follow-up do diagnóstico", contact: "Rafael Lima · Orbe Finance", time: "16:30", type: "Ligação", tone: "blue" }, { title: "Revisar escopo de automação", contact: "Ana Souza · Terralab", time: "17:15", type: "Tarefa", tone: "green" }].map((task, index) => <button className={`agenda-row ${completedAgenda.includes(index) ? "task-complete" : ""}`} key={task.title} onClick={() => completeAgenda(index)}><span className={`agenda-time agenda-${task.tone}`}>{task.time}</span><span className="agenda-line" /><span className="agenda-copy"><strong>{task.title}</strong><small>{task.contact}</small><em>{task.type}</em></span><span className="task-check">{completedAgenda.includes(index) && <Check size={13} />}</span></button>)}</div><div className="panel activity-panel"><div className="panel-header"><div><h2>Histórico recente</h2><p>Atividade do seu time</p></div><button className="filter-button"><Filter size={15} />Filtrar</button></div><div className="activity-list activity-list-large">{activities.concat(activities.slice(0, 2)).map((activity, index) => <div className="activity-row" key={`${activity.title}-${index}`}><span className={`activity-icon activity-${activity.color}`}>{activity.icon === "mail" ? <Mail size={15} /> : activity.icon === "calendar" ? <CalendarDays size={15} /> : activity.icon === "note" ? <PackageOpen size={15} /> : <Activity size={15} />}</span><span className="activity-copy"><strong>{activity.title}</strong><small>{activity.meta}</small></span><span className="activity-time">{activity.time}</span></div>)}</div></div></div></section>}

          {view === "sources" && <section className="view-section"><div className="section-title-row"><div><p className="eyebrow">DADOS CONECTADOS</p><h1>Fontes de dados</h1><p className="hero-subtitle">Traga seus dados para dentro do CRM sem perder o contexto.</p></div><button className="secondary-button" onClick={() => toast.info("Importação manual", { description: "Você poderá subir CSV ou XLSX na etapa de ingestão." })}><UploadCloud size={16} />Importar arquivo</button></div><div className="integration-callout"><div className="callout-icon"><Sparkles size={20} /></div><div><strong>Um CRM, todas as suas fontes.</strong><p>Conecte Notion e Google Sheets, revise o mapeamento e importe apenas o que faz sentido para sua operação.</p></div><button className="primary-button" onClick={() => toast.info("Integrações prontas", { description: "A autorização da conta será solicitada quando você quiser conectar uma fonte." })}>Começar conexão <ArrowUpRight size={15} /></button></div><div className="source-grid">{sourceRows.map(source => <div className="source-card" key={source.name}><div className="source-card-top"><span className={`source-app-icon source-${source.accent}`}><source.icon size={23} /></span><span className="source-status"><span className="status-dot" />Disponível</span></div><h2>{source.name}</h2><p>{source.description}</p><div className="source-card-meta"><span>Registros importados</span><strong>{source.records}</strong></div><button className="source-connect" onClick={() => connectSource(source.name)}>Conectar {source.name} <ArrowUpRight size={15} /></button></div>)}</div><div className="panel import-steps"><div className="panel-header"><div><h2>Como funciona a importação</h2><p>Um fluxo seguro e revisável em quatro passos</p></div><Globe2 size={20} className="panel-icon" /></div><div className="step-list">{[{ n: "01", title: "Autorize a fonte", copy: "Você decide quais contas e páginas entram no CRM." }, { n: "02", title: "Mapeie os campos", copy: "Conecte colunas como nome, e-mail, empresa e status." }, { n: "03", title: "Revise duplicidades", copy: "O CRM sinaliza registros repetidos antes de importar." }, { n: "04", title: "Importe e acompanhe", copy: "Cada contato mantém a origem e a data da última sincronização." }].map(step => <div className="step-item" key={step.n}><span>{step.n}</span><div><strong>{step.title}</strong><p>{step.copy}</p></div><ArrowUpRight size={15} /></div>)}</div></div></section>}
        </div>
      </main>

      {selectedContact && <div className="drawer-backdrop" onClick={() => setSelectedContact(null)}><aside className="contact-drawer" onClick={event => event.stopPropagation()}><div className="drawer-header"><span>Detalhes do contato</span><button className="icon-button" onClick={() => setSelectedContact(null)}><X size={18} /></button></div><div className="drawer-profile"><Avatar initials={selectedContact.initials} tone={selectedContact.tone} /><div><h2>{selectedContact.name}</h2><p>{selectedContact.role} · {selectedContact.company}</p><StatusPill label={selectedContact.status} /></div></div><div className="drawer-actions"><button className="secondary-button"><Mail size={15} />E-mail</button><button className="primary-button"><Plus size={15} />Atividade</button></div><div className="drawer-section"><h3>Informações</h3><div className="detail-row"><span>E-mail</span><strong>{selectedContact.email}</strong></div><div className="detail-row"><span>Empresa</span><strong>{selectedContact.company}</strong></div><div className="detail-row"><span>Origem</span><strong>{selectedContact.source}</strong></div><div className="detail-row"><span>Responsável</span><strong>{selectedContact.owner}</strong></div></div><div className="drawer-section"><h3>Oportunidades</h3><div className="drawer-deal"><span className="deal-tag tag-amber">Em andamento</span><strong>{selectedContact.value}</strong><small>{opportunities.find(item => item.company === selectedContact.company)?.name ?? "Relacionamento comercial"}</small></div></div><div className="drawer-section"><h3>Observações</h3><div className="note-box">Contato importado da fonte <strong>{selectedContact.source}</strong>. Próxima ação recomendada: manter o follow-up dentro de 48 horas.</div></div></aside></div>}
      {showQuickAdd && <div className="modal-backdrop" onClick={() => setShowQuickAdd(false)}><div className="quick-modal" onClick={event => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">AÇÃO RÁPIDA</p><h2>O que você quer adicionar?</h2></div><button className="icon-button" onClick={() => setShowQuickAdd(false)}><X size={18} /></button></div><div className="quick-options"><button onClick={() => { setShowQuickAdd(false); navigate("contacts"); toast.success("Novo contato", { description: "O formulário de contato será aberto na próxima etapa." }); }}><span className="quick-option-icon icon-amber"><Users size={20} /></span><span><strong>Contato</strong><small>Uma nova pessoa ou empresa</small></span><ArrowUpRight size={16} /></button><button onClick={() => { setShowQuickAdd(false); navigate("pipeline"); toast.success("Novo negócio", { description: "O formulário de oportunidade será aberto na próxima etapa." }); }}><span className="quick-option-icon icon-blue"><Target size={20} /></span><span><strong>Negócio</strong><small>Uma oportunidade no pipeline</small></span><ArrowUpRight size={16} /></button><button onClick={() => { setShowQuickAdd(false); navigate("activities"); toast.success("Nova atividade", { description: "O formulário de atividade será aberto na próxima etapa." }); }}><span className="quick-option-icon icon-green"><CalendarDays size={20} /></span><span><strong>Atividade</strong><small>Uma tarefa, reunião ou follow-up</small></span><ArrowUpRight size={16} /></button></div></div></div>}
    </div>
  );
}
