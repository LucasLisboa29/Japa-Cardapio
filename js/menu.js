// Cardápio do Japa Lounge, transcrito do cardápio impresso.
//
// Estrutura: MENU é uma lista de grupos (as abas do topo). Cada grupo tem seções,
// e cada seção tem itens. Para mudar um preço ou um nome, edite só este arquivo.
//
// Campos de um item:
//   cod    -> código impresso no cardápio (pode ficar vazio)
//   nome   -> nome exibido
//   preco  -> preço em reais (ponto como separador decimal)
//   desc   -> descrição (opcional)
//   opcoes -> escolhas do cliente (opcional). Pode ser uma lista de sabores com o
//             mesmo preço do item, ou uma lista de { nome, preco } quando cada
//             opção tem o seu preço (ex.: yakissoba M e G).
//
// Campos de uma seção:
//   prefixo -> texto colocado antes do nome do item no pedido ("Temaki · Salmão...")
//   nota    -> observação ao lado do título ("4 unidades")
//   foto    -> arquivo dentro de assets/fotos/

const CONFIG = {
  restaurante: 'Japa Lounge',
  // Número que recebe os pedidos, só dígitos, com 55 + DDD.
  whatsapp: '553435139900',
  // Depois deste tempo sem mexer, o pedido salvo no aparelho é descartado.
  horasParaExpirarPedido: 6
};

