import * as DbUtilizdores from '../../db/utilizador.js'
import bcrypt from 'bcryptjs';

export default async (req, res) => {
    const { params, body } = req;

    // Verificar se o ID do utilizador foi fornecido
    if (!params.id) {
        return res.status(500).json({ status: 'nok', erro: 'Missing utilizador id' });
    }

    // Certificar que o corpo da requisição existe
    if (!body || typeof body !== 'object') {
        return res.status(400).json({ status: 'nok', erro: 'Invalid request body' });
    }

    // Campos permitidos para atualização
    const allowedFields = ['tipoDePerfil', 'email', 'password'];

    // Validar se os campos enviados são permitidos
    if (Object.keys(body).some(field => !allowedFields.includes(field))) {
        return res.status(400).json({ status: 'nok', erro: `Allowed fields are 'tipoDePerfil', 'email', 'password'` });
    }

    // Encriptar a password, se fornecida
    if (body.password) {
        body.password = await bcrypt.hash(body.password, 10);
    }

    // Atualizar o utilizador na base de dados
    try {
        await DbUtilizdores.updateUserById({ id: params.id, data: body });
        res.status(200).json({ status: 'ok', message: 'Utilizador atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar utilizador:', error);
        res.status(500).json({ status: 'nok', erro: 'Erro ao atualizar utilizador' });
    }
}