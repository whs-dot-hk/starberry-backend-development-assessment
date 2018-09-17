const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobSchema = new Schema({
  noOfVancancies: {
    type: Number,
    required: true
  }, 
  jobReferenceNo: {
    type: String,
    required: true
  },
  timeStamp: {
    type: Date,
    required: true
  },
  jobTitle: {
    type: String,
    maxlength: 100,
    required: true
  },
  companyDetailsName: {
    type: String,
    maxlength: 100
  },
  companyDetailsImageUrl: {
    type: String,
    maxlength: 200
  },
  jobRequirements: {
    type: String,
    maxlength: 200
  },
  noOfYearsOfExperiences: {
    type: Number,
    required: true
  },
  jobFunctions: [{
    type: Schema.Types.ObjectId,
    ref: 'JobFunction'
  }]
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;