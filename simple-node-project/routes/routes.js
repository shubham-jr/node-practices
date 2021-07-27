const express=require('express');

const app=express();

const controllers=require('./../controllers/controllers.js');

// -------------------requiring-modules----------------------------------

const review_route=express.Router();

// ------------------making-routes---------------------------------------

app.use('/series',review_route);

review_route.route('/').get(controllers.replace_template);

module.exports=app;

// --------------------making-get-request--------------------------------