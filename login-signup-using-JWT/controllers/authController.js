const userModel=require('./../models/userModel');
const appError=require('./../utils/appError');
const errorController=require('./../controllers/errorController');
const catchAsync=require('./../utils/catchAsync');
const jwt=require('jsonwebtoken');
const get_token=id=>{
	return jwt.sign({id},process.env.SECRET,{
		expiresIn:process.env.JWT_EXPIRES_IN
	}) 
}
exports.signup=catchAsync(async(req,res)=>{
 const user=await userModel.create({
 	name:req.body.name,
 	email:req.body.email,
 	password:req.body.password,
 	passwordConfirm:req.body.passwordConfirm
 });
 const token=get_token(user._id);
 res.status(200).json({
 	status:'success',
 	token,
 	data:{
 		user
 	}
 })
})
exports.login=catchAsync(async(req,res,next)=>{
const {email,password}=req.body;
if(!email || !password)
return next(new appError(`please provide email and password`,404));
const user=await userModel.findOne({email}).select('+password');
if(!user || !await user.correctPassword(password,user.password))
return next(new appError(`incorect email or password`),404);
const token=get_token(user._id);	
res.status(200).json({
	status:'success',
	token
})
})