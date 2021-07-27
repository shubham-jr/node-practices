const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
// const User = require('./userModel');
const tourSchema= new mongoose.Schema({
	name:{
		type:String,
		required:[true,'tour name is required'],
		unique:true,
		trim:true
		// validate:[validator.isAlpha,'Tour name must only contain characters']
	},
	slug:String,
	duration:{
		type:Number,
		required:[true,'a tour must have a duration']
	},
	maxGroupSize:{
		type:Number,
		required:[true,'always need a group size']
	},
	difficulty:{
		type:String,
		required:[true,'should have a difficulty'],
		enum:{
			values:['easy','medium','hard'],
			message:'difficulty is only easy,medium or hard'
		}
	},
	ratingsAverage:{
		type:Number,
		default:4.5,
		min:[1,'Rating must be above 1.0'],
		max:[5,'Rating must be above 5.0'],
		set:val=>Math.round(val*10)/10
	},
	ratingsQuantity:{
		type:Number,
		default:0
	},
	price:{
		type:Number,
		required:true,
	},
	priceDiscount:{
		type:Number,
		validate:{
			validator:function(val)
		{
			return val<this.price;
		},
		message:'discount should not be greater than price here ({VALUE})'
		}
	},
	summary:{
		type:String,
		trim:true,
		required:[true,'summary is required']
	},
	rating:{
		type:Number,
		default:4.5
	},
	description:{
		type:String,
		trim:true
	},
	imageCover:{
		type:String,
		required:[true,'a tour have a cover image']
	},
	images:[String],
	createdAt:{
		type:Date,
		default:Date.now(),
		select:false
	},
    startDates:[Date],
    secretTour:{
    	type:Boolean,
    	default:false
    },
    startLocation:
    {
    	type:{
    		type:String,
    		default:'Point',
    		enum:['Point']
    	},
    	coordinates:[{
    		type:Number,
    		required:false
    	}],
    	address:String,
    	description:String,
    	day:Number
    },
    locations:[
    {
    	type:{
    		type:String,
    		default:'Point',
    		enum:['Point']
    	},
    	coordinates:[Number],
    	address:String,
    	description:String,
    	day:Number
    }
    ],
     guides:[
     {
     	type:mongoose.Schema.ObjectId,
     	ref:'users'
     }
     ]
},
{
	toJSON:{virtuals:true},
	toObject:{virtuals:true}
});

tourSchema.index({price:1,ratingsAverage:-1})
tourSchema.index({slug:1})
tourSchema.index({startLocation:'2dsphere'})
tourSchema.virtual('durationWeeks').get(function(){
	return this.duration/7;
});

// virtual populate
tourSchema.virtual('review',{
  ref: 'reviews',
  foreignField: 'tour',
  localField: '_id'
});
// --------------mongoose middleware----------------
tourSchema.pre('save',function(next){
	this.slug=slugify(this.name,{lower:true});
	next();
});
// tourSchema.post('save',function(doc,next){
// 	console.log(doc);
// 	next();
// })

// tourSchema.pre('save',async function(next){
// const guidesPromises=this.guides.map(async id=>await User.findById(id));
// this.guides=await Promise.all(guidesPromises);	
// next();
// })

tourSchema.pre(/^find/,function(next){
	this.populate({
  path:'guides',
  select:'-__v -changePasswordAt'
})
	next();
})

tourSchema.pre(/^find/,function(next){
	this.find({secretTour:{$ne:true}});
	next();
});

tourSchema.post(/^find/,function(doc,next){
	console.log(doc);
	next();
});

// tourSchema.pre('aggregate',function(next){
//     this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
// 	next();
// })
const model=mongoose.model('Tour',tourSchema);
module.exports=model;
