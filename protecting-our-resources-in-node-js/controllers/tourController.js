const tourModel=require('./../models/tourModel');
const catchAsync=require('./../utils/catchAsync');
const appError=require('./../utils/appError');

exports.get_all_tours=catchAsync(async(re,res,next)=>{
const getTour=await tourModel.find();
res.status(200).json({
	status:'success',
	totalTour:getTour.length,
	data:{
		getTour
	}
})
});

exports.postTour=catchAsync(async(req,res,next)=>{
const Tour=await tourModel.create(req.body);
res.status(200).json({
	status:'success',
	data:{
		Tour
	}
})
});

exports.get_a_tour=catchAsync(async(req,res,next)=>{
	const Tour=await tourModel.findById(req.params.id);
	res.status(200).json({
	status:'success',
	data:{
		Tour
	}
})
})

exports.update_tour=catchAsync(async(req,res,next)=>{
const Tour=await tourModel.findByIdAndUpdate(req.params.id,req.body,{
	new:true,
    runValidators:true
});
res.status(200).json({
	status:'success',
	data:{
		Tour
	}
})
})

exports.delete_tour=catchAsync(async(req,res,next)=>{
	const Tour=await tourModel.findByIdAndDelete(req.params.id);
	res.status(204).json({
	status:'success',
	data:null
})
})