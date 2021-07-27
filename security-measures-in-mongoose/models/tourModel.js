const mongoose=require('mongoose');
const Schema=new mongoose.Schema({
	name:{
		type:String,
		required:[true,'a tour must have a name'],
		trim:true,
		unique:true
	},
	difficulty:{
		type:String,
		enum:{
			values:['easy','medium','hard'],
			message:'difficulty can only be easy medium or hard'
		}
	},
	duration:{
		type:Number,
		required:[true,'tour must have a duration']
	},
	price:{
		type:Number,
		required:[true,'tour must have a price']
	}
})
const model=mongoose.model('trial-tour',Schema);
module.exports=model;