document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const mensagemErro = document.getElementById('mensagemErro');

    try {
        const usuario = await fazerLogin(email, senha);
        if (!usuario) return mensagemErro.textContent = 'E-mail ou senha incorretos';

        localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
        return usuario.tipo === 'admin' ? window.location.href = 'admin-filmes.html' : window.location.href = 'home.html';
    } catch (erro) {
        mensagemErro.textContent = 'Erro ao fazer login. Tente novamente.';
        console.error(erro);
    }
});