const express = require("express");
const tourController = require("./../controllers/tourController");
const router = express.Router();

// router.param("id", tourController.checkID);

router.route("/tours-stats")
  .get(tourController.getTourStats);

router.route("/tours-monthlyPlan:year")
  .get(tourController.getMonthlyPlan);

router.route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);
  
router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.postATour);


router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour)

module.exports =  router;