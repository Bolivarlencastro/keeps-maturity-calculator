import { calculate, categories, createDefaultState, levelFor, levels, normalizeState, playbooks, questions } from "./diagnostic.js";

const storageKey = "keeps-maturity-v3";
const legacyStorageKey = "keeps-maturity-v2";
const app = document.querySelector("#app");
const announcer = document.querySelector("#app-announcer");
let state = loadState();
let navigationLocked = false;

function loadState() {
  try {
    const saved = localStorage.getItem(storageKey) || localStorage.getItem(legacyStorageKey);
    return normalizeState(JSON.parse(saved) || createDefaultState());
  } catch {
    return createDefaultState();
  }
}

function saveState() {
  try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* Storage is optional. */ }
}

function icon(name) {
  const paths = {
    arrow: '<path d="m9 18 6-6-6-6"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    trend: '<path d="M3 17l6-6 4 4 8-9"/><path d="M15 6h6v6"/>',
    restart: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name]}</svg>`;
}

function render() {
  document.body?.setAttribute("data-screen", state.screen);
  if (state.screen === "quiz") renderQuiz();
  else if (state.screen === "result") renderResult();
  else renderIntro();
}

function renderIntro() {
  const answered = Object.keys(state.answers).length;
  app.innerHTML = `
    <section class="hero shell">
      <div class="hero-copy">
        <span class="kicker">Diagnóstico gratuito · resultado imediato</span>
        <h1 tabindex="-1">O próximo salto do seu T&D começa com um diagnóstico claro.</h1>
        <p class="hero-lead">Responda a 20 perguntas e avalie nove dimensões da sua operação de T&D. Ao final, descubra onde concentrar esforços para gerar mais impacto no negócio — sem precisar se cadastrar.</p>
        <div class="hero-actions">
          <button class="button button-primary" data-action="start">${answered ? "Continuar diagnóstico" : "Começar diagnóstico"} ${icon("arrow")}</button>
          <span class="time-note">${icon("clock")} Cerca de 4 minutos</span>
        </div>
      </div>
      <div class="hero-visual" aria-label="Prévia das dimensões avaliadas">
        <div class="orbit orbit-one"></div><div class="orbit orbit-two"></div>
        <div class="score-preview"><span>9</span><small>dimensões<br/>avaliadas</small></div>
        ${categories.slice(0, 6).map((item, index) => `<span class="dimension-pill pill-${index + 1}">${item.name}</span>`).join("")}
      </div>
    </section>
    <section class="trust-strip">
      <div class="shell trust-grid">
        <article><strong>Clareza</strong><span>Um retrato objetivo da operação atual</span></article>
        <article><strong>Prioridade</strong><span>Os três pontos que pedem atenção agora</span></article>
        <article><strong>Próximo passo</strong><span>Recomendações práticas, não apenas uma nota</span></article>
      </div>
    </section>`;
}

function renderQuiz() {
  const current = questions[state.question];
  const selected = state.answers[current.key];
  const progress = (state.question + 1) / questions.length * 100;
  app.innerHTML = `
    <div class="quiz-progress" role="progressbar" aria-label="Progresso do diagnóstico" aria-valuemin="1" aria-valuemax="20" aria-valuenow="${state.question + 1}" aria-valuetext="Pergunta ${state.question + 1} de ${questions.length}"><span style="width:${progress}%"></span></div>
    <section class="quiz-shell shell">
      <div class="quiz-focus">
        <div class="question-panel">
          <span class="question-count">Pergunta ${state.question + 1} de ${questions.length}</span>
          <h1 class="question-title" tabindex="-1">${current.text}</h1>
          <p class="question-instruction" id="question-instruction">Como isso acontece hoje na sua operação?</p>
          <fieldset class="single-question">
            <legend class="sr-only">Selecione uma resposta. A escala vai de 1, ainda não, a 5, sou referência.</legend>
            <div class="answer-scale">
              ${levels.map(level => `<label class="answer-option ${selected === level.value ? "selected" : ""}">
                <input type="radio" name="${current.key}" value="${level.value}" aria-describedby="question-instruction" ${selected === level.value ? "checked" : ""}/>
                <span class="answer-key" aria-hidden="true">${level.value}</span>
                <strong>${level.short}</strong>
              </label>`).join("")}
            </div>
          </fieldset>
        </div>
        <div class="quiz-actions">
          <button class="button button-secondary" data-action="back" ${state.question === 0 ? "disabled" : ""}>Voltar</button>
          <p class="keyboard-hint">Use 1–5 para responder e Enter para continuar</p>
          <button class="button button-primary" data-action="next" ${selected ? "" : "disabled"}>${state.question === questions.length - 1 ? "Ver resultado" : "Continuar"} ${icon("arrow")}</button>
        </div>
      </div>
    </section>`;
}

function furthestQuestion() {
  const firstIncomplete = questions.findIndex(item => !state.answers[item.key]);
  return firstIncomplete === -1 ? questions.length - 1 : firstIncomplete;
}

function renderResult() {
  const result = calculate(state.answers);
  const sorted = [...result.scores].sort((a, b) => a.score - b.score);
  const top = [...result.scores].sort((a, b) => b.score - a.score)[0];
  const whatsappMessage = `Olá! Concluí o Diagnóstico de Maturidade em T&D da Keeps. Meu resultado foi ${result.total}/100 (${result.classification}) e gostaria de conversar com um especialista.`;
  const whatsappUrl = `https://wa.me/554896064505?text=${encodeURIComponent(whatsappMessage)}`;
  const message = result.total >= 80 ? "Sua operação já é referência. O desafio agora é transformar excelência em vantagem competitiva." : result.total >= 60 ? "Você tem uma base consistente. Agora é hora de conectar as práticas e ampliar o impacto no negócio." : result.total >= 40 ? "Existem boas práticas em curso, mas elas ainda precisam ganhar consistência e conexão estratégica." : "Você tem uma ótima oportunidade de construir as bases certas, na ordem certa, sem carregar processos desnecessários.";
  app.innerHTML = `
    <section class="result-hero">
      <div class="shell result-head">
        <div>
          <span class="kicker kicker-light">Seu diagnóstico está pronto</span>
          <h1 tabindex="-1">${result.classification}</h1>
          <p>${message}</p>
        </div>
        <div class="result-score" style="--score:${result.total * 3.6}deg"><div><strong>${result.total}</strong><span>de 100</span></div></div>
      </div>
    </section>
    <section class="result-body shell">
      <div class="result-layout">
        <div class="result-content">
          <section class="maturity-section">
          <div class="result-intro">
            <div><span class="section-label">Mapa de maturidade</span><h2>Seu desempenho por dimensão</h2></div>
            <p>Use este mapa para identificar desequilíbrios na operação.</p>
          </div>
          <div class="score-grid">
            ${result.scores.map(item => `<article class="score-row"><div><strong>${item.name}</strong><span>${levelFor(item.score)}</span></div><div class="bar"><span style="width:${item.score}%"></span></div><b>${item.score}</b></article>`).join("")}
          </div>
          </section>
          <section class="priorities">
          <div class="priority-heading"><span class="section-label">Plano de evolução</span><h2>Comece por estas três prioridades</h2><p>Uma sequência recomendada a partir dos seus menores resultados.</p></div>
          <div class="priority-grid">
            ${sorted.slice(0, 3).map((item, index) => `<article class="priority-card"><span class="priority-number">0${index + 1}</span><small>${item.name} · ${item.score}/100</small><h3>${playbooks[item.id].action}</h3><p>${playbooks[item.id].detail}</p></article>`).join("")}
          </div>
          </section>
          <section class="strength-card">
            <div class="strength-icon">${icon("trend")}</div><div><span class="section-label">Seu ponto de alavancagem</span><h3>${top.name}</h3><p>Use as práticas que já funcionam nessa dimensão para acelerar a evolução das áreas prioritárias.</p></div>
          </section>
          <div class="result-tools"><button class="text-button" data-action="restart">${icon("restart")} Refazer diagnóstico</button><button class="text-button" data-action="print">Imprimir ou salvar em PDF</button></div>
        </div>
        <aside class="result-lead" aria-label="Agende um diagnóstico com a Keeps">
          <div class="sticky-conversion">
            <h2>Leve este diagnóstico para a prática.</h2>
            <p>Deixe seus dados e um especialista da Keeps entrará em contato.</p>
            <div class="lead-form-card">
              <div id="keeps-lead-form" aria-live="polite"><p class="form-loading">Carregando formulário…</p></div>
              <p class="form-privacy">Ao enviar, você concorda com nossa <a href="https://keeps.com.br/politica-de-privacidade/" target="_blank" rel="noreferrer">Política de Privacidade</a>.</p>
              <div class="conversion-divider"><span>ou</span></div>
              <a class="button whatsapp-button" href="${whatsappUrl}" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.7a8.5 8.5 0 1 1 16.1-4.2Z"/><path d="M8.1 7.8c.2-.5.5-.5.8-.5h.4c.1 0 .3 0 .4.4l.7 1.7c.1.3.1.5-.1.7l-.5.6c-.2.2-.3.4-.1.7.5 1 1.3 1.8 2.3 2.3.3.2.5.1.7-.1l.7-.8c.2-.2.4-.2.7-.1l1.6.8c.3.1.4.3.4.5 0 .3-.1 1.2-.8 1.8-.6.5-1.4.8-2.4.5-1.2-.3-2.7-1-4.2-2.4-1.2-1.1-2-2.5-2.3-3.5-.3-1.1 0-2 .4-2.4.4-.4.8-.5 1.3-.2Z"/></svg>
                Falar pelo WhatsApp
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>`;
  mountHubSpotForm();
}

