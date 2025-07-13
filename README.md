
# 🎬 Prefeito Filmes

**Prefeito Filmes** é um site de streaming de filmes desenvolvido como trabalho acadêmico utilizando tecnologias puras: **HTML**, **CSS** e **JavaScript**, com **PouchDB** como banco de dados local.

## 📁 Estrutura do Projeto

```
PrefeitoFilmes/
├── index.html                # Página inicial
├── home.html                 # Página com destaque de filmes
├── filme.html                # Página com detalhes de um filme
├── admin-filmes.html         # Página de administração de filmes
├── admin-usuarios.html       # Página de administração de usuários
├── css/
│   ├── login.css
│   ├── home.css
│   ├── filme.css
│   ├── admin-filmes.css
│   └── admin-usuarios.css
├── js/
│   ├── login.js
│   ├── home.js
│   ├── filme.js
│   ├── admin-filmes.js
│   ├── admin-usuarios.js
│   ├── auth.js              # Gerenciamento de autenticação
│   └── db.js                # Integração com PouchDB
└── README.md
```

## ✅ Funcionalidades

- [x] Cadastro e login de usuários (autenticação local via PouchDB)
- [x] Destaque de filmes na home
- [x] Visualização de detalhes do filme
- [x] Administração de filmes (CRUD)
- [x] Administração de usuários (CRUD)
- [x] URLs de trailer e imagem validadas
- [x] Estilo customizado com CSS puro

## 🧪 Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript (puro, sem frameworks)
- [PouchDB](https://pouchdb.com/) (banco de dados local)

## 🚀 Como Rodar o Projeto

1. Clone o repositório:

```bash
git clone https://github.com/usuario/PrefeitoFilmes.git
```

2. Abra o arquivo `index.html` diretamente em seu navegador **(não é necessário servidor)**.

> 💡 Para funcionalidade completa do PouchDB, o projeto pode ser melhor testado via Live Server no VS Code.

## 📌 Requisitos do Projeto

- Todos os campos do formulário de cadastro de filme são obrigatórios
- A URL do trailer e da imagem devem ser **URLs válidas**

## 🌐 URL do Site

Você pode acessar o site através do seguinte link:

🔗 **[https://prefeito.dev/](https://prefeito.dev/)**

## ✍️ Autoria

Desenvolvido por **João** como parte de uma atividade acadêmica.

## 🔐 Logins de Teste

Para facilitar os testes da aplicação, seguem abaixo os logins disponíveis:

### 👤 Administrador
- `admin@prefeitofilmes.com:admin`

### 👥 Usuários Comuns
- `usuario@gmail.com:user`  
- `rodrigoalves@gmail.com:rodigo`

> ℹ️ **Formato padrão:** `email:senha`
