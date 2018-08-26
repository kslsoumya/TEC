const express = require('express');
const router = express.Router();
const userController = require("./../../app/controllers/userController");
const appConfig = require("./../../config/appConfig")

const auth = require('../middlewares/Auth');

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`;

    // defining routes.
    // params: firstName, lastName, email, mobile, password
    app.post(`${baseUrl}/signup`, userController.signUpUser);

    /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/signup User SignUp.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     * @apiParam {string} firstName firstName of the user. (body params) (required)
     * @apiParam {string} lastName lastName of the user. (body params) (required)
     * @apiParam {string} mobile mobile of the user. (body params) (required)
     * @apiParam {Boolean} isAdmin isAdmin. (body params) (required)
     * 
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "User Created Successfully",
            "status": 200,
            "data": {
                        "userId": "u_a5AQZcF",
                        "firstName": "Simran",
                        "lastName": "Talwar",
                        "email": "SimranTalwar@gmail.com",
                        "mobile": 910090909011,
                        "isOnline": false,
                        "isAdmin": false,
                        "createdOn": "2018-08-26T04:04:10.000Z"
                    }
        }
    */

    app.post(`${baseUrl}/login`, userController.loginUser);

    
    /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/login User Login.
     *
     * @apiParam {string} email email of the user. (body params) (required)
     * @apiParam {string} password password of the user. (body params) (required)
     *
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Login Successful",
            "status": 200,
            "data": {
                "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.A",
                "userDetails": {
                    "userId": "u_a5AQZcF",
                    "firstName": "Simran",
                    "lastName": "Talwar",
                    "email": "SimranTalwar@gmail.com",
                    "mobile": 910090909011,
                    "isOnline": false,
                    "isAdmin": false
                    }
        }
    */

    
    app.put(`${baseUrl}/forgotPwd`, userController.resetPwd);

      /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {put} /api/v1/users/forgotPwd  Reset Password
     *
     * @apiParam {string} email email of the user. (body params) (required)
     *
     * 
     * @apiSuccessExample {object} Success-Response:
         {
            "error": false,
            "message": "Password Reset Successful",
            "status": 200,
             "data": {
                        "userId": "u_a5AQZcF",
                        "firstName": "Simran",
                        "lastName": "Talwar",
                        "email": "SimranTalwar@gmail.com",
                        "mobile": 910090909011,
                        "isOnline": false,
                        "isAdmin": false
                    }
          }
 */

app.get(`${baseUrl}/get/all`,auth.isAuthenticated,userController.listAllUsers);


 /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {get} /api/v1/users/get/all  Get All Users
     *
     * @apiParam {authToken} authToken authToken of the user. (body params or query param) (required)
     *
     * 
     * @apiSuccessExample {object} Success-Response:
         {
                "error": false,
                "message": "Users Found Succesfully!!",
                "status": 200,
                "data": [
                            {
                                "userId": "uS7nUkTGC",
                                "firstName": "Jacob",
                                "lastName": "Harry",
                                "email": "JacobHarry@gmail.com",
                                "mobile": 919898989898,
                                "isOnline": false,
                                "isAdmin": true,
                                "createdOn": "2018-08-25T06:55:06.000Z"
                            }
                        ]

        }
 */



    app.post(`${baseUrl}/logout`, userController.logoutUser);

    
    /**
     * @apiGroup Users
     * @apiVersion  1.0.0
     * @api {post} /api/v1/users/logout  User Logout.
     *
     * 
     * @apiParam {string} authToken authToken of the user.(params or bodyParams or queryParams)(required)
     *
     * @apiSuccess {object} myResponse shows error status, message, http status code, result.
     * 
     * @apiSuccessExample {object} Success-Response:
     *    {
     *       "error": false,
     *       "message": "Logged Out Successfully",
     *       "status": 200,
     *       "data": {
     *                   "n": 0,
     *                   "ok": 1
     *               }
     *   }
     * 
     * 
    */


}
