const express=require('express');
const app=require('./routes/routes.js');
const controllers=require('./controllers/controllers.js');
// ---------------------------------------middleware-end-----------------------------------------------
app.use(express.static(__dirname + '/public'));

// --------------------------------------accessing-static-files-end---------------------------------------
app.listen(process.env.PORT || 3000,'127.0.0.1',()=>{
	console.log("server started");
//------------------------------------------connection-end--------------------------------------------- 
});
