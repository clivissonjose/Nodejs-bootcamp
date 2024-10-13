class APIFeatures{
  constructor(query,queryString){
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
  
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
                
    // 1B ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
     
    this.query = this.query.find(JSON.parse(queryStr));
   
    return this;
  }
  
  sort() {
     // 2) SORTING
     if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitedFields() {
       // 3) FIELD LIMITING
       if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
  
      return this
  }

  paginate(){
    const page = this.queryString.page * 1 || 1; // Default to page 1 if not provided
    const limit = this.queryString.limit * 1 || 100; // Default to 100 documents per page
    const skip = (page - 1) * limit; // Calculate skip value

    this.query = this.query.skip(skip).limit(limit);
    
    return this;
  }
};

module.exports = APIFeatures;