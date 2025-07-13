const db = new PouchDB('prefeito-filmes');

async function initDB() {
  try {
    return await db.get('_local/initialized');
  } catch (err) {
    if (err.status === 404) {
      const users = [{
        _id: `user_${Date.now()}`,
        nome: 'Prefeitão',
        email: 'admin@prefeitofilmes.com',
        senha: 'admin',
        tipo: 'admin'
      },
      {
        _id: `user_${Date.now() + 1}`,
        nome: 'Usuário',
        email: 'usuario@gmail.com',
        senha: 'user',
        tipo: 'usuario'
      },
      {
        _id: `user_${Date.now() + 2}`,
        nome: 'Rodrigo Alves',
        email: 'rodrigoalves@gmail.com',
        senha: 'rodigo',
        tipo: 'usuario'
      }];

      users.forEach(async x => await db.put(x));

      await db.put({
        _id: 'categorias',
        lista: ['Ação', 'Comédia', 'Drama', 'Terror', 'Ficção Científica', 'Animação']
      });

      const filmes = [
        {
          _id: `filme_${Date.now()}`,
          titulo: 'Lilo & Stitch',
          sinopse: 'Os brinquedos de Andy ganham vida quando os humanos não estão olhando, levando a aventuras emocionantes.',
          categoria: 'Animação',
          ano: '2025',
          imagem: 'https://img.youtube.com/vi/oLnS1Ij9-Kk/maxresdefault.jpg',
          tipo: 'filme',
          trailer: 'oLnS1Ij9-Kk'
        },
        {
          _id: `filme_${Date.now() + 1}`,
          titulo: 'O Rei Leão',
          sinopse: 'Simba, um jovem leão, aprende sobre o ciclo da vida enquanto enfrenta desafios para se tornar o rei.',
          categoria: 'Animação',
          ano: '2019',
          imagem: 'https://img.youtube.com/vi/7TavVZMewpY/maxresdefault.jpg',
          tipo: 'filme',
          trailer: '7TavVZMewpY'
        },
        {
          _id: `filme_${Date.now() + 2}`,
          titulo: 'Frozen: Uma Aventura Congelante',
          sinopse: 'A princesa Anna parte em uma jornada para encontrar sua irmã Elsa, que possui poderes de gelo.',
          categoria: 'Animação',
          ano: '2013',
          imagem: 'https://img.youtube.com/vi/TbQm5doF_Uc/maxresdefault.jpg',
          tipo: 'filme',
          trailer: 'TbQm5doF_Uc'
        },
        {
          _id: `filme_${Date.now() + 3}`,
          titulo: 'Meu Malvado Favorito',
          sinopse: 'Um supervilão adota três órfãs como parte de seu plano maligno, mas acaba se apegando a elas.',
          categoria: 'Animação',
          imagem: 'https://img.youtube.com/vi/6DBi41reeF0/maxresdefault.jpg',
          tipo: 'filme',
          ano: '2016',
          trailer: '6DBi41reeF0'
        },
        {
          _id: `filme_${Date.now() + 4}`,
          titulo: 'Garfield - Fora de Casa',
          sinopse: 'Garfield, o gato caseiro que odeia segundas-feiras e ama lasanha, se vê em uma aventura selvagem ao ar livre quando seu pai há muito perdido o envolve em um assalto de alto risco.',
          categoria: 'Animação',
          imagem: 'https://img.youtube.com/vi/55D_3uaKXYE/maxresdefault.jpg',
          tipo: 'filme',
          ano: '2023',
          trailer: '55D_3uaKXYE'
        }
      ];

      filmes.forEach(async x => await db.put(x));

      await db.put({
        _id: '_local/initialized',
        value: true
      });
    }
  }
}

initDB();