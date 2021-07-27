class APIFeatures
{
	constructor(queryObj,queryStr)
	{
		this.queryStr=queryStr;
		this.queryObj=queryObj;
	}

	filter()
	{
		const filterObj={...this.queryObj};
        console.log(this.queryObj);
    	const excludedFields=['fields','sort','limit','page'];
		excludedFields.forEach(el=>delete filterObj[el]);	
		const queryObj=JSON.parse(JSON.stringify(filterObj).replace(/\b(gt|gte|lte|lt)\b/g,match=>`$${match}`));			
		this.queryStr=this.queryStr.find(queryObj);
		return this;
	}

	sort()
	{
		if(this.queryObj.sort)
		this.queryStr=this.queryStr.sort(this.queryObj.sort)
	   	return this;
	}

	limitFields()
	{
		if(this.queryObj.fields)
		this.queryStr=this.queryStr.select(this.queryObj.fields.split(',').join(' '))
		else
  		this.queryStr=this.queryStr.select('-__v');	
  		return this;
	}

	paginate()
	{
		const page=this.queryObj.page*1||1;
		const limit=this.queryObj.limit*1||100;
		const skip=(page-1)>0?(page-1)*limit:0;
		console.log(page,limit,skip);
  		this.queryStr=this.queryStr.limit(limit).skip(skip);
  		return this;
	}
}

module.exports=APIFeatures;