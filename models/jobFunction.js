const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobFunctionSchema = new Schema({
  name: String,
  jobs: [{
    type: Schema.Types.ObjectId,
    ref: 'Job'
  }]
});

const JobFunction = mongoose.model('JobFunction', jobFunctionSchema);

module.exports = JobFunction;