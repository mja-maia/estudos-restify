import * as restify from 'restify'
import { EventEmitter } from 'events';

export abstract class Router extends EventEmitter{
  abstract applyRoutes(application : restify.Server) : any

  render(resp: restify.Response, next: restify.Next){
    return document => {
      if(document){
        this.emit('beforeRender', document)
        resp.json(document)
      }else{
        resp.send(404)
      }
      return next()
    }
  }
}