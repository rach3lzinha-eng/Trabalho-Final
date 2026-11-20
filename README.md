# Agendaê

O Agendaê é uma interface responsiva para centralizar a agenda de um salão de beleza. O produto foi pensado para Mariana, proprietária e recepcionista de um salão pequeno que precisa visualizar horários por profissional, evitar conflitos, confirmar atendimentos e preencher rapidamente os espaços vagos.

## Público e princípio norteador

A interface atende recepcionistas, proprietárias e profissionais de salões pequenos que hoje alternam entre WhatsApp, caderno, calendário do celular e planilhas. O princípio norteador do produto é: **“Um horário deve estar livre ou ocupado de forma clara em até dois toques.”**

## Como executar

O projeto não usa React, build ou dependências locais. Na pasta raiz, execute:

```bash
python3 -m http.server 3000
```

Depois, abra `http://localhost:3000` no navegador. Também é possível usar qualquer servidor HTTP estático equivalente.

## Páginas

- `index.html` — painel inicial com resumo do dia, agenda compacta e próximos atendimentos.
- `agenda.html` — agenda por profissional e formulário de novo agendamento.
- `atendimentos.html` — lista pesquisável, filtrável e ordenável de atendimentos.
- `espera.html` — cadastro e acompanhamento da lista de espera.

## Arquivos principais

- `styles.css` — estilos externos, tokens de cor, layout com Grid/Flexbox, responsividade e estados de foco.
- `script.js` — menu mobile, alternância de tema, seleção de horários, validações, filtros, ordenação, modal de remarcação e feedbacks.
- `public/manus-routes.json` — rotas disponíveis para a navegação do projeto.
- `MUDANCAS.md` — diferenças conscientes em relação ao protótipo e seus motivos.
- `TODO.md` — registro dos requisitos e do andamento da implementação.

## Tecnologias e acessibilidade

A base é HTML semântico, CSS externo e JavaScript puro. O projeto utiliza o componente `alert` do Bootstrap via CDN no feedback do formulário; o equivalente em CSS puro está documentado em `styles.css`, logo acima das regras de `.form-feedback`. O layout usa CSS Grid e Flexbox, não usa `float` e não possui `style=""` no HTML.

Todos os campos têm `label` associado, os formulários usam tipos HTML adequados e validação nativa, as imagens decorativas usam `alt=""`, os botões têm nomes acessíveis e o foco de teclado permanece visível. O menu foi pensado para 360px, 768px e 1280px sem rolagem horizontal.

## Créditos

- Grupo: Rachel Tolentino de Sena
- Disciplina: Desenvolvimento de Interfaces — ADS/CEUB
- Pesquisa e definição do produto: E1 — Pesquisa e definição
- Ícones: SVG inline desenhados para a interface, sem dependência de biblioteca de ícones.
- Componente de framework: Bootstrap 5.3, usado somente para demonstrar a classe de alerta do feedback.
