const tour=require('./../models/tourModel.js');
const APIFeatures=require('./../utils/apiFeatures.js');
const catchAsync=require('./../utils/catchAsync.js');
const AppError=require('./../utils/appError.js');
const handlerFactory=require('./handlerFactory');
// // exports.checkID = (req, res, next, val) => {
// //   console.log(`Tour id is: ${val}`);

//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID'
//     });
//   }
//   next();
// }
exports.aliasTopTours=(req,res,next)=>{
  req.query.limit=5;
  req.query.sort='-ratingsAverage,price';
  req.query.fields='name,price,ratingsAverage,summary,difficulty';
  next();
}



// exports.getAllTours =catchAsync(async(req, res,next) => {

//     // const queryObj={...req.query};
//     // const excludedFields=['page','sort','limit','fields'];
//     // excludedFields.forEach(el=>delete queryObj[el]);
//     // // console.log(req.query,queryObj);
    
//     // let queryStr=JSON.stringify(queryObj); 
//     // queryStr=queryStr.replace(/\b(gt|gte|lte|lt)\b/g,match=>`$${match}`);
//     // console.log(JSON.parse(queryStr));

//     // let query= tour.find(JSON.parse(queryStr)); 
//     // sort
//     // if(req.query.sort)
//     // {
//     //   const sortBy=req.query.sort.split(',').join(' ');
//     //   console.log(sortBy);
//     //   query=query.sort(sortBy);
//     // }else
//     // {
//     //   // query=query.sort('createdAt');
//     // }

//     // if(req.query.fields)
//     // {
//     //   const sortBy=req.query.fields.split(',').join(' ');
//     //   console.log(sortBy);
//     //   query=query.select(sortBy);
//     // }else
//     // {
//     //   query=query.select('-__v');
//     // }

//     // pagination
   
//     // const page=req.query.page*1 || 1;
//     // const limit=req.query.limit*1 || 100;
//     // const skip=(page-1)*limit;
//     // query=query.limit(limit).skip(skip);
//     // console.log(page,limit,skip);
  
//     // if(req.query.page)
//     // {
//     //   const numTours= await tour.countDocuments();
//     //   if(skip>=numTours)
//     //   {
//     //     throw new Error("This page not exist");
//     //   }
//     // }

//     const features=new APIFeatures(tour.find(),req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//     const gettour=await features.query;

//     // const gettour=await tour.find().where('duration').equals(5);
//     // console.log(tour);
//     res.status(200).json({
//     status: 'success',
//     tourlenght:gettour.length,
//     data: {
//       tours:gettour
//     }
//   });
// });

// exports.getTour =catchAsync(async (req,res,next) => {
//  const getTour=await tour.findById(req.params.id).populate('review');
//  if(!getTour)
//  {
//   return next(new AppError('No tour found at that id',404));
//  }
//  res.status(200).json({
//     status: 'success',
//     data: {
//       tour:getTour
//     }
//   });
// });


// exports.createTour =catchAsync(async (req, res,next) => {
//   console.log(req.body);
//   const newTour=await tour.create(req.body);  
// res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour
//         }
//       });
// // try{
  
// // }catch(err){
// //   res.status(404).json({
// //   status:'failed',
// //   message:err
// //   });
// // };
// });
// exports.updateTour =catchAsync(async(req, res,next) => {
//     const update=await tour.findByIdAndUpdate(req.params.id,req.body,{
//       new:true,
//       runValidators:true
//     });
//     res.status(200).json({
//     status: 'success',
//     data: {
//       update
//     }
//   });
// });
// exports.deleteTour =catchAsync(async (req, res,next) => {
//    await tour.findByIdAndDelete(req.params.id);
//    res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

exports.deleteTour=handlerFactory.deleteOne(tour);
exports.updateTour=handlerFactory.updateOne(tour);
exports.createTour=handlerFactory.createOne(tour);
exports.getTour=handlerFactory.getOne(tour,{path:'review'});
exports.getAllTours=handlerFactory.getAll(tour);
exports.getTourStats=catchAsync(async(req,res,next)=>{
  const stats=await tour.aggregate([
     {
      $match:{ratingsAverage:{$gte:4.5}}
     },
     {
      $group:{
      _id:{$toUpper:'$difficulty'},
      numTours:{$sum:1},
      numRatings:{$sum:'$ratingsQuantity'},
      avgRating:{$avg:'$ratingsAverage'},
      avgPrice:{$avg:'$price'},
      minPrice:{$min:'$price'},
      maxPrice:{$max:'$price'}
     }
     },
     {
      $sort:{avgPrice:1}
     }
     // {
     //  $match:{_id:{$ne:'EASY'}}
     // }
    ]);
  res.status(200).json({
    status:'success',
    // numTours:stats.length,
    data:{
      stats
    }
  })
});

exports.getMonthlyPlan=catchAsync(async(req,res,next)=>{
  const year=req.params.year*1;
  const plan=await tour.aggregate([
    {
      $unwind:'$startDates'
    },
    {
      $match:{
        startDates:{
          $gte:new Date(`${year}-01-01`),
          $lte:new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group:{
        _id:{$month:'$startDates'},
        numTourStarts:{$sum:1},
        tours:{$push:'$name'}
      }
    },
    {
      $addFields:{month:'$_id'}
    },
    {
      $project:{
        _id:0
      }
    },
    {
      $sort:{numTourStarts:-1}
    },
    {
      $limit:6
    }
]);
  res.status(200).json({
    status:'success',
    // numTours:stats.length,
    data:{
      plan
    }
  });
});

exports.getToursWithin=catchAsync(async(req,res,next)=>{
const {distance,latlng,unit}=req.params;
const[lat,lng]=latlng.split(',');  
const radius=unit==='mi'?distance/3963.2:distance/6378.1;
if(!lat || !lng)
next(new appError('Please provide lattitude and longitude in the format lat,lng',400));
const tours=await tour.find({startLocation:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}})
res.status(200).json({
  status:'success',
  results:tours.length,
  data:{
    data:tours
  }
})
})

exports.getDistances=catchAsync(async(req,res,next)=>{
  const {latlng,unit}=req.params;
const[lat,lng]=latlng.split(','); 
const multiplier=unit==='mi'?0.000621371 :0.001;
if(!lat || !lng)
next(new appError('Please provide lattitude and longitude in the format lat,lng',400));
const distances=await tour.aggregate([
{
  $geoNear:{
    near:{
      type:'Point',
      coordinates:[lng*1,lat*1]
    },
    distanceField:'distance',
    distanceMultiplier:multiplier
  }
},
{
 $project:{
  distance:1,
  name:1
 }
}
 ])
res.status(200).json({
  status:'success',
  results:distances.length,
  data:{
    data:distances
  }
})
})
