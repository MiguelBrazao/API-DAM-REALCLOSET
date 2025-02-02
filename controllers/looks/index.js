import Express from '../../servicos/express.js'
import express from 'express'

import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();


import getAll from './getAll.js'
import getById from './getById.js'
import edit from './edit.js'
import deleteById from './deleteById.js'
import create from './create.js'

router
    .get('/', authMiddleware, getAll)
    .get('/:lookId', authMiddleware,getById) // Vai buscar um look específico
    .put('/:id', authMiddleware, edit)
    .post('/', authMiddleware, create) // depois é suposto substituir para o middleware!!!
    .delete('/:id', authMiddleware, deleteById)

Express.app.use('/looks', router)