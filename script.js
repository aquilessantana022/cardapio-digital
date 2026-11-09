// Lista de pratos do cardápio
const pratos = [
  { nome: "Moqueca de peixe", categoria: "Pratos principais", preco: 79.9, descricao: "Peixe cozido no leite de coco e azeite de dendê, com arroz e pirão." },
  { nome: "Bobó de camarão", categoria: "Pratos principais", preco: 84.9, descricao: "Camarão em creme de mandioca com leite de coco." },
  { nome: "Xinxim de galinha", categoria: "Pratos principais", preco: 59.9, descricao: "Frango com camarão seco, amendoim e castanha." },
  { nome: "Acarajé", categoria: "Petiscos", preco: 18.0, descricao: "Bolinho de feijão-fradinho com vatapá, caruru e camarão." },
  { nome: "Abará", categoria: "Petiscos", preco: 16.0, descricao: "Massa de feijão-fradinho cozida na folha de bananeira." },
  { nome: "Bolinho de aipim", categoria: "Petiscos", preco: 24.0, descricao: "Porção com 8 bolinhos recheados com carne de sol." },
  { nome: "Cocada", categoria: "Sobremesas", preco: 9.0, descricao: "Cocada cremosa de forno." },
  { nome: "Quindim", categoria: "Sobremesas", preco: 11.0, descricao: "Doce de gema e coco." },
  { nome: "Suco de cajá", categoria: "Bebidas", preco: 10.0, descricao: "Suco natural, 400 ml." },
  { nome: "Refrigerante", categoria: "Bebidas", preco: 7.0, descricao: "Lata, 350 ml." }
];

const pedido = [];
let categoriaAtual = "Todos";

const cardapio = document.getElementById("cardapio");
const filtros = document.getElementById("filtros");
const busca = document.getElementById("busca");
const itensPedido = document.getElementById("itens-pedido");
const total = document.getElementById("total");
const botaoLimpar = document.getElementById("limpar");

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function criarFiltros() {
  const categorias = ["Todos", ...new Set(pratos.map((p) => p.categoria))];

  categorias.forEach((categoria) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.textContent = categoria;
    if (categoria === categoriaAtual) botao.classList.add("ativo");

    botao.addEventListener("click", () => {
      categoriaAtual = categoria;
      document.querySelectorAll(".filtros button").forEach((b) => b.classList.remove("ativo"));
      botao.classList.add("ativo");
      mostrarPratos();
    });

    filtros.appendChild(botao);
  });
}

function mostrarPratos() {
  const termo = busca.value.trim().toLowerCase();

  const lista = pratos.filter((p) => {
    const naCategoria = categoriaAtual === "Todos" || p.categoria === categoriaAtual;
    const naBusca = p.nome.toLowerCase().includes(termo);
    return naCategoria && naBusca;
  });

  cardapio.innerHTML = "";

  if (lista.length === 0) {
    cardapio.innerHTML = '<p class="vazio">Nenhum prato encontrado.</p>';
    return;
  }

  lista.forEach((prato) => {
    const cartao = document.createElement("article");
    cartao.className = "prato";
    cartao.innerHTML = `
      <h3>${prato.nome}</h3>
      <p>${prato.descricao}</p>
      <div class="rodape-prato">
        <strong>${formatarPreco(prato.preco)}</strong>
        <button type="button">Adicionar</button>
      </div>
    `;
    cartao.querySelector("button").addEventListener("click", () => adicionarAoPedido(prato));
    cardapio.appendChild(cartao);
  });
}

function adicionarAoPedido(prato) {
  const item = pedido.find((i) => i.nome === prato.nome);
  if (item) {
    item.quantidade++;
  } else {
    pedido.push({ ...prato, quantidade: 1 });
  }
  atualizarPedido();
}

function atualizarPedido() {
  itensPedido.innerHTML = "";

  pedido.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item.quantidade}x ${item.nome}</span><span>${formatarPreco(item.preco * item.quantidade)}</span>`;
    itensPedido.appendChild(li);
  });

  const soma = pedido.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  total.textContent = formatarPreco(soma);
}

botaoLimpar.addEventListener("click", () => {
  pedido.length = 0;
  atualizarPedido();
});

busca.addEventListener("input", mostrarPratos);

criarFiltros();
mostrarPratos();
