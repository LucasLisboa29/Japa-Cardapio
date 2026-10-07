// Japa Lounge — lógica do cardápio.
//
// Ideia geral: existe um objeto `estado` com tudo o que muda (grupo aberto, busca,
// carrinho, tela atual). Cada função `desenhar...` lê o estado e monta o HTML de um
// pedaço da página. Quando o usuário toca em algo, mudamos o estado e redesenhamos
// só o pedaço afetado. Os dados do cardápio vêm de menu.js (MENU e CONFIG).

'use strict';

/* ------------------------------------------------------------------ */
/* 1. Funções utilitárias                                              */
/* ------------------------------------------------------------------ */

const $ = (id) => document.getElementById(id);

// "Salmão" -> "salmao": a busca ignora acentos e maiúsculas.
function normalizar(texto) {
  return String(texto).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Dinheiro é guardado em centavos (inteiros) para não somar 0.1 + 0.2 em ponto flutuante.
function centavos(reais) {
  return Math.round(reais * 100);
}

function brl(valorEmCentavos) {
  const partes = (valorEmCentavos / 100).toFixed(2).split('.');
  return 'R$ ' + partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ',' + partes[1];
}

// Escapa texto antes de colocar em HTML (evita que um "<" quebre a página).
function esc(texto) {
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const ICONE_MAIS = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>';
const ICONE_MENOS = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/></svg>';
const ICONE_BUSCA = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.8-3.8"/></svg>';
const ICONE_FECHAR = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12"/><path d="M18 6L6 18"/></svg>';

/* ------------------------------------------------------------------ */
/* 2. Preparação dos dados                                             */
/* ------------------------------------------------------------------ */

// Índice id -> item, para achar um item sem percorrer o cardápio inteiro.
const ITENS = {};

MENU.forEach((grupo) => {
  grupo.secoes.forEach((secao) => {
    secao.itens.forEach((item, posicao) => {
      // O código impresso se repete entre seções (104 a 111), então o id junta seção + código.
      item.id = secao.id + '-' + (item.cod || posicao);
      item.prefixo = secao.prefixo || '';
      // Deixa as opções sempre no formato { nome, precoC }, tenham ou não preço próprio.
      item.opcoes = (item.opcoes || []).map((opcao) =>
        typeof opcao === 'string'
          ? { nome: opcao, precoC: centavos(item.preco) }
          : { nome: opcao.nome, precoC: centavos(opcao.preco) }
      );
      item.precoC = item.preco == null ? null : centavos(item.preco);
      item.busca = normalizar([item.cod, item.nome, item.desc || '', secao.titulo].join(' '));
      ITENS[item.id] = item;
    });
  });
});

function nomeCompleto(item) {
  return (item.prefixo ? item.prefixo + ' · ' : '') + item.nome;
}

/* ------------------------------------------------------------------ */
/* 3. Estado                                                           */
/* ------------------------------------------------------------------ */

const estado = {
  grupo: MENU[0].id, // aba aberta
  buscando: false,   // campo de busca visível?
  busca: '',         // texto digitado na busca
  carrinho: {},      // { chave: quantidade }
  folha: null,       // id do item cuja lista de opções está aberta
  tela: 'menu',      // 'menu' | 'pedido' | 'sobre' | 'opcoes'
  nome: '',
  obs: ''
};

// Chave do carrinho: o id do item, ou "id|nome da opção" quando o item tem opções.
function lerChave(chave) {
  const corte = chave.indexOf('|');
  const item = ITENS[corte === -1 ? chave : chave.slice(0, corte)];
  if (!item) return null;
  if (corte === -1) {
    return item.opcoes.length ? null : { item: item, opcao: null, unidadeC: item.precoC };
  }
  const opcao = item.opcoes.find((o) => o.nome === chave.slice(corte + 1));
  return opcao ? { item: item, opcao: opcao, unidadeC: opcao.precoC } : null;
}

// Transforma o carrinho em linhas prontas para exibir e somar.
function linhasDoPedido() {
  const linhas = [];
  Object.keys(estado.carrinho).forEach((chave) => {
    const lido = lerChave(chave);
    if (!lido) return;
    const qtd = estado.carrinho[chave];
    linhas.push({
      chave: chave,
      qtd: qtd,
      cod: lido.item.cod,
      nome: nomeCompleto(lido.item) + (lido.opcao ? ' — ' + lido.opcao.nome : ''),
      unidadeC: lido.unidadeC,
      totalC: lido.unidadeC * qtd
    });
  });
  return linhas;
}

function quantidadeDoItem(item) {
  if (!item.opcoes.length) return estado.carrinho[item.id] || 0;
  return item.opcoes.reduce((soma, o) => soma + (estado.carrinho[item.id + '|' + o.nome] || 0), 0);
}

/* ------------------------------------------------------------------ */
/* 4. Pedido salvo no aparelho (localStorage)                          */
/* ------------------------------------------------------------------ */

const CHAVE_SALVO = 'japa-lounge-pedido';

function salvar() {
  try {
    localStorage.setItem(CHAVE_SALVO, JSON.stringify({
      quando: Date.now(),
      carrinho: estado.carrinho,
      nome: estado.nome,
      obs: estado.obs
    }));
  } catch (erro) {
    // Navegação anônima ou armazenamento bloqueado: o site funciona, só não lembra o pedido.
  }
}

function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_SALVO) || 'null');
    if (!salvo) return;
    const limite = CONFIG.horasParaExpirarPedido * 60 * 60 * 1000;
    if (Date.now() - salvo.quando > limite) return;
    Object.keys(salvo.carrinho || {}).forEach((chave) => {
      const qtd = salvo.carrinho[chave];
      // Só aceita o que ainda existe no cardápio (um item pode ter sido removido).
      if (lerChave(chave) && Number.isInteger(qtd) && qtd > 0 && qtd <= 99) {
        estado.carrinho[chave] = qtd;
      }
    });
    estado.nome = typeof salvo.nome === 'string' ? salvo.nome : '';
    estado.obs = typeof salvo.obs === 'string' ? salvo.obs : '';
  } catch (erro) {
    // Dado corrompido: começa com o pedido vazio.
  }
}

