'use strict'

// 1. Suas importações do arquivo de conexões com a API/Banco
import { getContatos, postContato, putContato, deleteContato } from "./contatos.js"

// 2. Mapeamento de elementos DOM
const btnNovoContato = document.getElementById('btnNovoContato');
const modalContato = document.getElementById('modalContato');
const btnCancelar = document.getElementById('btnCancelar');
const formContato = document.getElementById('formContato');
const containerContatos = document.getElementById('containerContatos');
const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');

// 3. Função para renderizar um card individual na tela
const criarCardContato = (contato) => {
    // 1. Cria a caixa principal
    const cartao = document.createElement('div');
    cartao.classList.add('cartao-contato');
    cartao.dataset.id = contato.id;

    // 2. Cria a parte do texto
    const conteudoCard = document.createElement('div');
    conteudoCard.classList.add('conteudo-card');

    const nome = document.createElement('h3');
    nome.textContent = contato.nome; // Totalmente seguro contra XSS

    const telefone = document.createElement('p');
    telefone.textContent = `📞 ${contato.telefone}`;

    conteudoCard.appendChild(nome);
    conteudoCard.appendChild(telefone);

    // 3. Cria os botões
    const acoesCard = document.createElement('div');
    acoesCard.classList.add('acoes-card');

    const btnEditar = document.createElement('button');
    btnEditar.classList.add('btn-editar');
    btnEditar.textContent = '✏️';
    btnEditar.title = 'Editar';

    const btnExcluir = document.createElement('button');
    btnExcluir.classList.add('btn-excluir');
    btnExcluir.textContent = '🗑️';
    btnExcluir.title = 'Excluir';

    acoesCard.appendChild(btnEditar);
    acoesCard.appendChild(btnExcluir);

    // 4. Junta tudo dentro do cartão principal
    cartao.appendChild(conteudoCard);
    cartao.appendChild(acoesCard);

    // --- Seus eventos de cliques ---
    btnExcluir.addEventListener('click', async () => { /* ... lógica de deletar ... */ });
    btnEditar.addEventListener('click', () => { /* ... lógica de editar ... */ });

    containerContatos.appendChild(cartao);
}

// 4. Carregar/Atualizar a listagem vinda da API (GET)
const carregarContatos = async () => {
    containerContatos.innerHTML = ""; 
    try {
        const contatos = await getContatos();
        if (Array.isArray(contatos)) {
            contatos.forEach(criarCardContato);
        }
    } catch (error) {
        console.error("Erro ao listar contatos:", error);
    }
}

// 5. Controle de abertura e fechamento do Modal
btnNovoContato.addEventListener('click', () => {
    modalContato.classList.remove('container-escondido');
    modalContato.querySelector('h2').textContent = "Adicionar Novo Contato";
    delete formContato.dataset.idEdicao; // Garante que não há ID residual
});

btnCancelar.addEventListener('click', () => {
    modalContato.classList.add('container-escondido');
    formContato.reset();
});

// 6. Submissão do Formulário (Salvar - Decide entre POST ou PUT)
formContato.addEventListener('submit', async (event) => {
    event.preventDefault();

    const idEdicao = formContato.dataset.idEdicao;
    const dadosContato = {
        nome: document.getElementById('nomeContato').value,
        telefone: document.getElementById('telContato').value
    };

    try {
        if (idEdicao) {
            // Executa o PUT (Atualizar)
            await putContato(idEdicao, dadosContato);
            alert("Contato atualizado com sucesso!");
        } else {
            // Executa o POST (Criar)
            await postContato(dadosContato);
            alert("Contato adicionado com sucesso!");
        }

        // Reseta o estado da tela, fecha o modal e recarrega os cards atualizados
        modalContato.classList.add('container-escondido');
        formContato.reset();
        carregarContatos(); 
        
    } catch (error) {
        console.error("Erro ao salvar dados do contato:", error);
        alert("Ocorreu um erro ao salvar o contato.");
    }
});

// 7. Mecanismo de Busca / Filtro
const filtrarContatos = () => {
    const termoBusca = inputBuscar.value.toLowerCase();
    const cartoes = document.querySelectorAll('.cartao-contato');

    cartoes.forEach(cartao => {
        const nomeContato = cartao.querySelector('h3').textContent.toLowerCase();
        
        if (nomeContato.includes(termoBusca)) {
            cartao.style.display = "flex"; // Volta para o flex original do card
        } else {
            cartao.style.display = "none";
        }
    });
}

btnBuscar.addEventListener('click', filtrarContatos);
inputBuscar.addEventListener('input', filtrarContatos); // Busca em tempo real enquanto digita!

// Inicializa a aplicação buscando os dados do servidor
carregarContatos();