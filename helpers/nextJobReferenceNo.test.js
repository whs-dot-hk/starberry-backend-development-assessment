const mongoose = require('mongoose');

const n = require('./nextJobReferenceNo');

const NextJobReferenceNo = require('../models/nextJobReferenceNo');

let a;

beforeEach(done => {
  mongoose.connect('mongodb://whs:dOlHZN9jqhv55LsRjYpc@ds257732.mlab.com:57732/starberry-backend-development-assessment');

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'db connection error:'));

  NextJobReferenceNo.findOneAndUpdate({}, { value: 'JHK00010' }, function (err, n) {
    if (err) return console.error(err);
    
    if (n === null) {
      a = 'JHK00001';

      var m = new NextJobReferenceNo({
        value: 'JHK00010'
      });
      m.save(function (err, m) {
        if (err) return console.error(err);
        done();
      });
    }
    else {
      a = n.value;
      done();
    }
  });
});

afterEach(done => {
  NextJobReferenceNo.findOneAndUpdate({}, { value: a }, function (err, doc) {
    if (err) return console.error(err);
    done();
  });
});

test('get next job reference no correctly', done => {
  function callback(data) {
    expect(data).toBe('JHK00010');
    NextJobReferenceNo.findOne({}, function (err, n) {
      if (err) return console.error(err);
      expect(n.value).toBe('JHK00011');
      done();
    });
  }

  n.getNextJobReferenceNo(callback);
});