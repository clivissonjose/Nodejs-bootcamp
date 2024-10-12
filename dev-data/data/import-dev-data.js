const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
//dotenv.config({path: './config.env'});
dotenv.config({path: './../../config.env'}); 

const Tour = require("./../../models/tourModel");

const db = process.env.DATABASE
  .replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

// Verifica se a URL e a senha foram carregadas corretamente
if (!process.env.DATABASE_PASSWORD || !process.env.DATABASE) {
  console.error('Erro: Variáveis de ambiente do MongoDB não estão corretamente configuradas.');
  process.exit(1);
}

mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() =>  console.log("DB connected!"));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, "utf-8"));

const importData = async () => {
  try{
    await Tour.create(tours);
    console.log("Data succesfully created")
  }catch(error){
    console.log(error);
  }
  process.exit();
}

const deleteData = async () => {
  try{
    await Tour.deleteMany();
    console.log("Data completely deleted");
  }catch(error){
    console.log(error);
  }
  process.exit();
}

if(process.argv[2] === '--import'){
  importData();
}else if(process.argv[2] === '--delete'){
  deleteData();
}