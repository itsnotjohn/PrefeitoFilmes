const CHAVE_USUARIO = 'usuarioLogado';
const PAGINA_INICIAL = 'index.html';
const PAGINA_HOME = 'home.html';

const elementos = {
    nomeUsuario: document.getElementById('nomeUsuario'),
    logout: document.getElementById('logout'),
    filmeDetalhes: document.getElementById('filmeDetalhes')
};

document.addEventListener('DOMContentLoaded', async function() {
    await verificarAutenticacao();
    configurarEventos();
    
    const filmeId = obterIdFilmeUrl();
    if (filmeId) {
        await carregarEExibirFilme(filmeId);
    } else {
        redirecionar(PAGINA_HOME);
    }
});

async function verificarAutenticacao() {
    const usuario = JSON.parse(localStorage.getItem(CHAVE_USUARIO));
    if (!usuario) {
        redirecionar(PAGINA_INICIAL);
    }
    elementos.nomeUsuario.textContent = usuario.nome;
}

function configurarEventos() {
    elementos.logout.addEventListener('click', function() {
        localStorage.removeItem(CHAVE_USUARIO);
        redirecionar(PAGINA_INICIAL);
    });
}

function obterIdFilmeUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function carregarEExibirFilme(id) {
    try {
        const filme = await carregarFilme(id);
        exibirDetalhesFilme(filme);
    } catch (erro) {
        console.error('Erro ao carregar filme:', erro);
        redirecionar(PAGINA_HOME);
    }
}

async function carregarFilme(id) {
    return await db.get(id);
}

function exibirDetalhesFilme(filme) {
    elementos.filmeDetalhes.innerHTML = `
        <div class="filme-capa-container">
            <img src="${filme.imagem}" alt="${filme.titulo}" class="filme-capa" 
                 onerror="this.src='https://placehold.co/300x450?text=Imagem+indisponível'">
        </div>
        
        <div class="filme-info">
            <h1 class="filme-titulo">${filme.titulo}</h1>
            
            <div class="filme-meta">
                ${filme.categoria ? `<span>${filme.categoria}</span>` : ''}
                ${filme.ano ? `<span>${filme.ano}</span>` : ''}
            </div>
            
            ${filme.sinopse ? `<p class="filme-sinopse">${filme.sinopse}</p>` : ''}
        </div>
        
        <div class="filme-trailer">
            <h2>Trailer</h2>
            <div class="trailer-container">
                ${gerarIframeTrailer(filme.trailer)}
            </div>
        </div>
    `;
}

function gerarIframeTrailer(trailerId) {
    if (!trailerId) {
        return '<p class="sem-trailer">Trailer não disponível</p>';
    }
    
    return `
        <iframe width="560" height="315" 
                src="https://www.youtube.com/embed/${trailerId}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
        </iframe>
    `;
}

function redirecionar(url) {
    window.location.href = url;
}