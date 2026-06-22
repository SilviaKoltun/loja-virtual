const express = require('express')
const router = express.Router()

const catgorias = [
    {id: 1, nome: 'Acessórios'},
    {id: 2, nome: 'Organizadores'},
    {id: 3, nome: 'Decoração'}
]
//GET
router.get('/', (req, res) => {
    res.json(catgorias)
})
router.get('/:id', (req, res) => {
    const id = Number(req.params.id)
    const categoria = catgorias.find(categoria => categoria.id === id)

    if (!categoria) {
        return res.status(404).json({ erro: 'Categoria não encontrada' })
    }
    res.json(categoria)
})
//POST
router.post('/', (req, res) => {
    const { nome } = req.body

    if (!nome) {
        return res.status(400).json({ erro: 'nome da categoria é obrigatório' })
    }

    const novaCategoria = {
        id: catgorias.length + 1,
        nome
    }
    catgorias.push(novaCategoria)
    res.status(201).json(novaCategoria)
})

module.exports = router