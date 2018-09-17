const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const nextJobReferenceNoSchema = new Schema({
  value: String
});

const NextJobReferenceNo = mongoose.model('NextJobReferenceNo', nextJobReferenceNoSchema);

module.exports = NextJobReferenceNo;