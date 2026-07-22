export const categories = [
  { id: "purpose", name: "Foco no propósito", shortName: "Propósito", eyebrow: "Estratégia", questions: [
    "Você sabe estruturar o propósito e o escopo estratégico de uma Universidade Corporativa Digital?",
    "Você consegue mapear indicadores de sucesso corporativo durante a etapa de planejamento inicial de uma Universidade Corporativa Digital?"
  ]},
  { id: "diagnosis", name: "Foco no diagnóstico", shortName: "Diagnóstico", eyebrow: "Necessidades", questions: [
    "Você sabe aplicar um levantamento de necessidades de treinamento (LNT) de forma a garantir que as demandas estão alinhadas aos resultados esperados da empresa?",
    "Você conhece e sabe estruturar um controle para as demandas de T&D, a fim de organizar e priorizar as suas entregas de treinamento?",
    "Você sabe transformar demandas dispersas de treinamento em um pipeline organizado, com foco em impacto e resultados mensuráveis?"
  ]},
  { id: "methodologies", name: "Foco nas metodologias", shortName: "Metodologias", eyebrow: "Design", questions: [
    "Você tem domínio prático sobre os principais modelos metodológicos de T&D, como ADDIE, 6Ds, Kirkpatrick e Phillips?",
    "Você sabe escolher o modelo metodológico mais adequado para cada tipo de projeto de treinamento?",
    "Você sabe desenhar programas de aprendizagem com foco na transferência efetiva do conhecimento para o ambiente de trabalho?"
  ]},
  { id: "scalability", name: "Foco na escalabilidade", shortName: "Escalabilidade", eyebrow: "Tecnologia", questions: [
    "Você conhece as diferenças e aplicações entre CMS, LMS e LXP?",
    "Você sabe estruturar um ambiente de aprendizagem digital escalável e sustentável considerando arquitetura, UX e usabilidade?"
  ]},
  { id: "operation", name: "Foco na operação", shortName: "Operação", eyebrow: "Governança", questions: [
    "Você possui domínio sobre processos operacionais, papéis e fluxos de uma área de T&D?",
    "Você conhece práticas de governança e gestão de demandas?"
  ]},
  { id: "productivity", name: "Foco na produtividade", shortName: "Produtividade", eyebrow: "Conteúdo", questions: [
    "Você sabe estruturar um fluxo produtivo para criação de projetos de aprendizagem?",
    "Você domina ferramentas que aceleram a produção de conteúdos digitais?"
  ]},
  { id: "engagement", name: "Foco no engajamento e retenção", shortName: "Engajamento", eyebrow: "Adoção", questions: [
    "Você sabe estruturar ações para promover transferência da aprendizagem?",
    "Você domina estratégias para engajar gestores na aprendizagem?"
  ]},
  { id: "indicators", name: "Foco nos indicadores de resultado", shortName: "Indicadores", eyebrow: "Resultados", questions: [
    "Você sabe estruturar indicadores para medir efetividade e ROI?",
    "Você consegue construir narrativas para comunicar resultados para a liderança?"
  ]},
  { id: "sustainability", name: "Foco na sustentabilidade", shortName: "Sustentabilidade", eyebrow: "Evolução", questions: [
    "Você acompanha tendências de T&D?",
    "Você sabe transformar uma Universidade Corporativa Digital em um ecossistema de aprendizagem?"
  ]}
];

export const levels = [
  { value: 1, short: "Desconheço", label: "Desconheço" },
  { value: 2, short: "Conhecimento Básico", label: "Conhecimento Básico" },
  { value: 3, short: "Conhecimento Intermediário", label: "Conhecimento Intermediário" },
  { value: 4, short: "Conhecimento Aprofundado", label: "Conhecimento Aprofundado" },
  { value: 5, short: "Especialista", label: "Especialista" }
];

