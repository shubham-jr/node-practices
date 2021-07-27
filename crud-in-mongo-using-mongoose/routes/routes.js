const express=require('express');

const app=express();

app.use(express.json());

const controllers=require('./../controllers/controllers.js');

// -------------------requiring-modules----------------------------------

const review_route=express.Router();

// ------------------making-routes---------------------------------------

app.use('/series',review_route);

review_route.route('/').get(controllers.getdata).post(controllers.postdata);

review_route.route('/:id').get(controllers.get_a_data).patch(controllers.update_a_data).delete(controllers.delete_a_data);

module.exports=app;

// --------------------making-get-request--------------------------------