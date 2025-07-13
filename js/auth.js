async function fazerLogin(email, senha) {
    try {
        const response = await db.allDocs({
            include_docs: true,
            startkey: 'user_',
            endkey: 'user_\uffff'
        });
        
        const usuario = response.rows
            .map(row => row.doc)
            .find(user => user.email === email && user.senha === senha);
        
        return usuario || null;
    } catch (erro) {
        console.error('Erro ao fazer login:', erro);
        return null;
    }
}

function verificarAutenticacao(tipoRequerido = null) {
    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
    if (!usuario) {
        return window.location.href = 'index.html';
    }
    
    if (tipoRequerido && usuario.tipo !== tipoRequerido) {
        return window.location.href = 'home.html';
    }
    
    return usuario;
}