const express = require('express');
const router = express.Router();
const prisma = require('../prisma/lib/prisma');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res, next) => {
    try {

        const { email, senha } = req.body;

        
        if (!email || !senha) {
            return res.status(400).json({
                erro: 'E-mail e senha são obrigatórios.'
            });
        }

   
        const usuario = await prisma.user.findUnique({
            where: {
                email: email.toLowerCase().trim()
            }
        });

        if (!usuario) {
            return res.status(404).json({
                erro: 'Usuário não encontrado.'
            });
        }

        const senhaValida = await argon2.verify(
            usuario.senha,
            senha
        );

        if (!senhaValida) {
            return res.status(401).json({
                erro: 'Senha inválida.'
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        res.status(200).json({
            mensagem: 'Login realizado com sucesso.',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone
            }
        });

    } catch (err) {
        next(err);
    }
});

module.exports = router;