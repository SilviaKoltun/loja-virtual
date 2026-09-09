const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')


router.get('/', async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id

        const pagamentos = await prisma.pagamento.findMany({
            where: {
                pedido: {
                    usuarioId
                }
            },
            include: {
                pedido: true
            }
        })

        res.json(pagamentos)

    } catch (err) {
        next(err)
    }
})


router.get('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id)

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: 'ID inválido.'
            })
        }

        const pagamento = await prisma.pagamento.findUnique({
            where: { id },
            include: {
                pedido: true
            }
        })

        if (!pagamento) {
            return res.status(404).json({
                erro: 'Pagamento não encontrado.'
            })
        }

        if (pagamento.pedido.usuarioId !== req.usuario.id) {
            return res.status(403).json({
                erro: 'Você não tem permissão para acessar este pagamento.'
            })
        }

        res.json(pagamento)

    } catch (err) {
        next(err)
    }
})


router.post('/', async (req, res, next) => {
    try {
        const usuarioId = req.usuario.id
        const { formaPagamento, pedidoId } = req.body

        if (!formaPagamento || pedidoId === undefined) {
            return res.status(400).json({
                erro: 'Forma de pagamento e pedidoId são obrigatórios.'
            })
        }

        const idPedido = Number(pedidoId)

        if (!Number.isInteger(idPedido) || idPedido <= 0) {
            return res.status(400).json({
                erro: 'pedidoId inválido.'
            })
        }

        const pedido = await prisma.pedido.findUnique({
            where: {
                id: idPedido
            },
            include: {
                pagamento: true
            }
        })

        if (!pedido) {
            return res.status(404).json({
                erro: 'Pedido não encontrado.'
            })
        }

        if (pedido.usuarioId !== usuarioId) {
            return res.status(403).json({
                erro: 'Você não tem permissão para pagar este pedido.'
            })
        }

        if (pedido.pagamento) {
            return res.status(409).json({
                erro: 'Este pedido já possui um pagamento.'
            })
        }

        const resultado = await prisma.$transaction(async (tx) => {

            const pagamento = await tx.pagamento.create({
                data: {
                    formaPagamento,
                    status: 'aprovado',
                    pedidoId: idPedido
                }
            })

            await tx.pedido.update({
                where: {
                    id: idPedido
                },
                data: {
                    status: 'pago'
                }
            })

            return pagamento
        })

        res.status(201).json(resultado)

    } catch (err) {
        next(err)
    }
})


router.put('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id)
        const { formaPagamento, status } = req.body

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: 'ID inválido.'
            })
        }

        const pagamento = await prisma.pagamento.findUnique({
            where: { id },
            include: {
                pedido: true
            }
        })

        if (!pagamento) {
            return res.status(404).json({
                erro: 'Pagamento não encontrado.'
            })
        }

        if (pagamento.pedido.usuarioId !== req.usuario.id) {
            return res.status(403).json({
                erro: 'Você não tem permissão para alterar este pagamento.'
            })
        }

        const atualizado = await prisma.pagamento.update({
            where: { id },
            data: {
                formaPagamento,
                status
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

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: 'ID inválido.'
            })
        }

        const pagamento = await prisma.pagamento.findUnique({
            where: { id },
            include: {
                pedido: true
            }
        })

        if (!pagamento) {
            return res.status(404).json({
                erro: 'Pagamento não encontrado.'
            })
        }

        if (pagamento.pedido.usuarioId !== req.usuario.id) {
            return res.status(403).json({
                erro: 'Você não tem permissão para excluir este pagamento.'
            })
        }

        await prisma.pagamento.delete({
            where: { id }
        })

        res.sendStatus(204)

    } catch (err) {
        next(err)
    }
})


module.exports = router