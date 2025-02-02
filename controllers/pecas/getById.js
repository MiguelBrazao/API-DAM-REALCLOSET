import * as DbPecas from '../../db/pecas.js';
import { convert } from '../middlewares/imageToB64.js';

export default async (req, res) => {
    const { params } = req;

    // Verificar se o ID foi enviado nos parâmetros
    if (!params.id) {
        return res.status(400).json({ error: 'Id is a mandatory param key value' });
    }

    try {
        // Buscar as peças do utilizador com o ID fornecido
        const pecas = await DbPecas.fetchPecaById({ id: params.id });


        // Verificar se foram encontradas peças
        if (!pecas.length) {
            return res.status(404).json({ message: 'Nenhuma peça encontrada' });
        }
        for (const peca of pecas)
            peca.Imagem = convert(peca.Imagem)

        // Responder com as peças encontradas
        res.status(200).json(pecas);
    } catch (error) {
        console.error('Error fetching pieces:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
