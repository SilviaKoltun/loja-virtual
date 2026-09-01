const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')

router.get('/', async (req, res, next) => {
    try {
        const resultado = await prisma.categoria.findMany();
        res.json(resultado);
    } catch (err) {
        next(err)
    }
})
router.get('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id)

        const categoria = await prisma.categoria.findUnique({
            where: { id }
        })

        if (!categoria) {
            const erro = new Error('Categoria não encontrada')
            erro.status = 404
            throw erro
        }
        res.json(categoria)

    } catch (err) {
        next(err)
    }
})
router.post('/', async (req, res, next) => {
    try {
        const { nome } = req.body;

        if (!nome) {
            const erro = new Error('nome da categoria é obrigatórios')
            erro.status = 400
            throw erro
        }


        const novaCategoria = await prisma.categoria.create({
            data: {
                nome

            }
        })

        res.status(201).json(novaCategoria)
    } catch (err) {
        next(err)
    }
});

module.exports = router
