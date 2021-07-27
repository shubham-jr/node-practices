const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const mongo_sanitize = require('express-mongo-sanitize');
const xss_clean=require('xss-clean'); 
const rateLimit = require('express-rate-limit');
const cookieParser=require('cookie-parser');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRoute = require('./routes/viewRoute');
const AppError = require('./utils/appError.js');
const globalErrorHandler = require('./controllers/errorController.js');

const app = express();
app.set('view engine','pug');
app.set('views','./views');
// app.use(helmet())
// 1) Global MIDDLEWARES
// set security HTTP headers 
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'data:', 'blob:'],
 
      fontSrc: ["'self'", 'https:', 'data:'],

      scriptSrc: ["'self'", 'unsafe-inline'],
 
      // scriptSrc: ["'self'", 'https://*.cloudflare.com'],
 
      // scriptSrcElem: ["'self'",'https:', 'https://*.cloudflare.com'],
 
      styleSrc: ["'self'", 'https:', 'unsafe-inline'],
 
      // connectSrc: ["'self'", 'data', 'https://*.cloudflare.com']
    },
  })
);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limiter
const limiter=rateLimit({
	max:100,
	windowMs:60*60*1000,
	message:'too many request from this IP '
}) 
app.use('/api',limiter);
app.use(express.json({limit:'10kb'}));
app.use(cookieParser());
app.use(mongo_sanitize());
app.use(xss_clean());
app.use(hpp({
	whitelist:[
	'duration',
	'ratingsQuantity',
	'ratingsAverage',
	'maxGroupSize',
	'difficulty',
	'price'
	]
}));
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  console.log(req.headers);
  console.log(req.cookies);
  next();
});

// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// 3) ROUTES

app.use('/',viewRoute);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;