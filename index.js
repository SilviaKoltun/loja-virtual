const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000
// quando avançar no projeto, incluir o morgan para logar as requisições, encontro 06.

app.use(express.json())

app.use((req, res, next) => {
  const horario = new Date().toLocaleTimeString('pt-BR', { timeZone:'America/Sao_Paulo'})
  console.log(`[${horario}] ${req.method} ${req.path}`)  
  req.horario = horario 
  next()
})
const produtosRoutes = require('./routes/produtos')

app.use('/produtos', produtosRoutes)


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})



