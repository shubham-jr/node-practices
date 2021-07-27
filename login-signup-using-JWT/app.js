const express=require('express');
const app=express();
const userRoute=require('./routes/userRoute');
const appError=require('./utils/appError');
const errorController=require('./controllers/errorController');
app.use(express.json());
app.use('/api/v1/user',userRoute);
app.all('*',(req,res,next)=>{
	next(new appError(`${req.originalUrl} not found`,404));
});
app.use(errorController);
module.exports=app;