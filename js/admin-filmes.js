const CHAVE_USUARIO = 'usuarioLogado';
const PREFIXO_FILME = 'filme_';
const IMAGEM_PADRAO = 'https://placehold.co/300x450?text=Sem+imagem';
const URL_YOUTUBE_REGEX = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;

const elementos = {
    nomeUsuario: document.getElementById('nomeUsuario'),
    logout: document.getElementById('logout'),
    formularioFilme: document.getElementById('filmeForm'),
    limpar: document.getElementById('limpar'),
    listaFilmes: document.getElementById('listaFilmes'),
    filmeId: document.getElementById('filmeId'),
    titulo: document.getElementById('titulo'),
    sinopse: document.getElementById('sinopse'),
    categoria: document.getElementById('categoria'),
    ano: document.getElementById('ano'),
    trailer: document.getElementById('trailer')
};

document.addEventListener('DOMContentLoaded', async function() {
    await iniciarPainelAdmin();
});

async function iniciarPainelAdmin() {
    const usuario = JSON.parse(localStorage.getItem(CHAVE_USUARIO));

    if (!usuario || usuario.tipo !== 'admin') {
        redirecionarParaIndex();
        return;
    }

    configurarInterface(usuario);
    await carregarDadosIniciais();
    configurarEventos();
}

function configurarInterface(usuario) {
    elementos.nomeUsuario.textContent = usuario.nome;
}

async function carregarDadosIniciais() {
    await carregarCategorias();
    await carregarFilmes();
}

function configurarEventos() {
    elementos.logout.addEventListener('click', deslogar);
    elementos.formularioFilme.addEventListener('submit', salvarFilme);
    elementos.limpar.addEventListener('click', limparFormulario);
}

async function carregarCategorias() {
    try {
        const doc = await db.get('categorias');
        elementos.categoria.innerHTML = '';

        doc.lista.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            elementos.categoria.appendChild(option);
        });
    } catch (erro) {
        console.error('Erro ao carregar categorias:', erro);
        alert('Erro ao carregar lista de categorias');
    }
}

async function carregarFilmes() {
    try {
        const response = await db.allDocs({
            include_docs: true,
            startkey: PREFIXO_FILME,
            endkey: `${PREFIXO_FILME}\uffff`
        });

        const filmes = response.rows.map(row => row.doc);
        exibirListaFilmes(filmes);
    } catch (erro) {
        console.error('Erro ao carregar filmes:', erro);
        alert('Erro ao carregar lista de filmes');
    }
}

function exibirListaFilmes(filmes) {
    elementos.listaFilmes.innerHTML = '';

    filmes.forEach(filme => {
        const card = document.createElement('div');
        card.className = 'filme-card';
        card.innerHTML = `
            <img src="${filme.imagem || IMAGEM_PADRAO}" alt="${filme.titulo}">
            <div class="filme-acoes">
                <button class="editar" data-id="${filme._id}">✏️</button>
                <button class="excluir" data-id="${filme._id}">🗑️</button>
            </div>
            <div class="filme-info">
                <h3>${filme.titulo}</h3>
                <p>${filme.categoria}</p>
            </div>
        `;

        card.querySelector('.editar').addEventListener('click', () => editarFilme(filme._id));
        card.querySelector('.excluir').addEventListener('click', () => excluirFilme(filme._id));

        elementos.listaFilmes.appendChild(card);
    });
}

async function editarFilme(id) {
    try {
        const filme = await db.get(id);

        elementos.filmeId.value = filme._id;
        elementos.titulo.value = filme.titulo;
        elementos.sinopse.value = filme.sinopse;
        elementos.categoria.value = filme.categoria;
        elementos.ano.value = filme.ano || '';
        
        const trailerUrl = filme.trailer ? `https://youtu.be/${filme.trailer}` : '';
        elementos.trailer.value = trailerUrl;

    } catch (erro) {
        console.error('Erro ao editar filme:', erro);
        alert('Erro ao carregar dados do filme');
    }
}

async function excluirFilme(id) {
    if (confirm('Tem certeza que deseja excluir este filme?')) {
        try {
            const filme = await db.get(id);
            await db.remove(filme);
            await carregarFilmes();
            limparFormulario();
        } catch (erro) {
            console.error('Erro ao excluir filme:', erro);
            alert('Erro ao excluir filme');
        }
    }
}

async function salvarFilme(e) {
    e.preventDefault();

    const filme = {
        _id: elementos.filmeId.value || `${PREFIXO_FILME}${Date.now()}`,
        titulo: elementos.titulo.value,
        sinopse: elementos.sinopse.value,
        categoria: elementos.categoria.value,
        tipo: 'filme'
    };

    if (elementos.ano.value) {
        filme.ano = parseInt(elementos.ano.value);
    }

    await processarMidia(filme);

    try {
        if (elementos.filmeId.value) {
            const doc = await db.get(filme._id);
            filme._rev = doc._rev;
        }

        await db.put(filme);
        await carregarFilmes();
        limparFormulario();
    } catch (erro) {
        console.error('Erro ao salvar filme:', erro);
        alert('Erro ao salvar filme');
    }
}

async function processarMidia(filme) {
    const trailerUrl = elementos.trailer.value;
    const match = trailerUrl.match(URL_YOUTUBE_REGEX);

    if (match && match[1]) {
        filme.trailer = match[1];
        filme.imagem = await verificarThumbnail(match[1]);
    } else {
        filme.imagem = IMAGEM_PADRAO;
    }
}

async function verificarThumbnail(videoId) {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    
    try {
        const response = await fetch(thumbnailUrl);
        return response.ok ? thumbnailUrl : IMAGEM_PADRAO;
    } catch (erro) {
        console.error('Erro ao verificar thumbnail:', erro);
        return IMAGEM_PADRAO;
    }
}

function limparFormulario() {
    elementos.formularioFilme.reset();
    elementos.filmeId.value = '';
}

function deslogar() {
    localStorage.removeItem(CHAVE_USUARIO);
    redirecionarParaIndex();
}

function redirecionarParaIndex() {
    window.location.href = 'index.html';
}