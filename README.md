# Starberry Backend Development Assessment

[![Build Status](https://travis-ci.com/whs-dot-hk/starberry-backend-development-assessment.svg?branch=master)](https://travis-ci.com/whs-dot-hk/starberry-backend-development-assessment)
[![Heroku](https://heroku-badge.herokuapp.com/?app=sbda-api&root=api/job&style=flat)](https://sbda-api.herokuapp.com/api/job)

## Features

## Dependences

* mongoose
* koa

## Schemas

### Job

Name | Type | Length | Default | Required | Remarks
--- | --- | --- | --- | --- | ---
noOfVancancies | Number | &ge;0 | No | Yes | Vancancies.
jobReferenceNo | String | &ge;0 | No | Yes | **Auto-generated**. The first Job is `JHK00001`, the second is `JHK00002`, etc.
timeStamp | Date | &ge;0 | No | Yes | **Auto-filled**.
jobTitle | String | &le;100 | No | Yes | Job title.
companyDetailsName | String | &le;100 | No | No | Company/Employer name.
companyDetailsImageUrl | String | &le;200 | No | No | Company/Employer image.
jobRequirements | String | &le;200 | No | No | Requirements
noOfYearsOfExperiences | Number | 0-10 | No | Yes | Year(s) of experiences
jobFunctions | [JobFunction] | &ge;0 | No | No | Job functions.

### JobFunction

Name | Type | Length | Default | Rquired | Remarks
--- | --- | --- | --- | --- | ---
name | String | &le;100 | No | Yes | Job function name.
jobs | [Job] | &ge;0 | No | No | Jobs under the job function.