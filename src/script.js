    /* Ínicio extra */

    // Não permitir que o usuário digite letras apenas números ou apenas letras e números
function apenasNumeros(event) {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode === 46 && event.target.id === 'juros') return true; 
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
    }
}
    
document.getElementById('parcelas').addEventListener('keypress', apenasNumeros);
document.getElementById('parcelas').addEventListener('input', verificarLimiteParcelas);
document.getElementById('juros').addEventListener('keypress', apenasNumeros);   
document.getElementById('nome').addEventListener('input', function (e) {
    e.target.value = e.target.value.replace(/[0-9]/g, '');
});



   
    
    /* Formatação do CPF */
    document.getElementById('CPF').addEventListener('input', function (e) {
        let cpf = e.target.value.replace(/\D/g, ''); 
        if (cpf.length > 11) { 
            cpf = cpf.substring(0, 11);
        }

        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2')
                 .replace(/(\d{3})(\d)/, '$1.$2')
                 .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        e.target.value = cpf;
    });


    function validarCPF(cpf) {
        cpf = cpf.replace(/\D/g, ''); 
    
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
            return false; // Verifica se tem 11 dígitos ou se todos os dígitos são iguais
        }
    
        // Calcula o primeiro dígito verificador
        let soma = 0;
        for (let i = 0; i < 9; i++) {
            soma += parseInt(cpf[i]) * (10 - i);
        }
        let primeiroDigito = 11 - (soma % 11);
        if (primeiroDigito >= 10) primeiroDigito = 0;
    
        // Calcula o segundo dígito verificador
        soma = 0;
        for (let i = 0; i < 10; i++) {
            soma += parseInt(cpf[i]) * (11 - i);
        }
        let segundoDigito = 11 - (soma % 11);
        if (segundoDigito >= 10) segundoDigito = 0;
    
        // Verifica se os dígitos calculados coincidem com os fornecidos
        return primeiroDigito === parseInt(cpf[9]) && segundoDigito === parseInt(cpf[10]);
    }
    
    // Verificar se o CPF é valido
    document.getElementById('CPF').addEventListener('input', function (e) {
        const cpfInput = e.target;
        const cpf = cpfInput.value;
    
        if (validarCPF(cpf)) {
            cpfInput.setCustomValidity(''); // CPF válido
        } else {
            cpfInput.setCustomValidity('Digite um CPF válido.'); // CPF inválido
        }
    });

    // Formatar o número para reais
function formatarParaReais(input) {
    let valor = input.value.replace(/\D/g, ''); 
    valor = (parseInt(valor) / 100).toFixed(2); 

    let formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
    input.value = formatador.format(valor);

    verificarEntradaMenorQueValorTotal();
    
}

['valorTotal', 'entrada'].forEach(id => {
    document.getElementById(id).addEventListener('input', function() {
        formatarParaReais(this);
    });


});

   // Verificar se o valor total é menor do que a entrada
function verificarEntradaMenorQueValorTotal() {
    const valorTotal = parseFloat(document.getElementById('valorTotal').value.replace(/\D/g, '')) / 100;
    const entrada = parseFloat(document.getElementById('entrada').value.replace(/\D/g, '')) / 100;

    if (entrada > valorTotal) {
        document.getElementById('entrada').setCustomValidity("A entrada deve ser menor ou igual ao valor total.");
    } else {
        document.getElementById('entrada').setCustomValidity("");
    }
}



function verificarLimiteParcelas() {
    const parcelas = parseInt(document.getElementById('parcelas').value);
    
    if (parcelas > 60) {
        document.getElementById('parcelas').setCustomValidity("O número máximo de parcelas é 60.");
    } else {
        document.getElementById('parcelas').setCustomValidity(""); // Limpa a mensagem de erro
    }
}

    // Botão para voltar
    document.getElementById('voltar').addEventListener('click', function () {
    document.getElementById('dados-pessoais').style.display = 'block';
    document.getElementById('dados-veiculo').style.display = 'none';
});





    /*   Ínicio do Simulador De Financiamento  */
document.addEventListener('DOMContentLoaded', function () {
    const formDadosPessoais = document.getElementById('dados-pessoais');
    const formDadosVeiculo = document.getElementById('dados-veiculo');
    const resultadoSimulacao = document.getElementById('resultado-simulacao');

    // Mostrar primeiro os dados pessoais e bloquear todo o resto
    formDadosPessoais.style.display = 'block';
    formDadosVeiculo.style.display = 'none';
    resultadoSimulacao.style.display = 'none';

    // Botão continuar do Dados Pessoais
    formDadosPessoais.addEventListener('submit', function (e) {
        e.preventDefault(); 
        formDadosPessoais.style.display = 'none'; 
        formDadosVeiculo.style.display = 'block';
    });

    // Botão continuar do Dados do Veiculo
    formDadosVeiculo.addEventListener('submit', function (e) {
        e.preventDefault();

        // Simulação de resultados
        const valorTotal = parseFloat(document.getElementById('valorTotal').value.replace(/\D/g, '')) / 100;
        const entrada = parseFloat(document.getElementById('entrada').value.replace(/\D/g, '')) / 100;
        const parcelas = parseInt(document.getElementById('parcelas').value);
        const taxaJuros = parseFloat(document.getElementById('juros').value) / 100;


        // Cálculo do simulador
        const valorFinanciado = valorTotal - entrada;
        const valorParcela = (valorFinanciado * taxaJuros) / (1 - Math.pow(1 + taxaJuros, -parcelas));
        const totalPago = valorParcela * parcelas;

        // Guardar os dados do usuário para aparecer no resultado final
        resultadoSimulacao.innerHTML = `
            <h2>Resultado da Simulação</h2>
            <p>Valor do Veículo: R$ ${valorTotal.toFixed(2)}</p>
            <p>Entrada: R$ ${entrada.toFixed(2)}</p>
            <p>Parcelas: ${parcelas} x R$ ${valorParcela.toFixed(2)}</p>
            <p>Total a ser pago: R$ ${totalPago.toFixed(2)}</p>
            <button id="refazer">Refazer Simulação</button>
        `;

        formDadosVeiculo.style.display = 'none';
        resultadoSimulacao.style.display = 'block';

        // Botão para refazer a simulação
        document.getElementById('refazer').addEventListener('click', function () {
            formDadosPessoais.style.display = 'block';
            formDadosVeiculo.style.display = 'none';
            resultadoSimulacao.style.display = 'none';
        });
    });
});

const modelosCarros = [
    "Chevrolet Onix",
    "Ford Ka",
    "Volkswagen Gol",
    "Toyota Corolla",
    "Honda Civic",
    "Hyundai HB20",
    "Fiat Argo",
    "Renault Kwid",
    "Jeep Compass",
    "Nissan Kicks"
];

// Referência ao select
const selectCarros = document.getElementById("modeloCarro");

// Adicionar opções dinamicamente
modelosCarros.forEach(modelo => {
    const option = document.createElement("option");
    option.value = modelo;
    option.textContent = modelo;
    selectCarros.appendChild(option);
});