/* ------------------------------------------------------------------ */
/* 5. Desenho da tela principal                                        */
/* ------------------------------------------------------------------ */

function grupoAtivo() {
  return MENU.find((g) => g.id === estado.grupo) || MENU[0];
}

function desenharNav() {
  let html;
  if (estado.buscando) {
    html =
      '<div class="busca">' +
        '<input id="campo-busca" type="text" inputmode="search" enterkeyhint="search" autocomplete="off" aria-label="Buscar no cardápio" placeholder="Buscar prato, bebida ou código" value="' + esc(estado.busca) + '">' +
        '<button type="button" class="botao-icone" data-acao="fechar-busca" aria-label="Fechar busca">' + ICONE_FECHAR + '</button>' +
      '</div>';
  } else {
    const ativo = grupoAtivo();
    html =
      '<div class="nav-linha">' +
        '<div class="grupos sem-barra">' +
          MENU.map((g) =>
            '<button type="button" class="grupo" data-acao="grupo" data-grupo="' + esc(g.id) + '" aria-pressed="' + (g.id === ativo.id) + '">' + esc(g.nome) + '</button>'
          ).join('') +
        '</div>' +
        '<button type="button" class="botao-icone nav-buscar" data-acao="abrir-busca" aria-label="Buscar no cardápio">' + ICONE_BUSCA + '</button>' +
      '</div>';
    if (ativo.secoes.length > 1) {
      html +=
        '<div class="atalhos sem-barra">' +
          ativo.secoes.map((s) =>
            '<button type="button" class="atalho" data-acao="pular" data-secao="' + esc(s.id) + '">' + esc(s.titulo) + '</button>'
          ).join('') +
        '</div>';
    }
  }
  $('nav').innerHTML = html;
}

