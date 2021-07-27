const mongoose=require('mongoose');
const app=require('./app');
const dotenv=require('dotenv');
dotenv.config({path:'./env/config.env'});
const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
	useNewUrlParser:true,
	useCreateIndex:true,
	useFindAndModify:false,
	useUnifiedTopology: true
}).then(()=>{console.log('database connected....')}).catch(err=>{console.log(err)});
app.listen(process.env.PORT,'127.0.0.1',()=>{
	console.log(`Server runnning on port ${process.env.PORT}....`);
});