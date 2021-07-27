const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
const Schema=new mongoose.Schema({
	name:{
		type:String,
		required:[true,'user must have a name'],
		trim:true
	},
	email:{
		type:String,
		required:[true,'user must have an email'],
		lowercase:true,
		validate:[validator.isEmail,'please provide a valid email'],
		unique:[true,'email already exist']
	},
	password:{
		type:String,
		required:[true,'user must have a password'],
		minlength:8,
		select:false
	},
	passwordConfirm:{
		type:String,
		required:[true,'please confim your password'],
		validate:{
			validator:function(el){
            return this.password===el;
			},
			message:'password not matched'
		}
	},
	changePasswordAt:Date,
	passwordTokenString:String,
	passwordTokenStringExpired:Date,
	role:{
		type:String,
		enum:['admin','user','tour-guide'],
		default:'user'
	},
	active:{
		type:Boolean,
		default:true,
		select:false
	}
});
Schema.pre(/^find/,function(next){
this.find({active:{$ne:false}});
next();
})
Schema.pre('save',async function(next){
	if(!this.isModified('password'))
		next();
this.password=await bcrypt.hash(this.password,12);
this.passwordConfirm=undefined;
next();
})
Schema.methods.correctPassword=async function(claimPass,realPass)
{
	return await bcrypt.compare(claimPass,realPass); 
}
Schema.methods.changePasswordAfter=function(JWTTimeStamp)
{
	console.log(this);
	if(this.changePasswordAt)
	{
      const pwdChangedTime=parseInt(this.changePasswordAt.getTime()/1000,10);
      	console.log(pwdChangedTime,JWTTimeStamp);
      	return pwdChangedTime>JWTTimeStamp;
	}
	return false;
}
Schema.methods.createTokenToResetPassword=function()
{
	console.log("hello");
  const token=crypto.randomBytes(32).toString('hex');	
  this.passwordTokenString=crypto.createHash("sha256").update(token).digest("hex");
  this.passwordTokenStringExpired=Date.now()+1000*60*10;
  console.log(token,this.passwordTokenString," date.now ",this.passwordTokenStringExpired,Date.now());
  return token;	
}
const model=mongoose.model('trial-user',Schema);
module.exports=model;