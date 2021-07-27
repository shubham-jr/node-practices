const tourModel=require('./../models/tourModel');
const catchAsync=require('./../utils/catchAsync');
const appError=require('./../utils/appError');
const apiFeatures=require('./../utils/apiFeatures');
exports.get_all_tours=catchAsync(async(req,res,next)=>{
const queryObj=new apiFeatures(req.query,tourModel.find()).filter().sort().limitFields().paginate()
const getTour=await queryObj.queryStr;
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
	const Tour=await tourModel.findById(req.params.id).populate({
		path:'review',
		select:'review rating'
	});
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