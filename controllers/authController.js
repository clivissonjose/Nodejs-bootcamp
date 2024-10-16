const User =  require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/AppError");

const signToken = id => {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
}
exports.signup = catchAsync(async (req,res,next) =>{
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const token = signToken(newUser._id);
  
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = async (req,res,next) => {

  const {email, password} = req.body;

  // Verify if the email and password exist
  if(!password || !email){
   return next( new AppError("Please provide an email or password", 400));
  };

  // Check if email and password are correct

  const user = await User.findOne({email}).select("+password");
   

  if(!user || !await user.correctPassword(password, user.password )){
    return next(new AppError("Nome ou usuario invalidso", 401));
  }
  console.log(user);

  // 3 - If everything is ok send a token to the client
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token: token
  })
}