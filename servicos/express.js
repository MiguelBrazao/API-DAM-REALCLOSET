import express from 'express'
import morgan from 'morgan'

class Express {
    constructor() {
        this._app = express()
            .use(express.json())
            .use(morgan('dev'))
    }
    init() {
        this._app
            .use((req, res, next) => {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
                next();
            })
            .use((req,res,next)=>{

                console.log(req.url, req.path, '  incoming')
                next()
            })
            .listen(5000, () => {
                console.log('Listening on port 5000');
            });
    }
    get app() {
        return this._app
    }
}
const e = new Express()
export default e;