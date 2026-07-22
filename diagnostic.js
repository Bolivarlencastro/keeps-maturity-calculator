export const categories = [
  { id: "purpose", name: "Propósito", eyebrow: "Estratégia", questions: [
    "Você sabe estruturar o propósito e o escopo estratégico de uma Universidade Corporativa Digital?",
    "Você consegue mapear indicadores de sucesso corporativo durante o planejamento inicial?"
  ]},
  { id: "diagnosis", name: "Diagnóstico", eyebrow: "Necessidades", questions: [
    "Você sabe aplicar um levantamento de necessidades de treinamento (LNT) alinhado aos resultados esperados da empresa?",
    "Você sabe estruturar um controle para organizar e priorizar as demandas de T&D?",
    "Você sabe transformar demandas dispersas em um pipeline focado em impacto e resultados mensuráveis?"
  ]},
  { id: "methodologies", name: "Metodologias", eyebrow: "Design", questions: [
    "Você domina modelos de T&D como ADDIE, 6Ds, Kirkpatrick e Phillips?",
    "Você sabe escolher o modelo metodológico adequado para cada projeto de treinamento?",
    "Você sabe desenhar programas focados na transferência do conhecimento para o trabalho?"
  ]},
  { id: "scalability", name: "Escalabilidade", eyebrow: "Tecnologia", questions: [
    "Você conhece as diferenças e aplicações entre CMS, LMS e LXP?",
    "Você sabe estruturar um ambiente digital escalável considerando arquitetura, UX e usabilidade?"
  ]},
  { id: "operation", name: "Operação", eyebrow: "Governança", questions: [
    "Você domina os processos, papéis e fluxos de uma área de T&D?",
    "Você conhece práticas de governança e gestão de demandas?"
  ]},
  { id: "productivity", name: "Produtividade", eyebrow: "Conteúdo", questions: [
    "Você sabe estruturar um fluxo produtivo para criar projetos de aprendizagem?",
    "Você domina ferramentas que aceleram a produção de conteúdos digitais?"
  ]},
  { id: "engagement", name: "Engajamento", eyebrow: "Adoção", questions: [
    "Você sabe estruturar ações para promover a transferência da aprendizagem?",
    "Você domina estratégias para engajar gestores na aprendizagem?"
  ]},
  { id: "indicators", name: "Indicadores", eyebrow: "Resultados", questions: [
    "Você sabe estruturar indicadores para medir efetividade e ROI?",
    "Você consegue construir narrativas para comunicar resultados à liderança?"
  ]},
  { id: "sustainability", name: "Sustentabilidade", eyebrow: "Evolução", questions: [
    "Você acompanha tendências de T&D?",
    "Você sabe transformar uma Universidade Corporativa Digital em um ecossistema de aprendizagem?"
  ]}
];

export const levels = [
  { value: 1, short: "Ainda não", label: "Desconheço" },
  { value: 2, short: "Conheço", label: "Conhecimento básico" },
  { value: 3, short: "Já aplico", label: "Conhecimento intermediário" },
  { value: 4, short: "Domino", label: "Conhecimento aprofundado" },
  { value: 5, short: "Sou referência", label: "Especialista" }
];

export const playbooks = {
  purpose: { action: "Conecte a UC às prioridades do negócio", detail: "Defina propósito, público, patrocinadores e três indicadores de sucesso antes de ampliar o portfólio." },
  diagnosis: { action: "Crie uma entrada única de demandas", detail: "Implemente um LNT contínuo e priorize pedidos por impacto, urgência e aderência estratégica." },
  methodologies: { action: "Padronize o desenho de aprendizagem", detail: "Adote um framework leve para diagnóstico, desenho, transferência e avaliação de cada iniciativa." },
  scalability: { action: "Revise a arquitetura de aprendizagem", detail: "Mapeie requisitos de UX, dados e integrações antes de escolher ou evoluir LMS, LXP e conteúdo." },
  operation: { action: "Torne papéis e fluxos visíveis", detail: "Documente responsáveis, acordos de serviço e pontos de decisão do pedido até a mensuração." },
  productivity: { action: "Industrialize o que é repetível", detail: "Use templates, componentes reutilizáveis e IA assistiva para reduzir o tempo de produção." },
  engagement: { action: "Traga o gestor para a experiência", detail: "Planeje comunicação, prática no trabalho e reforços pós-treinamento como parte do programa." },
  indicators: { action: "Meça menos, mas meça o que importa", detail: "Conecte indicadores de aprendizagem a comportamento e a pelo menos um resultado do negócio." },
  sustainability: { action: "Crie um ciclo de evolução trimestral", detail: "Revise tendências, dados e feedback para decidir o que testar, manter ou descontinuar." }
};

export const questions = categories.flatMap((category, categoryIndex) =>
  category.questions.map((text, questionIndex) => ({
    text, category, categoryIndex, questionIndex, key: `${categoryIndex}-${questionIndex}`
  }))
);

const screens = new Set(["intro", "identify", "quiz", "result"]);
const questionKeys = new Set(questions.map(question => question.key));

export function createDefaultState() {
  return { screen: "intro", question: 0, answers: {}, profile: { name: "", email: "" } };
}

export function normalizeState(candidate = {}) {
  const answers = Object.fromEntries(
    Object.entries(candidate.answers || {}).filter(([key, value]) =>
      questionKeys.has(key) && Number.isInteger(value) && value >= 1 && value <= 5
    )
  );
  const question = Math.min(Math.max(Number(candidate.question) || 0, 0), questions.length - 1);
  let screen = screens.has(candidate.screen) ? candidate.screen : "intro";
  if (screen === "result" && Object.keys(answers).length !== questions.length) screen = "quiz";
  const profile = {
    name: typeof candidate.profile?.name === "string" ? candidate.profile.name.trim().slice(0, 120) : "",
    email: typeof candidate.profile?.email === "string" ? candidate.profile.email.trim().toLowerCase().slice(0, 254) : ""
  };
  return { screen, question, answers, profile };
}

export function calculate(answers) {
  const scores = categories.map((category, categoryIndex) => {
    const values = category.questions.map((_, questionIndex) => answers[`${categoryIndex}-${questionIndex}`] || 0);
    return { ...category, score: Math.round(values.reduce((sum, value) => sum + value, 0) / values.length * 20) };
  });
  const total = Math.round(scores.reduce((sum, item) => sum + item.score, 0) / scores.length);
  return { total, classification: levelFor(total), scores };
}

export function levelFor(score) {
  return score >= 80 ? "Especialista" : score >= 60 ? "Avançado" : score >= 40 ? "Intermediário" : "Em desenvolvimento";
}
