require('dotenv').config() //primeira linha

const express = require('express')
const helmet = require('helmet')
const app = express()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const PORT = process.env.PORT || 3000

// quando avançar no projeto, incluir o morgan para logar as requisições, encontro 06.

app.use(helmet())
app.use(express.json())

app.use((req, res, next) => {
  const horario = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  console.log(`[${horario}] ${req.method} ${req.path}`)
  req.horario = horario
  next()
})
const produtosRoutes = require('./routes/produtos')
const categoriasRoutes = require('./routes/categorias')
const pagamentosRoutes = require('./routes/pagamentos')
const pedidosRoutes = require('./routes/pedido')
const usuariosRoutes = require('./routes/usuarios')
const carrinhoRoutes = require('./routes/carrinho')
const authRoutes = require('./routes/auth')

app.use(cors())

app.use('/auth', authRoutes)

app.get('/', (req, res) => {
  res.json({ projeto: 'Loja de produtos 3D', status: 'online' })
})

app.use((req, res, next) => {
  const token = req.headers['authorization']
    ?.replace('Bearer ', '')

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ erro: 'Token expirado' });
      }
      return res.status(403).json({ erro: 'Token inválido' });
    }

    req.usuario = decoded; // dados do usuário disponíveis nas próximas rotas
    next();
  });
})

app.use('/produtos', produtosRoutes)
app.use('/categorias', categoriasRoutes)
app.use('/pagamentos', pagamentosRoutes)
app.use('/pedidos', pedidosRoutes)
app.use('/usuarios', usuariosRoutes)
app.use('/carrinho', carrinhoRoutes)

// Middleware global de erros — deve ter 4 parâmetros exatamente
app.use((err, req, res, next) => {
  // Registra o erro no terminal para diagnóstico
  console.error(`[ERRO] ${err.message}`)

  // Usa o status do erro se definido, ou 500 como padrão
  const status = err.status || 500
  const mensagem = err.message || 'Erro interno do servidor'

  res.status(status).json({ erro: mensagem })
})

app.get('/saude', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(), // segundos rodando
    timestamp: new Date().toISOString()
  })
})

app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    const horario = new Date().toLocaleTimeString('pt-BR')
    console.log(`[${horario}] ${req.method} ${req.path}`)
  }
  next() // chamado sempre, com ou sem log
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})



