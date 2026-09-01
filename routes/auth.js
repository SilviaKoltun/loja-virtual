const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')
const argon2 = require('argon2')
const jwt = require("jsonwebtoken")

router.post('/register', async (req, res, next) => {
    try {
        const { nome, email, telefone, senha } = req.body

        if (!nome || !email || !telefone || !senha) {
            const erro = new Error('nome, email, telefone e senha são obrigatórios')
            erro.status = 400
            throw erro
        }

        const senhaHash = await argon2.hash(senha, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1
        })

        const usuarioCriado = await prisma.user.create({
            data: {
                nome,
                email: email.toLowerCase().trim(),
                telefone,
                senha: senhaHash
            }
        })

        res.status(201).json({
            id: usuarioCriado.id,
            nome: usuarioCriado.nome,
            email: usuarioCriado.email,
            telefone: usuarioCriado.telefone
        })
    } catch (err) {
        if (err.code === 'P2002') {
            err.message = 'E-mail já cadastrado'
            err.status = 409
        }

        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { email, senha } = req.body

        if (!email || !senha) {
            const erro = new Error('E-mail e senha são obrigatórios')
            erro.status = 400
            throw erro
        }

        const usuarioEncontrado = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase().trim()
            }
        })

        if (!usuarioEncontrado) {
            const erro = new Error("Usuário não encontrado")
            erro.status = 404
            throw erro
        }

        const senhaValida = await argon2.verify(usuarioEncontrado.senha, senha)

        if (!senhaValida) {
            const erro = new Error('Senha inválida')
            erro.status = 401
            throw erro
        }

        const token = jwt.sign(
            { id: usuarioEncontrado.id, email: usuarioEncontrado.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        )

        res.json({
            token,
            usuario: {
                id: usuarioEncontrado.id,
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email,
                telefone: usuarioEncontrado.telefone
            }
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router
