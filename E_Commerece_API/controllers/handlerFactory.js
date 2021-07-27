const catchAsync=require('./../utils/catchAsync.js');
const AppError=require('./../utils/appError.js');
const APIFeatures=require('./../utils/apiFeatures.js');
exports.deleteOne=Model=>catchAsync(async (req, res,next) => {
   const doc=await Model.findByIdAndDelete(req.params.id);
   if(!doc)
   {
   	return next(new appError(`document not found`,404))
   }
   res.status(204).json({
    status: 'success',
    data: null
  });
});


exports.updateOne=Model=>catchAsync(async(req,res,next) => {
    const doc=await Model.findByIdAndUpdate(req.params.id,req.body,{
      new:true,
      runValidators:true
    });
    if(!doc)
   {
   	return next(new appError(`document not found`,404))
   }
    res.status(200).json({
    status: 'success',
    data: {
      data:doc
    }
  });
})

exports.createOne=Model=>catchAsync(async (req, res,next) => {
  console.log(req.body);
  const doc=await Model.create(req.body);  
res.status(201).json({
        status: 'success',
        data: {
          data: doc
        }
      });
});

exports.getOne=(Model,popOptions)=>catchAsync(async (req,res,next) => {
	let query=Model.findById(req.params.id);
	if(popOptions)query=query.populate(popOptions); 
	const doc=await query;
 if(!doc)
 {
  return next(new AppError('No document found at that id',404));
 }
 res.status(200).json({
    status: 'success',
    data: {
      data:doc
    }
  });
});

exports.getAll=(Model)=>catchAsync(async(req, res,next) => {
	let filter={};
	if(req.params.tourId)filter={tour:req.params.tourId}
	const features=new APIFeatures(Model.find(filter),req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

    // const doc=await features.query.explain();
    const doc=await features.query;

    // const doc=await tour.find().where('duration').equals(5);
    // console.log(tour);
    res.status(200).json({
    status: 'success',
    tourlenght:doc.length,
    data: {
      data:doc
    }
  });
});
