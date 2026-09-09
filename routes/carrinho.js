const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')


router.get('/', async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id

        const carrinho = await prisma.carrinho.findMany({
            where: {
                usuarioId
            },
            include: {
                produto: true
            }
        })

        res.json(carrinho)

    } catch (err) {
        next(err)
    }
})


router.post('/', async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id
        const { produtoId, quantidade } = req.body

        if (!produtoId) {
            return res.status(400).json({
                erro: 'Produto é obrigatório.'
            })
        }

        const quantidadeNumero =
            quantidade === undefined ? 1 : Number(quantidade)

        if (
            !Number.isInteger(quantidadeNumero) ||
            quantidadeNumero < 1
        ) {
            return res.status(400).json({
                erro: 'Quantidade deve ser um número inteiro maior que zero.'
            })
        }

        const produto = await prisma.produto.findUnique({
            where: {
                id: Number(produtoId)
            }
        })

        if (!produto) {
            return res.status(404).json({
                erro: 'Produto não encontrado.'
            })
        }

        if (!produto.disponivel) {
            return res.status(400).json({
                erro: 'Produto indisponível.'
            })
        }

        // PROCURA SE O PRODUTO JÁ ESTÁ NO CARRINHO
        const existItem = await prisma.carrinho.findFirst({
            where: {
                usuarioId,
                produtoId: Number(produtoId)
            }
        })

        // SE JÁ EXISTE, SOMA A QUANTIDADE
        if (existItem) {
            const atualizado = await prisma.carrinho.update({
                where: {
                    id: existItem.id
                },
                data: {
                    quantidade:
                        existItem.quantidade + quantidadeNumero
                },
                include: {
                    produto: true
                }
            })

            return res.json(atualizado)
        }

        // SE NÃO EXISTE, CRIA
        const novoItem = await prisma.carrinho.create({
            data: {
                usuarioId,
                produtoId: Number(produtoId),
                quantidade: quantidadeNumero
            },
            include: {
                produto: true
            }
        })

        res.status(201).json(novoItem)

    } catch (err) {
        next(err)
    }
})


router.put('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id)
        const { quantidade } = req.body

        if (
            !Number.isInteger(Number(quantidade)) ||
            Number(quantidade) < 1
        ) {
            return res.status(400).json({
                erro: 'Quantidade deve ser maior que zero.'
            })
        }

        const item = await prisma.carrinho.findUnique({
            where: { id }
        })

        // primeiro verifica se existe
        if (!item) {
            return res.status(404).json({
                erro: 'Item não encontrado.'
            })
        }

        // depois verifica se pertence ao usuário
        if (item.usuarioId !== req.usuario.id) {
            return res.status(403).json({
                erro: 'Você não tem permissão para alterar este item.'
            })
        }

        const atualizado = await prisma.carrinho.update({
            where: { id },
            data: {
                quantidade: Number(quantidade)
            },
            include: {
                produto: true
            }
        })

        res.json(atualizado)

    } catch (err) {
        next(err)
    }
})


router.delete('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id)

        const item = await prisma.carrinho.findUnique({
            where: { id }
        })

        if (!item) {
            return res.status(404).json({
                erro: 'Item não encontrado.'
            })
        }

        if (item.usuarioId !== req.usuario.id) {
            return res.status(403).json({
                erro: 'Você não tem permissão para excluir este item.'
            })
        }

        await prisma.carrinho.delete({
            where: { id }
        })

        res.sendStatus(204)

    } catch (err) {
        next(err)
    }
})


router.delete('/', async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id

        await prisma.carrinho.deleteMany({
            where: {
                usuarioId
            }
        })

        res.json({
            mensagem: 'Carrinho esvaziado.'
        })

    } catch (err) {
        next(err)
    }
})


module.exports = router