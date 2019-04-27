import * as restify from 'restify'
// import { Router } from '../common/router'
import { ModelRouter } from '../common/model-router'
import { User } from './users.model'

class UsersRouter extends ModelRouter<User> {

  constructor(){
    super(User)
    this.on('beforeRender', document => {
      document.password = undefined
    })
  }

  applyRoutes(application : restify.Server){

    application.get(`${this.basePath}`,this.findAll)

    application.get(`${this.basePath}/:id`, [this.validadeId, this.findById])

    application.post(`${this.basePath}`, this.save)

    application.put(`${this.basePath}/:id`, [this.validadeId, this.replace])
    
    application.patch(`${this.basePath}/:id`, [this.validadeId, this.update])

    application.del(`${this.basePath}/:id`, [this.validadeId, this.delete])
  }
}

export const usersRouter = new UsersRouter()