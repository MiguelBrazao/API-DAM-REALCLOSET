import * as DbFavoritos from '../../db/favoritos.js';

export default async (req, res) => {
    const { id } = req.params;
    const utilizadorId = req.user.id;

    // Verificar se os parâmetros foram fornecidos
    if (!utilizadorId || !id) {
        return res.status(400).json({ status: 'nok', erro: 'Missing utilizadorId or pecaId' });
    }

    try {
        // Chamar a função para adicionar o favorito
        const result = await DbFavoritos.addFavorito({ utilizadorId, pecaId: id });

        if (result === 0) {
            return res.status(500).json({ status: 'nok', erro: 'Failed to add piece to favorites' });
        }

        return res.status(200).json({ status: 'ok', message: 'Peça added to favorites' });
    } catch (e) {
        console.error('Error adding favorite:', e.stack);
        return res.status(500).json({ status: 'nok', erro: e.message });
    }
};
