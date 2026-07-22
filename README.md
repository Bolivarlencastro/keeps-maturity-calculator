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
- As 20 perguntas, 5 alternativas, 9 dimensões, classificações e recomendações foram recuperadas do bundle público da calculadora original e preservadas literalmente.
- A nota geral pondera igualmente as 20 perguntas; as notas de dimensão são médias internas de seus respectivos agrupamentos.
- Captura progressiva integrada à própria landing page: nome e e-mail antes do quiz, resultado completo sem novo bloqueio e consultoria opcional depois do resultado.
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

A evidência e as regras recuperadas da aplicação original estão documentadas em [`docs/original-calculator-spec.md`](./docs/original-calculator-spec.md).

## Integração da captura inicial

A interface inicial mantém o perfil no estado local e faz dois envios independentes:

1. HubSpot, por meio da API pública de submissão de formulários, para criar/atualizar o contato e acionar a automação de nutrição.
2. Google Apps Script, em modo não bloqueante, para registrar a sessão e os eventos analíticos no Google Sheets.

O formulário HubSpot inicial usa o GUID `943890c9-07b9-4126-9c16-887ae066f662` e recebe `firstname` (nome completo) e `email`. O formulário completo usa o GUID `48477db3-8a25-4ab4-972e-006db08fdcfc`. Nenhum token privado é exposto no navegador.

O formulário de consultoria continua usando `hubspot.consultationFormId`. A obrigatoriedade do telefone também deve ser removida na configuração desse formulário no HubSpot; a aplicação já remove a indicação visual e a validação HTML, mas o CRM é a fonte definitiva dessa regra.

## Analytics no Google Sheets

Planilha operacional: [Keeps — Diagnóstico de Maturidade — Analytics](https://docs.google.com/spreadsheets/d/1VWSabu1Cg3gN0tK5uBHF4rp0hNgvMKn-P6_Fjd65k54/edit)

As abas são separadas por finalidade:

- `Usuarios`: única aba com nome e e-mail, associados a um `user_id` anônimo.
- `Sessoes`: início, última atividade, status, tempo, progresso e atribuição UTM.
- `Respostas`: uma linha por resposta ou alteração de resposta.
- `Eventos`: trilha bruta de navegação e conversão.
- `Resultados`: nota final, classificação e notas das nove dimensões.

O coletor está em `apps-script/Code.gs`. O projeto remoto e o diretório local são conectados por `.clasp.json`. Para publicar uma nova versão:

```bash
clasp push
clasp deploy --description "descrição da versão"
```

Depois de um novo deployment, atualize `analyticsConfig.endpoint` em `app.js`. O Web App deve executar como o usuário que fez o deployment e permitir acesso anônimo. O envio usa `POST` com `text/plain`, `no-cors` e `keepalive`, portanto uma falha analítica nunca bloqueia o diagnóstico.

O projeto registra `diagnostic_started`, visualização e resposta de perguntas, conclusão, reinício, pausa/abandono inferido, impressão, clique no WhatsApp e pedido de consultoria. Nome e e-mail são enviados ao Sheets somente no evento `lead_details_submitted` e não entram no `dataLayer`.
