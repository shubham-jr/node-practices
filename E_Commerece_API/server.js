const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
const port = process.env.PORT || 3000;
mongoose.connect(DB,{
	useNewUrlParser:true,
	useCreateIndex:true,
	useFindAndModify:false,
	useUnifiedTopology: true
}).then((con)=>{
	// console.log(con.connections);
	console.log("database connected");
}).catch(err=>{
	console.log(err);
});
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});