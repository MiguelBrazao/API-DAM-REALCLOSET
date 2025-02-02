import * as DbUtilizdores from '../../db/utilizador.js';

export default async (req, res) => {
    try {
        // O ID do utilizador já está no `req.user.id`
        const user = await DbUtilizdores.fetchUserById({ id: req.user.id });

        if (!user.length) {
            return res.status(404).json({ error: 'Utilizador não encontrado' });
        }

        // Retorna o utilizador logado
        res.status(200).json(user[0]);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar utilizador logado' });
    }
}
