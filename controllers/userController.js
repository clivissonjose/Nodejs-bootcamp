const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req,res) => {

  const user = await User.find();
  
  res.status(200).json({
    status: 'success',
    results: user.length,
    data: {
      user
    }
  });
  
});
exports.getUser = (req,res) => {
  res.status(500).json({
    status: "success",
    message: "Not implemented yet."
  })
}

exports.postUser = (req,res) => {
  res.status(500).json({
    status: "success",
    message: "Not implemented yet."
  })
}

exports.updateUser = (req,res) => {
  res.status(500).json({
    status: "success",
    message: "Not implemented yet."
  })
}

exports.deleteUser = (req,res) => {
  res.status(500).json({
    status: "success",
    message: "Not implemented yet."
  })
}
