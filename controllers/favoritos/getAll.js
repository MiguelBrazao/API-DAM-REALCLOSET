import * as DbFavoritos from '../../db/favoritos.js';
import { convert } from '../middlewares/imageToB64.js';

export default async (req, res) => {
    const utilizadorId = req.user.id; // Obter utilizadorId da URL

    if (!utilizadorId) {
        return res.status(400).json({ status: 'nok', erro: 'Missing utilizadorId' });
    }

    try {
        // Buscar os favoritos do utilizador
        const favoritos = await DbFavoritos.fetchFavoritos(utilizadorId);

        if (favoritos.length === 0) {
            return res.status(404).json({ status: 'nok', erro: 'No favorites found for this user' });
        }

        for (const peca of favoritos)
            peca.Imagem = convert(peca.Imagem)
        

        // Responder com a lista de favoritos
        return res.status(200).json(favoritos);
    } catch (e) {
        console.error('Error fetching favorites:', e.stack);
        return res.status(500).json({ status: 'nok', erro: e.message });
    }
};
