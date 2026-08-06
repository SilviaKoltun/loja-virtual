const prisma = require('../prisma/lib/prisma')
const express = require('express')
const router = express.Router()
const argon2 = require('argon2')

// POST /auth/cadastro
router.post('/cadastro', async (req, res, next) => {
  try {
    const { nome, email, senha } = req.body

    // Validação dos campos
    const erros = validarObrigatorios(req.body, ['nome', 'email', 'senha'])
    if (email && !emailValido(email)) erros.push('email com formato inválido')
    if (senha && senha.length < 6) erros.push('senha deve ter pelo menos 6 caracteres')
    if (erros.length > 0) return res.status(400).json({ erros })

    // Verificar se email já está cadastrado
    const existe = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim()
      }
    })

    if (existe) {return res.status(409).json({ erro: 'Email já cadastrado' })
    }


    // Gerar o hash da senha (custo 10)
    const senha_hash = await argon2.hash(senha)

    // Salvar o usuário — nunca retornar o senha_hash
    const usuarioCriado = await prisma.user.create({
      data: {
        nome: nome.trim(),
        email: email.toLowerCase().trim(),
        senha_hash: senha_hash
      }
    })

    res.status(201).json({
      id: usuarioCriado.id,
      nome: usuarioCriado.nome,
      email: usuarioCriado.email
    })
  } catch (err) { next(err) }
})

module.exports = router