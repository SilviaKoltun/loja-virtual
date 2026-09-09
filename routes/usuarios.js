const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')
const argon2 = require('argon2')


router.get('/', async (req, res, next) => {
    try {

        const usuarioId = req.usuario.id

        const usuario = await prisma.user.findUnique({
            where: {
                id: usuarioId
            },
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true
            }
        })

        if (!usuario) {
            return res.status(404).json({
                erro: 'Usuário não encontrado.'
            })
        }

        res.json(usuario)

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

        if (id !== req.usuario.id) {
            return res.status(403).json({
                erro: 'Você não tem permissão para acessar este usuário.'
            })
        }

        const usuario = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true
            }
        })

        if (!usuario) {
            return res.status(404).json({
                erro: 'Usuário não encontrado.'
            })
        }

        res.json(usuario)

    } catch (err) {
        next(err)
    }
})


router.put('/:id', async (req, res, next) => {
    try {

        const id = Number(req.params.id)

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                erro: 'ID inválido.'
            })
        }

        if (id !== req.usuario.id) {
            return res.status(403).json({
                erro: 'Você não tem permissão para alterar este usuário.'
            })
        }

        const { nome, email, telefone, senha } = req.body

        const usuario = await prisma.user.findUnique({
            where: { id }
        })

        if (!usuario) {
            return res.status(404).json({
                erro: 'Usuário não encontrado.'
            })
        }

        const dados = {}

        if (nome) {
            dados.nome = nome.trim()
        }

        if (email) {
            dados.email = email.toLowerCase().trim()
        }

        if (telefone) {
            dados.telefone = telefone.trim()
        }

        if (senha) {
            dados.senha = await argon2.hash(senha)
        }

        const atualizado = await prisma.user.update({
            where: { id },
            data: dados
        })

        res.json({
            id: atualizado.id,
            nome: atualizado.nome,
            email: atualizado.email,
            telefone: atualizado.telefone
        })

    } catch (err) {

        if (err.code === 'P2002') {
            err.message = 'E-mail já cadastrado.'
            err.status = 409
        }

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

        if (id !== req.usuario.id) {
            return res.status(403).json({
                erro: 'Você não tem permissão para excluir este usuário.'
            })
        }

        const usuario = await prisma.user.findUnique({
            where: { id }
        })

        if (!usuario) {
            return res.status(404).json({
                erro: 'Usuário não encontrado.'
            })
        }

        await prisma.user.delete({
            where: { id }
        })

        res.sendStatus(204)

    } catch (err) {
        next(err)
    }
})


module.exports = router