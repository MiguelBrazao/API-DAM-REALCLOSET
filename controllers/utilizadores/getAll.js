import * as DbUtilizdores from '../../db/utilizador.js'

export default async (req, res) => {

    const users = await DbUtilizdores.fetchUsers()

    res. status(200).json(users)
}