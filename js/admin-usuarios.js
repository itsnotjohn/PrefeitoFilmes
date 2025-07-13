const CHAVE_USUARIO = 'usuarioLogado';
const PREFIXO_USUARIO = 'user_';

const elementos = {
    nomeUsuario: document.getElementById('nomeUsuario'),
    logout: document.getElementById('logout'),
    formularioUsuario: document.getElementById('usuarioForm'),
    limpar: document.getElementById('limpar'),
    listaUsuarios: document.querySelector('#listaUsuarios tbody'),
    usuarioId: document.getElementById('usuarioId'),
    nome: document.getElementById('nome'),
    email: document.getElementById('email'),
    senha: document.getElementById('senha'),
    tipo: document.getElementById('tipo')
};

document.addEventListener('DOMContentLoaded', async function () {
    await iniciarPainelAdmin();
});

async function iniciarPainelAdmin() {
    const usuario = JSON.parse(localStorage.getItem(CHAVE_USUARIO));

    if (!usuario || usuario.tipo !== 'admin') {
        redirecionarParaIndex();
        return;
    }

    configurarInterface(usuario);
    await carregarUsuarios();
    configurarEventos();
}

function configurarInterface(usuario) {
    elementos.nomeUsuario.textContent = usuario.nome;
}

function configurarEventos() {
    elementos.logout.addEventListener('click', deslogar);
    elementos.formularioUsuario.addEventListener('submit', salvarUsuario);
    elementos.limpar.addEventListener('click', limparFormulario);
}

async function carregarUsuarios() {
    try {
        const resposta = await db.allDocs({
            include_docs: true,
            startkey: PREFIXO_USUARIO,
            endkey: `${PREFIXO_USUARIO}\uffff`
        });

        const usuarios = resposta.rows.map(linha => linha.doc);
        exibirListaUsuarios(usuarios);
    } catch (erro) {
        console.error('Erro ao carregar usuários:', erro);
        alert('Erro ao carregar lista de usuários');
    }
}

function exibirListaUsuarios(usuarios) {
    console.log(usuarios);
    elementos.listaUsuarios.innerHTML = '';

    usuarios.forEach(usuario => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${usuario.tipo === 'admin' ? 'Administrador' : 'Usuário'}</td>
            <td class="acoes">
                <button class="editar" data-id="${usuario._id}">Editar</button>
                <button class="excluir" data-id="${usuario._id}">Excluir</button>
            </td>
        `;

        linha.querySelector('.editar').addEventListener('click', () => editarUsuario(usuario._id));
        linha.querySelector('.excluir').addEventListener('click', () => excluirUsuario(usuario._id));

        elementos.listaUsuarios.appendChild(linha);
    });
}

async function editarUsuario(id) {
    try {
        const usuario = await db.get(id);

        elementos.usuarioId.value = usuario._id;
        elementos.nome.value = usuario.nome;
        elementos.email.value = usuario.email;
        elementos.tipo.value = usuario.tipo;
        elementos.senha.value = '';
    } catch (erro) {
        console.error('Erro ao editar usuário:', erro);
        alert('Erro ao carregar dados do usuário');
    }
}

async function excluirUsuario(id) {
    const usuarioLogado = JSON.parse(localStorage.getItem(CHAVE_USUARIO));

    if (id === usuarioLogado._id) {
        alert('Você não pode excluir a si mesmo!');
        return;
    }

    if (confirm('Tem certeza que deseja excluir este usuário?')) {
        try {
            const usuario = await db.get(id);
            await db.remove(usuario);
            await carregarUsuarios();
            limparFormulario();
        } catch (erro) {
            console.error('Erro ao excluir usuário:', erro);
            alert('Erro ao excluir usuário');
        }
    }
}

async function salvarUsuario(e) {
    e.preventDefault();

    const id = elementos.usuarioId.value;
    const nome = elementos.nome.value;
    const email = elementos.email.value;
    const senha = elementos.senha.value;
    const tipo = elementos.tipo.value;

    const usuario = {
        _id: id || `${PREFIXO_USUARIO}${Date.now()}`,
        nome,
        email,
        tipo,
        tipoDocumento: 'usuario'
    };

    if (!id && !senha) {
        alert('Por favor, informe uma senha para o novo usuário');
        return;
    }

    if (senha) {
        usuario.senha = senha;
    }

    try {
        if (!id) {
            await db.put(usuario);
        } else {
            const doc = await db.get(id);
            usuario._rev = doc._rev;

            if (!senha && doc.senha) {
                usuario.senha = doc.senha;
            }

            await db.put(usuario);
        }

        await carregarUsuarios();
        limparFormulario();
    } catch (erro) {
        console.error('Erro ao salvar usuário:', erro);
        alert('Erro ao salvar usuário');
    }
}

function limparFormulario() {
    elementos.formularioUsuario.reset();
    elementos.usuarioId.value = '';
}

function deslogar() {
    localStorage.removeItem(CHAVE_USUARIO);
    redirecionarParaIndex();
}

function redirecionarParaIndex() {
    window.location.href = 'index.html';
}