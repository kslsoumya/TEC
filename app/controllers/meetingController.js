const shortId = require('shortid');
const mongoose = require('mongoose')
const express = require('express')
const eventModel = mongoose.model('Meeting')
// Libs----
const logger = require('../libs/loggerLib')
const apiResponse = require('../libs/responseLib')
const check = require('../libs/checkLib')
const timeLib = require('../libs/timeLib')

// Lists all the Meetings

let listAllMeetings = (req, res) => {
    eventModel.find()
        .select('-__v -_id')
        .skip(parseInt(req.query.skip)|| 0)
        .lean()
        .exec((err, result) => {
            if (err) {
                logger.error(`Error Occured : ${err}`, 'controller : listAllMeetings', 10)
                let response = apiResponse.generate(true, 'Some error Occured', 500, err)
                res.send(response)
            } else if (check.isEmpty(result)) {
                logger.info('No Meeting Found', 'controller : listAllMeetings', 10)
                let response = apiResponse.generate(true, 'No Meeting Found!!', 404, [])
                res.send(response)
            } else {
                logger.info('Meetings Found Succesfully', 'controller : listAllMeetings', 10)
                let response = apiResponse.generate(false, 'Meetings Found Succesfully!!', 200, result)
                res.send(response)
            }
        })
}

// Details of Meeting-------

let MeetingDetail = (req, res) => {
    eventModel.find({ 'meetingId': req.params.id }, (err, result) => {
        if (err) {
            logger.error(`Error Occured : ${err}`, 'controller : Meeting Detail', 10)
            let response = apiResponse.generate(true, 'Some error Occured', 500, err)
            res.send(response)
        } else if (check.isEmpty(result)) {
            logger.info('No Meeting Found', 'controller : Meeting Detail', 10)
            let response = apiResponse.generate(true, 'No Meeting Found!!', 404, err)
            res.send(response)
        } else {
            logger.info('Meetings Found Succesfully', 'controller : Meeting Detail', 10)
            let response = apiResponse.generate(false, 'Meeting Found Succesfully!!', 200, result)
            res.send(response)
        }
    })
}

// Creating a Meeting------------

let createMeeting = (req, res) => {
    const uniqueId = shortId.generate()
    const today = timeLib.now();

    let meetingEntry = new eventModel({
        meetingId: uniqueId,
        admin : req.body.misc.admin,
        title: req.body.event.title,
        start:new Date(req.body.event.start),
        end: new Date(req.body.event.end),
        color: req.body.event.color,
        description : req.body.misc.desc,
        location : req.body.misc.location,
        createdOn : today
    })
    meetingEntry.save((err, result) => {
        if (err) {
            logger.error(`Some Error Occured ${err}`, 'controller:createMeeting', 10)
            let response = apiResponse.generate(true, 'Some Error Occured', 500, err)
            res.send(response)
        } else {
            let response = apiResponse.generate(false, 'Meeting Created Successfully!!', 200, result)
            res.send(response)
        }
    })
}

// Updating the details of a Meeting ----------

let editMeeting = (req, res) => {
    let options = req.body;
    eventModel.update({ 'meetingId': req.params.id }, options, { multi: true }).exec((err, result) => {

        if (err) {
            logger.error(`Some Error Occured ${err}`, 'controller:editMeeting', 10)
            let response = apiResponse.generate(true, 'Some error Occured!!', 500, err)
            res.send(response)
        } else if (check.isEmpty(result)) {
            logger.info('No Meeting Found!!', 'controller:editMeeting', 10)
            let response = apiResponse.generate(true, 'No Meeting Found', 404, err)
            res.send(response)
        } else {
            logger.info('Meeting updated Successfully !!', 'controller:editMeeting', 10)
            let response = apiResponse.generate(false, 'Meeting updated Successfully !!', 200, result)
            res.send(response)
        }
    });
}

// Deleting a Meeting  ------

let cancelMeeting = (req, res) => {
    eventModel.remove({ 'meetingId': req.params.id }, (err, result) => {
        // console.log(req.params.id + '-------');
        if (err) {
            logger.error(`Some Error Occured ${err}`, 'controller:cancelMeeting', 10)
            let response = apiResponse.generate(true, 'Some error Occured!!', 500, err)
            res.send(response)
        } else if (check.isEmpty(result)|| result.n === 0) {
            logger.info('No Meeting Found!!', 'controller:cancelMeeting', 10)
            let response = apiResponse.generate(true, 'No Meeting Found', 404, err)
            res.send(response)
        } else {
            logger.info('Meeting removed Successfully !!', 'controller:cancelMeeting', 10)
            let response = apiResponse.generate(false, 'Meeting removed Successfully !!', 200, result)
            res.send(response)
        }
    })
}

module.exports = {
    listAllMeetings: listAllMeetings,
    MeetingDetail: MeetingDetail,
    createMeeting: createMeeting,
    editMeeting: editMeeting,
    cancelMeeting: cancelMeeting
}

