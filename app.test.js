import test from "node:test";
import assert from "node:assert/strict";

const { categories, calculate, normalizeState } = await import("./diagnostic.js");

test("keeps the original 20 questions across 9 dimensions", () => {
  assert.equal(categories.length, 9);
  assert.equal(categories.reduce((sum, category) => sum + category.questions.length, 0), 20);
});

test("maps all expert answers to a score of 100", () => {
  const answers = {};
  categories.forEach((category, ci) => category.questions.forEach((_, qi) => answers[`${ci}-${qi}`] = 5));
  assert.equal(calculate(answers).total, 100);
  assert.equal(calculate(answers).classification, "Especialista");
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
});

test("uses the expected classification boundaries", () => {
  const answersAt = value => Object.fromEntries(
    categories.flatMap((category, categoryIndex) =>
      category.questions.map((_, questionIndex) => [`${categoryIndex}-${questionIndex}`, value])
    )
  );
  assert.equal(calculate(answersAt(1)).classification, "Em desenvolvimento");
  assert.equal(calculate(answersAt(2)).classification, "Intermediário");
  assert.equal(calculate(answersAt(3)).classification, "Avançado");
  assert.equal(calculate(answersAt(4)).classification, "Especialista");
});