function htmlContador(chave, qtd, rotulo) {
  return (
    '<div class="contador">' +
      '<button type="button" data-acao="menos" data-chave="' + esc(chave) + '" aria-label="Remover ' + esc(rotulo) + '">' + ICONE_MENOS + '</button>' +
      '<span class="qtd" aria-live="polite">' + qtd + '</span>' +
      '<button type="button" data-acao="mais" data-chave="' + esc(chave) + '" aria-label="Adicionar ' + esc(rotulo) + '">' + ICONE_MAIS + '</button>' +
    '</div>'
  );
}

// O controle à direita de cada item: "+", contador ou "Escolher".
function htmlControle(item) {
  const qtd = quantidadeDoItem(item);
  const rotulo = nomeCompleto(item);
  if (item.opcoes.length) {
    return (
      '<button type="button" class="escolher" data-acao="opcoes" data-item="' + esc(item.id) + '">' +
        '<span>Escolher</span>' + (qtd > 0 ? '<span class="selo">' + qtd + '</span>' : '') +
      '</button>'
    );
  }
  if (qtd === 0) {
    return '<button type="button" class="mais" data-acao="mais" data-chave="' + esc(item.id) + '" aria-label="Adicionar ' + esc(rotulo) + '">' + ICONE_MAIS + '</button>';
  }
  return htmlContador(item.id, qtd, rotulo);
}

function htmlPreco(item) {
  if (!item.opcoes.length) return brl(item.precoC);
  const precoVaria = item.opcoes.some((o) => o.precoC !== item.opcoes[0].precoC);
  if (!precoVaria) return brl(item.opcoes[0].precoC);
  return item.opcoes.map((o) => o.nome + '  ' + brl(o.precoC)).join('\n'); // ex.: "M R$ 25,90 / G R$ 34,00"
}

function htmlItem(item) {
  return (
    '<div class="item">' +
      '<div class="item-texto">' +
        '<h3 class="item-nome">' + (item.cod ? '<span class="item-cod">' + esc(item.cod) + '</span>' : '') + esc(item.nome) + '</h3>' +
        (item.desc ? '<div class="item-desc">' + esc(item.desc) + '</div>' : '') +
      '</div>' +
      '<div class="item-lado">' +
        '<div class="item-preco">' + esc(htmlPreco(item)) + '</div>' +
        '<div data-controle="' + esc(item.id) + '">' + htmlControle(item) + '</div>' +
      '</div>' +
    '</div>'
  );
}

function desenharLista() {
  const termo = normalizar(estado.busca).trim();
  const filtrando = estado.buscando && termo.length > 0;
  // Buscando: procura em todas as seções. Senão: só as do grupo aberto.
  const secoes = filtrando ? MENU.flatMap((g) => g.secoes) : grupoAtivo().secoes;

  let html = '';
  let primeira = true;
  secoes.forEach((secao) => {
    const itens = filtrando ? secao.itens.filter((it) => it.busca.includes(termo)) : secao.itens;
    if (!itens.length) return;
    const comFoto = !filtrando && !!secao.foto;
    html += '<section class="secao" id="secao-' + esc(secao.id) + '">';
    if (comFoto) {
      html += '<img class="secao-foto" src="assets/fotos/' + esc(secao.foto) + '" alt="Foto do cardápio: ' + esc(secao.titulo) + '"' + (primeira ? '' : ' loading="lazy"') + '>';
    }
    html +=
      '<div class="secao-titulo' + (comFoto ? '' : ' sem-foto') + '">' +
        '<img src="assets/badge.png" alt="" width="48" height="48">' +
        '<h2>' + esc(secao.titulo) + (secao.nota ? ' <span class="nota">' + esc(secao.nota) + '</span>' : '') + '</h2>' +
      '</div>' +
      itens.map(htmlItem).join('') +
      '</section>';
    primeira = false;
  });

  if (filtrando && !html) {
    html = '<div class="sem-resultado">Nenhum item encontrado. Tente outro nome ou o código do prato.</div>';
  }
  $('lista').innerHTML = html;
}

