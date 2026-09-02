require('dotenv').config() //primeira linha

const express = require('express')
const helmet = require('helmet')
const app = express()
const cors = require("cors")
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const jwt = require("jsonwebtoken")
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '127.0.0.1'

app.use(helmet())
app.use(express.json())
app.use(cors())

app.post('/upload', upload.single('arquivo'), (req, res) => {
  const {nome, descricao} = req.body
  res.json({nome, descricao, arquivo: req.file})
})

app.use((req, res, next) => {
  const horario = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo' })
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[${horario}] ${req.method} ${req.path}`)
  }
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

app.use('/auth', authRoutes)

app.get('/', (req, res) => {
  res.json({ projeto: 'Loja de produtos 3D', status: 'online' })
})

app.get('/saude', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})

app.use((req, res, next) => {
  const token = req.headers['authorization']
    ?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ erro: 'Token não informado' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ erro: 'Token expirado' })
      }
      return res.status(403).json({ erro: 'Token inválido' })
    }

    req.usuario = decoded
    next()
  })
})

app.use('/produtos', produtosRoutes)
app.use('/categorias', categoriasRoutes)
app.use('/pagamentos', pagamentosRoutes)
app.use('/pedidos', pedidosRoutes)
app.use('/usuarios', usuariosRoutes)
app.use('/carrinho', carrinhoRoutes)

// Middleware global de erros — deve ter 4 parâmetros exatamente
app.use((err, req, res, next) => {
  console.error(`[ERRO] ${err.message}`)

  const status = err.status || 500
  const mensagem = err.message || 'Erro interno do servidor'

  res.status(status).json({ erro: mensagem })
})

app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`)
})
