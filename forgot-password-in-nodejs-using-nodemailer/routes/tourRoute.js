const express=require('express');
const tourController=require('./../controllers/tourController');
const authController=require('./../controllers/authController');
const tourRoute=express.Router();
tourRoute.route('/get-all-tours').get(authController.protect,tourController.get_all_tours).post(authController.protect,tourController.postTour);
tourRoute.route('/:id')
.get(authController.protect,tourController.get_a_tour)
.patch(authController.protect,tourController.update_tour)
.delete(authController.protect,tourController.delete_tour);
module.exports=tourRoute;