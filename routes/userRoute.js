const express = require("express");

const userController = require("./../controllers/userController");
// ROUTES
const route = express.Router();

route
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.postUser);

route
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports =  route;
