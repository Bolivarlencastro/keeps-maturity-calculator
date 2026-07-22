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
- Captura progressiva: nome e e-mail antes do quiz, resultado completo sem novo bloqueio e consultoria opcional depois do resultado.
- Nome e e-mail personalizam a experiência e preenchem automaticamente o formulário comercial.
- Telefone/WhatsApp é apresentado como opcional no pedido de consultoria.
- Estado persistido é validado antes de renderizar e o progresso anterior continua compatível.
- As 20 perguntas permanecem montadas no DOM; avançar ou voltar alterna somente o painel visível.
- Selecionar uma resposta atualiza apenas o componente necessário, preservando foco e teclado.
- Atalhos `1–5` e `Enter`, anúncios para leitores de tela e foco previsível entre perguntas.
- Opacidade aplicada aos elementos da pergunta, progresso persistente, View Transitions entre telas, `@starting-style`, animação do score e rolagem contextual como melhorias progressivas.
- `prefers-reduced-motion` respeitado; navegadores sem as APIs novas recebem o fluxo completo sem animação.
- Formulário nativo do HubSpot estilizado com o mesmo componente visual dos demais botões, sem submit duplicado.
- Contrato de `dataLayer` para CTA, identificação, início, resposta, conclusão, solicitação de consultoria e clique no WhatsApp.
- Relatório imprimível ou exportável em PDF pelo navegador.
- Zero dependências de produção; Google Fonts é o único recurso visual externo.
- Identidade alinhada ao site institucional: logo oficial, Roboto Flex, roxo `#6750A4` e gradiente Keeps.

Para uma versão 100% autocontida, basta hospedar as fontes localmente ou usar a pilha de fontes do sistema.

## Integração da captura inicial

A interface inicial está pronta e mantém o perfil no estado local. Para registrar essa etapa no CRM, crie no HubSpot um formulário com apenas `firstname`, `lastname` e `email` e informe seu GUID em `hubspot.leadFormId`, no início de `app.js`. O envio usa a API pública de submissão de formulários; nenhum token privado é exposto no navegador.

O formulário de consultoria continua usando `hubspot.consultationFormId`. A obrigatoriedade do telefone também deve ser removida na configuração desse formulário no HubSpot; a aplicação já remove a indicação visual e a validação HTML, mas o CRM é a fonte definitiva dessa regra.
