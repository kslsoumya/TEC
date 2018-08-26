let socketio = require('socket.io')
const events = require('events')
const mongoose = require('mongoose')
const tokenLib = require('../libs/tokenLib')
const nodemailer = require('nodemailer');
const userModel = mongoose.model('User');
var schedule = require('node-schedule');
const moment = require('moment')


let setServer = (server) => {
    let onlineUsers = [];

    let io = socketio.listen(server)
    let myIo = io.of('/')

    myIo.on('connection', (socket) => {
        socket.emit('verifyUser', "")

        socket.on('set-user', (authToken) => {
            console.log('set-user called')
            tokenLib.verifyClaimWithoutSecret(authToken, (err, user) => {
                if (err) {
                    socket.emit('auth-error', { status: 500, error: 'Please provide correct auth Token' })
                } else {
                    console.log('user is verified.. setting details of user')
                    let currentUser = user.data;
                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName}${currentUser.lastName}`
                    if (currentUser.isAdmin) {
                        // console.log(currentUser.isAdmin + '--------isAdmin')
                        socket.join('admins');
                    } else {
                        if(onlineUsers.indexOf(fullName) === -1) {
                        onlineUsers.push(fullName)
                        socket.join('users');
                        }
                    }
                    console.log('emitting usersList' + onlineUsers);
                        socket.to('admins').emit('online-user-list', onlineUsers)
                }
            })
        })
        socket.on('refresh',()=>{
            console.log('emitting usersList' + onlineUsers);
            socket.emit('online-user-list', onlineUsers)

        })


        socket.on('planMeeting', (event) => {
            console.log(event.end + '----------date');
            socket.broadcast.to('users').emit('meeting', event.title);
            let mailBody = `Hi,<br/> This is an invitation to the ${event.title}
                        <br/> <b>Hope to meet you at the meeting.</b>`;
            let mailSubject = `Invite`
            const mail = {
                subject: mailSubject,
                body: mailBody
            }
            sendEmail(mail);
            let startTime = new Date((moment(moment(event.start).subtract(1, 'minutes')).format('LLLL')));
            let endTime = new Date(moment(event.start).format('LLLL'));
            var j = schedule.scheduleJob(startTime, function () {
                let obj = {
                    title: event.title,
                    start: event.start,
                    end : endTime,
                    msg: `You have a meeting at ${endTime}`
                }
                socket.to('users').emit('notification', obj);
            });
        })
        socket.on('snooze', (data) => {
            let startTime = new Date(Date.now() + 5000);
            let endTime = new Date(data.end);
            var j = schedule.scheduleJob(data.title,{ start: startTime, end: endTime, rule: '/5 * * * * * *' }, function () {
                let obj = {
                    title: data.title,
                    start: startTime,
                    msg: `You have a meeting at ${endTime}`
                }
                socket.emit('notification', obj);
            });
        })

        socket.on('cancelSnooze',(title) =>{
            var job = schedule.scheduledJobs[title];
                job.cancel();
        })

        socket.on('modifyMeeting', (title) => {
            console.log('Emitted edit meetin--------------')
            socket.to('users').emit('meetingChanged', title);
            let mailBody = `Hi, <br/> This is to notify you about the changes in ${title}<br/> 
                        <b>Hope to meet you at the meeting.</b>`;
            // let mailHtml = `<b>Hope to meet you at the meeting.</b>`;
            let mailSubject = `Update on Meeting`
            const mail = {
                subject: mailSubject,
                body: mailBody
            }

            sendEmail(mail);

        })
        socket.on('cancelMeeting', (title) => {
            socket.to('users').emit('meetingCancelled', title);
            let mailBody = `Hi,<br/> This is to notify you that ${title} has been cancelled!!<br/>
                        <b>sorry for the inconvience.Looking forward to meet you</b>`;
            let mailSubject = `Meeting Cancelled`
            const mail = {
                subject: mailSubject,
                body: mailBody
            }

            sendEmail(mail);
        })
        socket.on('disConnect', () => {
            console.log('user is disconnected');
            console.log(socket.userId)
            var removeIndex = onlineUsers.map((user) => {
                return user.userId
            }).indexOf(socket.userId)
            onlineUsers.splice(removeIndex, 1)
            console.log(onlineUsers)
            socket.broadcast.to('admins').emit('online-user-list', onlineUsers)
            socket.leave(socket.room)
        })
    })
}





sendEmail = (mail) => {
    let recepients = [];
    userModel.find({ isAdmin: false })
        .select('-__v -_id')
        .lean()
        .exec((err, result) => {
            result.forEach(element => {
                recepients.push(element.email);

            });
        });

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'dprivate00@gmail.com',
            pass: 'lkjhgfdsa0987'
        }
    })
    var mailOptions = {
        from: '"Plan It" <dprivate00@gmail.com>',
        to: recepients,
        subject: mail.subject,
        html: mail.body
    }
    console.log(mail.body + 'body----------');

    transporter.sendMail(mailOptions, (error, resp) => {
        if (error) {
            console.log(error + 'In sending Mail------------');
            socket.to(admins).emit('mail-error', { status: 500, error: 'Email has not been sent' })

        } else {
            console.log(resp);
            console.log('Successfully sent an email!!');
        }

    })
}

module.exports = {
    setServer: setServer
}