const mongoose=require('mongoose');
const movieScheme=mongoose.Schema({
	moviename:{
		type:String,
		required:[true,"movie name is required"],
		trim:true,
		unique:true
	},
	moral:{
		type:String,
		required:[true,"moral is required"],
		trim:true
	},
	actors:{
		type:String,
		required:[true,"actors name is required"],
		trim:true
	},
	review:{
		type:String,
		required:[true,"review is required"],
		trim:true
	},
	image:{
		type:String,
		required:[true,"image name is required"],
	}
});
const model=mongoose.model('movies_review',movieScheme);
module.exports=model;

