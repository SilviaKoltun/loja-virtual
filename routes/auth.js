const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')
const argon2 = require('argon2')
const jwt = require("jsonwebtoken")

router.post('/register', async (req, res, next) => {
console.log(req)

    try {
        const { nome, email, telefone, senha } = req.body

        const senhaHash = await argon2.hash(senha, {
            type: argon2.argon2id,
            memoryCost: 2 ** 16,
            timeCost: 3,
            parallelism: 1
        });

        console.log(senhaHash)

        const usuarioCriado = await prisma.user.create({
            data: {
                nome,
                email,
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
        next(err)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { email, senha } = req.body

        console.log(email, senha)

        const usuarioEncontrado = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        console.log(usuarioEncontrado)

        if (!usuarioEncontrado) {
            const erro = new Error("usuario não encontrado")
            erro.status = 404
            throw erro
        }

        const senhaValida = await argon2.verify(usuarioEncontrado.senha, senha)

        console.log(senhaValida)

        if (!senhaValida) {
            const erro = new Error('Senha Invalida')
            erro.status = 401
            throw erro
        }

        console.log("bateu aq")

        const token = jwt.sign(
            { id: usuarioEncontrado.id, email: usuarioEncontrado.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        console.log(token)

        res.json({ token });
    } catch (error) {
        next(error)

    }

})

module.exports = router
