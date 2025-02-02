import Express from '../../servicos/express.js'
import express from 'express'

import { authMiddleware } from '../middlewares/authMiddleware.js';


import getAll from './getAll.js'
import getById from './getById.js'
import edit from './edit.js'
import deleteById from './deleteById.js'
import create from './create.js'
import getLoggedUser from './getLoggedUser.js';

const router = express.Router();
router
    .get('/', authMiddleware, getAll)
    .get('/me', authMiddleware, getLoggedUser)
    .get('/:id', authMiddleware, getById)
    .put('/:id', authMiddleware, edit)
    .post('/', authMiddleware, create)
    .delete('/:id', authMiddleware, deleteById)

Express.app.use('/utilizador', router)