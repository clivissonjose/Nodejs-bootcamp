const AppError = require("../utils/AppError");

const handleCastErrorBD = (err) =>{
   const message = `invalid ${err.path}: ${err.value}`;
   return new AppError(message, 404);
}

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = (error) => new AppError("Invalid token. Login again.", 401);

const handleTokenExpiredError = (error) => new AppError("Expired token. Please login again", 401);

const sendErrorDev = (err,res) =>{
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}
const sendErrorProd = (err,res) => {
  // Operational , trusted error: send message to client
  if(err.isOperational){
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  // Programming or other unknown error
  }else{
    // 1 Log error
    //console.error("erro", err);

    // 2) send generic message
    res.status(500).json({
      status: 'error',
      message: "Something went wrong!"
    });
  }
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if(process.env.NODE_ENV === "development"){
    sendErrorDev(err,res);
  }else if(process.env.NODE_ENV === "production"){
    console.log(err.name);
   
    let error = { ...err };

    console.log(error.name);

    // Não funciona corretamnete e eu não sei por que.
    if(err.name === "CastError") 
      error = handleCastErrorBD(err);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if(error.name = "JsonWebTokenError")
       error = handleJWTError(error);

    if(error.name = "TokenExpired")
      error = handleTokenExpiredError(error);

    sendErrorProd(error,res);
  }
}