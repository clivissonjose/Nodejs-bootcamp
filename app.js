const express = require("express");
const app = express();
const morgan = require("morgan");

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
})

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRoute);

// START SERVER 
module.exports = app;