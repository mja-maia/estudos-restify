import { Router } from "./router";
import * as mongoose from 'mongoose'
import * as restify from 'restify'
import { NotFoundError } from "restify-errors";

export abstract class ModelRouter<D extends mongoose.Document> extends Router {
  
  basePath: string
  
  constructor(protected model: mongoose.Model<D>){
    super()
    this.basePath = `/${model.collection.name}`
  }

  protected prepareOne(query: mongoose.DocumentQuery<D, D>): mongoose.DocumentQuery<D,D>{
    return query
  }

  envelope(document: any):any {
    let resource = Object.assign({_links: {}}, document.toJSON())
    resource._links.self = `${this.basePath}/${document._id}`
    return resource
  }

  //valida se é um id invalido, caso seja retorna 404 e não um 500 como retornava antes
  validadeId = (req:restify.Request, resp: restify.Response, next) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
      next(new NotFoundError('Document not found'))
    }else{
      next()
    }
  }

  findAll = (req:restify.Request, resp: restify.Response, next) => {
    this.model.find()
        .then(this.renderAll(resp, next))
        .catch(next)
  }

  findById = (req:restify.Request, resp: restify.Response, next) => {
    this.prepareOne(this.model.findById(req.params.id))
      .then(this.render(resp, next))
      .catch(next)
  }

  save = (req:restify.Request, resp: restify.Response, next) => {
    let document = new this.model(req.body)
    document.save()
      .then(this.render(resp, next))
      .catch(next)
  }

  replace = (req:restify.Request, resp: restify.Response, next) => {
    const options = { 
      overwrite: true,
      runValidators: true
    }
    this.model.update({_id: req.params.id}, req.body, options)
    .exec().then(result => {
      if(result.n){
        return this.model.findById(req.params.id).exec()
      }else{
        throw new NotFoundError('Documento não encontrado')
      }
    }).then(this.render(resp, next))
    .catch(next)
  }

  update = (req:restify.Request, resp: restify.Response, next) => {
    const options = { 
      new: true,
      runValidators: true
    }
    this.model.findByIdAndUpdate(req.params.id, req.body, options)
      .then(this.render(resp, next))
      .catch(next)
  }

  delete = (req:restify.Request, resp: restify.Response, next) => {
    this.model.remove({_id: req.params.id}).exec()
      .then(({result}:any) => {
        if(result.n){
          resp.send(204)
        }else{
          throw new NotFoundError('Documento não encontrado')
        }
        return next()
      })
      .catch(next)
  }
}