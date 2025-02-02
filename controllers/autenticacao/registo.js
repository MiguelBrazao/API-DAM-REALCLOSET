import * as DbUtilizadores from '../../db/utilizador.js';
import bcrypt from 'bcryptjs';

export default async (req, res) => {
    const { nome, apelido, email, password, tipoDePerfil, dataNascimento } = req.body;

    // Verificar se todos os dados necessários foram fornecidos
    if (!nome || !apelido || !email || !password || !tipoDePerfil || !dataNascimento) {
        return res.status(400).json({ status: 'nok', erro: 'Todos os campos são obrigatórios' });
    }

    // Verificar se o email já existe no banco de dados
    const existingUser = await DbUtilizadores.fetchUserByEmail(email);
    if (existingUser.length > 0) {
        return res.status(400).json({ status: 'nok', erro: 'Email já registrado' });
    }

    // Criptografar a password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o novo utilizador no banco de dados, definindo Admin como false
    const newUser = {
        nome,
        apelido,
        email,
        password: hashedPassword,
        tipoDePerfil,
        dataNascimento,
        admin: false  // Adicionando o campo Admin como false
    };

    // Chamar o método para criar o utilizador no banco de dados
    const result = await DbUtilizadores.createUser({ data: newUser });

    // Retornar uma resposta de sucesso
    res.status(201).json({ status: 'ok', message: 'Utilizador criado com sucesso' });
};
