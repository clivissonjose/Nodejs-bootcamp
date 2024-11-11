const express = require("express");
const app = express();
const morgan = require("morgan");

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRoutes");
const userRoute = require("./routes/userRoute");
// 1)  MIDDLEWARES

console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req,res,next) => {
  console.log("moddleware here!");
  next();
})

app.use((req,res,next) => {
  req.requestTime= new Date().toISOString();
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRoute);


// CASO A APLICAÇÃO CHEGUE AQUI, SIGNIFICA QUE HOUVE ALGUM ERRO NO PROCESSO
// app.all é para todos os tipos de rotas( get, put, delete, create)

// (*0 significa todas as urls possíveis
app.all("*", function(req,res,next){
  next(new AppError(`Can not find ${req.originalUrl} on this server!`, 404));
})


// Só em ter 4 parâmetros, JS sabe que é uma função de handler
app.use(globalErrorHandler);
// START SERVER 
module.exports = app;