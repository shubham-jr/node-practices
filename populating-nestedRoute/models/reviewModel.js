const mongoose=require('mongoose');
const reviewSchema=new mongoose.Schema({
  review:{
  	type:String,
  	required:[true,'this field cannot be blank'],
  	trim:true
  },
  rating:{
  	type:Number,
  	max:5,
  	min:1,
  	required:[true,'must have a rating']
  },
  tour:{
  	type:mongoose.Schema.ObjectId,
  	ref:'trial-tour',
  	required:[true,'review must have a tour']
  },
  user:{
  	type:mongoose.Schema.ObjectId,
  	ref:'trial-user',
  	required:[true,'review must have a user']
  },
  createdAt:{
  	type:Date,
  	default:Date.now()
  }
},
{
	toJSON:{virtuals:true},
	toObject:{virtuals:true}
})
reviewSchema.pre(/^find/,function(next){
	this.populate({
    path:'user',
    select:'name'
	})
	next();
})
const reviewModel=mongoose.model('trial-review',reviewSchema);
module.exports=reviewModel;