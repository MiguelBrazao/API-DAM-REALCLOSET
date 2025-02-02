import Express from '../../servicos/express.js'
import express from 'express'
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

import getAll from './getAll.js'
import adiciona from './adiciona.js'
import remove from './remove.js'

router
    .get('/', authMiddleware, getAll) //falta passar o middleware para ir buscar os favoritos da pessoa logada!
    .post('/:id', authMiddleware, adiciona)
    .delete('/:id',authMiddleware, remove) //falta passar o middleware para apagar os favoritos da pessoa logada!
    
Express.app.use('/favoritos', router)