const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')
const { post } = require('./produtos')


//GET /carrinho
//POST /carrinho
//PUT /carrinho /:id
//DELETE /carrinho /: id
//DELETE /carrinho
router.get('/', async (req, res, next) => {
    try {
        const carrinho = await prisma.carrinho.findMany({
            include: {
                produto: true,
                usuario: true
            }
        });

        res.json(carrinho);

    } catch (err) {
        next(err);
    }
});
router.post('/', async (req, res, next) => {
    try {

        const { usuarioId, produtoId, quantidade } = req.body;

        if (!usuarioId || !produtoId) {
            return res.status(400).json({
                erro: "Usuário e produto são obrigatórios."
            });
        }

        const novoItem = await prisma.carrinho.create({
            data: {
                usuarioId,
                produtoId,
                quantidade: quantidade || 1
            }
        });

        res.status(201).json(novoItem);

    } catch (err) {
        next(err);
    }
});
router.put('/:id', async (req, res, next) => {
    try {

        const id = Number(req.params.id);
        const { quantidade } = req.body;

        const item = await prisma.carrinho.findUnique({
            where: { id }
        });

        if (!item) {
            return res.status(404).json({
                erro: "Item não encontrado."
            });
        }

        const atualizado = await prisma.carrinho.update({
            where: { id },
            data: {
                quantidade
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

        await prisma.carrinho.delete({
            where: { id }
        });

        res.sendStatus(204);

    } catch (err) {
        next(err);
    }
});
router.delete('/', async (req, res, next) => {
    try {

        await prisma.carrinho.deleteMany();

        res.json({
            mensagem: "Carrinho esvaziado."
        });

    } catch (err) {
        next(err);
    }
});