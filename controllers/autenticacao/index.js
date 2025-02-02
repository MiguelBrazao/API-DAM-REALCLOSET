import Express from '../../servicos/express.js';
import express from 'express';

import login from './login.js';
import registo from './registo.js';
import { logout } from './logout.js';

const router = express.Router();


router
    .post('/login', login)   // Rota para login
    .post('/registo', registo)  // Rota para registo
    .post('/logout', logout);

Express.app.use('/autenticacao', router);  // Usamos /autenticacao para as rotas de autenticação

