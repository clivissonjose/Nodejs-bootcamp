const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, "An user must have a name!"]
  },
  email:{
    type: String,
    required: [true, "An user must have a email!"],
    unique: true,
    validate: [validator.isEmail, "Please send a valid email"]
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "An user must have a password"],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type:String,
    require: [true, "You need to confirm your password!"],
    validate: {
    // ISSO APENAS FUNCIONA COM SAVE e create
      validator: function (val){
          return val === this.password;
      },
      // Se o retorno é falso então mandaremos uma messagem
      message: "The passwords are not  equals!", 
    } 
  }
});

userSchema.pre("save", async function(next){

  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // Não  mostrar senha
  this.passwordConfirm = undefined;
});

// Comparar as senhas 
userSchema.methods.correctPassword = async function(senhaCandidata, senhaDoUsuario)  {
  return await bcrypt.compare(senhaCandidata, senhaDoUsuario);
}
const User = mongoose.model("user", userSchema);
module.exports = User;