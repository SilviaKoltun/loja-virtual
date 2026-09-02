const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')

router.get('/', async (req, res, next) => {
    try {
        const usuarioId = req.usuario?.id

        const carrinho = await prisma.carrinho.findMany({
            where: usuarioId ? { usuarioId } : undefined,
            include: {
                produto: true,
                usuario: {
                    select: {
                        id: true,
                        nome: true,
                        email: true
                    }
                }
            }
        });

        res.json(carrinho);

    } catch (err) {
        next(err);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const usuarioId = req.body.usuarioId || req.usuario?.id;
        const { produtoId, quantidade } = req.body;

        if (!usuarioId || !produtoId) {
            return res.status(400).json({
                erro: "Usuário e produto são obrigatórios."
            });
        }

        const produto = await prisma.produto.findUnique({
            where: {
                id: Number(produtoId)
            }
        });

        if (!produto) {
            return res.status(404).json({
                erro: "Produto não encontrado."
            });
        }


        // PROCURA SE O PRODUTO JÁ ESTÁ NO CARRINHO
        const existItem = await prisma.carrinho.findFirst({
            where: {
                usuarioId: Number(usuarioId),
                produtoId: Number(produtoId)
            }
        });


        // SE JÁ EXISTE, SOMA 1 NA QUANTIDADE
        if (existItem) {

            const atualizado = await prisma.carrinho.update({
                where: {
                    id: existItem.id
                },

                data: {
                    quantidade:
                        existItem.quantidade +
                        (quantidade ? Number(quantidade) : 1)
                },

                include: {
                    produto: true
                }
            });

            return res.json(atualizado);
        }


        // SE NÃO EXISTE, CRIA COM QUANTIDADE 1
        const novoItem = await prisma.carrinho.create({
            data: {
                usuarioId: Number(usuarioId),
                produtoId: Number(produtoId),
                quantidade: quantidade
                    ? Number(quantidade)
                    : 1
            },

            include: {
                produto: true
            }
        });

        res.status(201).json(novoItem);

    } catch (err) {

        console.error("Erro ao adicionar ao carrinho:", err);

        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { quantidade } = req.body;

        if (!quantidade || Number(quantidade) < 1) {
            return res.status(400).json({
                erro: "Quantidade deve ser maior que zero."
            });
        }

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
                quantidade: Number(quantidade)
            },
            include: {
                produto: true
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

        const item = await prisma.carrinho.findUnique({
            where: { id }
        });

        if (!item) {
            return res.status(404).json({
                erro: "Item não encontrado."
            });
        }

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
        const usuarioId = req.usuario?.id

        await prisma.carrinho.deleteMany({
            where: usuarioId ? { usuarioId } : undefined
        });

        res.json({
            mensagem: "Carrinho esvaziado."
        });

    } catch (err) {
        next(err);
    }
});

module.exports = router
