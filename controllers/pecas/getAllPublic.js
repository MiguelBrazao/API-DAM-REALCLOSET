import * as DbPecas from '../../db/pecas.js'
import { convert } from '../middlewares/imageToB64.js';

export default async (req, res) => {

    const pecas = await DbPecas.fetchPublicPecas()
    for (const peca of pecas)
        peca.Imagem = convert(peca.Imagem)

    res.status(200).json(pecas)
}

