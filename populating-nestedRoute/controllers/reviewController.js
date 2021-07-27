const reviewModel=require('./../models/reviewModel');
const catchAsync=require('./../utils/catchAsync');
const appError=require('./../utils/appError');
const apiFeatures=require('./../utils/apiFeatures');

exports.mergeUtility=(req,res,next)=>{
if(!req.body.tour)req.body.tour=req.params.tourId;
if(!req.body.user)req.body.user=req.user.id;
next();
}

exports.createReview=catchAsync(async(req,res,next)=>{
const review=await reviewModel.create(req.body)
res.status(200).json({
	status:'success',
	data:{
		review
	}
})
})

exports.getReview=catchAsync(async(req,res,next)=>{
	let filter={};
	if(req.params.tourId)filter={tour:req.params.tourId}
const review=await reviewModel.find(filter);
res.status(200).json({
	status:'success',
	totalReview:review.length,
	data:{
		review
	}
})
})