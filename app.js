const Koa = require('koa');
const Router = require('koa-router');

const cors = require('@koa/cors');

const koaBody = require('koa-body');

const app = new Koa();

const PORT = process.env.PORT || 5000

app.use(cors({
  origin: '*'
}));

app.use(koaBody());

const router = new Router();

const Job = require('./models/job');
const JobFunction = require('./models/jobFunction');

const NextJobReferenceNoHelper = require('./helpers/nextJobReferenceNo')

const mongoose = require('mongoose');
mongoose.connect('mongodb://whs:dOlHZN9jqhv55LsRjYpc@ds257732.mlab.com:57732/starberry-backend-development-assessment');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error:'));

const Joi = require('joi');

async function findJobs(ctx) {
  const p = function() {
    return new Promise(resolve => Job.find().sort({ timeStamp: -1 }).populate('jobFunctions').exec(function (err, jobs) {
      if(err) return console.error(err);
  
      resolve(JSON.stringify(jobs));
    }));
  }

  ctx.body = await p();
}

async function saveJob(ctx) {
  const body = ctx.request.body;

  const schema = Joi.object().keys({
    noOfVancancies: Joi.number().min(1).max(10).required(),
    jobTitle: Joi.string().max(100).required(),
    companyDetailsName: Joi.string().max(100).allow(''),
    companyDetailsImageUrl: Joi.string().max(200).allow(''),
    jobRequirements: Joi.string().max(200).allow(''),
    noOfYearsOfExperiences: Joi.number().min(0).max(10),
    jobFunctions: Joi.array().items(Joi.object().keys({
      name: Joi.string().max(100).required()
    }))
  });
  
  const result = Joi.validate(body, schema);

  if (result.error !== null) return console.error(result);

  const p = function() {
    return new Promise(resolve => NextJobReferenceNoHelper.getNextJobReferenceNo(function (r) {
      resolve(r);
    }));
  }
  
  const n = await p();

  const inputJfs = body.jobFunctions;

  const job = new Job({
    noOfVancancies: body.noOfVancancies,
    jobReferenceNo: n,
    timeStamp: Date.now(),
    jobTitle: body.jobTitle,
    companyDetailsName: body.companyDetailsName,
    companyDetailsImageUrl: body.companyDetailsImageUrl,
    jobRequirements: body.jobRequirements,
    noOfYearsOfExperiences: body.noOfYearsOfExperiences
  });

  const p2 = function() {
    return new Promise(resolve => job.save(function (err, doc) {
      if (err) return console.error(err);
  
      let ids = [];
  
      inputJfs.forEach(inputJf => {
        JobFunction.findOne({ name: inputJf.name }, function (err, jf) {
          if (err) return console.error(err);
    
          if (jf === null) {
            const jf = new JobFunction({
              name: inputJf.name
            });

            jf.save(function (err) {
              if (err) return console.error(err);
              
              ids.push(jf._id);
  
              Job.findByIdAndUpdate(job._id, { jobFunctions: ids }, function (err, doc) {
                if (err) return console.error(err);
    
                resolve(JSON.stringify(doc));
              });
            });
          }
          else {
            ids.push(jf._id);
  
            Job.findByIdAndUpdate(job._id, { jobFunctions: ids }, function (err, doc) {
              if (err) return console.error(err);
    
              resolve(JSON.stringify(doc));
            });
          }
        });
      });

      resolve(doc);
    }));
  }

  ctx.body = await p2();
}

async function findJobByJobReferenceNo(ctx) {
  const jobReferenceNo = ctx.params.jobReferenceNo;

  const p = function() {
    return new Promise(resolve => {
      Job.findOne({ jobReferenceNo }).populate('jobFunctions').exec(function (err, job) {
        if (err) console.error(err);
    
        resolve(JSON.stringify(job));
      });
    });
  }

  ctx.body = await p();
}

async function updateJob(ctx) {
  const body = ctx.request.body;

  const schema = Joi.object().keys({
    noOfVancancies: Joi.number().min(1).max(10).required(),
    jobReferenceNo: Joi.string().length(8).required(),
    jobTitle: Joi.string().max(100).required(),
    companyDetailsName: Joi.string().max(100).allow(''),
    companyDetailsImageUrl: Joi.string().max(200).allow(''),
    jobRequirements: Joi.string().max(200).allow(''),
    noOfYearsOfExperiences: Joi.number().min(0).max(10),
    jobFunctions: Joi.array().items(Joi.object().keys({
      name: Joi.string().max(100).required()
    }))
  });
  
  const result = Joi.validate(body, schema);
  
  if (result.error !== null) return console.error(result);

  const noOfVancancies = body.noOfVancancies;
  const jobReferenceNo = body.jobReferenceNo;
  const jobTitle = body.jobTitle;
  const companyDetailsName = body.companyDetailsName;
  const companyDetailsImageUrl = body.companyDetailsImageUrl;
  const jobRequirements = body.jobRequirements;
  const noOfYearsOfExperiences = body.noOfYearsOfExperiences;
  
  const jobFunctions = body.jobFunctions;

  const p2 = function() {
    return new Promise(resolve => {
      let ids = [];
      for (let i = 0; i < jobFunctions.length; i++) {
        var inputJf = jobFunctions[i];
        JobFunction.findOne({ name: inputJf.name }, function(err, jf) {
          if (err) return console.error(err);

          if (jf === null) {
            const jf = new JobFunction({
              name: inputJf.name
            });

            jf.save(function (err) {
              if (err) return console.error(err);
              
              ids.push(jf._id);
              if (i === (jobFunctions.length - 1)) resolve(ids);
            });
          }
          else {
            ids.push(jf._id);
            if (i === (jobFunctions.length - 1)) resolve(ids);
          }
        });
      }
    });
  }

  let ids = [];
  if (jobFunctions.length > 0) ids = await p2();

  const p = function() {
    return new Promise(resolve => {
      Job.findOneAndUpdate({ jobReferenceNo }, {
        noOfVancancies,
        jobTitle,
        companyDetailsName,
        companyDetailsImageUrl,
        jobRequirements,
        noOfYearsOfExperiences,
        jobFunctions: ids
      }, { new: true }, function (err, job) {
      if (err) return console.error(err);

        resolve(JSON.stringify(job));
      });
    })
  }

  ctx.body = await p();
}

async function deleteJobByReferenceNo(ctx) {
  const jobReferenceNo = ctx.params.jobReferenceNo;

  Job.deleteOne({ jobReferenceNo }, function (err) {
    if (err) return console.error(err);

  });
}

router.get('/api/job', findJobs)
  .post('/api/job', saveJob)
  .get('/api/job/:jobReferenceNo', findJobByJobReferenceNo)
  .put('/api/job', updateJob)
  .delete('/api/job/:jobReferenceNo', deleteJobByReferenceNo);

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT);