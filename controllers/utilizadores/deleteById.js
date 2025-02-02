import * as DbUtilizdores from '../../db/utilizador.js'

export default async (req, res) => {
    const { params } = req;

    if (!params.id)
        return res.status(500).json({ status: 'nok', erro: 'Missing utilizador id' })

    try {
        const utilizador = await DbUtilizdores.fetchUserById({ id: params.id })
        if (!utilizador.length)
            return res.status(404).json({ status: 'nok', erro: 'Utilizador doesnt exist' })

        await DbUtilizdores.deleteUserById({ id: params.id });

        return res.status(200).json({ status: 'ok' })
    } catch (e) {
        console.error(e.stack)
        return res.status(500).json({ status: 'nok', erro: e.message })
    }
}