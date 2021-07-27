class APIFeatures
{
  constructor(query,queryString)
  {
    this.query=query;
    this.queryString=queryString;
  }

  filter()
  {
    const queryObj={...this.queryString};
    const excludedFields=['page','sort','limit','fields'];
    excludedFields.forEach(el=>delete queryObj[el]);
    // console.log(req.query,queryObj);
    
    let queryStr=JSON.stringify(queryObj); 
    queryStr=queryStr.replace(/\b(gt|gte|lte|lt)\b/g,match=>`$${match}`);
    this.query.find(JSON.parse(queryStr));
    // let query= tour.find(JSON.parse(queryStr)); 
    return this;
  }

  sort()
  {
    if(this.queryString.sort)
    {
      const sortBy=this.queryString.sort.split(',').join(' ');
      // console.log(sortBy);
      this.query=this.query.sort(sortBy);
    }else
    {
      // query=query.sort('createdAt');
    }
    return this;
  }

  limitFields()
  {
    if(this.queryString.fields)
    {
      const sortBy=this.queryString.fields.split(',').join(' ');
      // console.log(sortBy);
      this.query=this.query.select(sortBy);
    }else
    {
      this.query=this.query.select('-__v');
    }
    return this;
  }

  paginate()
  {
    const page=this.queryString.page*1 || 1;
    const limit=this.queryString.limit*1 || 100;
    const skip=(page-1)*limit;
    this.query=this.query.limit(limit).skip(skip);
    // console.log(page,limit,skip);
    return this;
  }
} 
module.exports=APIFeatures;