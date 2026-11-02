
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

const lista = document.getElementById('lista-carrinho');
const vazio = document.getElementById('carrinho-vazio');
const spanQuantidade = document.getElementById('quantidade');
const spanTotal = document.getElementById('total');

function formatar(valor) {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
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

    if (carrinho[i].quantidade <= 0) {
        carrinho.splice(i, 1);
    }

    salvar();
    render();
}

function remover(i) {
    carrinho.splice(i, 1);
    salvar();
    render();
}

async function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    let total = 0;

    carrinho.forEach(item => {
        total += item.preco * item.quantidade;
    });

    try {
        const resposta = await fetch(
            'https://oboticario.free.nf/finalizar-pedido.php',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    produtos: carrinho,
                    total: total
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok || !dados.link) {
            throw new Error(dados.erro || 'Erro ao finalizar pedido.');
        }

        window.location.href = dados.link;

    } catch (erro) {
        console.error('Erro ao finalizar compra:', erro);
        alert('Não foi possível finalizar o pedido. Tente novamente.');
    }
}

render();
