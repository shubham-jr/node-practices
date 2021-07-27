const tourModel=require('./../models/tourModel')
const catchAsync=require('./../utils/catchAsync')
exports.getOverview=catchAsync(async(req,res,next)=>{
	const tours = await tourModel.find();
	res.status(200).render('overview',{
		title:'overview',
		tours
	})
})

exports.getTour=catchAsync(async(req,res)=>{
	const tour =await tourModel.findOne({slug:req.params.slug}).populate({
		path:'review',
		fields:'review rating user'
	});
	res.status(200).render('tour',{
		title:'the forest hiker',
		tour
	})
})

exports.getLoginForm=catchAsync(async(req,res)=>{
res.status(200).render('login',{
	title:'Log into your account'
})
})
exports.getAccount=(req,res)=>{
res.status(200).render('account',{
	title:'Your Account'
})	
}