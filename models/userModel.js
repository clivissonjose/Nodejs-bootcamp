const mongoose = require("mongoose");
const validator = require("validator");

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
    minlength: 8
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

const User = mongoose.model("user", userSchema);
module.exports = User;