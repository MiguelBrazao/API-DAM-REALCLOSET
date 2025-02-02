import Express from '../../servicos/express.js'
import express from 'express'

import { authMiddleware } from '../middlewares/authMiddleware.js';
import multer from '../middlewares/multer.js'

import getAll from './getAll.js'
import getById from './getById.js'
import edit from './edit.js'
import deleteById from './deleteById.js'
import create from './create.js'
import getAllPublic from './getAllPublic.js'

const router = express.Router();

router
    .use('/uploads', (req, res, next) => {
        console.log('IMAGE ', req.path)
        next()

    }, express.static('uploads'))
    .get('/', authMiddleware, getAll) // req.query Utilizador
    .get('/public', getAllPublic)
    .get('/:id', authMiddleware, getById) // vai buscar a peça pelo id
    .put('/:pecaId', authMiddleware, edit)
    .post('/', authMiddleware, multer, create)
    .delete('/:pecaId', authMiddleware, deleteById);

Express.app.use('/pecas', router)