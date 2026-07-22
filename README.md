# Diagnóstico de maturidade em T&D — Keeps

Recriação leve da calculadora original, sem framework e sem dependências de produção.

## Rodar localmente

```bash
npm run dev
```

Abra `http://localhost:4173`.

## Publicação

O projeto é totalmente estático e pode ser publicado diretamente pelo GitHub Pages a partir da raiz da branch `main`. O arquivo `.nojekyll` evita processamento desnecessário pelo Jekyll.

Versão pública: https://bolivarlencastro.github.io/keeps-maturity-calculator/

Antes de publicar uma nova versão:

```bash
npm test
```

## Decisões principais

- HTML semântico, CSS responsivo e JavaScript modular, sem framework.
- Regras do diagnóstico isoladas em `diagnostic.js`; a interface e as integrações ficam em `app.js`.
- As 20 perguntas, 9 dimensões e a pontuação de 20–100 foram preservadas.
- Resultado completo antes da conversão; agendamento comercial é opcional.
- Estado persistido é validado antes de renderizar e o progresso anterior continua compatível.
- As 20 perguntas permanecem montadas no DOM; avançar ou voltar alterna somente o painel visível.
- Selecionar uma resposta atualiza apenas o componente necessário, preservando foco e teclado.
- Atalhos `1–5` e `Enter`, anúncios para leitores de tela e foco previsível entre perguntas.
- Opacidade aplicada aos elementos da pergunta, progresso persistente, View Transitions entre telas, `@starting-style`, animação do score e rolagem contextual como melhorias progressivas.
- `prefers-reduced-motion` respeitado; navegadores sem as APIs novas recebem o fluxo completo sem animação.
- Formulário nativo do HubSpot estilizado com o mesmo componente visual dos demais botões, sem submit duplicado.
- Relatório imprimível ou exportável em PDF pelo navegador.
- Zero dependências de produção; Google Fonts é o único recurso visual externo.
- Identidade alinhada ao site institucional: logo oficial, Roboto Flex, roxo `#6750A4` e gradiente Keeps.

Para uma versão 100% autocontida, basta hospedar as fontes localmente ou usar a pilha de fontes do sistema.
