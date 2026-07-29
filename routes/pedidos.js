const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')

const pedidos = []

//GET /pedidos
//GET /pedidos/:id 
//POST /pedidos
//PUT /pedidos /:id
//DELETE /pediidos /:id