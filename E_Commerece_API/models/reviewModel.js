const mongoose=require('mongoose');
const tourModel=require('./tourModel')
const reviewSchema=new mongoose.Schema({
	review:{
		type:String,
		required:[true,'review cannot be blank'],
		trim:true
	},
	rating:{
		type:Number,
		required:[true,''],
		max:5,
		min:1
	},
	createdAt:{
		type:Date,
		default:Date.now()
	},
	user:{
		type:mongoose.Schema.ObjectId,
		ref:'users',
		required:[true,'review must belong to a user']
	},
	tour:{
		type:mongoose.Schema.ObjectId,
		ref:'Tour',
		required:[true,'review must belong to a tour']
	}
},{
	toJSON:{virtuals:true},
	toObject:{virtuals:true}
})
reviewSchema.pre(/^find/,function(next){
	// this.populate({
	// 	path:'user',
	// 	select:'name'
	// }).populate({
	// 	path:'tour',
	// 	select:'name'
	// })
	this.populate({
		path:'user',
		select:'name'
	})
	next();
})

reviewSchema.statics.calcAverageRatings=async function(tourId)
{
	const stats=await this.aggregate([
  	{
  		$match:{tour:tourId}
  	},
  	{
 		$group:{
 			_id:'$tour',
 			nRating:{$sum:1},
 			avgRating:{$avg:'$rating'}	
 		}
  	}
	])
	console.log(stats);
	if(stats.length>0)
	{await tourModel.findByIdAndUpdate(tourId,{
			ratingsQuantity:stats[0].nRating,
			ratingsAverage:stats[0].avgRating
		});}else
{
	await tourModel.findByIdAndUpdate(tourId,{
			ratingsQuantity:0,
			ratingsAverage:4.5
		})
}
		
}

reviewSchema.post('save',function(){
this.constructor.calcAverageRatings(this.tour);	
})

reviewSchema.pre(/^findOneAnd/,async function(next){
	this.r=await this.findOne();
	console.log(this.r);
	next();
})

reviewSchema.post(/^findOneAnd/,async function(){
	await this.r.constructor.calcAverageRatings(this.r.tour)
})
const reviewModel=mongoose.model('reviews',reviewSchema);
module.exports=reviewModel;