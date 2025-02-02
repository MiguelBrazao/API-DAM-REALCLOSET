import dotenv from 'dotenv/config'

import Db from './servicos/db.js'
import Express from './servicos/express.js'
import  './routes.js'

class StartUp {
    constructor() { this.init() }
    async init() {
        Express.init()
        await Db.connect()
    }
}

new StartUp()