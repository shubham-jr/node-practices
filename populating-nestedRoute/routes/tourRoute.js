const express=require('express');
const tourController=require('./../controllers/tourController');
const authController=require('./../controllers/authController');
const reviewRoute=require('./reviewRoute');
const tourRoute=express.Router();
tourRoute.use('/:tourId/review',reviewRoute);
tourRoute.route('/get-all-tours').get(authController.protect,tourController.get_all_tours).post(authController.protect,tourController.postTour);
tourRoute.route('/:id')
.get(authController.protect,tourController.get_a_tour)
.patch(authController.protect,authController.restrictTo('admin','tour-guide'),tourController.update_tour)
.delete(authController.protect,authController.restrictTo('admin','tour-guide'),tourController.delete_tour);
module.exports=tourRoute;