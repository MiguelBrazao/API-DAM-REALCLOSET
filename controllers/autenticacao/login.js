import * as DbUtilizadores from '../../db/utilizador.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Variável de ambiente ou chave secreta que vamos usar para assinar o token
const JWT_SECRET = process.env.JWT_SECRET || 'SdJcD}E~9geY<*n=X.?2y`';

export default async (req, res) => {
    const { email, password } = req.body;

    // Verificar se email e password foram enviados
    if (!email || !password) {
        return res.status(400).json({ status: 'nok', erro: 'Email e password são obrigatórios' });
    }

    // Procurar utilizador no banco de dados
    const users = await DbUtilizadores.fetchUserByEmail(email);
    const user = users[0]; // Vamos assumir que o email é único

    if (!user) {
        return res.status(401).json({ status: 'nok', erro: 'Credenciais inválidas' });
    }

    // Verificar a password usando bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
        return res.status(401).json({ status: 'nok', erro: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign({ id: user.UtilizadorID, email: user.Email, admin: user.Admin }, JWT_SECRET, { expiresIn: '1h' });

    // Retornar o token para o cliente
    res.status(200).json({ status: 'ok', token });
};
