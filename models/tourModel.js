const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema({
  /* name: String,
   rating: Number,
   price:Number  */
 
   name: {
     type:String,
     required: [true, "message: a tour must have a name"],
     unique: true,
   },
   price:{
     type: Number,
     required:[true, "messsage: A tour must have a price"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tous must have a max group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
    },
    // rating:{
    //   type: Number,
    //   default: 4.5
    // },
    ratingsAverage: {
      type:Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    priceDiscount: Number,
    summary:{
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },

    description: {
      type: String,
    },
    imageCover:{
      type:String,
      required: [true, "A tour must have a image cover"]
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now()
    },
    startDates: [Date],
  })
 
 const Tour = mongoose.model('Tour', tourSchema);

 module.exports = Tour;