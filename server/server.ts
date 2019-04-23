import * as restify from 'restify'
import { Router } from '../common/router'
import { environment } from '../common/environment'


export class Server {

  application!: restify.Server

  bootstrap(routers : Router[] = []): Promise<Server> {
    return this.initRoutes(routers)
      .then(() => this)
  }

  initRoutes(routers: Router[]) : Promise<any>{
    return new Promise((resolve, reject) => {
      try{
        this.application = restify.createServer({
          name: 'meat-api',
          version: '1.0.0'
        })

        this.application.use(restify.plugins.queryParser())
        
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
}