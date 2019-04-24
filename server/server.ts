import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { mergePatchBodyParser } from './merge-patch.parser'
import { Router } from '../common/router'
import { environment } from '../common/environment'


export class Server {

  application!: restify.Server

  initDb(): mongoose.MongooseThenable{
    (<any>mongoose).Promise = global.Promise
    return mongoose.connect(environment.db.url, {
      useMongoClient: true
    })
  }

  initRoutes(routers: Router[]) : Promise<any>{
    return new Promise((resolve, reject) => {
      try{
        this.application = restify.createServer({
          name: 'meat-api',
          version: '1.0.0'
        })

        //parseia os atributos enviados via query string em atributos isolados
        this.application.use(restify.plugins.queryParser())
        //parseia os atributos enviados via POST 
        this.application.use(restify.plugins.bodyParser())
        //bodyParser customizado que foi criado para adicionar 
        //o contentType nas requisicoes do tipo patch
        this.application.use(mergePatchBodyParser)
        
        //routes
        for(let router of routers){
          router.applyRoutes(this.application)
        }
        
        this.application.listen(environment.server.port, () => {
          resolve(this.application)
        })
      }catch(error){
        reject(error)
      }
    })
  }

  bootstrap(routers : Router[] = []): Promise<Server> {
    return this.initDb().then(()=>
    this.initRoutes(routers).then(()=> this))
  }
}