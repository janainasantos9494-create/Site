
<?php

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    exit("Método não permitido");
}

// Mantenha aqui o número verdadeiro já configurado.
$numeroWhatsApp = "5511949446373";

// Recebe os dados enviados pelo formulário.
if (!isset($_POST["pedido"])) {
    exit("Pedido não recebido.");
}

$dados = json_decode($_POST["pedido"], true);

if (
    !is_array($dados) ||
    empty($dados["produtos"]) ||
    !is_array($dados["produtos"])
) {
    exit("Dados do pedido inválidos.");
}

$mensagem = "Olá! Gostaria de fazer um pedido:\n\n";
$total = 0;

foreach ($dados["produtos"] as $produto) {

    if (
        !isset($produto["nome"], $produto["quantidade"], $produto["preco"]) ||
        !is_numeric($produto["quantidade"]) ||
        !is_numeric($produto["preco"])
    ) {
        exit("Produto inválido.");
    }

    $nome = $produto["nome"];
    $quantidade = (int) $produto["quantidade"];
    $preco = (float) $produto["preco"];

    if ($quantidade <= 0 || $preco < 0) {
        exit("Dados do produto inválidos.");
    }

    $subtotal = $preco * $quantidade;
    $total += $subtotal;

    $mensagem .= "• " . $quantidade . "x " . $nome;
    $mensagem .= " - R$ " . number_format($subtotal, 2, ",", ".");
    $mensagem .= "\n";
}

$mensagem .= "\nTotal: R$ " . number_format($total, 2, ",", ".");

$link = "https://wa.me/" . $numeroWhatsApp . "?text=" . urlencode($mensagem);

header("Location: " . $link);
exit;

?>
