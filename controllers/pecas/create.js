import * as DbPecas from '../../db/pecas.js'

export default async (req, res) => {
    const utilizadorId = req.user.id; // vai buscar o utilizador logado
    
    // validator body para evitar errors a escrever na base de dados e ter que mandar um erro da base de dados de volta para o browser
    try {
        const peca = JSON.parse(req.body.peca)
        peca.Imagem = req.imageName;
        await DbPecas.createPeca({ data: peca, utilizadorId})
        res.status(200).json({ status: 'ok', })
    } catch (e) {
        console.error(e.stack )
        res.status(500).json({ status: 'nok', erro: e.message })
    }

}