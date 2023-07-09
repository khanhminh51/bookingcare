import { reject } from "lodash";
import db from "../../models/index";
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

require('dotenv').config();

let buildUrlEmail = (doctorId,token) => {


    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date
                || !data.fullName) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            else {
                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                });
                //upsert patient
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    },
                });
                //create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor patient succeed!'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let postVefifyBookAppointment = (data) =>{
    return new Promise(async(resolve, reject)=>{
        try {
            if (!data.token || !data.doctorId ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            }
            else{
                let appoinment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if(appoinment){
                    appoinment.statusId = 'S2';
                    await appoinment.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appoitment succeed!'
                    })
                }
                else{
                    resolve({
                        errCode: 2,
                        errMessage: 'Appoitment has been activated or does not exist!'
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVefifyBookAppointment:postVefifyBookAppointment,
}