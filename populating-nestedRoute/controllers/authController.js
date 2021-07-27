const userModel=require('./../models/userModel');
const appError=require('./../utils/appError');
const errorController=require('./../controllers/errorController');
const catchAsync=require('./../utils/catchAsync');
const Sendmail=require('./../utils/email');
const jwt=require('jsonwebtoken');
const {promisify}=require('util');
const crypto=require('crypto');
const get_token=id=>{
	return jwt.sign({id},process.env.SECRET,{
		expiresIn:process.env.JWT_EXPIRES_IN
	}) 
}
const createSendToken=(user,statusCode,res)=>{
 const token=get_token(user._id);
 const options={
 	httpOnly:true,
 	// secure:true,
 	expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000)
 }
 if(process.env.NODE_ENV==='production')
 	options.secure=true;
 res.cookie("jwt",token,options)
 user.password=undefined;
 res.status(statusCode).json({
 	status:'success',
 	token,
 	data:{
 		user
 	}
 })
}
exports.signup=catchAsync(async(req,res)=>{
 const user=await userModel.create({
 	name:req.body.name,
 	email:req.body.email,
 	password:req.body.password,
 	passwordConfirm:req.body.passwordConfirm,
 	changePasswordAt:req.body.changePasswordAt,
 	role:req.body.role
 });
 createSendToken(user,200,res);
})
exports.login=catchAsync(async(req,res,next)=>{
const {email,password}=req.body;
if(!email || !password)
return next(new appError(`please provide email and password`,404));
const user=await userModel.findOne({email}).select('+password');
if(!user || !await user.correctPassword(password,user.password))
return next(new appError(`incorect email or password`),404);
 createSendToken(user,200,res);
})
exports.protect=catchAsync(async(req,res,next)=>{
	let token;
if(req.headers.authorization &&req.headers.authorization.startsWith('Bearer'))
{
  token=req.headers.authorization.split(' ')[1];
}
if(!token)
return next(new appError(`you are not logged in please login !!!!!`,404));
const decode=await promisify(jwt.verify)(token,process.env.SECRET);
console.log(decode);
const user=await userModel.findById(decode.id);
if(!user)
  return next(new appError(`No user belongs to this token`));
  if(user.changePasswordAfter(decode.iat))
  	return next(new appError(`password recently changed! please login again @`));
  req.user=user;
  next();
})
exports.forgot_password=catchAsync(async(req,res,next)=>{
const user=await userModel.findOne({email:req.body.email});
if(!user)
return next(new appError(`email not found`,404));
const token=user.createTokenToResetPassword();
await user.save({validateBeforeSave:false});//please see console.log(user);
const subject=`please click on the given link to reset your password
${req.protocol}://${req.get('host')}/api/v1/user/${token}`;
const message=`Forgot your password ?? submit a patch request to the given URL to regenerate
the new password 
.
${subject}
if it is not you then ignore the message`;
try
{
await Sendmail({
	email:user.email,
	subject:'Reset your password',
	message
});
res.status(200).json({
	status:'success',
	message:'email sent successfully'
})
}catch(err)
{
  user.passwordTokenStringExpired=undefined;
  user.passwordTokenString=undefined;
  await user.save({validateBeforeSave:false});
  return next(new appError(`email not sent! please try again`),500);
}
})
exports.resetPassword=catchAsync(async(req,res,next)=>{
const hashedToken=await crypto.createHash('sha256').update(req.params.id).digest('hex');
console.log(hashedToken);
const user=await userModel.findOne({passwordTokenString:hashedToken,
	passwordTokenString:{$gt:Date.now()}});
	if(!user)
		return next(new appError(`token is invalid or expired`,404));
	user.password=req.body.password;
	user.passwordConfirm=req.body.passwordConfirm;
	user.passwordTokenString=undefined;
	user.passwordTokenStringExpired=undefined;
	user.save();
	 createSendToken(user,200,res);
})
exports.restrictTo=(...roles)=>{
return (req,res,next)=>{
	if(!roles.includes(req.user.role))
	{
      return next(new appError(`you are not permitted to access this`),403);
	}
	next();
}
}
exports.updatePassword=catchAsync(async(req,res,next)=>{
const user=await userModel.findById(req.user.id).select('+password');
if(!(await user.correctPassword(req.body.currentPass,user.password)))
return next(new appError(`Incorrect currentPassword !!`,404));
user.password=req.body.password;
user.passwordConfirm=req.body.passwordConfirm;
await user.save();
 createSendToken(user,200,res);
})