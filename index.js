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
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    horario: req.horario
   })  
  })

const produtos = [
  {
    id: 1,
    nome: 'Suporte para Celular 3D',
    preco: 25.90,
    categoria: 'acessorios',
    disponivel: true
  },
  {
    id: 2,
    nome: 'Organizador de Cabos 3D',
    preco: 15.50,
    categoria: 'organizadores',
    disponivel: true
  },
  {
    id: 3,
    nome: 'Vaso Decorativo 3D',
    preco: 39.90,
    categoria: 'decoração',
    disponivel: false
  }
]

// GET - Listar todos os produtos
app.get('/produtos', (req, res) => {
  const { categoria, disponivel, busca } = req.query
  let resultado = produtos
  if (categoria) {
    resultado = resultado.filter(produto => produto.categoria === categoria)
  }
  if (disponivel) {
    const valorBooleano = disponivel === 'true'
    resultado = resultado.filter(produto => produto.disponivel === valorBooleano)
  }
  if (busca) {
    resultado = resultado.filter(produto => produto.nome.toLowerCase().includes(busca.toLowerCase()))
    const termoBusca = busca.toLowerCase()
    resultado = resultado.filter(produto => produto.nome.toLowerCase().includes(termoBusca))
  }
  res.json(resultado);
})

app.get('/produtos/:id', (req, res) => {
  const id = Number(req.params.id)

  const produto = produtos.find(produto => produto.id === id)

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado' })
  }
 res.json(produto)
})
app.post('/produtos', (req, res) => {
  const { nome, categoria, preco, disponivel } = req.body;

  if (!nome || !categoria || !preco || disponivel === undefined) {
    return res.status(400).json({
      erro: 'nome, categoria, preco e disponivel são obrigatórios'
    })
  }

  const novoProduto = {
    id: produtos.length + 1,
    nome,
    preco,
    categoria,
    disponivel
  };

  produtos.push(novoProduto);

  res.status(201).json(novoProduto);
});

//PUT

app.put('/produtos/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = produtos.findIndex(produto => produto.id === id)

  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' })
  }
  const { nome, categoria, preco, disponivel } = req.body
   
  if (!nome || !categoria || !preco || disponivel === undefined) {
    return res.status(400).json({
      erro: 'nome, categoria, preco e disponivel são obrigatórios'
    })
  }
  produtos[index] = { id, nome, categoria, preco, disponivel }
  res.json(produtos[index])
})

// PATCH
app.patch('/produtos/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = produtos.findIndex(produto => produto.id === id)
  
  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' })
  }
  produtos[index] = { ...produtos[index], ...req.body, id }
  res.json(produtos[index])
})

//DELETE

app.delete('/produtos/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = produtos.findIndex(produto => produto.id === id)

  if (index === -1) {
    return res.status(404).json({ erro: 'Produto não encontrado' })
  }

  produtos.splice(index, 1)
  res.status(204).send()
})


app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})



