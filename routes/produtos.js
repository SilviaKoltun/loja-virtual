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
router.get('/', (req, res, next) => {
  try {
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
  } catch (err) {
    next(err)
  }
  })
  
  router.get('/:id', (req, res, next) => {
    try {
    const id = Number(req.params.id)
  
    const produto = produtos.find(produto => produto.id === id)
  
    if (!produto) {
      const erro = new Error('Produto não encontrado')
      erro.status = 404
      throw erro
    }
   res.json(produto)

  } catch (err) {
    next(err)
  }
  })
  router.post('/', (req, res, next) => {
    try {
    const { nome, categoria, preco, disponivel } = req.body;
  
    if (!nome || !categoria || !preco || disponivel === undefined) {
      const erro = new Error('nome, categoria, preco e disponivel são obrigatórios')
      erro.status = 400
      throw erro
    }
  
    const novoProduto = {
      id: produtos.length + 1,
      nome,
      preco,
      categoria,
      disponivel
    };
    produtos.push(novoProduto);

    res.status(201).json(novoProduto)
  } catch (err) {
    next(err)
  }
  });

  router.put('/:id', (req, res, next) => {
    try {
    const id = Number(req.params.id)
    const index = produtos.findIndex(produto => produto.id === id)
  
    if (index === -1) {
      const erro = new Error('Produto não encontrado')
      erro.status = 404
      throw erro
    
    }
    const { nome, categoria, preco, disponivel } = req.body
     
    if (!nome || !categoria || !preco || disponivel === undefined) {
      const erro = new Error('nome, categoria, preco e disponivel são obrigatórios')
      erro.status = 400
      throw erro
    }
      
    produtos[index] = { id, nome, categoria, preco, disponivel }
    res.json(produtos[index])
  } catch (err) {
    next(err)
  }
  })
  router.patch('/:id', (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const index = produtos.findIndex(produto => produto.id === id)
      
      if (index === -1) {
        const erro = new Error('Produto não encontrado')
        erro.status = 404
        throw erro
      }
      produtos[index] = { ...produtos[index], ...req.body, id }
      res.json(produtos[index])
    } catch (err) {
      next(err)
    }
  })
  router.delete('/:id', (req, res, next) => {
    try {
    const id = Number(req.params.id)
    const index = produtos.findIndex(produto => produto.id === id)
  
    if (index === -1) {
      const erro = new Error('Produto não encontrado')
      erro.status = 404
      throw erro
    }
  
    produtos.splice(index, 1)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
  })
  

module.exports = router