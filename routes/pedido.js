const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')

router.get('/', async (req, res, next) => {
    try {

        const pedidos = await prisma.pedido.findMany({
            where: {
                usuarioId: req.usuario.id
            },
            include: {
                pagamento: true,
                itens: {
                    include: {
                        produto: true
                    }
                }
            }
        });

        res.json(pedidos);

    } catch (err) {
        next(err);
    }
});
router.get('/:id', async (req, res, next) => {
    try {

        const id = Number(req.params.id);

        const pedido = await prisma.pedido.findUnique({
            where: { id },
            include: {
                user: true,
                pagamento: true,
                itens: {
                    include: {
                        produto: true
                    }
                }
            }
        });

        if (pedido.usuarioId !== req.usuario.id) {
        return res.status(403).json({
        erro: 'Você não tem permissão para acessar este pedido.'
    })
    }

        if (!pedido) {
            return res.status(404).json({
                erro: 'Pedido não encontrado.'
            });
        }

        res.json(pedido);

    } catch (err) {
        next(err);
    }
});
router.post('/', async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id

        const itensCarrinho = await prisma.carrinho.findMany({
            where: {
                usuarioId
            },
            include: {
                produto: true
            }
        })

        if (itensCarrinho.length === 0) {
            return res.status(400).json({
                erro: 'Carrinho vazio.'
            })
        }

        const pedido = await prisma.$transaction(async (tx) => {

            const novoPedido = await tx.pedido.create({
                data: {
                    usuarioId,
                    status: 'aguardando_pagamento'
                }
            })

            await tx.itemPedido.createMany({
                data: itensCarrinho.map((item) => ({
                    pedidoId: novoPedido.id,
                    produtoId: item.produtoId,
                    quantidade: item.quantidade,
                    preco: item.produto.preco
                }))
            })

            await tx.carrinho.deleteMany({
                where: {
                    usuarioId
                }
            })

            return tx.pedido.findUnique({
                where: {
                    id: novoPedido.id
                },
                include: {
                    itens: {
                        include: {
                            produto: true
                        }
                    },
                    pagamento: true
                }
            })
        })

        res.status(201).json(pedido)

    } catch (err) {
        next(err)
    }
})
router.put('/:id', async (req, res, next) => {
    try {

        const id = Number(req.params.id);

        const { status } = req.body;

        const pedido = await prisma.pedido.findUnique({
            where: { id }
        });

        if (!pedido) {
            return res.status(404).json({
                erro: 'Pedido não encontrado.'
            });
        }
        if (pedido.usuarioId !== req.usuario.id) {
        return res.status(403).json({
        erro: 'Você não tem permissão para acessar este pedido.'
    })
}

        const atualizado = await prisma.pedido.update({
            where: { id },
            data: {
                status
            }
        });

        res.json(atualizado);

    } catch (err) {
        next(err);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {

        const id = Number(req.params.id);

        const pedido = await prisma.pedido.findUnique({
            where: { id }
        });

        if (!pedido) {
            return res.status(404).json({
                erro: 'Pedido não encontrado.'
            });
        }
        if (pedido.usuarioId !== req.usuario.id) {
        return res.status(403).json({
        erro: 'Você não tem permissão para excluir este pedido.'
    })
}

        await prisma.pedido.delete({
            where: { id }
        });

        res.sendStatus(204);

    } catch (err) {
        next(err);
    }
});

module.exports = router
