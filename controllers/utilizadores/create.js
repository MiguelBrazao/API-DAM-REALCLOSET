import * as DbUtilizdores from '../../db/utilizador.js'

export default async (req, res) => {

    // cookies -> req.cookies, query -> req.query, params, req.params, hash -> req.hash
    // req.body
    // localhost:5000/utilizadores/:id?xx=aaa#asdasd

    const { body } = req;
    // validator body para evitar errors a escrever na base de dados e ter que mandar um erro da base de dados de volta para o browser
    try {
        body.dataNascimento = new Date()
        await DbUtilizdores.createUser({ data: body })
        res.status(200).json({ status: 'ok', })
    } catch (e) {
        console.error(e.stack )
        res.status(500).json({ status: 'nok', erro: e.message })
    }

}