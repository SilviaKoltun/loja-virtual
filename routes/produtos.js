const express = require('express')
const router = express.Router()

// Dados temporários (o array do seu recurso)
// Cole aqui o array que estava no index.js
const produtos = [
    {
      id: 1,
      nome: 'Suporte para Celular 3D',
      preco: 25.90,
      categoria: 'acessorios',
      disponivel: true
    },
    {
      id: 2,
      nome: 'Organizador de Cabos 3D',
      preco: 15.50,
      categoria: 'organizadores',
      disponivel: true
    },
    {
      id: 3,
      nome: 'Vaso Decorativo 3D',
      preco: 39.90,
      categoria: 'decoração',
      disponivel: false
    }
  ]
  // As rotas virão aqui nos próximos passos
  // GET - Listar todos os produtos
router.get('/', (req, res) => {
    const { categoria, disponivel, busca } = req.query
    let resultado = produtos
    if (categoria) {
      resultado = resultado.filter(produto => produto.categoria === categoria)
    }
    if (disponivel) {
      const valorBooleano = disponivel === 'true'
      resultado = resultado.filter(produto => produto.disponivel === valorBooleano)
    }
    if (busca) {
      resultado = resultado.filter(produto => produto.nome.toLowerCase().includes(busca.toLowerCase()))
      const termoBusca = busca.toLowerCase()
      resultado = resultado.filter(produto => produto.nome.toLowerCase().includes(termoBusca))
    }
    res.json(resultado);
  })
  
  router.get('/:id', (req, res) => {
    const id = Number(req.params.id)
  
    const produto = produtos.find(produto => produto.id === id)
  
    if (!produto) {
      return res.status(404).json({ erro: 'Produto não encontrado' })
    }
   res.json(produto)
  })
  router.post('/', (req, res) => {
    const { nome, categoria, preco, disponivel } = req.body;
  
    if (!nome || !categoria || !preco || disponivel === undefined) {
      return res.status(400).json({
        erro: 'nome, categoria, preco e disponivel são obrigatórios'
      })
    }
  
    const novoProduto = {
      id: produtos.length + 1,
      nome,
      preco,
      categoria,
      disponivel
    };
    produtos.push(novoProduto);

    res.status(201).json(novoProduto);
  });

  router.put('/:id', (req, res) => {
    const id = Number(req.params.id)
    const index = produtos.findIndex(produto => produto.id === id)
  
    if (index === -1) {
      return res.status(404).json({ erro: 'Produto não encontrado' })
    }
    const { nome, categoria, preco, disponivel } = req.body
     
    if (!nome || !categoria || !preco || disponivel === undefined) {
      return res.status(400).json({
        erro: 'nome, categoria, preco e disponivel são obrigatórios'
      })
    }
    produtos[index] = { id, nome, categoria, preco, disponivel }
    res.json(produtos[index])
  })  
  router.patch('/:id', (req, res) => {
    const id = Number(req.params.id)
    const index = produtos.findIndex(produto => produto.id === id)
    
    if (index === -1) {
      return res.status(404).json({ erro: 'Produto não encontrado' })
    }
    produtos[index] = { ...produtos[index], ...req.body, id }
    res.json(produtos[index])
  })
  router.delete('/:id', (req, res) => {
    const id = Number(req.params.id)
    const index = produtos.findIndex(produto => produto.id === id)
  
    if (index === -1) {
      return res.status(404).json({ erro: 'Produto não encontrado' })
    }
  
    produtos.splice(index, 1)
    res.status(204).send()
  })
  
  

module.exports = router