function mountHubSpotForm() {
  const target = document.querySelector("#keeps-lead-form");
  if (!target) return;
  const createForm = () => {
    if (!window.hbspt?.forms || !document.querySelector("#keeps-lead-form")) return;
    target.innerHTML = "";
    window.hbspt.forms.create({
      region: "na1",
      portalId: "23523710",
      formId: "48477db3-8a25-4ab4-972e-006db08fdcfc",
      target: "#keeps-lead-form",
      onFormReady: form => {
        const formElement = form?.querySelector ? form : form?.[0] || target.querySelector("form");
        formElement?.setAttribute("aria-label", "Fale com um especialista da Keeps");
        const submit = formElement?.querySelector('input[type="submit"]');
        if (submit) submit.value = "Falar com um especialista";
      },
      onFormSubmitted: () => announce("Dados enviados. Em breve, um especialista da Keeps entrará em contato.")
    });
  };
  if (window.hbspt?.forms) return createForm();
  const existing = document.querySelector("#hubspot-forms-script");
  if (existing) { existing.addEventListener("load", createForm, { once: true }); return; }
  const script = document.createElement("script");
  script.id = "hubspot-forms-script";
  script.src = "https://js.hsforms.net/forms/embed/v2.js";
  script.async = true;
  script.addEventListener("load", createForm, { once: true });
  script.addEventListener("error", () => {
    if (target.isConnected) target.innerHTML = '<p class="form-error">Não foi possível carregar o formulário agora. Você ainda pode falar conosco pelo WhatsApp.</p>';
  }, { once: true });
  document.head.appendChild(script);
}

