const {promisify} = require("util");
const User =  require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require("./../utils/AppError");

const signToken = id => {
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
}
exports.signup = catchAsync(async (req,res,next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
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

  // const email = req.body.email  -- const password = req.body.password
  const {email, password} = req.body;

  // Verify if the email and password exist
  if(!password || !email){
   return next( new AppError("Please provide an email or password", 400));
  };

  // Check if email and password are correct
  const user = await User.findOne({email}).select("+password");

  if(!user || !await user.correctPassword(password, user.password )){
    return next(new AppError("Nome ou usuario invalido!", 401));
  }

  // 3 - If everything is ok send a token to the client
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token: token
  })
}

// Função para ver se um usuário está autenticado
exports.protect = catchAsync( async (req,res,next) => {

  // 1 - Pegar token e checar se ele existe
  let token;
  if(req.headers.authorization && req.headers
    .authorization.startsWith("Bearer")){
    token = req.headers.authorization.split(" ")[1];
  }

  if(!token){
    return next(new AppError("You are not logged in! Please login first", 401));
  };

  // 2 - Validar token

  //jwt.verify(token, process.env.JWT_SECRET);
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  // 3 - Verificar se usuário ainda existe

  const userExist = await User.findById(decoded.id);

  if(!userExist){
    return next(
      new AppError("User with token does not exist anymore!", 401)
    );
  }
  //  4 - Verificar se usuário mudou a senha
    if(userExist.changedPasswordAfter(decoded.iat)){
      return next(
        new AppError("User recently changed password! Please login again", 401)
      )
    };
 
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = userExist;
    next();
});