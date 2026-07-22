import { calculate, createDefaultState, levelFor, levels, normalizeState, playbooks, questions } from "./diagnostic.js";

const storageKey = "keeps-maturity-v4";
const previousStorageKey = "keeps-maturity-v3";
const legacyStorageKey = "keeps-maturity-v2";
const hubspot = {
  portalId: "23523710",
  leadFormId: "",
  consultationFormId: "48477db3-8a25-4ab4-972e-006db08fdcfc"
};
const app = document.querySelector("#app");
const announcer = document.querySelector("#app-announcer");
let state = loadState();
let navigationLocked = false;

function loadState() {
  try {
    const saved = localStorage.getItem(storageKey) || localStorage.getItem(previousStorageKey) || localStorage.getItem(legacyStorageKey);
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

function track(event, parameters = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, diagnostic_name: "maturidade_td", ...parameters });
}

function firstName() {
  return state.profile?.name?.trim().split(/\s+/)[0] || "";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function renderIntro() {
  const answered = Object.keys(state.answers).length;
  app.innerHTML = `
    <section class="hero shell">
      <div class="hero-copy">
        <span class="kicker">Diagnóstico gratuito · resultado imediato</span>
        <h1 tabindex="-1">O próximo salto do seu T&D começa com um diagnóstico claro.</h1>
        <p class="hero-lead">Avalie as principais dimensões da sua operação de T&amp;D e descubra onde concentrar esforços para ampliar o impacto no negócio.</p>
        <form class="hero-lead-form" data-identify-form>
          <label for="lead-name"><span>Nome</span><input id="lead-name" name="name" type="text" autocomplete="name" maxlength="120" placeholder="Seu nome" required value="${escapeAttribute(state.profile?.name || "")}" /></label>
          <label for="lead-email"><span>E-mail profissional</span><input id="lead-email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="voce@empresa.com" required value="${escapeAttribute(state.profile?.email || "")}" /></label>
          <button class="button button-primary" type="submit"><span data-submit-label>${answered ? "Continuar diagnóstico" : "Começar diagnóstico"}</span> ${icon("arrow")}</button>
          <p class="form-error" data-identify-error role="alert" hidden></p>
          <p class="hero-form-privacy">Ao continuar, você concorda com nossa <a href="https://keeps.com.br/politica-de-privacidade/" target="_blank" rel="noreferrer">Política de Privacidade</a>.</p>
        </form>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="flow-glow flow-glow-one"></div>
        <div class="flow-glow flow-glow-two"></div>
        <svg class="hero-flow" viewBox="0 0 600 520" role="presentation">
          <defs>
            <linearGradient id="flow-gradient" x1="48" y1="458" x2="550" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#6750a4" stop-opacity=".18" />
              <stop offset=".56" stop-color="#a8379c" stop-opacity=".52" />
              <stop offset="1" stop-color="#de2b81" stop-opacity=".28" />
            </linearGradient>
            <linearGradient id="flow-surface-gradient" x1="70" y1="470" x2="520" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#6750a4" stop-opacity=".025" />
              <stop offset=".58" stop-color="#a8379c" stop-opacity=".09" />
              <stop offset="1" stop-color="#de2b81" stop-opacity=".025" />
            </linearGradient>
            <filter id="flow-soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>
          <path class="flow-surface" d="M50 444 C143 432 145 343 236 336 C329 329 302 230 397 210 C470 194 466 116 550 66 L550 121 C485 157 485 226 415 245 C333 267 349 357 252 370 C161 382 151 458 50 476 Z" />
          <path class="flow-depth flow-depth-back" d="M30 415 C128 405 132 323 221 314 C316 305 292 214 382 194 C455 178 455 110 535 70" />
          <path class="flow-depth flow-depth-front" d="M72 473 C168 461 169 379 259 369 C354 358 332 272 424 249 C493 232 496 165 567 126" />
          <path class="flow-shadow-line" d="M50 444 C143 432 145 343 236 336 C329 329 302 230 397 210 C470 194 466 116 550 66" />
          <path class="flow-track" d="M50 444 C143 432 145 343 236 336 C329 329 302 230 397 210 C470 194 466 116 550 66" />
          <path class="flow-line" pathLength="1" d="M50 444 C143 432 145 343 236 336 C329 329 302 230 397 210 C470 194 466 116 550 66" />
          <g class="flow-halos">
            <ellipse cx="50" cy="444" rx="22" ry="8" />
            <ellipse cx="236" cy="336" rx="27" ry="10" />
            <ellipse cx="397" cy="210" rx="33" ry="12" />
            <ellipse cx="550" cy="66" rx="40" ry="15" />
          </g>
          <g class="flow-nodes">
            <circle cx="50" cy="444" r="5" />
            <circle cx="236" cy="336" r="6" />
            <circle cx="397" cy="210" r="7" />
            <circle class="flow-node-final" cx="550" cy="66" r="9" />
          </g>
        </svg>
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

function escapeAttribute(value) {
  return String(value).replace(/[&<>'"]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

async function submitLeadToHubSpot(profile) {
  if (!hubspot.leadFormId) return { synced: false };
  const names = profile.name.trim().split(/\s+/);
  const response = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${hubspot.portalId}/${hubspot.leadFormId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      submittedAt: Date.now(),
      fields: [
        { objectTypeId: "0-1", name: "firstname", value: names[0] || "" },
        { objectTypeId: "0-1", name: "lastname", value: names.slice(1).join(" ") },
        { objectTypeId: "0-1", name: "email", value: profile.email }
      ],
      context: { pageUri: window.location.href, pageName: document.title }
    })
  });
  if (!response.ok) throw new Error("Não foi possível salvar seus dados agora. Tente novamente.");
  return { synced: true };
}

function renderQuiz() {
  const progress = (state.question + 1) / questions.length * 100;
  const current = questions[state.question];
  app.innerHTML = `
    <div class="quiz-progress" role="progressbar" aria-label="Progresso do diagnóstico" aria-valuemin="1" aria-valuemax="20" aria-valuenow="${state.question + 1}" aria-valuetext="Pergunta ${state.question + 1} de ${questions.length}"><span style="width:${progress}%"></span></div>
    <section class="quiz-shell shell">
      <div class="quiz-focus">
        <div class="question-stage">
          ${questions.map((question, index) => {
            const selected = state.answers[question.key];
            const active = index === state.question;
            const titleId = `question-title-${question.key}`;
            return `<section class="question-panel ${active ? "is-active" : ""}" data-question-index="${index}" aria-labelledby="${titleId}" ${active ? "" : "hidden"}>
              <span class="question-count">Pergunta ${index + 1} de ${questions.length}</span>
              <h1 class="question-title" id="${titleId}" tabindex="-1">${question.text}</h1>
              <fieldset class="single-question">
                <legend class="sr-only">Selecione uma resposta. A escala vai de 1, desconheço, a 5, especialista.</legend>
                <div class="answer-scale">
                  ${levels.map(level => `<label class="answer-option ${selected === level.value ? "selected" : ""}">
                    <input type="radio" name="${question.key}" value="${level.value}" ${selected === level.value ? "checked" : ""}/>
                    <span class="answer-key" aria-hidden="true">${level.value}</span>
                    <strong>${level.short}</strong>
                  </label>`).join("")}
                </div>
              </fieldset>
            </section>`;
          }).join("")}
        </div>
        <div class="quiz-actions">
          <button class="button button-secondary" data-action="back" ${state.question === 0 ? "disabled" : ""}>Voltar</button>
          <p class="keyboard-hint">Use 1–5 para responder e Enter para continuar</p>
          <button class="button button-primary" data-action="next" ${state.answers[current.key] ? "" : "disabled"}><span data-next-label>${state.question === questions.length - 1 ? "Ver resultado" : "Continuar"}</span>${icon("arrow")}</button>
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
  const givenName = escapeHtml(firstName());
  const sorted = [...result.scores].sort((a, b) => a.score - b.score);
  const top = [...result.scores].sort((a, b) => b.score - a.score)[0];
  const resultPlaybook = playbooks[result.classification];
  const whatsappMessage = `Olá! Concluí o Diagnóstico de Maturidade em T&D da Keeps. Meu resultado foi ${result.total}/100 (${result.classification}) e gostaria de conversar com um especialista.`;
  const whatsappUrl = `https://wa.me/554896064505?text=${encodeURIComponent(whatsappMessage)}`;
  const message = result.total >= 80 ? "Sua operação já é referência. O desafio agora é transformar excelência em vantagem competitiva." : result.total >= 60 ? "Você tem uma base consistente. Agora é hora de conectar as práticas e ampliar o impacto no negócio." : result.total >= 40 ? "Existem boas práticas em curso, mas elas ainda precisam ganhar consistência e conexão estratégica." : "Você tem uma ótima oportunidade de construir as bases certas, na ordem certa, sem carregar processos desnecessários.";
  app.innerHTML = `
    <section class="result-hero">
      <div class="shell result-head">
        <div>
          <span class="kicker kicker-light">${givenName ? `${givenName}, seu diagnóstico está pronto` : "Seu diagnóstico está pronto"}</span>
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
            ${result.scores.map(item => `<article class="score-row"><div><strong>${item.shortName || item.name}</strong><span>${levelFor(item.score)}</span></div><div class="bar"><span style="width:${item.score}%"></span></div><b>${Math.round(item.score)}</b></article>`).join("")}
          </div>
          </section>
          <section class="priorities">
          <div class="priority-heading"><span class="section-label">Plano de evolução</span><h2>Comece por estas três prioridades</h2><p>Uma sequência recomendada a partir dos seus menores resultados.</p></div>
          <div class="priority-grid">
            ${sorted.slice(0, 3).map((item, index) => `<article class="priority-card"><span class="priority-number">0${index + 1}</span><small>${item.shortName || item.name} · ${Math.round(item.score)}/100</small><h3>${resultPlaybook[item.id].action}</h3><p>${resultPlaybook[item.id].detail}</p></article>`).join("")}
          </div>
          </section>
          <section class="strength-card">
            <div class="strength-icon">${icon("trend")}</div><div><span class="section-label">Seu ponto de alavancagem</span><h3>${top.shortName || top.name}</h3><p>Use as práticas que já funcionam nessa dimensão para acelerar a evolução das áreas prioritárias.</p></div>
          </section>
          <div class="result-tools"><button class="text-button" data-action="restart">${icon("restart")} Refazer diagnóstico</button><button class="text-button" data-action="print">Imprimir ou salvar em PDF</button></div>
        </div>
        <aside class="result-lead" aria-label="Solicite uma consultoria com a Keeps">
          <div class="sticky-conversion">
            <span class="section-label">Consultoria gratuita de 1 hora</span>
            <h2>Transforme seu diagnóstico em um plano de ação.</h2>
            <p>Converse com um especialista da Keeps para interpretar seus resultados e definir os próximos passos. O WhatsApp é opcional.</p>
            <div class="lead-form-card">
              <div id="keeps-lead-form" aria-live="polite"><p class="form-loading">Carregando formulário…</p></div>
              <p class="form-privacy">Ao enviar, você concorda com nossa <a href="https://keeps.com.br/politica-de-privacidade/" target="_blank" rel="noreferrer">Política de Privacidade</a>.</p>
              <div class="conversion-divider"><span>ou</span></div>
              <a class="button whatsapp-button" href="${whatsappUrl}" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.7a8.5 8.5 0 1 1 16.1-4.2Z"/><path d="M8.1 7.8c.2-.5.5-.5.8-.5h.4c.1 0 .3 0 .4.4l.7 1.7c.1.3.1.5-.1.7l-.5.6c-.2.2-.3.4-.1.7.5 1 1.3 1.8 2.3 2.3.3.2.5.1.7-.1l.7-.8c.2-.2.4-.2.7-.1l1.6.8c.3.1.4.3.4.5 0 .3-.1 1.2-.8 1.8-.6.5-1.4.8-2.4.5-1.2-.3-2.7-1-4.2-2.4-1.2-1.1-2-2.5-2.3-3.5-.3-1.1 0-2 .4-2.4.4-.4.8-.5 1.3-.2Z"/></svg>
                Prefiro conversar pelo WhatsApp
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
      portalId: hubspot.portalId,
      formId: hubspot.consultationFormId,
      target: "#keeps-lead-form",
      onFormReady: form => {
        const formElement = form?.querySelector ? form : form?.[0] || target.querySelector("form");
        formElement?.setAttribute("aria-label", "Solicite sua consultoria gratuita de uma hora");
        prefillHubSpotField(formElement, "firstname", state.profile?.name?.split(/\s+/)[0]);
        prefillHubSpotField(formElement, "lastname", state.profile?.name?.split(/\s+/).slice(1).join(" "));
        prefillHubSpotField(formElement, "email", state.profile?.email);
        ["firstname", "lastname", "email"].forEach(name => formElement?.querySelector(`[name="${name}"]`)?.closest(".hs-form-field")?.classList.add("prefilled-field"));
        const phone = formElement?.querySelector('[name="phone"], [name="mobilephone"]');
        if (phone) {
          phone.required = false;
          phone.removeAttribute("data-rule-required");
          const field = phone.closest(".hs-form-field");
          field?.classList.add("optional-field");
          const label = field?.querySelector("label");
          if (label) label.childNodes.forEach(node => { if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.replace(/\*+\s*$/, ""); });
          label?.insertAdjacentHTML("beforeend", '<span class="optional-label"> (opcional)</span>');
          field?.querySelectorAll(".hs-form-required").forEach(mark => mark.remove());
        }
        const submit = formElement?.querySelector('input[type="submit"]');
        if (submit) submit.value = "Quero minha consultoria de 1 hora";
      },
      onFormSubmitted: () => {
        track("consultation_requested", { contact_preference: "form" });
        announce("Solicitação enviada. Em breve, um especialista da Keeps entrará em contato.");
      }
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

function prefillHubSpotField(form, name, value) {
  const input = form?.querySelector(`[name="${name}"]`);
  if (!input || !value) return;
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
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
  const heading = app.querySelector(".question-panel:not([hidden]) .question-title, .result-head h1, .hero h1");
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

function updateQuizChrome() {
  const current = questions[state.question];
  const progress = app.querySelector(".quiz-progress");
  if (progress) {
    progress.setAttribute("aria-valuenow", String(state.question + 1));
    progress.setAttribute("aria-valuetext", `Pergunta ${state.question + 1} de ${questions.length}`);
    progress.querySelector("span")?.style.setProperty("width", `${(state.question + 1) / questions.length * 100}%`);
  }
  const back = app.querySelector('[data-action="back"]');
  const next = app.querySelector('[data-action="next"]');
  if (back) back.disabled = state.question === 0;
  if (next) {
    next.disabled = !state.answers[current.key];
    const label = next.querySelector("[data-next-label]");
    if (label) label.textContent = state.question === questions.length - 1 ? "Ver resultado" : "Continuar";
  }
}

async function moveQuestion(nextQuestion) {
  if (navigationLocked || state.screen !== "quiz") return;
  const targetIndex = Math.min(Math.max(nextQuestion, 0), questions.length - 1);
  if (targetIndex === state.question) return;
  navigationLocked = true;
  const previousPanel = app.querySelector(`.question-panel[data-question-index="${state.question}"]`);
  const nextPanel = app.querySelector(`.question-panel[data-question-index="${targetIndex}"]`);
  try {
    state.question = targetIndex;
    saveState();
    updateQuizChrome();
    if (!prefersReducedMotion() && previousPanel?.animate) {
      const exit = previousPanel.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 100,
        easing: "ease-out",
        fill: "forwards"
      });
      await exit.finished.catch(() => {});
      exit.cancel();
    }
    if (previousPanel) {
      previousPanel.hidden = true;
      previousPanel.classList.remove("is-active");
    }
    if (nextPanel) {
      nextPanel.hidden = false;
      nextPanel.classList.remove("is-active");
      void nextPanel.offsetWidth;
      nextPanel.classList.add("is-active");
    }
    focusCurrentHeading();
    scrollToAppTop();
    announce(`Pergunta ${state.question + 1} de ${questions.length}`);
  } finally {
    navigationLocked = false;
  }
}

function advanceQuiz() {
  const current = questions[state.question];
  if (!state.answers[current?.key]) return;
  if (state.question < questions.length - 1) return moveQuestion(state.question + 1);
  track("diagnostic_completed", { questions_answered: Object.keys(state.answers).length });
  return navigate(() => { state.screen = "result"; }, { message: "Resultado do diagnóstico" });
}

function selectAnswer(input) {
  const current = questions[state.question];
  if (!current || input.name !== current.key) return;
  const value = Number(input.value);
  if (!Number.isInteger(value) || value < 1 || value > 5) return;
  state.answers[current.key] = value;
  track("question_answered", { question_number: state.question + 1, dimension: current.category.id, answer_value: value });
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

app.addEventListener("submit", async event => {
  if (!event.target.matches("[data-identify-form]")) return;
  event.preventDefault();
  if (navigationLocked) return;
  const data = new FormData(event.target);
  const profile = { name: String(data.get("name") || "").trim(), email: String(data.get("email") || "").trim().toLowerCase() };
  track("diagnostic_cta_clicked", { returning_user: Object.keys(state.answers).length > 0 });
  const submit = event.target.querySelector('button[type="submit"]');
  const label = submit?.querySelector("[data-submit-label]");
  const error = event.target.querySelector("[data-identify-error]");
  if (submit) submit.disabled = true;
  if (label) label.textContent = "Salvando…";
  if (error) error.hidden = true;
  let submission;
  try {
    submission = await submitLeadToHubSpot(profile);
  } catch (submissionError) {
    if (submit) submit.disabled = false;
    if (label) label.textContent = Object.keys(state.answers).length ? "Continuar diagnóstico" : "Começar diagnóstico";
    if (error) { error.textContent = submissionError.message; error.hidden = false; }
    track("lead_capture_error", { lead_capture_stage: "before_quiz" });
    return;
  }
  state.profile = profile;
  track("lead_details_submitted", { lead_capture_stage: "before_quiz", crm_synced: submission.synced });
  track("diagnostic_started", { returning_user: Object.keys(state.answers).length > 0 });
  navigate(() => {
    state.screen = "quiz";
    state.question = furthestQuestion();
  }, { message: `Vamos começar, ${firstName()}. Pergunta ${furthestQuestion() + 1} de ${questions.length}` });
});

app.addEventListener("click", event => {
  const trigger = event.target.closest("[data-action]");
  if (!trigger) return;
  const action = trigger.dataset.action;
  if (action === "print") { window.print(); return; }
  if (action === "back" && state.question > 0) return moveQuestion(state.question - 1);
  if (action === "next") return advanceQuiz();
  if (action === "restart") return navigate(() => {
    state = { ...createDefaultState(), profile: state.profile };
  }, { direction: "back", message: "Diagnóstico reiniciado" });
});

app.addEventListener("click", event => {
  if (event.target.closest(".whatsapp-button")) track("whatsapp_click", { placement: "result_consultation" });
});

document.addEventListener("keydown", event => {
  if (state.screen !== "quiz" || event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
  const current = questions[state.question];
  if (event.key === "Enter" && state.answers[current.key]) {
    event.preventDefault();
    return advanceQuiz();
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