function announce(message) {
  if (!announcer) return;
  announcer.textContent = "";
  requestAnimationFrame(() => { announcer.textContent = message; });
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function focusCurrentHeading() {
  const heading = app.querySelector(".question-title, .result-head h1, .hero h1");
  heading?.focus({ preventScroll: true });
}

function scrollToAppTop() {
  if (typeof window === "undefined") return;
  const top = Math.max(0, app.getBoundingClientRect().top + window.scrollY - 76);
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

function renderWithTransition(direction = "forward") {
  const update = () => render();
  const root = document.documentElement;
  root?.setAttribute("data-transition-direction", direction);
  if (prefersReducedMotion() || typeof document.startViewTransition !== "function") {
    update();
    return Promise.resolve();
  }
  try {
    return document.startViewTransition(update).finished.catch(() => {});
  } catch {
    update();
    return Promise.resolve();
  }
}

async function navigate(mutator, { direction = "forward", message = "" } = {}) {
  if (navigationLocked) return;
  navigationLocked = true;
  try {
    mutator();
    state = normalizeState(state);
    saveState();
    await renderWithTransition(direction);
    focusCurrentHeading();
    scrollToAppTop();
    if (message) announce(message);
  } finally {
    navigationLocked = false;
  }
}

function selectAnswer(input) {
  const current = questions[state.question];
  if (!current || input.name !== current.key) return;
  const value = Number(input.value);
  if (!Number.isInteger(value) || value < 1 || value > 5) return;
  state.answers[current.key] = value;
  saveState();
  app.querySelectorAll(`input[name="${current.key}"]`).forEach(radio => {
    const selected = Number(radio.value) === value;
    radio.checked = selected;
    radio.closest(".answer-option")?.classList.toggle("selected", selected);
  });
  const card = input.closest(".answer-option");
  card?.classList.remove("answer-confirmed");
  requestAnimationFrame(() => card?.classList.add("answer-confirmed"));
  app.querySelector('[data-action="next"]')?.removeAttribute("disabled");
  input.focus({ preventScroll: true });
  announce(`${levels[value - 1].short} selecionado. Pressione Enter para continuar.`);
}

app.addEventListener("change", event => {
  if (!event.target.matches('input[type="radio"]')) return;
  selectAnswer(event.target);
});

app.addEventListener("click", event => {
  const trigger = event.target.closest("[data-action]");
  if (!trigger) return;
  const action = trigger.dataset.action;
  if (action === "print") { window.print(); return; }
  if (action === "start") return navigate(() => {
    state.screen = "quiz";
    state.question = furthestQuestion();
  }, { message: `Pergunta ${furthestQuestion() + 1} de ${questions.length}` });
  if (action === "back" && state.question > 0) return navigate(() => {
    state.question -= 1;
  }, { direction: "back", message: `Pergunta ${state.question} de ${questions.length}` });
  if (action === "next" && state.answers[questions[state.question]?.key]) return navigate(() => {
    if (state.question === questions.length - 1) state.screen = "result";
    else state.question += 1;
  }, { message: state.question === questions.length - 1 ? "Resultado do diagnóstico" : `Pergunta ${state.question + 2} de ${questions.length}` });
  if (action === "restart") return navigate(() => {
    state = { screen: "intro", question: 0, answers: {} };
  }, { direction: "back", message: "Diagnóstico reiniciado" });
});

document.addEventListener("keydown", event => {
  if (state.screen !== "quiz" || event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
  const current = questions[state.question];
  if (event.key === "Enter" && state.answers[current.key]) {
    event.preventDefault();
    return navigate(() => {
      if (state.question === questions.length - 1) state.screen = "result";
      else state.question += 1;
    }, { message: state.question === questions.length - 1 ? "Resultado do diagnóstico" : `Pergunta ${state.question + 2} de ${questions.length}` });
  }
  const value = Number(event.key);
  if (value < 1 || value > 5) return;
  event.preventDefault();
  const input = app.querySelector(`input[name="${current.key}"][value="${value}"]`);
  if (input) selectAnswer(input);
});

document.querySelector(".brand").addEventListener("click", event => {
  event.preventDefault();
  navigate(() => { state.screen = "intro"; }, { direction: "back", message: "Página inicial" });
});

app.addEventListener("invalid", event => {
  requestAnimationFrame(() => {
    try {
      event.target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center", container: "nearest" });
    } catch {
      event.target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
    }
  });
}, true);

let scrollTicking = false;
function updateScrollState() {
  document.body?.classList.toggle("is-scrolled", window.scrollY > 12);
  scrollTicking = false;
}
globalThis.window?.addEventListener?.("scroll", () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(updateScrollState);
}, { passive: true });

render();
