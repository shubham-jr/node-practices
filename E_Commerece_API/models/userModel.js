const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
const Schema=new mongoose.Schema({
	name:{
		type:String,
		trim:true,
		require:[true,'please write your name']
	},
	email:{
		type:String,
		require:[true,'Please write your email'],
	    unique:true,
	    lowercase:true,
	    validate:[validator.isEmail,'please enter a valid email']
	},
	photo:String,
	role:{
      type:String,
      enum:['user','guide','lead-guide','admin'],
      default:'user'
	},
	password:{
		type:String,
		require:[true,'password is required'],
		minlength:8,
		select:false
	},
	passwordConfirm:{
		type:String,
		require:[true,'please confirm your password'],
		validate:{
			validator:function(el){
				return this.password===el;
			},
			message:'Password not matched'
		}
	},
	changePasswordAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
    	type:Boolean,
    	default:true,
    	select:false
    } 
});

// Schema.pre('save',function(next){
// 	if(!this.isModified('password') || this.isNew) return next();
// 	this.changePasswordAt=Date.now()-1000;
// 	next();
// })

// Schema.pre('save',async function(next){
// if(!this.isModified('password')) return next();//if user want to only update password
// this.password=await bcrypt.hash(this.password,12);
// this.passwordConfirm=undefined;//if you want to not to include in database
// next();
// });

Schema.pre(/^find/,function(next){
this.find({active:{$ne:false}});
next();
})

Schema.methods.correctPassword=async function(encyPassword,userPass){
return await bcrypt.compare(encyPassword,userPass);
}
Schema.methods.changePasswordAfter=function(JWTTimestamp){
	if(this.changePasswordAt)
	{
	  const changedTimeStamp=parseInt(this.changePasswordAt.getTime()/1000,10);
	  console.log(this.changePasswordAt,JWTTimestamp);
	  return JWTTimestamp<changedTimeStamp;
	}
return false;
}

Schema.methods.createPasswordResetToken=function()
{
  const resetToken=crypto.randomBytes(32).toString('hex');
  this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires=Date.now() +10*60*1000;
  console.log({resetToken},this.passwordResetToken);
  return resetToken;
}
const usermodel=mongoose.model('users',Schema);
module.exports=usermodel;