function desenharBarra() {
  const linhas = linhasDoPedido();
  const barra = $('barra');
  const temItens = linhas.length > 0;
  barra.hidden = !temItens;
  document.querySelector('.app').classList.toggle('com-barra', temItens); // abre espaço no fim da lista
  if (!temItens) {
    barra.innerHTML = '';
    return;
  }
  const qtd = linhas.reduce((soma, l) => soma + l.qtd, 0);
  const totalC = linhas.reduce((soma, l) => soma + l.totalC, 0);
  barra.innerHTML =
    '<button type="button" class="botao botao-primario" data-acao="ver-pedido">' +
      '<span class="contagem">' + qtd + '</span>' +
      '<span class="texto">Ver pedido</span>' +
      '<span class="total">' + brl(totalC) + '</span>' +
    '</button>';
}

/* ------------------------------------------------------------------ */
/* 6. Folha de opções e tela do pedido                                 */
/* ------------------------------------------------------------------ */

// Troca o HTML de um contêiner sem perder o foco do teclado: depois de redesenhar,
// devolve o foco ao botão equivalente (mesma ação e mesma chave), se ele ainda existir.
function redesenhar(conteiner, html) {
  const ativo = document.activeElement;
  const focoDentro = ativo && conteiner.contains(ativo);
  const acao = focoDentro ? ativo.dataset.acao : null;
  const chave = focoDentro ? ativo.dataset.chave : null;
  conteiner.innerHTML = html;
  if (!focoDentro) return;
  const botoes = Array.from(conteiner.querySelectorAll('[data-acao]'));
  const alvo =
    botoes.find((b) => b.dataset.chave === chave && b.dataset.acao === acao) ||
    botoes.find((b) => b.dataset.chave === chave) ||
    botoes[0];
  if (alvo) alvo.focus();
}

function htmlOpcoes(item) {
  return item.opcoes.map((opcao) => {
    const chave = item.id + '|' + opcao.nome;
    const qtd = estado.carrinho[chave] || 0;
    return (
      '<div class="opcao">' +
        '<div class="opcao-nome">' + esc(opcao.nome) + '</div>' +
        '<div class="opcao-preco">' + brl(opcao.precoC) + '</div>' +
        (qtd === 0
          ? '<button type="button" class="mais" data-acao="mais" data-chave="' + esc(chave) + '" aria-label="Adicionar ' + esc(opcao.nome) + '">' + ICONE_MAIS + '</button>'
          : htmlContador(chave, qtd, opcao.nome)) +
      '</div>'
    );
  }).join('');
}

function desenharFolha() {
  const folha = $('folha');
  const item = estado.tela === 'opcoes' ? ITENS[estado.folha] : null;
  folha.hidden = !item;
  if (!item) {
    folha.innerHTML = '';
    return;
  }
  folha.innerHTML =
    '<button type="button" class="folha-fundo" data-acao="voltar" aria-label="Fechar opções"></button>' +
    '<div class="folha-painel" role="dialog" aria-modal="true" aria-label="' + esc(nomeCompleto(item)) + '">' +
      '<div class="folha-topo"><h2>' + esc(nomeCompleto(item)) + '</h2><p>Escolha a opção e a quantidade</p></div>' +
      '<div class="folha-lista sem-barra" id="folha-lista">' + htmlOpcoes(item) + '</div>' +
      '<div class="folha-rodape"><button type="button" class="botao botao-escuro" data-acao="voltar">Concluir</button></div>' +
    '</div>';
  const primeiro = folha.querySelector('#folha-lista [data-acao]');
  if (primeiro) primeiro.focus();
}

