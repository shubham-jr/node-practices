const userModel=require('./../models/userModel.js');
const APIFeatures=require('./../utils/apiFeatures.js');
const catchAsync=require('./../utils/catchAsync.js');
const appError=require('./../utils/appError.js');
const handlerFactory=require('./handlerFactory');
const filterObj=(obj,...allowedFields)=>{
  const newObj={};
  Object.keys(obj).forEach(el=>{
    if(allowedFields.includes(el)) return newObj[el]=obj[el];
  })
  return newObj;
}

// exports.getAllUsers = catchAsync(async(req, res,next) => {
//  const gettour=await userModel.find();
//     res.status(200).json({
//     status: 'success',
//     tourlenght:gettour.length,
//     data: {
//       gettour
//     }
//   });
// });
exports.updateMe=catchAsync(async(req,res,next)=>{
if(req.body.password||req.body.passwordConfirm)
  return next(new appError(`this route is not for updating password`,400));
  const filteredBody=filterObj(req.body,'name','email');
  const updatedUser=await userModel.findByIdAndUpdate(req.user.id,filteredBody,{new:true,runValidators:true});
res.status(200).json({
  status:'success',
  data:{
    updatedUser
  }
})
})
// exports.deleteMe=catchAsync(async(req,res,next)=>{
// await userModel.findByIdAndUpdate(req.user.id,{active:false})
// res.status(204).json({
//   status:'success',
//   data:null
// })
// })

exports.deleteMe=handlerFactory.deleteOne(userModel);
exports.getUser = handlerFactory.getOne(userModel);
exports.getAllUsers=handlerFactory.getAll(userModel);
exports.getMe=(req,res,next)=>{
  req.params.id=req.user.id;
  next();
}
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = handlerFactory.updateOne(userModel);

