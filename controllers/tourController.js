//const fs = require("fs");
const Tour = require("./../models/tourModel");
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
exports.getAllTours = async (req, res) => {

  try{

    // QUERY
    // 1A FILTERING
    const queryObj = {...req.query};
    const excluded = ["page", "limit", "sort", "fields"]

    excluded.forEach((element) => {
       delete queryObj[element];
     });
    
    // 1B - BUILD ADVANCED FILTERING
  
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

   console.log(JSON.parse(queryStr));

    let query =  Tour.find(JSON.parse(queryStr));

    // ORDENAR 
    if(req.query.sort){
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    }else
    // ORDENAR POR ORDEM DE CRIAÇÃO QUANDO NÃO TIVER NENHUM CRITÉRIO
      query = query.sort("-createdAt");

    // 3 limitar fileds

    if(req.query.fields){
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    }else{
      query = query.select("-__v");
    }  

    // 4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    console.log(query); // Ver se a query está sendo construída corretamente

    if(req.query.page){
      const numbers =  await Tour.countDocuments();
      if(skip>= numbers) throw new Error("This page do not exist!");
    }

    //EXECUTE QUERY
    const tours = await query;

    res.status(200).json({
       status: "success",
       results: tours.length,
       requestedAt:  req.requestTime,
       data: {
         tours: tours,
       }
     });

  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error
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
      runValidators: true
    });
    res.status(200).json({
      status: "success",
      data: {
        tour: tour,
      }
    })

  }catch(error){
    res.status(404).json({
      status: "fail",
      message: error
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
 