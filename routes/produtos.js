const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')

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

router.get('/', async (req, res, next) => {
  try {
    const { categoria, disponivel, busca } = req.query

    let produtos = await prisma.produto.findMany();
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


router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const produto = await prisma.produto.findUnique({
      where: { id }
    })

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
router.post('/', async (req, res, next) => {
  try {
    const { nome, preco, disponivel } = req.body;

    if (!nome || !preco || disponivel === undefined) {
      const erro = new Error('nome, categoria, preco e disponivel são obrigatórios')
      erro.status = 400
      throw erro
    }

    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        preco,
        disponivel
      },
    });


    //substituido pelo prisma create
    // const novoProduto = { 
    //id: produtos.length + 1,
    //nome,
    // preco,
    //categoria,
    //disponivel
    //};
    // produtos.push(novoProduto);

    res.status(201).json(novoProduto)
  } catch (err) {
    next(err)
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const produto = await prisma.produto.findUnique({
      where: { id }
    })

    if (!produto) {
      const erro = new Error('Produto não encontrado')
      erro.status = 404
      throw erro
    }
    const { nome, preco, disponivel } = req.body
    // erro retirado porque pode-se alterar qualquer outra informação
    //if (!nome || !preco || disponivel === undefined) {
    //const erro = new Error('nome, preco e disponivel são obrigatórios')
    //erro.status = 400
    // throw erro
    //}
    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: {
        nome,
        preco,
        disponivel
      }
    })

    //produtos[index] = { id, nome, preco, disponivel }

    res.json(produtoAtualizado)
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
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const produtoEncontrado = await prisma.produto.findUnique({
      where: { id }
    })
    if (!produtoEncontrado) {
      const erro = new Error('Produto não encontrado')
      erro.status = 404
      throw erro
    }

    //produtos.splice(index, 1)
    await prisma.produto.delete({
      where: { id }
    })
    res.status(204).send("Produto deletado!")
  } catch (err) {
    next(err)
  }
})



module.exports = router