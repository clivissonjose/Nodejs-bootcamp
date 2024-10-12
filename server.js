const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({path: './config.env'});

const app = require("./app");

const db = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

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
}).then(con => {
 // console.log(con.connections);
  console.log("DB connection successfull");
});
/*
const tourSchema = new mongoose.Schema({
 /* name: String,
  rating: Number,
  price:Number  

  name: {
    type:String,
    required: [true, "message: a tour must have a name"],
    unique: true,
  },
  rating:{
    type: Number,
    default: 4.5
  },
  price:{
    type: Number,
    required:[true, "messsage: A tour must have a price"]
  }
})

const Tour = mongoose.model('Tour', tourSchema); 

const testTour = new Tour({
  name: "Arcoverde",
  price: 100,
  rating: 2.0
})

testTour
  .save()
  .then(doc => {
  console.log(doc)
}).catch(erro => {
  console.log("ERROR: ", erro);
})

mongoose.set('debug', true);   */


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Running on port ${port}`);
}); 