function textoDoWhatsApp(linhas, totalC) {
  const partes = ['*Pedido · ' + CONFIG.restaurante + '*', 'Nome: ' + estado.nome.trim(), ''];
  linhas.forEach((l) => {
    partes.push(l.qtd + 'x ' + l.nome + (l.cod ? ' (' + l.cod + ')' : '') + ' — ' + brl(l.totalC));
  });
  partes.push('', '*Total dos itens: ' + brl(totalC) + '*');
  if (estado.obs.trim()) partes.push('Obs.: ' + estado.obs.trim());
  return partes.join('\n');
}

function desenharPedido() {
  const linhas = linhasDoPedido();
  const totalC = linhas.reduce((soma, l) => soma + l.totalC, 0);
  const temItens = linhas.length > 0;

  $('pedido-vazio').hidden = temItens;
  $('pedido-cheio').hidden = !temItens;

  redesenhar($('pedido-linhas'), linhas.map((l) =>
    '<div class="item">' +
      '<div class="item-texto">' +
        '<div class="linha-nome">' + esc(l.nome) + '</div>' +
        '<div class="linha-unidade">' + brl(l.unidadeC) + ' cada</div>' +
      '</div>' +
      '<div class="item-lado">' +
        '<div class="item-preco">' + brl(l.totalC) + '</div>' +
        htmlContador(l.chave, l.qtd, l.nome) +
      '</div>' +
    '</div>'
  ).join(''));

  $('pedido-total').textContent = brl(totalC);

  // O link do WhatsApp leva o texto do pedido na própria URL (parâmetro ?text=),
  // por isso não é preciso servidor. encodeURIComponent troca espaços, acentos e
  // quebras de linha por códigos que podem ir numa URL.
  const podeEnviar = temItens && estado.nome.trim().length > 0;
  const enviar = $('enviar');
  enviar.hidden = !podeEnviar;
  $('enviar-bloqueado').hidden = podeEnviar;
  if (podeEnviar) {
    enviar.href = 'https://wa.me/' + CONFIG.whatsapp.replace(/\D/g, '') + '?text=' + encodeURIComponent(textoDoWhatsApp(linhas, totalC));
  } else {
    enviar.removeAttribute('href');
  }
}

/* ------------------------------------------------------------------ */
/* 7. Troca de telas                                                   */
/* ------------------------------------------------------------------ */

// Cada tela sobreposta vira um "#pedido", "#sobre" ou "#opcoes" no endereço. Assim o
// botão Voltar do celular fecha a tela em vez de sair do site.
const TELAS = ['pedido', 'sobre', 'opcoes'];

function ir(tela) {
  location.hash = tela; // dispara o evento 'hashchange', tratado em aoMudarEndereco
}

function voltar() {
  if (location.hash) history.back();
}

function limparEndereco() {
  history.replaceState(null, '', location.pathname + location.search);
}

function aoMudarEndereco() {
  const pedida = location.hash.slice(1);
  estado.tela = TELAS.includes(pedida) ? pedida : 'menu';
  // "#opcoes" sem item escolhido (ex.: botão Avançar do navegador) não faz sentido.
  if (estado.tela === 'opcoes' && !ITENS[estado.folha]) {
    limparEndereco();
    estado.tela = 'menu';
  }
  if (estado.tela !== 'opcoes') estado.folha = null;
  desenharTelas();
}

function desenharTelas() {
  $('tela-pedido').hidden = estado.tela !== 'pedido';
  $('tela-sobre').hidden = estado.tela !== 'sobre';
  document.body.classList.toggle('travado', estado.tela !== 'menu'); // trava a rolagem do fundo
  desenharFolha();
  if (estado.tela === 'pedido') desenharPedido();
  if (estado.tela === 'pedido' || estado.tela === 'sobre') {
    const botaoVoltar = $('tela-' + estado.tela).querySelector('[data-acao="voltar"]');
    if (botaoVoltar) botaoVoltar.focus();
  }
}

/* ------------------------------------------------------------------ */
/* 8. Ações do usuário                                                 */
/* ------------------------------------------------------------------ */

