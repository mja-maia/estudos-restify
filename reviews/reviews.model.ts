import * as mongoose from 'mongoose'
import { User } from '../users/users.model'
import { Restaurant } from "../restaurants/restaurants.model";

export interface Review extends mongoose.Document {
  date: Date,
  rating: number,
  comment: string,
  restaurant: mongoose.Types.ObjectId | User,
  user: mongoose.Types.ObjectId | Restaurant,
}

const reviewSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Restaurant' //isso indica qual é o model que ira ser feito a referencia
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' //isso indica qual é o model que ira ser feito a referencia
  },

})

export const Review = mongoose.model<Review>('Review', reviewSchema)