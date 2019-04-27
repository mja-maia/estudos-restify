import { ModelRouter } from "../common/model-router";
import * as restify from 'restify'
import { Restaurant } from "./restaurants.model";
import { NotFoundError } from "restify-errors";

class RestaurantsRouter extends ModelRouter<Restaurant> {
  constructor(){
    super(Restaurant)
  }

  findMenu = (req:restify.Request, resp: restify.Response, next: restify.Next) => {
    Restaurant.findById(req.params.id, "+menu")
      .then(restaurant => {
        if(!restaurant){
          next(new NotFoundError('Restaurant not found'))
        }else{
          resp.json(restaurant.menu)
          return next()
        }
      }).catch(next)
  }

  replaceMenu = (req:restify.Request, resp: restify.Response, next: restify.Next) => {
    Restaurant.findById(req.params.id)
      .then(restaurant => {
        if(!restaurant){
          next(new NotFoundError('Restaurant not found'))
        }else{
          restaurant.menu = req.body
          return restaurant.save()
        }
      }).then(restaurant => {
        resp.json(restaurant.menu)
        next()
      })
      .catch(next)
  }

  applyRoutes(application : restify.Server){

    application.get('/restaurants',this.findAll)

    application.get('/restaurants/:id', [this.validadeId, this.findById])

    application.post('/restaurants', this.save)

    application.put('/restaurants/:id', [this.validadeId, this.replace])
    
    application.patch('/restaurants/:id', [this.validadeId, this.update])

    application.del('/restaurants/:id', [this.validadeId, this.delete])

    application.get('/restaurants/:id/menu', [this.validadeId, this.findMenu])
    application.put('/restaurants/:id/menu', [this.validadeId, this.replaceMenu])
  }
}

export const restaurantsRouter = new RestaurantsRouter()