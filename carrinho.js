let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

const lista = document.getElementById('lista-carrinho');
const vazio = document.getElementById('carrinho-vazio');
const spanQuantidade = document.getElementById('quantidade');
const spanTotal = document.getElementById('total');

function formatar(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function salvar() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function render() {
    lista.innerHTML = '';

    if (carrinho.length === 0) {
        vazio.style.display = 'block';
        spanQuantidade.textContent = 0;
        spanTotal.textContent = formatar(0);
        return;
    }

    vazio.style.display = 'none';

    let total = 0;
    let qtdTotal = 0;

    carrinho.forEach((item, i) => {
        total += item.preco * item.quantidade;
        qtdTotal += item.quantidade;

        lista.innerHTML += `
            <div class="item-carrinho">
                <img src="${item.img}" alt="${item.nome}" width="80">
                <div class="item-info">
                    <h3>${item.nome}</h3>
                    <p>${formatar(item.preco)}</p>
                </div>
                <div class="item-qtd">
                    <button onclick="alterarQtd(${i}, -1)">−</button>
                    <span>${item.quantidade}</span>
                    <button onclick="alterarQtd(${i}, 1)">+</button>
                </div>
                <button onclick="remover(${i})" aria-label="Remover">🗑</button>
            </div>
        `;
    });

    spanQuantidade.textContent = qtdTotal;
    spanTotal.textContent = formatar(total);
}

function alterarQtd(i, delta) {
    carrinho[i].quantidade += delta;
    if (carrinho[i].quantidade <= 0) carrinho.splice(i, 1);
    salvar();
    render();
}

function remover(i) {
    carrinho.splice(i, 1);
    salvar();
    render();
}


<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["erro" => "Método não permitido"]);
    exit;
}

$numeroWhatsApp = "5511949446373";

$dados = json_decode(file_get_contents("php://input"), true);

if (
    !is_array($dados) ||
    empty($dados["produtos"]) ||
    !is_array($dados["produtos"]) ||
    !isset($dados["total"])
) {
    http_response_code(400);
    echo json_encode(["erro" => "Dados do pedido inválidos"]);
    exit;
}

$mensagem = "Olá! Gostaria de fazer um pedido:\n\n";

foreach ($dados["produtos"] as $produto) {
    if (
        !isset($produto["nome"], $produto["quantidade"], $produto["preco"])
    ) {
        http_response_code(400);
        echo json_encode(["erro" => "Produto inválido"]);
        exit;
    }

    $mensagem .= "• " . $produto["quantidade"] . "x ";
    $mensagem .= $produto["nome"] . " - R$ ";
    $mensagem .= number_format((float)$produto["preco"], 2, ",", ".");
    $mensagem .= "\n";
}

$mensagem .= "\nTotal: R$ ";
$mensagem .= number_format((float)$dados["total"], 2, ",", ".");

$link = "https://wa.me/" . $numeroWhatsApp . "?text=" . urlencode($mensagem);

echo json_encode(["link" => $link]);

?>
