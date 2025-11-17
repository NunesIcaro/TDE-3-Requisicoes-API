let dadosEndereco = null;
const URL_POSTS = 'https://jsonplaceholder.typicode.com/posts';

function limparResultados() {
    document.getElementById('resultadoCep').innerHTML = '';
    document.getElementById('resultadoPostCep').innerHTML = '';
    document.getElementById('salvarBtn').disabled = true;
    dadosEndereco = null;
}

async function buscarCep() {
    const cep = document.getElementById('cepInput').value.replace(/\D/g, '');
    const resultadoDiv = document.getElementById('resultadoCep');
    resultadoDiv.innerHTML = 'Buscando...';
    document.getElementById('salvarBtn').disabled = true; // Desabilita antes da busca

    if (cep.length !== 8) {
        resultadoDiv.innerHTML = '<span class="erro">CEP inválido. Digite 8 dígitos.</span>';
        return;
    }
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.erro) {
            resultadoDiv.innerHTML = `<span class="erro">CEP não encontrado.</span>`;
            return;
        }
        dadosEndereco = data;
        document.getElementById('salvarBtn').disabled = false;
        resultadoDiv.innerHTML = `
            <strong>Endereço Encontrado:</strong><br>
            CEP: ${data.cep}<br>
            Logradouro: ${data.logradouro}<br>
            Bairro: ${data.bairro}<br>
            Cidade: ${data.localidade} / ${data.uf}<br>
            DDD: ${data.ddd}
        `;
    } catch (error) {
        resultadoDiv.innerHTML = `<span class="erro">Falha ao buscar CEP. Detalhes: ${error.message}</span>`;
    }
}
async function salvarEndereco() {
    const resultadoPostDiv = document.getElementById('resultadoPostCep');
    if (!dadosEndereco) {
        resultadoPostDiv.innerHTML = '<span class="erro">Nenhum endereço para salvar.</span>';
        return;
    }
    resultadoPostDiv.innerHTML = 'Enviando dados para o servidor...';
    const dadosParaSalvar = {
        title: `CEP Salvo: ${dadosEndereco.cep}`,
        body: JSON.stringify(dadosEndereco), 
        userId: 1, 
    };
    try {
        const response = await fetch(URL_POSTS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosParaSalvar), 
        });
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        resultadoPostDiv.innerHTML = `
            <strong>POST Bem-Sucedido!</strong><br>
            <span style="color: green;">Status: ${response.status} ${response.statusText}</span><br>
            <p>O servidor simulou o salvamento do endereço (ID fictício: ${data.id}).</p>
        `;
        document.getElementById('salvarBtn').disabled = true;
    } catch (error) {
        resultadoPostDiv.innerHTML = `<span class="erro">Falha ao salvar endereço (POST). Detalhes: ${error.message}</span>`;
    }
}


