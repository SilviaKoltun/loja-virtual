const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

app.use(express.json());

const produtos = [
  {
    id: 1,
    nome: 'Suporte para Celular 3D',
    preco: 25.90,
    categoria: 'acessorios',
    estoque: 10
  },
  {
    id: 2,
    nome: 'Organizador de Cabos 3D',
    preco: 15.50,
    categoria: 'organizadores',
    estoque: 20
  },
  {
    id: 3,
    nome: 'Vaso Decorativo 3D',
    preco: 39.90,
    categoria: 'decoração',
    estoque: 5
  }
];

// GET - Listar todos os produtos
app.get('/produtos', (req, res) => {
  res.json(produtos);
});

// POST - Adicionar um novo produto
app.post('/produtos', (req, res) => {
  const { nome, preco, categoria, estoque } = req.body;

  const novoProduto = {
    id: produtos.length + 1,
    nome,
    preco,
    categoria,
    estoque
  };

  produtos.push(novoProduto);

  res.status(201).json(novoProduto);
});

app.post('mensagem', (req, res) =>{
  const {categoria, estoque} = req.body;

  if (!categoria || !estoque){
    return res.status(400).json({
      erro: 'categoria e estoque são obrigatórios'
    })
  }
  const novaMensagem = {
    id: mensagem.length +1,
    categoria,
    estoque
  };
  mensagem.push(novaMensagem);
  res.status(201).json(novaMensagem)
});


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})



