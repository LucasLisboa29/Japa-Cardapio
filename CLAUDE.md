# Japa Lounge — Cardápio digital

Instruções para o Claude ao trabalhar neste repositório.

## Commit e push

- O Lucas autorizou o Claude a fazer commit e push direto na branch `main`.
- Essa autorização só vale depois que o Lucas disser, na conversa, que aprova as alterações.
  Sem essa aprovação: não commitar e não dar push. Mostrar o que mudou e esperar.
- Cada aprovação cobre as alterações mostradas naquele momento. Mudanças feitas depois
  precisam de uma nova aprovação.
- Push na `main` publica o site (a Vercel faz o deploy a cada push), então conferir antes
  que o site abre e que o fluxo de pedido funciona.

## Sobre o projeto

- Site estático: HTML, CSS e JavaScript puros, sem build e sem dependências.
- Dados do cardápio e número do WhatsApp ficam em `js/menu.js`. A lógica fica em `js/app.js`.
- Preços e nomes vêm do cardápio impresso do restaurante. Não inventar itens nem preços.
- O Lucas cursa Ciência da Computação e quer entender o que está sendo feito: explicar as
  mudanças e manter os comentários do código em português.
