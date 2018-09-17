const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobSchema = new Schema({
  jobTitle: {
    type: String,
    maxlength: 100,
    required: true
  },
  jobReferenceNo: {
    type: String,
    required: true
  },
  jobFunctions: [{
    type: Schema.Types.ObjectId,
    ref: 'JobFunction'
  }]
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;