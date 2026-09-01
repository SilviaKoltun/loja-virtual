const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')

router.get('/', async (req, res, next) => {
    try {

        const pedidos = await prisma.pedido.findMany({
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

        const { usuarioId, status } = req.body;

        if (!usuarioId || !status) {
            return res.status(400).json({
                erro: 'Usuário e status são obrigatórios.'
            });
        }

        const usuario = await prisma.user.findUnique({
            where: {
                id: usuarioId
            }
        });

        if (!usuario) {
            return res.status(404).json({
                erro: 'Usuário não encontrado.'
            });
        }

        const pedido = await prisma.pedido.create({
            data: {
                usuarioId,
                status
            }
        });

        res.status(201).json(pedido);

    } catch (err) {
        next(err);
    }
});
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

        await prisma.pedido.delete({
            where: { id }
        });

        res.sendStatus(204);

    } catch (err) {
        next(err);
    }
});

module.exports = router
