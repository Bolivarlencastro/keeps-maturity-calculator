# Especificação recuperada da calculadora original

Fonte de verdade analisada em 22/07/2026:

- Aplicação: `https://calculadora.keeps.com.br/`
- Bundle público: `/assets/index-Djvzoe9f.js`
- SHA-256 do bundle: `1de1865cbc5ac54e34981c3d33123a593752703d6e1f82d3ff8390400be250b6`
- Estruturas originais identificadas pelos caminhos de origem preservados no bundle: `CalculatorContext.tsx`, `Calculator.tsx`, `ResultPreview.tsx` e `DiagnosisReport.tsx`.

## Questionário

- 20 perguntas em 9 agrupamentos.
- Ordem dos agrupamentos: propósito, diagnóstico, metodologias, escalabilidade, operação, produtividade, engajamento e retenção, indicadores de resultado e sustentabilidade.
- A implementação original apresenta um agrupamento por etapa, com duas ou três perguntas na mesma tela.
- O redesign mantém a ordem e o conteúdo, mas apresenta uma pergunta por vez para reduzir carga cognitiva.

## Escala original

| Valor | Resposta |
|---:|---|
| 1 | Desconheço |
| 2 | Conhecimento Básico |
| 3 | Conhecimento Intermediário |
| 4 | Conhecimento Aprofundado |
| 5 | Especialista |

A calculadora original exibe as alternativas de 5 para 1. O redesign mantém os mesmos valores e rótulos, organizados de 1 para 5 para preservar a progressão visual e os atalhos de teclado.

## Fórmula original

Cada pergunta tem o mesmo peso na nota geral:

```text
nota geral = arredondar((soma das 20 respostas / 20) × 20)
```

A nota de cada agrupamento é:

```text
nota do agrupamento = (soma das respostas do agrupamento / quantidade de perguntas do agrupamento) × 20
```

A nota de agrupamento é mantida com precisão decimal e arredondada apenas na apresentação. A nota geral é arredondada no cálculo.

É incorreto calcular a nota geral pela média simples das nove notas de agrupamento: isso aumenta o peso dos agrupamentos com duas perguntas em relação aos que possuem três.

## Classificação original

| Nota | Classificação |
|---:|---|
| 20–39 | Iniciante |
| 40–59 | Intermediário |
| 60–79 | Avançado |
| 80–100 | Especialista |

## Recomendações

O original possui uma matriz de quatro classificações por nove agrupamentos. Para cada combinação há listas de pontos fortes, oportunidades, próximos passos e um resumo executivo.

O redesign usa, para as três dimensões com menor nota:

- o primeiro próximo passo da matriz original como ação prioritária;
- o resumo executivo original como explicação;
- a classificação geral para selecionar a linha da matriz, reproduzindo a regra encontrada no original.

## Testes de referência

- Todas as respostas 1: nota 20, Iniciante.
- Todas as respostas 2: nota 40, Intermediário.
- Todas as respostas 3: nota 60, Avançado.
- Todas as respostas 4: nota 80, Especialista.
- Todas as respostas 5: nota 100, Especialista.
- Apenas as duas perguntas de propósito com valor 5 e todas as demais com valor 1: nota geral 28. Esse vetor detecta uma implementação incorreta que pondera dimensões em vez de perguntas.
