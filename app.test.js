import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const { categories, calculate, createDefaultState, levels, normalizeState, playbooks, questions } = await import("./diagnostic.js");
const { recommendations } = await import("./recommendations.js");

test("keeps the original 20 questions across 9 dimensions", () => {
  assert.equal(categories.length, 9);
  assert.equal(categories.reduce((sum, category) => sum + category.questions.length, 0), 20);
});

test("preserves the original question and answer wording", () => {
  assert.equal(questions[1].text, "Você consegue mapear indicadores de sucesso corporativo durante a etapa de planejamento inicial de uma Universidade Corporativa Digital?");
  assert.equal(questions[5].text, "Você tem domínio prático sobre os principais modelos metodológicos de T&D, como ADDIE, 6Ds, Kirkpatrick e Phillips?");
  assert.deepEqual(levels.map(level => [level.value, level.label]), [
    [1, "Desconheço"],
    [2, "Conhecimento Básico"],
    [3, "Conhecimento Intermediário"],
    [4, "Conhecimento Aprofundado"],
    [5, "Especialista"]
  ]);
});

test("maps all expert answers to a score of 100", () => {
  const answers = {};
  categories.forEach((category, ci) => category.questions.forEach((_, qi) => answers[`${ci}-${qi}`] = 5));
  assert.equal(calculate(answers).total, 100);
  assert.equal(calculate(answers).classification, "Especialista");
});

test("weights each question equally instead of weighting each dimension equally", () => {
  const answers = Object.fromEntries(questions.map(question => [question.key, 1]));
  answers["0-0"] = 5;
  answers["0-1"] = 5;
  const result = calculate(answers);
  assert.equal(result.total, 28);
  assert.equal(result.scores[0].score, 100);
  assert.equal(result.classification, "Iniciante");
});

test("uses the recommendation matrix recovered from the original calculator", () => {
  assert.equal(playbooks.Iniciante.diagnosis.action, "Capacitar equipe em metodologias de LNT");
  assert.equal(playbooks.Especialista.purpose.action, "Posicionar UC como diferencial competitivo");
  assert.equal(Object.values(recommendations).reduce((total, level) => total + Object.keys(level).length, 0), 36);
  assert.equal(recommendations.Iniciante.diagnosis.nextSteps[0], playbooks.Iniciante.diagnosis.action);
  assert.equal(recommendations.Especialista.purpose.executiveSummary, playbooks.Especialista.purpose.detail);
});

test("sanitizes persisted state before rendering", () => {
  const normalized = normalizeState({
    screen: "result",
    question: 99,
    answers: { "0-0": 5, "0-1": 8, invalid: 3 }
  });
  assert.equal(normalized.screen, "quiz");
  assert.equal(normalized.question, 19);
  assert.deepEqual(normalized.answers, { "0-0": 5 });
  assert.deepEqual(normalized.profile, { name: "", email: "" });
});

test("normalizes and preserves progressive lead data", () => {
  const normalized = normalizeState({ screen: "intro", profile: { name: "  Bolívar Alencastro  ", email: " BOLIVAR@EXAMPLE.COM " } });
  assert.equal(normalized.screen, "intro");
  assert.deepEqual(normalized.profile, { name: "Bolívar Alencastro", email: "bolivar@example.com" });
  assert.deepEqual(createDefaultState().profile, { name: "", email: "" });
});

test("uses the expected classification boundaries", () => {
  const answersAt = value => Object.fromEntries(
    categories.flatMap((category, categoryIndex) =>
      category.questions.map((_, questionIndex) => [`${categoryIndex}-${questionIndex}`, value])
    )
  );
  assert.equal(calculate(answersAt(1)).classification, "Iniciante");
  assert.equal(calculate(answersAt(2)).classification, "Intermediário");
  assert.equal(calculate(answersAt(3)).classification, "Avançado");
  assert.equal(calculate(answersAt(4)).classification, "Especialista");
});

test("keeps critical mobile UX protections in place", async () => {
  const [appSource, css] = await Promise.all([
    readFile(new URL("./app.js", import.meta.url), "utf8"),
    readFile(new URL("./styles.css", import.meta.url), "utf8")
  ]);
  assert.match(appSource, /class="button button-primary mobile-consultation-cta" href="#consultoria"/);
  assert.match(css, /--safe-bottom:env\(safe-area-inset-bottom,0px\)/);
  assert.match(css, /min-height:calc\(100dvh - var\(--header-height\) - 4px\)/);
  assert.match(css, /font-size:16px!important/);
  assert.match(css, /grid-template-columns:32px minmax\(0,1fr\) 20px/);
});
