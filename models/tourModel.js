const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema({
  /* name: String,
   rating: Number,
   price:Number  */
 
   name: {
     type:String,
     required: [true, "message: a tour must have a name"],
     unique: true,
   },
   slug: String,
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

    secretTour: {
      type: Boolean,
      default: false
    },
  },
  {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
  })
 
tourSchema.virtual("durationWeeks").get(function() {
  return this.duration / 7;
});


// DOCUMENT MIDDLEWARE
tourSchema.pre('save', function(next){
    this.slug = slugify(this.name, {lower: true});
    next();
 });


// QUERY MIDDLEWARE
//  /^find/ seleciona todos que inicia com find
tourSchema.pre(/^find/, function(next){
  this.find({secretTour: {$ne: true}});
  this.start =  Date.now()
  next();
});

tourSchema.post(/^find/, function(docs, next){
  console.log("The query took ", Date.now() - this.start, " millseconds");
  console.log(docs);
  next();
})

// AGREGATION MIDLEWARE

tourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({$match: {secretTour: {$ne: true}}});

    next();
})
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;