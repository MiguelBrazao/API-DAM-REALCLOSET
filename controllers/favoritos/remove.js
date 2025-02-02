import * as DbFavoritos from '../../db/favoritos.js';

export default async (req, res) => {
    const { id } = req.params; // Obter o favoritoId da URL
    const utilizadorId = req.user.id; // vai buscar o utilizador logado

    if (!utilizadorId || !id) {
        return res.status(400).json({ status: 'nok', erro: 'Missing user id or favorite id' });
    }

    // quero futuramente permitir que o admin também possa eliminar

    try {
        // Remover o favorito
        const rowsAffected = await DbFavoritos.removeFavorito({ utilizadorId, pecaId : id });

        if (rowsAffected === 0) {
            return res.status(404).json({ status: 'nok', erro: 'Favorite not found or does not belong to the user' });
        }

        // Responder com sucesso
        return res.status(200).json({ status: 'ok', message: 'Favorite removed successfully' });
    } catch (e) {
        console.error('Error removing favorite:', e.stack);
        return res.status(500).json({ status: 'nok', erro: e.message });
    }
};
