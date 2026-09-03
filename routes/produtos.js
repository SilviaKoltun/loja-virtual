const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')

router.get('/', async (req, res, next) => {
  try {
    const { categoria, disponivel, busca } = req.query

    const filtros = {}

    if (categoria) {
      filtros.categoria = {
        nome: {
          contains: categoria
        }
      }
    }

    if (disponivel !== undefined) {
      filtros.disponivel = disponivel === 'true'
    }

    if (busca) {
      filtros.nome = {
        contains: busca
      }
    }

    const produtos = await prisma.produto.findMany({
      where: filtros,
      include: {
        categoria: true,
        carrinho: {
          where: {
            usuarioId: req.usuarioId
          }
        }
      }
    })

    res.json(produtos)
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)

    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
      categoria: true
      }
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
    const { nome, descricao, preco, disponivel = true, categoriaId } = req.body

    if (!nome || preco === undefined || categoriaId === undefined) {
      const erro = new Error('nome, preco e categoriaId são obrigatórios')
      erro.status = 400
      throw erro
    }

    const novoProduto = await prisma.produto.create({
      data: {
        nome,
        descricao,
        preco: Number(preco),
        disponivel,
        categoriaId: Number(categoriaId)
      }
    })

    res.status(201).json(novoProduto)
  } catch (err) {
    next(err)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const { nome, descricao, preco, disponivel, imagem,categoriaId } = req.body

    const produto = await prisma.produto.findUnique({
      where: { id }
    })

    if (!produto) {
      const erro = new Error('Produto não encontrado')
      erro.status = 404
      throw erro
    }

    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: {
        nome,
        descricao,
        preco: preco === undefined ? undefined : Number(preco),
        disponivel,
        imagem,
        categoriaId: categoriaId === undefined ? undefined : Number(categoriaId)
      }
    })

    res.json(produtoAtualizado)
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const { nome, descricao, preco, disponivel, categoriaId } = req.body

    const produto = await prisma.produto.findUnique({
      where: { id }
    })

    if (!produto) {
      const erro = new Error('Produto não encontrado')
      erro.status = 404
      throw erro
    }

    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: {
        nome,
        descricao,
        preco: preco === undefined ? undefined : Number(preco),
        disponivel,
        categoriaId: categoriaId === undefined ? undefined : Number(categoriaId)
      }
    })

    res.json(produtoAtualizado)
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

    await prisma.produto.delete({
      where: { id }
    })

    res.sendStatus(204)
  } catch (err) {
    next(err)
  }
})

module.exports = router
