const fs=require('fs');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config({path:'./config.env'});
const tourModel=require('./../../models/tourModel')
const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
	useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(()=>{
	console.log('database connected...').catch(err=>{console.log(err)});
});
const tour=JSON.parse(fs.readFileSync('./tour.json','utf-8'));

const importData=async()=>{
try{
	await tourModel.create(tour);
}catch(err){
 console.log(err);
}
process.exit();
}

const deleteData=async()=>{
try{
await tourModel.deleteMany();
}catch(err){
	console.log(err);
}
process.exit();
}

if(process.argv[2]==='--import')
importData();
else if(process.argv[2]==='--delete')
deleteData();

