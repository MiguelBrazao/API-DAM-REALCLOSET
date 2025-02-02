import * as DbUtilizdores from '../../db/utilizador.js'

export default async (req, res) => {
    const { params } = req

    if (!params.id)
        return res.status(500).json({ error: 'Id is a mandatory param key value' })

    const user = await DbUtilizdores.fetchUserById({ id: params.id })
    if (!user.length)
        return res.status(404).json({ status: 'nok', erro: 'utilizador not found' })

    res.status(200).json(...user)
}