const NextJobReferenceNo = require('../models/nextJobReferenceNo');

function getNextJobReferenceNo(cb) {
  NextJobReferenceNo.findOne(function (err, n) {
    if (err) return console.error(err);

    if (n === null) {
      var m = new NextJobReferenceNo({
        value: 'JHK00002'
      });
      m.save(function (err, m) {
        if (err) return console.error(err);

        cb('JHK00001');
      });
    }
    else {
      var r = m = n.value;
      m = parseInt(m.substring(3));
      m++;
      m = 'JHK' + ('0000' + m).slice(-5);

      n.value = m;
      n.save(function (err, n) {
        if (err) return console.error(err);

        cb(r);
      });
    }
  });
}

module.exports.getNextJobReferenceNo = getNextJobReferenceNo;