const MENU = [
  {
    id: 'japonesa',
    nome: 'Japonesa',
    secoes: [
      {
        id: 'temaki', titulo: 'Temaki', prefixo: 'Temaki', foto: 'japonesa.jpg',
        itens: [
          { cod: '077', nome: 'Salmão, cream cheese e arroz', preco: 32.00 },
          { cod: '078', nome: 'Salmão grelhado, cream cheese e arroz', preco: 32.00 },
          { cod: '079', nome: 'Salmão, cream cheese, alho poró e arroz', preco: 35.00 },
          { cod: '080', nome: 'Salmão, cream cheese, alho crocante e arroz', preco: 34.00 },
          { cod: '081', nome: 'Salmão, cream cheese, cebolinha, arroz', preco: 33.00 },
          { cod: '082', nome: 'Camarão, cebolinha, cream cheese e arroz', preco: 43.00 },
          { cod: '083', nome: 'Hot Philadelfia', preco: 39.90, desc: 'Escolher salmão cru ou grelhado', opcoes: ['Salmão cru', 'Salmão grelhado'] },
          { cod: '084', nome: 'Salmão e cream cheese', preco: 42.00, desc: 'Sem arroz' }
        ]
      },
      {
        id: 'uramakis', titulo: 'Uramakis', prefixo: 'Uramaki', foto: 'uramakis.jpg',
        itens: [
          { cod: '085', nome: 'Califórnia', preco: 28.00 },
          { cod: '086', nome: 'Salmão e cream cheese', preco: 28.00 },
          { cod: '087', nome: 'Salmão grelhado e cream cheese', preco: 28.00 },
          { cod: '088', nome: 'Skin couve', preco: 31.00 },
          { cod: '089', nome: 'Salmão, cream cheese e alho crocante', preco: 31.00 },
          { cod: '090', nome: 'Salmão, cream cheese e cebolinha', preco: 30.00 },
          { cod: '091', nome: 'Salmão, cream cheese e alho poró', preco: 31.00 },
          { cod: '092', nome: 'Salmão, cream cheese, cebola caramelizada', preco: 31.00 }
        ]
      },
      {
        id: 'hossomakis', titulo: 'Hossomakis', prefixo: 'Hossomaki',
        itens: [
          { cod: '093', nome: 'Salmão e cream cheese', preco: 23.00 },
          { cod: '094', nome: 'Kani kama e cream cheese', preco: 23.00 },
          { cod: '095', nome: 'Salmão grelhado e cream cheese', preco: 23.00 }
        ]
      },
      {
        id: 'hotholl', titulo: 'Hot Holl', prefixo: 'Hot Holl', foto: 'hotholl.jpg',
        itens: [
          { cod: '096', nome: 'Salmão e cream cheese', preco: 36.00 },
          { cod: '097', nome: 'Salmão grelhado e cream cheese', preco: 36.00 },
          { cod: '098', nome: 'Camarão e cream cheese', preco: 39.00 },
          { cod: '099', nome: 'Inverso com alho poró', preco: 39.00 }
        ]
      },
      {
        id: 'sashimis', titulo: 'Sashimis', nota: '10 fatias', prefixo: 'Sashimi',
        itens: [
          { cod: '100', nome: 'Salmão', preco: 39.90 },
          { cod: '101', nome: 'Peixe branco', preco: 35.90 },
          { cod: '102', nome: 'Salmão siciliano', preco: 43.00, desc: 'Selado com raspas de limão siciliano' }
        ]
      },
      {
        id: 'niguiri', titulo: 'Niguiri', nota: '4 unidades', prefixo: 'Niguiri',
        itens: [
          { cod: '103', nome: 'Salmão', preco: 27.00 },
          { cod: '104', nome: 'Salmão maçaricado com raspas de limão siciliano', preco: 29.90 },
          { cod: '105', nome: 'Camarão', preco: 34.00 }
        ]
      },
      {
        id: 'joy', titulo: 'Joy', nota: '4 unidades', prefixo: 'Joy',
        itens: [
          { cod: '106', nome: 'Salmão, cream cheese, salmão batido e cebolinha', preco: 29.00 },
          { cod: '107', nome: 'Salmão e cream cheese', preco: 28.00 },
          { cod: '108', nome: 'Salmão maçaricado, com tarê e Doritos', preco: 31.00 },
          { cod: '109', nome: 'Salmão cream cheese e camarão', preco: 36.00 },
          { cod: '110', nome: 'Salmão cream cheese e geleia picante', preco: 31.00 },
          { cod: '111', nome: 'Salmão cream cheese, camarão empanado', preco: 37.00 }
        ]
      },
      {
        id: 'porkin', titulo: 'Porkin', nota: '4 unidades', prefixo: 'Porkin', foto: 'porkin.jpg',
        itens: [
          { cod: '104', nome: 'Salmão, cream cheese, salmão grelhado, crispy de alho poró e tarê', preco: 31.00 },
          { cod: '105', nome: 'Salmão, cream cheese, crispy de alho poró e tarê', preco: 31.00 },
          { cod: '106', nome: 'Salmão, cream cheese, camarão, crispy de alho poró e tarê', preco: 36.00 }
        ]
      },
      {
        id: 'poke', titulo: 'Poke',
        itens: [
          { cod: '107', nome: 'Poke', preco: 58.90, desc: 'Arroz, salmão com cream cheese, morango, manga, alho poró, amêndoa defumada, milho crocante, gergelim, alga, couve crispy, chips de banana, cebola roxa e sunomono' }
        ]
      },
      {
        id: 'combinados', titulo: 'Combinados',
        itens: [
          { cod: '108', nome: 'Combinado 25 peças', preco: 92.00, desc: '5 sashimis salmão, 8 uramakis, 8 hossomakis, 2 joys cream cheese, 2 porkin cream cheese' },
          { cod: '109', nome: 'Combinado 26 peças', preco: 134.00, desc: '10 sashimis, 4 joys de salmão batido, 4 joys cream cheese, 4 nigiri e 4 porkin' },
          { cod: '110', nome: 'Combinado 30 peças', preco: 112.00, desc: '10 sashimis, 4 uramakis cebola crispy, 4 uramakis alho poró, 8 hossomakis, 2 joys cream cheese, 2 porkin cream cheese' },
          { cod: '111', nome: 'Combinado 36 peças', preco: 116.00, desc: '10 sashimis, 8 uramakis, 8 hossomakis, 10 hot holl salmão' },
          { cod: '112', nome: 'Combinado 54 peças', preco: 198.00, desc: '10 sashimis, 8 uramakis, 8 hossomakis, 4 joy brie, 4 porkin, 10 Monte Fuji, 10 hot holl salmão' }
        ]
      },
      {
        id: 'especiais', titulo: 'Sushis especiais', foto: 'especiais.jpg',
        itens: [
          { cod: '113', nome: 'Futomaki de salmão (8 unidades)', preco: 33.00 },
          { cod: '114', nome: 'Prensadinho grelhado', preco: 38.90 },
          { cod: '115', nome: 'Prensadinho de salmão cru', preco: 38.90 },
          { cod: '116', nome: 'Monte Fuji (10 unidades)', preco: 34.90, desc: 'Arroz, cream cheese, cebolinha, alho poró crispy, cebola crispy' },
          { cod: '117', nome: 'Montirella', preco: 39.90, desc: 'Alga, arroz, crispy de cebola, crispy alho poró, cebolinha, cream cheese, muçarela maçaricada e pimenta de cheiro' }
        ]
      },
      {
        id: 'yakissoba', titulo: 'Yakissoba', prefixo: 'Yakissoba',
        itens: [
          { cod: '124', nome: 'Vegetariano', opcoes: [{ nome: 'M', preco: 25.90 }, { nome: 'G', preco: 34.00 }] },
          { cod: '125', nome: 'Frango', opcoes: [{ nome: 'M', preco: 29.90 }, { nome: 'G', preco: 36.90 }] },
          { cod: '126', nome: 'Misto (bovino e frango)', opcoes: [{ nome: 'M', preco: 32.90 }, { nome: 'G', preco: 39.90 }] },
          { cod: '127', nome: 'Bovino', opcoes: [{ nome: 'M', preco: 36.90 }, { nome: 'G', preco: 44.00 }] },
          { cod: '128', nome: 'Camarão', opcoes: [{ nome: 'M', preco: 39.00 }, { nome: 'G', preco: 49.00 }] }
        ]
      },
      {
        id: 'adicionais', titulo: 'Adicionais', prefixo: 'Adicional',
        itens: [
          { cod: '', nome: 'Cebolinha', preco: 5.00 },
          { cod: '', nome: 'Alho crocante', preco: 6.00 },
          { cod: '', nome: 'Alho poró', preco: 6.00 },
          { cod: '', nome: 'Couve', preco: 6.00 },
          { cod: '', nome: 'Cebola caramelizada', preco: 6.00 },
          { cod: '', nome: 'Cream cheese', preco: 13.00 },
          { cod: '', nome: 'Sunomono', preco: 12.00 },
          { cod: '', nome: 'Gengibre', preco: 12.00 }
        ]
      }
    ]
  },
  {
    id: 'entradas',
    nome: 'Entradas',
    secoes: [
      {
        id: 'entradas-s', titulo: 'Entradas', foto: 'entradas.jpg',
        itens: [
          { cod: '037', nome: 'Bolinho suíno', preco: 55.00, desc: 'Bolinho de pernil recheado com queijo prato, servido ao molho de limão e mostarda' },
          { cod: '038', nome: 'Tilápia à moda do Japa', preco: 69.00, desc: 'Filé de tilápia recheado com mussarela e requeijão, acompanhado de molho de pimenta tailandês' },
          { cod: '039', nome: 'Peixe à gourjon', preco: 65.00, desc: 'Iscas de peixe empanadas, com molho tártaro' },
          { cod: '040', nome: 'Provolanete', preco: 63.00, desc: 'Palitos de provolone empanados e fritos, servidos com geleia de frutas vermelhas' },
          { cod: '041', nome: 'Ceviche de tilápia', preco: 29.00, desc: 'Tilápia ao molho cítrico picante' },
          { cod: '042', nome: 'Shimeji branco na manteiga com cebolinha', preco: 36.00 },
          { cod: '043', nome: 'Salmão Fusion', preco: 74.00, desc: 'Salmão em cubos, cebola roxa, tomatinho cereja, suco de limão, tempero du chef, gergelim moído, folhas de ouro' },
          { cod: '044', nome: 'Carpaccio de salmão', preco: 80.00 },
          { cod: '045', nome: 'Carpaccio de peixe branco', preco: 67.00 }
        ]
      },
      {
        id: 'saladas', titulo: 'Saladas', foto: 'saladas.jpg',
        itens: [
          { cod: '046', nome: 'Salada di Pollo', preco: 58.00, desc: 'Alface americana, frango em cubos, palmito, parmesão, bacon e molho de iogurte com limão' },
          { cod: '047', nome: 'Caprese', preco: 79.00, desc: 'Tomates, burrata, molho pesto e raspas de parmesão' },
          { cod: '048', nome: 'Tropical', preco: 46.00, desc: 'Alface, manga, morango, queijo coalho tostado, abacaxi e molho cítrico' }
        ]
      }
    ]
  },
  {
    id: 'porcoes',
    nome: 'Porções',
    secoes: [
      {
        id: 'porcoes-s', titulo: 'Porções do Japa', foto: 'porcoes.jpg',
        itens: [
          { cod: '049', nome: 'Parmegiana à palito', preco: 90.00, desc: 'Filé mignon em tiras empanado e frito, com molho caseiro, muçarela e fritas' },
          { cod: '050', nome: 'Filé mignon ao molho gorgonzola', preco: 110.00, desc: 'Filé mignon em tiras ao molho de queijo gorgonzola com parmesão e torradas' },
          { cod: '051', nome: 'Picanha gourmet', preco: 120.00, desc: 'Tiras de picanha ao ponto, mandioca frita e queijo coalho tostado com geleia de frutas vermelhas' },
          { cod: '052', nome: 'Picanha rústica na chapa', preco: 140.00, desc: 'Acompanha mandioca, cebola, tomate e muçarela' },
          { cod: '053', nome: 'Filé mignon rústico na chapa', preco: 140.00, desc: 'Acompanha mandioca, cebola, tomate, muçarela' },
          { cod: '054', nome: 'Porção de batata frita', preco: 36.00 },
          { cod: '055', nome: 'Pastéis mistos (20 unidades)', preco: 44.90 }
        ]
      },
      {
        id: 'hamburguer', titulo: 'Hambúrguer', foto: 'hamburguer.jpg',
        itens: [
          { cod: '056', nome: 'Hambúrguer do Japa', preco: 41.00, desc: '180g de hambúrguer, queijo, alface, tomate, molho da casa, pão e batata frita' },
          { cod: '057', nome: 'Hambúrguer cheddar', preco: 43.00, desc: '180g de hambúrguer, cheddar, alface, tomate, molho da casa, pão e batata frita' },
          { cod: '058', nome: 'Hambúrguer bacon', preco: 46.00, desc: '180g de hambúrguer, queijo, alface, tomate, molho da casa, bacon, ovo, pão e batata frita' }
        ]
      }
    ]
  },
  {
    id: 'pratos',
    nome: 'Pratos',
    secoes: [
      {
        id: 'massas', titulo: 'Massas', foto: 'massas.jpg',
        itens: [
          { cod: '059', nome: 'Espaguete à bolonhesa', preco: 55.00, desc: 'Com molho de tomate caseiro' },
          { cod: '060', nome: 'Espaguete à carbonara', preco: 59.00, desc: 'Com molho de tomate caseiro' },
          { cod: '061', nome: 'Risoto carbonara', preco: 69.00, desc: 'Risoto cremoso com gemas de ovos, parmesão e bacon' },
          { cod: '062', nome: 'Risoto shimeji', preco: 71.00, desc: 'Risoto de shimeji desfiado ao vinho tinto' },
          { cod: '063', nome: 'Risoto gamberi', preco: 95.00, desc: 'Risoto ao sugo com camarões, tomates, alho e manjericão' },
          { cod: '064', nome: 'Risoto de filé mignon', preco: 95.00 }
        ]
      },
      {
        id: 'brasileiros', titulo: 'Pratos brasileiros e contemporâneos', foto: 'pratos.jpg',
        itens: [
          { cod: '065', nome: 'Teppan gourmet', preco: 88.00, desc: 'Salmão grelhado e arroz piamontês de brócolis' },
          { cod: '066', nome: 'Confit de salmão', preco: 88.00, desc: 'Salmão grelhado, servido com arroz com castanhas, tomates cereja, limão e azeitonas' },
          { cod: '067', nome: 'Bife de picanha', preco: 73.00, desc: 'Arroz, bife de picanha, batata frita, feijão, ovo, salada de tomate cereja e alface' },
          { cod: '068', nome: 'Filé Saint Peter', preco: 73.00, desc: 'Filé de tilápia grelhado, pimentão, azeitonas, verdes e azeite, com arroz branco e purê de batata com queijo' }
        ]
      },
      {
        id: 'cortes', titulo: 'Cortes especiais', foto: 'cortes.jpg',
        itens: [
          { cod: '069', nome: 'Ancho', preco: 120.00, desc: 'Corte traseiro do contrafilé com risoto de bacon e manjericão' },
          { cod: '070', nome: 'Bife de tira', preco: 120.00, desc: 'Corte nobre da picanha, servido ao ponto com risoto de tomate cereja, bacon e manjericão' }
        ]
      },
      {
        id: 'camarao', titulo: 'Camarão', foto: 'camarao.jpg',
        itens: [
          { cod: '074', nome: 'Camarão ao alho e óleo', preco: 91.90 },
          { cod: '075', nome: 'Camarão empanado', preco: 95.90, desc: 'Acompanha molho da casa' }
        ]
      },
      {
        id: 'kids', titulo: 'Pratos kids', prefixo: 'Kids',
        itens: [
          { cod: '071', nome: 'Arroz, filezinho em tiras, feijão em caldo, batata frita, salada de alface e tomate', preco: 64.90 },
          { cod: '072', nome: 'Arroz, frango em cubos, brócolis e cenoura, batata frita', preco: 49.90 },
          { cod: '073', nome: 'Estrogonofe de frango, arroz, batata palha', preco: 47.90 }
        ]
      }
    ]
  },
  {
    id: 'sobremesas',
    nome: 'Sobremesas',
    secoes: [
      {
        id: 'sobremesas-s', titulo: 'Sobremesas do Japa', foto: 'sobremesas.jpg',
        itens: [
          { cod: '129', nome: 'Doce purê', preco: 36.00, desc: 'Purê de limão doce com crocante de biscoito Negresco, chantilly e raspas de limão' },
          { cod: '130', nome: 'Alfajor mineiro', preco: 39.00, desc: 'Pão crocante com canela, doce de leite, sorvete de chocolate artesanal e flocos de castanha-do-pará' },
          { cod: '131', nome: 'Petit gateau', preco: 28.90 }
        ]
      }
    ]
  },
  {
    id: 'bebidas',
    nome: 'Bebidas',
    secoes: [
      {
        id: 'aguas', titulo: 'Águas', foto: 'bebidas.jpg',
        itens: [
          { cod: '001', nome: 'Mineral sem gás', preco: 6.00 },
          { cod: '002', nome: 'Mineral com gás', preco: 6.90 },
          { cod: '003', nome: 'Água tônica', preco: 7.00 },
          { cod: '004', nome: 'Água tônica zero', preco: 7.00 }
        ]
      },
      {
        id: 'sucos', titulo: 'Sucos',
        itens: [
          { cod: '005', nome: 'Suco em lata', preco: 8.00, desc: 'Uva ou pêssego', opcoes: ['Uva', 'Pêssego'] },
          { cod: '006', nome: 'Suco 300 ml', preco: 12.00, desc: 'Acerola, abacaxi, maracujá, morango, limão ou laranja', opcoes: ['Acerola', 'Abacaxi', 'Maracujá', 'Morango', 'Limão', 'Laranja'] },
          { cod: '007', nome: 'Suco de duas frutas', preco: 16.00 },
          { cod: '008', nome: 'Suco ao leite', preco: 18.00, desc: 'Morango, maracujá ou limonada suíça', opcoes: ['Morango', 'Maracujá', 'Limonada suíça'] }
        ]
      },
      {
        id: 'refrigerantes', titulo: 'Refrigerantes',
        itens: [
          { cod: '009', nome: 'Refrigerante em lata', preco: 7.00, desc: 'Coca-Cola, Coca-Cola Zero, Fanta Uva, Fanta Laranja, Sprite, Schweppes Citrus, Guaraná Antarctica, Guaraná Antarctica Zero, H2OH, Limoneto', opcoes: ['Coca-Cola', 'Coca-Cola Zero', 'Fanta Uva', 'Fanta Laranja', 'Sprite', 'Schweppes Citrus', 'Guaraná Antarctica', 'Guaraná Antarctica Zero', 'H2OH', 'Limoneto'] }
        ]
      },
      {
        id: 'energeticos', titulo: 'Energéticos',
        itens: [
          { cod: '010', nome: 'Monster 473 ml', preco: 17.00 },
          { cod: '011', nome: 'Red Bull 250 ml', preco: 17.00, desc: 'Tradicional ou zero açúcar', opcoes: ['Tradicional', 'Zero açúcar'] }
        ]
      },
      {
        id: 'longneck', titulo: 'Cervejas long neck', prefixo: 'Long neck',
        itens: [
          { cod: '012', nome: 'Heineken', preco: 13.90 },
          { cod: '013', nome: 'Budweiser', preco: 13.90 },
          { cod: '014', nome: 'Stella Artois', preco: 13.90 },
          { cod: '015', nome: 'Heineken Zero Álcool', preco: 13.90 }
        ]
      },
      {
        id: 'chopp', titulo: 'Chopp',
        itens: [
          { cod: '016', nome: 'Chopp', preco: 14.70 }
        ]
      },
      {
        id: 'cervejas600', titulo: 'Cervejas 600 ml', prefixo: 'Cerveja 600 ml',
        itens: [
          { cod: '017', nome: 'Original', preco: 17.00 },
          { cod: '018', nome: 'Amstel', preco: 17.00 },
          { cod: '019', nome: 'Budweiser', preco: 17.00 },
          { cod: '020', nome: 'Heineken', preco: 18.00 },
          { cod: '021', nome: 'Brahma', preco: 17.00 }
        ]
      }
    ]
  },
  {
    id: 'drinks',
    nome: 'Drinks',
    secoes: [
      {
        id: 'coqueteis', titulo: 'Drinks e coquetéis', foto: 'drinks.jpg',
        itens: [
          { cod: '022', nome: 'Caipirinha', preco: 23.90, desc: 'Cachaça, limão, açúcar e gelo' },
          { cod: '023', nome: 'Marguerita', preco: 26.00, desc: 'Tequila, curaçau blue, suco de limão e rum de coco' },
          { cod: '024', nome: 'Caipvodka de fruta com Orloff', preco: 26.90, desc: 'Opções: limão, morango, abacaxi, kiwi', opcoes: ['Limão', 'Morango', 'Abacaxi', 'Kiwi'] },
          { cod: '025', nome: 'Sangria', preco: 28.90, desc: 'Suco de laranja, morango, açúcar, vinho tinto seco' },
          { cod: '026', nome: 'Caipvodka de frutas com Absolut', preco: 34.00, desc: 'Opções: limão, morango, abacaxi, kiwi', opcoes: ['Limão', 'Morango', 'Abacaxi', 'Kiwi'] },
          { cod: '027', nome: 'Mojito', preco: 29.00, desc: 'Soda, açúcar, hortelã, suco de limão e rum' },
          { cod: '028', nome: 'Aperol', preco: 33.00, desc: 'Aperol, espumante, água com gás e laranja' },
          { cod: '029', nome: 'Gin tônica', preco: 29.00, desc: 'Gin, limão siciliano, xarope de limão e água tônica' },
          { cod: '030', nome: 'Sexy on the Beach', preco: 30.00, desc: 'Vodka, licor de pêssego, xarope de groselha e suco de laranja' },
          { cod: '031', nome: 'Clericot', preco: 37.00, desc: 'Morango, abacaxi, laranja, kiwi, licor de pêssego, soda limonada e espumante' },
          { cod: '032', nome: 'Moscow Mule', preco: 34.90, desc: 'Vodka, suco de limão e espuma de gengibre' },
          { cod: '033', nome: 'Gin tônica Tanqueray', preco: 39.00 },
          { cod: '034', nome: 'Negroni', preco: 34.90, desc: 'Vermute, gin, Campari' }
        ]
      },
      {
        id: 'semalcool', titulo: 'Drinks sem álcool',
        itens: [
          { cod: '035', nome: 'Soda italiana', preco: 24.00, desc: 'Água gaseificada com xarope de limão ou morango artesanal', opcoes: ['Limão', 'Morango artesanal'] },
          { cod: '036', nome: 'Frozen', preco: 28.00, desc: 'Morango, limão, abacaxi ou maracujá', opcoes: ['Morango', 'Limão', 'Abacaxi', 'Maracujá'] }
        ]
      }
    ]
  }
];