export const playbooks = {
  Iniciante: {
    purpose: { action: "Realizar diagnóstico estratégico com especialistas em T&D", detail: "Você está no início da jornada de estruturação de uma Universidade Corporativa Digital. Este é o momento ideal para estabelecer fundações sólidas com foco estratégico, evitando retrabalhos futuros. Recomendamos começar com um diagnóstico profundo e um plano estratégico claro." },
    diagnosis: { action: "Capacitar equipe em metodologias de LNT", detail: "O diagnóstico é a base de qualquer operação de T&D bem-sucedida. Você precisa estruturar processos robustos de levantamento de necessidades e gestão de demandas para garantir que os treinamentos gerem impacto real." },
    methodologies: { action: "Realizar treinamento em metodologias de design instrucional", detail: "Metodologia é o diferencial entre treinamentos que geram resultado e aqueles que não geram. Você precisa dominar os principais modelos e aprender a aplicá-los de forma contextualizada." },
    scalability: { action: "Realizar análise comparativa de plataformas (CMS vs LMS vs LXP)", detail: "A escolha da plataforma de aprendizagem é crítica. Você precisa entender as diferenças entre CMS, LMS e LXP para fazer uma escolha alinhada com sua estratégia de crescimento." },
    operation: { action: "Mapear processos operacionais necessários", detail: "Operações bem estruturadas são a base da escalabilidade. Você precisa definir processos, papéis e fluxos claros para garantir consistência e qualidade." },
    productivity: { action: "Avaliar ferramentas de autoria de conteúdo", detail: "Produtividade é essencial para escalar T&D. Você precisa estruturar fluxos e adotar ferramentas que permitam criar conteúdo de qualidade rapidamente." },
    engagement: { action: "Definir estratégia de engajamento de gestores", detail: "Engajamento determina o sucesso da aprendizagem. Você precisa estruturar estratégias para engajar colaboradores e gestores desde o início." },
    indicators: { action: "Definir KPIs de T&D alinhados ao negócio", detail: "Indicadores são a prova do valor de T&D. Você precisa estruturar medição desde o início para demonstrar impacto e justificar investimentos." },
    sustainability: { action: "Estabelecer processo de monitoramento de tendências", detail: "Sustentabilidade é sobre evoluir continuamente. Você precisa acompanhar tendências e transformar sua UC em um ecossistema vivo de aprendizagem." }
  },
  Intermediário: {
    purpose: { action: "Realizar revisão estratégica anual da UC", detail: "Você tem uma base sólida em propósito estratégico. O próximo passo é aprofundar o alinhamento com a estratégia corporativa e criar indicadores mais sofisticados." },
    diagnosis: { action: "Implementar LNT contínua (não apenas anual)", detail: "Você tem processos de diagnóstico implementados. O próximo passo é evoluir para diagnóstico contínuo e mais sofisticado, integrando análise de gaps." },
    methodologies: { action: "Estudar metodologias avançadas (Design Thinking, Agile Learning)", detail: "Você tem metodologia implementada. O próximo passo é aprofundar expertise e estruturar framework próprio adaptado à sua organização." },
    scalability: { action: "Avaliar evolução para LXP mais sofisticado", detail: "Você tem plataforma escalável. O próximo passo é evoluir para experiências mais sofisticadas com IA e personalisação." },
    operation: { action: "Realizar mapeamento de processos e identificar gargalos", detail: "Você tem operações estruturadas. O próximo passo é otimizar processos e implementar automação para melhorar eficiência." },
    productivity: { action: "Avaliar ferramentas de IA para produção", detail: "Você tem produtividade implementada. O próximo passo é aumentar velocidade através de IA e automação." },
    engagement: { action: "Expandir programa de gestores multiplicadores", detail: "Você tem engajamento implementado. O próximo passo é aprofundar através de comunidades, gamificação e mentoring." },
    indicators: { action: "Implementar modelo de ROI mais sofisticado", detail: "Você tem indicadores implementados. O próximo passo é evoluir para ROI mais sofisticado e business intelligence." },
    sustainability: { action: "Participar ativamente de comunidades de T&D", detail: "Você tem sustentabilidade em evolução. O próximo passo é aprofundar participação em comunidades e estruturar programa formal de inovação." }
  },
  Avançado: {
    purpose: { action: "Transformar UC em centro de excelência de T&D", detail: "Você tem propósito estratégico muito bem estruturado. O próximo passo é expandir UC para ecossistema de aprendizagem e centro de excelência." },
    diagnosis: { action: "Implementar AI para diagnóstico preditivo", detail: "Você tem diagnóstico muito bem estruturado. O próximo passo é implementar IA para diagnóstico preditivo e expandir para toda cadeia de valor." },
    methodologies: { action: "Pesquisar e integrar metodologias emergentes", detail: "Você tem metodologia muito bem estruturada. O próximo passo é integrar metodologias emergentes e criar metodologia proprietária." },
    scalability: { action: "Implementar adaptive learning com IA avançada", detail: "Você tem plataforma muito sofisticada. O próximo passo é implementar IA avançada e explorar tecnologias emergentes como AR/VR." },
    operation: { action: "Implementar RPA em processos operacionais", detail: "Você tem operações muito bem otimizadas. O próximo passo é expandir automação com RPA e estruturar operações de classe mundial." },
    productivity: { action: "Implementar geração automática de conteúdo com IA", detail: "Você tem produtividade muito elevada. O próximo passo é expandir IA para geração automática e estruturar studio de classe mundial." },
    engagement: { action: "Expandir social learning e peer learning", detail: "Você tem engajamento muito elevado. O próximo passo é expandir para social learning e experiências imersivas." },
    indicators: { action: "Implementar predictive analytics de impacto de T&D", detail: "Você tem indicadores muito bem estruturados. O próximo passo é implementar predictive analytics e integrar T&D com KPIs de negócio." },
    sustainability: { action: "Estruturar centro de pesquisa em T&D", detail: "Você tem sustentabilidade muito bem estruturada. O próximo passo é estruturar centro de pesquisa e programa de thought leadership." }
  },
  Especialista: {
    purpose: { action: "Posicionar UC como diferencial competitivo", detail: "Você tem propósito estratégico de classe mundial. O próximo passo é posicionar UC como diferencial competitivo e modelo para indústria." },
    diagnosis: { action: "Implementar diagnóstico em tempo real com IA", detail: "Você tem diagnóstico de classe mundial. O próximo passo é expandir para diagnóstico em tempo real e oferecer como serviço." },
    methodologies: { action: "Comercializar metodologia como produto", detail: "Você tem metodologia de classe mundial. O próximo passo é comercializar como produto e estruturar programa de certificação." },
    scalability: { action: "Comercializar plataforma como SaaS", detail: "Você tem plataforma de classe mundial. O próximo passo é comercializar como SaaS e expandir para mercado global." },
    operation: { action: "Oferecer operações como serviço gerenciado", detail: "Você tem operações de classe mundial. O próximo passo é oferecer operações como serviço gerenciado e expandir globalmente." },
    productivity: { action: "Oferecer produção como serviço", detail: "Você tem produtividade de classe mundial. O próximo passo é oferecer produção como serviço e estruturar marketplace." },
    engagement: { action: "Explorar metaverso e Web3 para aprendizagem", detail: "Você tem engajamento de classe mundial. O próximo passo é explorar metaverso e Web3, e estruturar comunidades globais." },
    indicators: { action: "Comercializar indicadores como produto", detail: "Você tem indicadores de classe mundial. O próximo passo é comercializar como produto e estruturar programa de BI." },
    sustainability: { action: "Estruturar programa de venture building", detail: "Você tem sustentabilidade de classe mundial. O próximo passo é estruturar programa de venture building e expandir influência global." }
  }
};

export const questions = categories.flatMap((category, categoryIndex) =>
  category.questions.map((text, questionIndex) => ({
    text, category, categoryIndex, questionIndex, key: `${categoryIndex}-${questionIndex}`
  }))
);

const screens = new Set(["intro", "quiz", "result"]);
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
  let totalPoints = 0;
  let totalQuestions = 0;
  const scores = categories.map((category, categoryIndex) => {
    const values = category.questions.map((_, questionIndex) => answers[`${categoryIndex}-${questionIndex}`] || 0);
    const points = values.reduce((sum, value) => sum + value, 0);
    totalPoints += points;
    totalQuestions += values.length;
    return { ...category, score: values.length ? points / values.length * 20 : 0 };
  });
  const total = Math.round(totalQuestions ? totalPoints / totalQuestions * 20 : 0);
  return { total, classification: levelFor(total), scores };
}

export function levelFor(score) {
  return score >= 80 ? "Especialista" : score >= 60 ? "Avançado" : score >= 40 ? "Intermediário" : "Iniciante";
}
