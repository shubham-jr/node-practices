const userModel=require('./../models/userModel');
const catchAsync=require('./../utils/catchAsync');
const appError=require('./../utils/appError');
const filterObj=(obj,...allowedFields)=>{
	const newObj={};
Object.keys(obj).forEach(el=>{
	if(allowedFields.includes(el))
		return newObj[el]=obj[el];
})	
return newObj;
}

exports.getAllUser=catchAsync(async(req,res)=>{
      const user=await userModel.find();
      res.status(200).json({
      	status:'success',
      	data:{
      		user
      	}
      })
})

exports.updateMe=catchAsync(async(req,res,next)=>{
if(req.body.password || req.body.passwordConfirm)
return next(new appError(`this route is not for upadting password`),404);
const filterBody=filterObj(req.body,'name','email');
const upadtedUser=await userModel.findByIdAndUpdate(req.user.id,filterBody,{
	new:true,
	runValidators:true
});	
res.status(200).json({
	status:'success',
    data:{
    	upadtedUser
    }
})
})

exports.deleteMe=catchAsync(async(req,res,next)=>{
await userModel.findByIdAndUpdate(req.user.id,{active:false});
res.status(200).json({
	status:'success',
	data:null
})
})