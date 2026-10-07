# Japa Lounge — Cardápio digital

Cardápio interativo do Japa Lounge (Araguari, MG) para celular. O cliente navega pelas
categorias, monta o pedido e envia pelo WhatsApp.

Site estático: HTML, CSS e JavaScript puros, sem etapa de build e sem servidor.

## Estrutura

```
index.html        Esqueleto da página e as telas fixas (pedido, nossa história)
css/styles.css    Todo o visual
js/menu.js        Os dados: CONFIG (WhatsApp) e MENU (grupos, seções, itens, preços)
js/app.js         A lógica: estado, desenho das telas, carrinho e link do WhatsApp
assets/           Logo, selo e fotos recortadas do cardápio impresso
CLAUDE.md         Instruções para o Claude ao trabalhar neste repositório
```

## Como alterar o cardápio

Tudo fica em `js/menu.js`. Cada item é uma linha:

```js
{ cod: '077', nome: 'Salmão, cream cheese e arroz', preco: 32.00 },
```

- Mudar preço: edite `preco` (use ponto, não vírgula).
- Item com sabores: `opcoes: ['Uva', 'Pêssego']`.
- Item com tamanhos de preços diferentes: `opcoes: [{ nome: 'M', preco: 25.90 }, { nome: 'G', preco: 34.00 }]`.
- Número que recebe os pedidos: `CONFIG.whatsapp` (só dígitos, com 55 + DDD).

## Rodar no computador

Abra o `index.html` no navegador, ou sirva a pasta:

```
python -m http.server 8000
```

e acesse `http://localhost:8000`.

## Publicar na Vercel

Importe este repositório em vercel.com/new. Em *Framework Preset* escolha **Other** e
deixe *Build Command* e *Output Directory* vazios — a Vercel serve os arquivos como estão.
A cada `git push` na branch `main`, o site é publicado de novo.
