const express=require('express');
const reviewController=require('./../controllers/reviewController');
const authController=require('./../controllers/authController');
const Router=express.Router({mergeParams:true});
Router.route('/').post(authController.protect,reviewController.mergeUtility,reviewController.createReview);
Router.route('/').get(reviewController.getReview);
module.exports=Router;