const Tour = require("./../models/tourModel");
const APIFeatures = require("./../utils/ApiFeatures")
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));
/*
exports.checkID= (req,res,next, val) => {
  console.log(`The tour id is ${val}`)
  if(req.params.id * 1 > tours.length){
    return res.status(404).json({
      status: "Fail",
      message: "Invalid id"
    })
  }
  next();
}  */

  /*
exports.checkBody =  (req,res,next) => {
  console.log("checkbody");
  console.log(req.body.name);
  console.log(req.body.price);
  if(!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "error",
      message: "No name or price",
    })
  }
  next();
}  */

exports.aliasTopTours =  (req,res,next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
  };

exports.getAllTours = async (req, res) => {
    try {
      // // QUERY
      // // 1A FILTERING
      // const queryObj = { ...req.query };
      // const excludedFields = ['page', 'limit', 'sort', 'fields'];
      // excludedFields.forEach(el => delete queryObj[el]);
  
      // // 1B ADVANCED FILTERING
      // let queryStr = JSON.stringify(queryObj);
      // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  
      // let query = Tour.find(JSON.parse(queryStr));
  
      // // 2) SORTING
      // if (req.query.sort) {
      //   const sortBy = req.query.sort.split(',').join(' ');
      //   query = query.sort(sortBy);
      // } else {
      //   query = query.sort('-createdAt');
      // }
  
      // // 3) FIELD LIMITING
      // if (req.query.fields) {
      //   const fields = req.query.fields.split(',').join(' ');
      //   query = query.select(fields);
      // } else {
      //   query = query.select('-__v');
      // }
  
      // // 4) PAGINATION
      // const page = req.query.page * 1 || 1; // Default to page 1 if not provided
      // const limit = req.query.limit * 1 || 100; // Default to 100 documents per page
      // const skip = (page - 1) * limit; // Calculate skip value
  
      // // Check if skip exceeds number of documents
      // const numTours = await Tour.countDocuments();
      // if (skip >= numTours) {
      //   return res.status(404).json({
      //     status: 'fail',
      //     message: 'This page does not exist'
      //   });
      // }
  
      // query = query.skip(skip).limit(limit);
  
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
  
    } catch (err) {
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
  };
  
exports.getTour = async (req,res) => {
  console.log(req.params);
  const id = req.params.id * 1;
//   const tour = tours.find(el => el.id === id); 

//  // if(id > tours.length){

try{
  const tour = await Tour.findById(req.params.id);
                   //Tour.findOne({"_d: req.param.id"})
  res.status(200).json({
    status: "success",
    data: {
      tour: tour
    }
  }); 
} catch(error) {
  res.status(404).json({
    status: "fail",
    message: error
  })
}

}

exports.postATour = async  (req, res) => {

  try{
    const newTour = await Tour.create(req.body)
  
     res.status(201).json({
       status: "success",
        data: {
          tour: newTour,
        }
       });

} catch (error){
  res.status(404).json({
    status: "fail",
    message: error
  })
}
}

exports.updateTour = async (req, res) => {

  try{

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      // Aqui é para retornar o valor atualizado. 
      new: true,
      // Validar uma entrada com DataValidars no model
      runValidators: true
    });

    res.status(200).json({
      status: "success",
      data: {
         tour,
      }
    })

  }catch(error){
    res.status(404).json({
      status: "fail",
      message: error.message
    })
  }
}

exports.deleteTour = async  (req,res) => {

  try{
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null
    })
  } catch( error){
    res.status(404).json({
      status: "fail",
      message: error
    })
  }
}

exports.getTourStats = async (req,res) => {
   try{
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
      
   }catch(err){

    res.status(404).json({
      status:"fail",
      message:err
    })
   }
}

exports.getMonthlyPlan = async (req,res) => {
  try{

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
    })
  }catch(err){

    res.status(404).json({
      status: "fail",
      message: err
    })
  }

};
 