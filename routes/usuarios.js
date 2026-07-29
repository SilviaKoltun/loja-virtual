const express = require('express')
const router = express.Router()
const prisma = require('../prisma/lib/prisma')


//GET   /usuarios 
//GET  /usuarios /: id
//POST /usuarios
//PUT   /usuarios/:id
//DELETE  /usuarios/:id