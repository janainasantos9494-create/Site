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
function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    let mensagem = 'Olá! Gostaria de fazer o pedido:\n\n';
    let total = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        mensagem += `• ${item.quantidade}x ${item.nome} - ${formatar(subtotal)}\n`;
    });

    mensagem += `\nTotal: ${formatar(total)}`;

    const numero = '5511949446373';

    window.open(
        `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`,
        '_blank'
    );
}

render();
