const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')
const argon2 = require('argon2')

router.get('/', async (req, res, next) => {
    try {

        const usuarios = await prisma.user.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true
            }
        });

        res.json(usuarios);

    } catch (err) {
        next(err);
    }
});
router.get('/:id', async (req, res, next) => {
    try {

        const id = Number(req.params.id);

        const usuario = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                nome: true,
                email: true,
                telefone: true
            }
        });

        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        res.json(usuario);

    } catch (err) {
        next(err);
    }
});
router.put('/:id', async (req, res, next) => {
    try {

        const id = Number(req.params.id);

        const { nome, email, telefone, senha } = req.body;

        const usuario = await prisma.user.findUnique({
            where: { id }
        });

        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        const dados = {
            nome,
            email,
            telefone
        };

        if (senha) {
            dados.senha = await argon2.hash(senha);
        }

        const atualizado = await prisma.user.update({
            where: { id },
            data: dados
        });

        res.json({
            id: atualizado.id,
            nome: atualizado.nome,
            email: atualizado.email,
            telefone: atualizado.telefone
        });

    } catch (err) {
        next(err);
    }
});
router.delete('/:id', async (req, res, next) => {
    try {

        const id = Number(req.params.id);

        const usuario = await prisma.user.findUnique({
            where: { id }
        });

        if (!usuario) {
            return res.status(404).json({
                erro: "Usuário não encontrado."
            });
        }

        await prisma.user.delete({
            where: { id }
        });

        res.sendStatus(204);

    } catch (err) {
        next(err);
    }
});


//GET   /usuarios 
//GET  /usuarios /: id
//POST /usuarios
//PUT   /usuarios/:id
//DELETE  /usuarios/:id