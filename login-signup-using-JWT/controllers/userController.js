const userModel=require('./../models/userModel');
const catchAsync=require('./../utils/catchAsync');
exports.getAllUser=catchAsync(async(req,res)=>{
      const user=await userModel.find();
      res.status(200).json({
      	status:'success',
      	data:{
      		user
      	}
      })
})