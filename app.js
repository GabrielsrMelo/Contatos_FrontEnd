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
    const cartao = document.createElement('div');
    cartao.classList.add('cartao-contato');
    cartao.dataset.id = contato.id;

    const conteudoCard = document.createElement('div');
    conteudoCard.classList.add('conteudo-card');

    const foto = document.createElement('img')
    foto.classList.add('foto-contato')
    foto.src = contato.foto ? contato.foto : './img/avatar.jpg';
    foto.alt = `Foto de ${contato.nome}`;

    const nome = document.createElement('h3');
    nome.textContent = contato.nome;

    const celular = document.createElement('p');
    celular.textContent = `Celular: ${contato.celular || ''}`;

    const email = document.createElement('p');
    email.textContent = `E-mail: ${contato.email || ''}`;

    const endereco = document.createElement('p');
    endereco.textContent = `Endereço: ${contato.endereco || ''}`;

    const cidade = document.createElement('p');
    cidade.textContent = `Cidade: ${contato.cidade || ''}`;

    conteudoCard.appendChild(foto);
    conteudoCard.appendChild(nome);
    conteudoCard.appendChild(celular);
    conteudoCard.appendChild(email);
    conteudoCard.appendChild(endereco);
    conteudoCard.appendChild(cidade);

    const acoesCard = document.createElement('div');
    acoesCard.classList.add('acoes-card');

    const btnEditar = document.createElement('button');
    btnEditar.classList.add('btn-editar');
    btnEditar.textContent = 'E';
    btnEditar.title = 'Editar';

    const btnExcluir = document.createElement('button');
    btnExcluir.classList.add('btn-excluir');
    btnExcluir.textContent = 'D';
    btnExcluir.title = 'Excluir';

    acoesCard.appendChild(btnEditar);
    acoesCard.appendChild(btnExcluir);

    cartao.appendChild(conteudoCard);
    cartao.appendChild(acoesCard);

    // Eventos de clique 
    btnExcluir.addEventListener('click', async () => {
        const confirmar = confirm(`Tem certeza que deseja excluir o contato "${contato.nome}"?`);

        if (confirmar) {
            try {
                await deleteContato(contato.id);

                alert("Contato excluído com sucesso!");

                carregarContatos();
            } catch (error) {
                console.error("Erro ao deletar o contato:", error);
                alert("Não foi possível excluir o contato.");
            }
        }
    });
    btnEditar.addEventListener('click', () => {
        modalContato.classList.remove('container-escondido');
        modalContato.querySelector('h2').textContent = "Editar Contato";

        document.getElementById('fotoContato').value = contato.foto || '';
        document.getElementById('nomeContato').value = contato.nome || '';
        document.getElementById('telContato').value = contato.celular || '';
        document.getElementById('emailContato').value = contato.email || '';
        document.getElementById('enderecoContato').value = contato.endereco || '';
        document.getElementById('cidadeContato').value = contato.cidade || '';

        formContato.dataset.idEdicao = contato.id;
    });

    containerContatos.appendChild(cartao);
}

const carregarContatos = async () => {
    // Forma mais segura e rápida de limpar o container
    while (containerContatos.firstChild) {
        containerContatos.removeChild(containerContatos.firstChild);
    }

    try {
        const contatos = await getContatos();
        if (Array.isArray(contatos)) {
            contatos.forEach(criarCardContato);
        }
    } catch (error) {
        console.error("Erro ao listar contatos:", error);
    }
}

btnNovoContato.addEventListener('click', () => {
    modalContato.classList.remove('container-escondido');
    modalContato.querySelector('h2').textContent = "Adicionar Novo Contato";
    delete formContato.dataset.idEdicao;
});

btnCancelar.addEventListener('click', () => {
    modalContato.classList.add('container-escondido');
    formContato.reset();
});


formContato.addEventListener('submit', async (event) => {
    event.preventDefault();

    const idEdicao = formContato.dataset.idEdicao;
    const dadosContato = {
        nome: document.getElementById('nomeContato').value,
        foto: document.getElementById('fotoContato').value,
        celular: document.getElementById('telContato').value,
        email: document.getElementById('emailContato').value,
        endereco: document.getElementById('enderecoContato').value,
        cidade: document.getElementById('cidadeContato').value
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

const filtrarContatos = () => {
    const termoBusca = inputBuscar.value.toLowerCase();
    const cartoes = document.querySelectorAll('.cartao-contato');

    cartoes.forEach(cartao => {
        const conteudoDoCard = cartao.textContent.toLowerCase();

        if (conteudoDoCard.includes(termoBusca)) {
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
// Faz a página atualizar ao clicar no logotipo
document.querySelector('.logo').addEventListener('click', () => {
    window.location.reload();
});