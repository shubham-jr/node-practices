const express=require('express');
const hpp=require('hpp');
const helmet=require('helmet');
const rateLimit=require('express-rate-limit');
const mongoSanitize=require('express-mongo-sanitize');
const xssClean=require('xss-clean');
const app=express();
const userRoute=require('./routes/userRoute');
const tourRoute=require('./routes/tourRoute');
const reviewRoute=require('./routes/reviewRoute');
const appError=require('./utils/appError');
const errorController=require('./controllers/errorController');
app.use(express.json({limit:'10kb'}));
app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());
const rateLimits=rateLimit({
	max:100,
	windowMs:60*60*1000,
	message:'too many request form this IP'
})
app.use(hpp({

}));
app.use('/api',rateLimits);
app.use('/api/v1/user',userRoute);
app.use('/api/v1/tour',tourRoute);
app.use('/api/v1/review',reviewRoute);
app.all('*',(req,res,next)=>{
	next(new appError(`${req.originalUrl} not found`,404));
});
app.use(errorController);
module.exports=app;