// ----------------------------------------requiring-files----------------------------
const express=require('express');
const app=require('./routes/routes.js');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:'./env/config.env'});
const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
// ------------------------requiring-file-end----------------------------------------------
// ---------------------connect-with-mongo-db-----------------------------------------
mongoose.connect(DB,{
    useNewUrlParser:true,
	useCreateIndex:true,
	useFindAndModify:false,
	useUnifiedTopology: true	
}).then(()=>{console.log("connection successfull")}).catch(err=>{console.log(err)});
app.listen(process.env.PORT || 3000,'127.0.0.1',()=>{
	console.log("server started");
//------------------------------------------connection-end--------------------------------------------- 
});
