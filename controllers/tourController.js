const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/ApiFeatures");
const AppError = require("./../utils/AppError");
const catchAsync =  require('./../utils/catchAsync');
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


exports.aliasTopTours =  (req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
  };

exports.getAllTours = catchAsync(async (req, res, next) => {  
      // EXECUTE QUERY
      const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitedFields()
        .paginate();

      const tours = await features.query;
  
      res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
          tours
        }
      });
 
  });
  
exports.getTour = catchAsync( async (req,res,next) => {
  const id = req.params.id * 1;
//   const tour = tours.find(el => el.id === id); 

//  // if(id > tours.length){

  const tour = await Tour.findById(req.params.id);
                   //Tour.findOne({"_d: req.param.id"})
  if(!tour){
    return next(new AppError("It was nor possible to find a tour with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: tour
    }
  }); 
});

// const catchAsync = fn => {
//   return (req,res,next) => {
//     fn(req,res,next).catch(next);
//   }
// }
exports.postATour = catchAsync(async  (req, res, next) => {
  const newTour = await Tour.create(req.body)

   res.status(201).json({
     status: "success",
      data: {
        tour: newTour,
      }
    });
});

exports.updateTour = catchAsync( async (req, res, next) => {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      // Aqui é para retornar o valor atualizado. 
      new: true,
      // Validar uma entrada com DataValidars no model
      runValidators: true
    });

    if(!tour){
      return next(new AppError("It was not possible to find a tour with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
         tour,
      }
    })

});

exports.deleteTour = catchAsync(async  (req,res,next) => {

    const tour = await Tour.findByIdAndDelete(req.params.id);
    if(!tour){
      return next(new AppError("It was nor possible to find a tour with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null
    })
});

exports.getTourStats = catchAsync(async (req,res,next) => {
      const stats = await Tour.aggregate([
        {
          $match: {ratingsAverage: {$gte: 4.5}},
        },
        {
          $group: {
            _id: {$toUpper: "$difficulty"},// null significa selecionar todos os dados salvos
           // _id: "$ratingsAverage",
            numTours: {$sum: 1},
            numRatings: {$sum: '$ratingsQuantity'},
            avgRating: {$avg: "$ratingsAverage"},
            avgPrice: {$avg: "$price"},
            minPrice: {$min: "$price"},
            maxPrice: {$max: "$price"},

          },
    
        },
        {
          $sort: {avgPrice: 1},
        }
      ]);

      res.status(200).json({
        status: "success",
        data:{
          stats
        }
      })
});

exports.getMonthlyPlan = catchAsync(async (req,res) => {
    const year = req.params.year;

    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates"
      },
      {
        $match: {
          startDates:{
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          }
        }
      },
      {
        $group:{
          // What do we want to group?
          _id: {$month: "$startDates"},
          numToursStart: {$sum: 1},
          tours: {$push: "$name" }
        }
      },
      {
        $addFields: {month: "$_id"},
      },
      {
        $project: {
          _id: 0,
        }
      },
      {
        $sort: {numTours: -1},
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        plan
      }
    });
});
 