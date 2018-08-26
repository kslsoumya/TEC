const express = require('express')
const config = require('../../config/appConfig')
const meetingController = require('../controllers/meetingController')

const auth = require('../middlewares/Auth')

let setRouter = (app) => {
    let baseUrl = config.apiVersion+'/'+'meetings';

    // Routes regarding the Meetings -------------

    app.get(baseUrl + '/get/all?skip', auth.isAuthenticated, meetingController.listAllMeetings);

    /**
   * @api {get}  /api/v1/meetings/get/all  Get all Meetings
   * @apiVersion 0.0.1
   * @apiName Get all Meetings
   * @apiGroup Meetings
   *
   * @apiParam {String} authToken The token for authentication.(Send authToken as a query Param or header Param or Body param)
   * @apiParam {String} skip skip.(Send skip as a query Param or header Param or Body param)(optional parameter for pagination)
   * 
   * @apiSuccessExample {json} Success-Response:
   *            [
   *                 
   *                    {
   *                         "error": false,
   *                         "message": "Meetings Found Succesfully!!",
   *                         "status": 200,
   *                        "data": [
   *                             {
   *                                 "color": {
   *                                            "primary": "#ff80c0",
   *                                            "secondary": "#a4b3c6"
   *                                          },
   *                                 "meetingId": "QdQ3Gy5Ps",
   *                                 "admin": "alex-admin",
   *                                "title": "StandUp",
   *                                 "start": "Sunday, August 26, 2018 4:20 AM",
   *                                 "end": "Sunday, August 26, 2018 5:08 AM",
   *                                 "description": "Updates",
   *                                 "location": "TownHall",
   *                                 "createdOn": "2018-08-26T04:09:48.000Z"
   *                            },
   *                             {
   *                                 "color": {
   *                                            "primary": "#004040",
   *                                             "secondary": "#80ffff"
   *                                           },
   *                                 "meetingId": "lM1gWhzc9",
   *                                 "admin": "alex-admin",
   *                                 "title": "Friends",
   *                                 "start": "Monday, August 27, 2018 4:30 AM",
   *                                 "end": "Monday, August 27, 2018 10:30 AM",
   *                                 "description": "meeting",
   *                                 "location": "hall",
   *                                 "createdOn": "2018-08-26T04:12:52.000Z"
   *                             }
   *                     }
   *              ]
   *
   * 
   *
   */

    app.get(baseUrl + '/detail/:id', auth.isAuthenticated, meetingController.MeetingDetail);


     /**
   * @api {get}  /api/v1/meetings/detail/:id   Get Meeting Details
   * @apiVersion 0.0.1
   * @apiName Get details of Meeting
   * @apiGroup Meetings
   *
   * @apiParam {String} authToken The token for authentication.(Send authToken as a query Param or header Param or Body param)
   *  @apiParam {String}id     The id of the Meeting passed as a URL parameter 
   *
   * 
   * @apiSuccessExample {json} Success-Response:
   *           {
   *                 "error": false,
   *                 "message": "Meeting Found Succesfully!!",
   *                 "status": 200,
   *                 "data": [
   *                    {
   *                         "color": {
   *                             "primary": "#ff80c0",
   *                             "secondary": "#a4b3c6"
   *                         },
   *                        "_id": "5b82280c2202127f12eed901",
   *                         "meetingId": "QdQ3Gy5Ps",
   *                         "admin": "alex-admin",
   *                         "title": "StandUp",
   *                         "start": "Sunday, August 26, 2018 4:20 AM",
   *                         "end": "Sunday, August 26, 2018 5:08 AM",
   *                         "description": "Updates",
   *                         "location": "TownHall",
   *                        "createdOn": "2018-08-26T04:09:48.000Z",
   *                         "__v": 0
   *                     }
   *                 ]
   *             }
   *
   *
   */


    app.post(baseUrl + '/create', auth.isAuthenticated, meetingController.createMeeting);

      /**
   * @api {post}  /api/v1/meetings/create   Create a Meeting
   * @apiVersion 0.0.1
   * @apiName  Create a Meeting
   * @apiGroup For Admin Only
   *
   * @apiParam {String} authToken The token for authentication.(Send authToken as a query Param or header Param or Body param)
   * @apiParam {String} title title of the Meeting passed as a body parameter.
   * @apiParam {String} start start time of the Meeting passed as a body parameter.
   * @apiParam {Boolean} end end time of the Meeting passed as a body parameter.
   * @apiParam {String} description Description of the Meeting passed as a body parameter.
   * @apiParam {String} location location of the Meeting passed as a body parameter.
   * @apiParam {Number} color Color for the Meeting passed as a body parameter.
   * 
   * 
   * 
   * @apiSuccessExample {json} Success-Response:
   *     {
   *                      "error":false,
   *                       "message":"Meeting Created Successfully!!",
   *                       "status":200,
   *                        "data":
   *                               {
   *                                   "color":{"primary":"#ff80c0","secondary":"#a4b3c6"},
   *                                   "_id":"5b82280c2202127f12eed901",
   *                                   "meetingId":"QdQ3Gy5Ps",
   *                                   "admin":"alex-admin",
   *                                   "title":"StandUp",
   *                                   "start":"Sunday, August 26, 2018 4:20 AM",
   *                                   "end":"Sunday, August 26, 2018 5:08 AM",
   *                                   "description":"Updates",
   *                                   "location":"TownHall",
   *                                   "createdOn":"2018-08-26T04:09:48.000Z",
   *                                   "__v":0
   *                               }
   *                  }
   *
   */


    
    app.put(baseUrl + '/update/:id', auth.isAuthenticated, meetingController.editMeeting);

      /**
   * @api {put}  /api/v1/meetings/update/:id   Update a Meeting 
   * @apiVersion 0.0.1
   * @apiName  Update  Meeting
   * @apiGroup For Admin Only
   *
   * @apiParam {String} authToken The token for authentication.(Send authToken as a query Param or header Param or Body param)
   * @apiParam {String} id Id of the Meeting passed as a URL parameter.
   * @apiParam {String} option  value to be changed passed as a body parameter
   * 
   * 
   * @apiSuccessExample {json} Success-Response:
   *     {
   *       "error": False,
   *       "message": "Meeting Updated Successfully!!",
   *        "status": 200,    
   *       "data": {
   *                   "n": 0,
   *                   "ok": 1
   *               }
   *     }
   *
   *
   */


    app.post(baseUrl + '/cancel/:id', auth.isAuthenticated, meetingController.cancelMeeting);
     /**
   * @api {post}  /api/v1/meetings/remove/:id    Delete a Meeting
   * @apiVersion 0.0.1
   * @apiName  Cancel  Meeting
   * @apiGroup For Admin Only
   *
   * @apiParam {String} authToken The token for authentication.(Send authToken as a query Param or header Param or Body param)
   * @apiParam {String} id Id of the Meeting passed as a URL parameter.
   * 
   * 
   * @apiSuccessExample {json} Success-Response:
   *     {
   *       "error": False,
   *       "message": "Meeting Deleted Successfully!!",
   *        "status": 200,    
   *        "data": {
   *                   "n": 0,
   *                   "ok": 1
   *               } 
   *     }
   *
   * 
   *
   * 
   *
   */

   }
   

module.exports = {
    setRouter: setRouter
}