const express = require('express')
const router = express.Router()

const catgorias = [
    {id: 1, nome: 'Acessórios'},
    {id: 2, nome: 'Organizadores'},
    {id: 3, nome: 'Decoração'}
]
//GET
router.get('/', (req, res, next) => {
    try {
        res.json(catgorias)
    } catch (err) {
        next(err)
    }
})
router.get('/:id', (req, res, next) => {
    try {
    const id = Number(req.params.id)
    const categoria = catgorias.find(categoria => categoria.id === id)

    if (!categoria) {
        const erro = new Error('Categoria não encontrada')
        erro.status = 404
        throw erro
    }
    res.json(categoria)
} catch (err) {
    next(err)
}
})
//POST
router.post('/', (req, res, next) => {
    try {
    const { nome } = req.body

    if (!nome) {
        const erro = new Error('nome da categoria é obrigatório')
        erro.status = 400
        throw erro
    }

    const novaCategoria = {
        id: catgorias.length + 1,
        nome
    }
    catgorias.push(novaCategoria)
    res.status(201).json(novaCategoria)
} catch (err) {
    next(err)
}   
})

module.exports = router