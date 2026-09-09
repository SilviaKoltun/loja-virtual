const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')


router.get('/', async (req, res, next) => {
    try {
        const categorias = await prisma.categoria.findMany()

        res.json(categorias)

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

        const categoria = await prisma.categoria.findUnique({
            where: { id }
        })

        if (!categoria) {
            return res.status(404).json({
                erro: 'Categoria não encontrada.'
            })
        }

        res.json(categoria)

    } catch (err) {
        next(err)
    }
})


router.post('/', async (req, res, next) => {
    try {
        const { nome } = req.body

        if (!nome || !nome.trim()) {
            return res.status(400).json({
                erro: 'Nome da categoria é obrigatório.'
            })
        }

        const novaCategoria = await prisma.categoria.create({
            data: {
                nome: nome.trim()
            }
        })

        res.status(201).json(novaCategoria)

    } catch (err) {
        next(err)
    }
})


router.put('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id)
        const { nome } = req.body

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: 'ID inválido.'
            })
        }

        if (!nome || !nome.trim()) {
            return res.status(400).json({
                erro: 'Nome da categoria é obrigatório.'
            })
        }

        const categoria = await prisma.categoria.findUnique({
            where: { id }
        })

        if (!categoria) {
            return res.status(404).json({
                erro: 'Categoria não encontrada.'
            })
        }

        const atualizada = await prisma.categoria.update({
            where: { id },
            data: {
                nome: nome.trim()
            }
        })

        res.json(atualizada)

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

        const categoria = await prisma.categoria.findUnique({
            where: { id }
        })

        if (!categoria) {
            return res.status(404).json({
                erro: 'Categoria não encontrada.'
            })
        }

        await prisma.categoria.delete({
            where: { id }
        })

        res.sendStatus(204)

    } catch (err) {
        next(err)
    }
})


module.exports = router