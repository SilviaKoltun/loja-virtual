const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

  
app.get('/',(req, res) =>{
  res.json({
    projeto: 'Loja Virtual',
      descricao: 'Site para vendas de produtos pela internet',
      status: 'online'
    })
})

app.get('/produtos', (req, res) => {
  res.json([
    { id: 1, nome: 'Notebook Gamer', preco: 4500.00, categoria: 'Informática' },
    { id: 2, nome: 'Cadeira Ergonômica', preco: 1200.00, categoria: 'Móveis' },
    { id: 3, nome: 'Mouse sem fio', preco: 150.00, categoria: 'Acessórios' }
  ])
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})



