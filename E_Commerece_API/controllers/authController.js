const {promisify}=require('util');
const crypto=require('crypto');
const userModel=require('./../models/userModel.js');
const catchAsync=require('./../utils/catchAsync.js');
const jwt=require('jsonwebtoken');
const appError=require('./../utils/appError.js');
const sendEmail=require('./../utils/email.js');
const Signtoken=id=>{
	return jwt.sign({id},process.env.JWT_SECRET,{
	expiresIn:process.env.JWT_EXPIRES_IN
})
}

const createSendToken=(user,statusCode,res)=>{
const token=Signtoken(user._id);
const options={
	expires:new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
	// secure:true,
	httpOnly:true
}
if(process.env.NODE_ENV==='production')
	options.secure=true;
res.cookie('jwt',token,options);
user.password=undefined;
res.status(statusCode).json({
	status:'success',
	token,
	data:{
		user
	}
})
}

exports.signup=catchAsync(async(req,res,next)=>{
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

	// check if email and password exist
	if(!email || !password)
	{
      return next(new appError('Please provide email and password',400));
	}
	// check if the user and password is correct
	const find_user=await userModel.findOne({email}).select('+password');
	if(!find_user || !await find_user.correctPassword(password,find_user.password))
	{
	  return next(new appError('Incorrect email or password',401));
	}
	// check every thing ok,send token to client
	createSendToken(find_user,200,res);

})

exports.protect=catchAsync(async(req,res,next)=>{
	// getting token and checkof it's there
	let token;
	if(req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
	{
	  token=req.headers.authorization.split(' ')[1];	
	}else if(req.cookies.jwt)
	token=req.cookies.jwt;
	// Verification Token
	// check if user still exist
	// check if user changed password after the token was issued
	if(!token)
		return next(new appError('please logged in first'),401);

	// const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET);
	const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET);
	const fresh_user=await userModel.findById(decoded.id);
	if(!fresh_user)
		return new appError('user belonged to this token no longer exit',401);
	if(fresh_user.changePasswordAfter(decoded.iat))
		return next(new appError(`User recently changed pssword!Please login again`,401));
	req.user=fresh_user;
    res.locals.user=fresh_user;
next();
});

exports.restrictTo=(...roles)=>{
	return (req,res,next)=>{
		if(!roles.includes(req.user.role))
		{
			return next(new appError('not have permission to do this',403))
		}
		next();
	}
}

exports.forgotPassword=catchAsync(async(req,res,next)=>{
	// get user based on posted email
const user=await userModel.findOne({email:req.body.email});
if(!user)
return next(new appError(`no user with that email`,404));
// generate token 
const resetToken=user.createPasswordResetToken();
await user.save();
// send token to that email
const resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
const message=`forgot your password? Submit a patch requestwiht your new password and password confirm to ${resetURL}
 if you didn't forgot your password please ignore this!!`;
 try{
  await sendEmail({
 	email:user.email,
 	Subject:'Your password reset token(only valid for 10 min)',
 	message
 })
 res.status(200).json({
 	status:'success',
 	message:'token sent successfully'
 })
 }catch(err)
 {
 	user.createPasswordResetToken=undefined;
 	passwordResetExpires=undefined;
 	await user.save({validateBeforeSave:false});
 	return next(new appError(`error in sending the email`,500))
 }
})

exports.resetPassword=catchAsync(async(req,res,next)=>{
// get user based on the token
const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
const user= await userModel.findOne({passwordResetToken:hashedToken,
	passwordResetExpires:{$gt:Date.now()}
})
// if the token is not expired and their is user then set new password
if(!user)
	return next(new appError(`token is invalid or expired`,400));
user.password=req.body.password;
user.passwordConfirm=req.body.passwordConfirm;
user.passwordResetToken=undefined;
user.passwordResetExpires=undefined;
await user.save();
// update changePasswordAt property for the user

// log the user in and send JWT token
createSendToken(user,200,res);
})

exports.updatePassword=catchAsync(async(req,res,next)=>{
	const user=await userModel.findById(req.user.id).select('+password');
	if(!(await user.correctPassword(req.body.passwordCurrent,user.password)))
		return next(new appError(`incorrect password`,404))
	user.password=req.body.password;
	user.passwordConfirm=req.body.passwordConfirm;
	await user.save();
	createSendToken(user,200,res);
})

// ony for rendered pages
exports.isLoggedIn=async(req,res,next)=>{
	if(req.cookies.jwt)
	{
		try
		{
		console.log('top level');
		// const decoded=await promisify(jwt.verify)(token,process.env.JWT_SECRET);
		const decoded=await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET);
		console.log('after decoded');
		const fresh_user=await userModel.findById(decoded.id);
		console.log('fresh user');
		if(!fresh_user)
			 return next();
			console.log('not fresh_user');
		if(fresh_user.changePasswordAfter(decoded.iat))
			 return next();
			console.log('not changePasswordAfter');
		res.locals.user=fresh_user;
		console.log('locals');
		return next();
	}catch(err){
		return next();
	}
	}
	console.log('not have jwt');
	next();
};

exports.logout=(req,res,next)=>{
	res.cookie('jwt','loggedout',{
		expires:new Date(Date.now()+1000*10),
		httpOnly:true
	})
	res.status(200).json({
		status:'success'
	})
}