function alterar(chave, delta) {
  if (!lerChave(chave)) return;
  const qtd = Math.min(99, (estado.carrinho[chave] || 0) + delta);
  if (qtd <= 0) delete estado.carrinho[chave];
  else estado.carrinho[chave] = qtd;
  salvar();

  // Redesenha só o que depende desse item.
  const item = lerChave(chave).item;
  const controle = document.querySelector('[data-controle="' + CSS.escape(item.id) + '"]');
  if (controle) redesenhar(controle, htmlControle(item));
  desenharBarra();
  if (estado.tela === 'opcoes' && $('folha-lista')) redesenhar($('folha-lista'), htmlOpcoes(item));
  if (estado.tela === 'pedido') desenharPedido();
}

function rolarPara(y) {
  const semAnimacao = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: y, behavior: semAnimacao ? 'auto' : 'smooth' });
}

function escolherGrupo(id) {
  estado.grupo = id;
  desenharNav();
  desenharLista();
  // Se a capa já saiu da tela, começa o novo grupo do topo da lista.
  const alturaCapa = $('capa').offsetHeight;
  if (window.scrollY > alturaCapa) window.scrollTo(0, alturaCapa);
  const botao = document.querySelector('.grupo[aria-pressed="true"]');
  if (botao) {
    botao.focus({ preventScroll: true });
    botao.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
}

function pularParaSecao(id) {
  const secao = $('secao-' + id);
  if (!secao) return;
  rolarPara(secao.getBoundingClientRect().top + window.scrollY - $('nav').offsetHeight);
}

// Um único "ouvinte" de cliques para a página toda: cada botão diz o que faz no
// atributo data-acao. Assim os botões criados depois (via innerHTML) já funcionam.
document.addEventListener('click', (evento) => {
  const alvo = evento.target.closest('[data-acao]');
  if (!alvo) return;
  const dados = alvo.dataset;

  switch (dados.acao) {
    case 'grupo':
      escolherGrupo(dados.grupo);
      break;
    case 'pular':
      pularParaSecao(dados.secao);
      break;
    case 'abrir-busca':
      estado.buscando = true;
      estado.busca = '';
      desenharNav();
      $('campo-busca').focus();
      break;
    case 'fechar-busca':
      estado.buscando = false;
      estado.busca = '';
      desenharNav();
      desenharLista();
      break;
    case 'mais':
      alterar(dados.chave, 1);
      break;
    case 'menos':
      alterar(dados.chave, -1);
      break;
    case 'opcoes':
      estado.folha = dados.item;
      ir('opcoes');
      break;
    case 'ver-pedido':
      ir('pedido');
      break;
    case 'sobre':
      ir('sobre');
      break;
    case 'voltar':
      voltar();
      break;
    case 'esvaziar':
      estado.carrinho = {};
      salvar();
      desenharLista();
      desenharBarra();
      desenharPedido();
      break;
  }
});

// Campos de texto: busca, nome e observações.
document.addEventListener('input', (evento) => {
  const campo = evento.target;
  if (campo.id === 'campo-busca') {
    estado.busca = campo.value;
    desenharLista();
    // Mostra os resultados desde o primeiro, mesmo que a lista estivesse rolada.
    const alturaCapa = $('capa').offsetHeight;
    if (window.scrollY > alturaCapa) window.scrollTo(0, alturaCapa);
  } else if (campo.id === 'campo-nome') {
    estado.nome = campo.value;
    salvar();
    desenharPedido();
  } else if (campo.id === 'campo-obs') {
    estado.obs = campo.value;
    salvar();
    desenharPedido();
  }
});

document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape' && estado.tela !== 'menu') voltar();
});

window.addEventListener('hashchange', aoMudarEndereco);

/* ------------------------------------------------------------------ */
/* 9. Início                                                           */
/* ------------------------------------------------------------------ */

carregar();
$('campo-nome').value = estado.nome;
$('campo-obs').value = estado.obs;
if (location.hash) limparEndereco(); // recarregar em "#pedido" volta para o cardápio
desenharNav();
desenharLista();
desenharBarra();
desenharTelas();
