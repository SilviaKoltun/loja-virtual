const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')

router.get('/', async (req, res, next) => {
    try {

        const pagamentos = await prisma.pagamento.findMany({
            include: {
                pedido: true
            }
        });

        res.json(pagamentos);

    } catch (err) {
        next(err);
    }
});
router.get('/:id', async (req, res, next) => {
    try {

        const id = Number(req.params.id);

        const pagamento = await prisma.pagamento.findUnique({
            where: { id },
            include: {
                pedido: true
            }
        });

        if (!pagamento) {
            return res.status(404).json({
                erro: "Pagamento não encontrado."
            });
        }

        res.json(pagamento);

    } catch (err) {
        next(err);
    }
});
router.post('/', async (req, res, next) => {
    try {

        const { formaPagamento, status, pedidoId } = req.body;

        if (!formaPagamento || !status || !pedidoId) {
            return res.status(400).json({
                erro: "Todos os campos são obrigatórios."
            });
        }

        const pedido = await prisma.pedido.findUnique({
            where: {
                id: pedidoId
            }
        });

        if (!pedido) {
            return res.status(404).json({
                erro: "Pedido não encontrado."
            });
        }

        const pagamento = await prisma.pagamento.create({
            data: {
                formaPagamento,
                status,
                pedidoId
            }
        });

        res.status(201).json(pagamento);

    } catch (err) {
        next(err);
    }
});
router.put('/:id', async (req, res, next) => {
    try {

        const id = Number(req.params.id);

        const { formaPagamento, status } = req.body;

        const pagamento = await prisma.pagamento.findUnique({
            where: { id }
        });

        if (!pagamento) {
            return res.status(404).json({
                erro: "Pagamento não encontrado."
            });
        }

        const atualizado = await prisma.pagamento.update({
            where: { id },
            data: {
                formaPagamento,
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

        const pagamento = await prisma.pagamento.findUnique({
            where: { id }
        });

        if (!pagamento) {
            return res.status(404).json({
                erro: "Pagamento não encontrado."
            });
        }

        await prisma.pagamento.delete({
            where: { id }
        });

        res.sendStatus(204);

    } catch (err) {
        next(err);
    }
});
module.exports = router