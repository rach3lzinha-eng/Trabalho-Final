# Mudanças em relação ao protótipo

## 1. Protótipo de referência protegido por login

O endereço do preview do Lovable recebido para referência solicitou autenticação e não disponibilizou a tela do protótipo nesta sessão. Por isso, a implementação preserva o escopo e os conteúdos definidos no E1, mas não afirma reproduzir detalhes visuais que não puderam ser inspecionados diretamente.

## 2. Quatro páginas em vez de uma tela única

A entrega foi organizada em `index.html`, `agenda.html`, `atendimentos.html` e `espera.html`. Essa decisão torna as áreas principais navegáveis por links reais e atende ao requisito de três a cinco páginas, sem esconder funcionalidades importantes em uma única tela.

## 3. Visual Noite de salão

A direção visual usa ameixa profundo, dourado suave e superfícies claras. A escolha veio do blueprint confirmado para uma proposta premium de salão, mantendo alto contraste nos textos e estados explícitos para que a agenda continue rápida de ler.

## 4. Dados demonstrativos locais

Os atendimentos e horários são dados estáticos de demonstração. A interação modifica o DOM durante a sessão, mas não persiste em banco de dados, pois a entrega pede HTML, CSS e JavaScript introdutórios e não um produto com backend.

## 5. Bootstrap apenas em um componente

O site usa o `alert` do Bootstrap no feedback do formulário, carregado por CDN. O restante do layout é CSS próprio para que a estrutura, responsividade e estados visuais possam ser avaliados no código. O equivalente em CSS puro está comentado em `styles.css`.

## 6. Imagens substituídas por elementos de interface

Como o problema é operacional e a referência não expôs imagens disponíveis, o destaque usa composição tipográfica, formas e cartões de agenda em vez de fotografia de banco. Isso reduz ruído visual e mantém o foco na disponibilidade dos horários.

## 7. Tema claro opcional

Foi adicionado um alternador de tema como acabamento de JavaScript. O tema padrão continua sendo o escuro premium; o tema claro ajuda em ambientes muito iluminados sem alterar a hierarquia de informações.
