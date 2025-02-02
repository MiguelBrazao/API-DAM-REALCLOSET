import * as DbLooks from '../../db/looks.js';

export default async (req, res) => {
    const { lookId } = req.params;

    try {

        // futuramente fazer validações
        // req.user -> user.id -> fetchLookId - validar user id com o user id na req.user

        // Busca o look com as peças associadas
        const look = await DbLooks.fetchLookById(lookId)

        if (!look)
            return res.status(404).json({ message: 'Look não encontrado' });

        // Se o look for encontrado, retornamos ele
        res.status(200).json(look);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar o look' });
    }
};
