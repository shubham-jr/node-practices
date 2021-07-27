const reviewModel=require('./../models/reviewModel.js');
const catchAsync=require('./../utils/catchAsync.js');
const AppError=require('./../utils/appError.js');
const handlerFactory=require('./handlerFactory');

// exports.getAllReview=catchAsync(async(req,res,next)=>{
// let filter={};
// if(req.params.tourId)filter={tour:req.params.tourId}	
// const reviews=await reviewModel.find(filter);
// res.status(200).json({
// 	status:'success',
// 	totalReview:reviews.length,
// 	data:{
// 		reviews
// 	}
// }) 
// })

exports.setTourUserIds=(req,res,next)=>{
if(!req.body.tour)req.body.tour=req.params.tourId;
if(!req.body.user)req.body.user=req.user.id;
	next();
}

exports.createReview=catchAsync(async(req,res,next)=>{
	// Allowing nested route
const newReview=await reviewModel.create(req.body);
res.status(200).json({
status:'success',
data:{
	newReview
}
});
})
exports.getReview=handlerFactory.getOne(reviewModel);
exports.deleteReview=handlerFactory.deleteOne(reviewModel);
exports.updateReview=handlerFactory.updateOne(reviewModel);
exports.createReview=handlerFactory.createOne(reviewModel);
exports.getAllReview=handlerFactory.getAll(reviewModel);