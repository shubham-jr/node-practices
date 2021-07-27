// -----------------------------------requiring-files-------------------------------------------

const series_model=require('./../models/models.js');

// ---------------------------get-request-from-mongo-db---------------------------------
exports.getdata=async (req,res)=>{
try{
const getdataobj=await series_model.find();
res.status(200).json({
	status:'success',
	data:{
		getdataobj
	}
});
}catch(err){
	res.status(404).json({
    status:'failed',
    message:err
	});
}
}
// -----------------------get-request-end------------------------------------------

// --------------------post-request-start------------------------------------------


exports.postdata=async (req,res)=>{
try{
const postdataobj=await series_model.create(req.body);
console.log(postdataobj);
res.status(201).json({
	status:'success',
	data:{
		postdataobj
	}
});	
}catch(err){
	res.status(404).json({
    status:'failed',
    message:err
	});
}
}
// -----------------------post-request-end-----------------------------------------

// ----------------------get-an-unique-data----------------------------------------
exports.get_a_data=async(req,res)=>{
	try{
		const get_a_data=await series_model.findById(req.params.id);
	res.status(200).json({
		status:'success',
		data:{
           get_a_data
		}
	});
	}catch(err)
	{
		res.status(404).json({
         status:'failed',
         message:err
		});
	}
}

// --------------------get-a-unique-data-end--------------------------------------------

// ----------------------------update-a-data-----------------------------------------
exports.update_a_data=async(req,res)=>{
    try{
		const update_a_data=await series_model.findByIdAndUpdate(req.params.id,req.body,{
			new:true,
			runValidators:true
		});
	res.status(200).json({
		status:'success',
		data:{
           update_a_data
		}
	});
	}catch(err)
	{
		res.status(404).json({
         status:'failed',
         message:err
		});
	}
}
// ----------------------------update-a-data-end--------------------------------------

// -------------------------------delete-a-data----------------------------------------
exports.delete_a_data=async(req,res)=>{
	try{
		await series_model.findByIdAndDelete(req.params.id);
	res.status(200).json({
		status:'success',
		data:null
	});
	}catch(err)
	{
		res.status(404).json({
         status:'failed',
         message:err
		});
	}
}
// --------------------------------delete-a-data-end-----------------------------------------

