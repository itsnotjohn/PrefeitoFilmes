document.addEventListener('DOMContentLoaded', async function () {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuario) {
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('nomeUsuario').textContent = usuario.nome;
    document.getElementById('logout').addEventListener('click', function () {
        localStorage.removeItem('usuarioLogado');
        window.location.href = 'index.html';
    });

    if (usuario.tipo === "admin") {
        const botaoAdmin = document.createElement("button");
        botaoAdmin.textContent = "Admin";
        botaoAdmin.id = "adminButton";
        botaoAdmin.className = "admin-btn";

        botaoAdmin.addEventListener("click", () => window.location.href = "admin-filmes.html");

        const userMenu = document.querySelector(".user-menu");
        const logoutButton = document.getElementById("logout");
        userMenu.insertBefore(botaoAdmin, logoutButton);
    }

    await carregarFilmes();

    document.querySelectorAll('.categoria').forEach(link => {
        link.addEventListener('click', async function (e) {
            e.preventDefault();
            const categoria = this.getAttribute('data-categoria');
            await carregarFilmes(categoria);
        });
    });
});

async function carregarFilmes(categoria = 'todos') {
    try {
        const response = await db.allDocs({
            include_docs: true,
            startkey: 'filme_',
            endkey: 'filme_\uffff'
        });

        const filmes = response.rows.map(row => row.doc);
        const filmesFiltrados = categoria === 'todos'
            ? filmes
            : filmes.filter(filme => filme.categoria === categoria);

        if (filmesFiltrados.length > 0) {
            const filmeDestaque = filmesFiltrados[Math.floor(Math.random() * filmesFiltrados.length)];
            exibirFilmeDestaque(filmeDestaque);
        }

        exibirListaFilmes(filmesFiltrados);
    } catch (erro) {
        console.error('Erro ao carregar filmes:', erro);
    }
}

function exibirFilmeDestaque(filme) {
    const container = document.getElementById('filmeDestaque');
    const imagemUrl = filme.imagem || 'https://placehold.co/800x450?text=Imagem+indisponível';
    
    container.innerHTML = `
        <div class="filme-destaque-container">
            <div class="filme-destaque-background" style="background-image: url('${imagemUrl}')"></div>
            <div class="filme-destaque-overlay"></div>
            <div class="filme-destaque-info">
                <h3>${filme.titulo || 'Título não disponível'}</h3>
                <p>${filme.sinopse || 'Sinopse não disponível.'}</p>
                <a href="filme.html?id=${filme._id}" class="botao-assistir">Assistir</a>
            </div>
        </div>
    `;
}

function exibirListaFilmes(filmes) {
    const container = document.getElementById('listaFilmes');
    container.innerHTML = '';

    filmes.forEach(filme => {
        const card = document.createElement('div');
        card.className = 'filme-card';
        card.innerHTML = `
            <img src="${filme.imagem}" alt="${filme.titulo}">
            <div class="filme-info">
                <h3>${filme.titulo}</h3>
                <p>${filme.categoria}</p>
            </div>
        `;
        card.addEventListener('click', () => window.location.href = `filme.html?id=${filme._id}`);
        container.appendChild(card);
    });
}