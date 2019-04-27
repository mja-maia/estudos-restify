import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { ModelRouter } from "../common/model-router";
import { Review } from "./reviews.model";

class ReviewsRouter extends ModelRouter<Review> {
  constructor() {
    super(Review)
  };

  prepareOne(query: mongoose.DocumentQuery<Review, Review>): mongoose.DocumentQuery<Review,Review>{
    return query.populate('restaurant', 'name').populate('user','name')
  }

  applyRoutes(application : restify.Server){

    application.get('/reviews',this.findAll)

    application.get('/reviews/:id', [this.validadeId, this.findById])

    application.post('/reviews', this.save)
  }
  
}

export const reviewsRouter = new ReviewsRouter()