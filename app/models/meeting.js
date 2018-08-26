
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const time = require('../libs/timeLib')

const meetings = new Schema ({
    meetingId : {
        type :String,
        unique:true
    },
    admin :{
        type: String
    },
    title : {
        type : String
        // unique: true
    },
    description : {
        type:String
    },
    start :{
        type : Object
    },
    color : {
        type:Object,
        default : {
            primary : '#ad2121',
            secondary : '#FAE3E3'
        }
    },
    end :{
        type : Object
    },
    location : {
        type: String
    },
    createdOn : {
        type : Date
    }
})


mongoose.model('Meeting',meetings)