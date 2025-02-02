import * as DbPecas from '../../db/pecas.js'
import { convert } from '../middlewares/imageToB64.js';

export default async (req, res) => {
    const user = req.user; // Supondo que 'user' foi adicionado pelo middleware de autenticação


    //preciso de ir bucar o utilizador id, é nele que consigo ver se é admin ou não

    // Verifica se o utilizador é admin
    if (user && user.admin === true) {
        // Se for admin, retorna todas as peças
        try {
            const pecas = await DbPecas.fetchAllPecas();
            for (const peca of pecas)
                pecas.Imagem = convert(peca.Imagem)

            return res.status(200).json(pecas);
        } catch (e) {
            return res.status(500).json({ status: 'nok', erro: e.message });
        }
    } else {
        // Caso contrário, retorna as peças apenas do utilizador logado
        if (user.id) {
            try {
                const pecas = await DbPecas.fetchPecasByUserId(user.id);

                for (const peca of pecas)
                    peca.Imagem = convert(peca.Imagem)

                return res.status(200).json(pecas);
            } catch (e) {
                return res.status(500).json({ status: 'nok', erro: e.message });
            }
        } else {
            // Se o utilizador não for admin e não passar um utilizadorId, retorna erro
            return res.status(400).json({ status: 'nok', erro: 'É necessário fornecer um utilizadorId para buscar as peças.' });
        }
    }
};
