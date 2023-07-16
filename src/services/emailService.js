require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        },
    })

    let info = await transporter.sendMail({
        from: '"Minh PK👻" <minh.phambku51@hcmut.edu.vn>', // sender address
        to: dataSend.receiverEmail,   //"bar@example.com, baz@example.com",  list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        // text: "Hello world?", // plain text body
        html: getBodyHTMLEmail(dataSend), // html body
    })
}


// main().catch(console.error);
let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian : ${dataSend.time}</b></div>
        <div><b>Bác sĩ : ${dataSend.doctorName}</b></div>
        <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới
         để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        <div>Xin chân thành cảm ơn</div>

        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You received this email because you booked an online medical appointment on Booking Care</p>
        <p>Information to book a medical appointment:</p>
        <div><b>Time : ${dataSend.time}</b></div>
        <div><b>BDoctor : ${dataSend.doctorName}</b></div>
        <p>If the above information is true, please click on the link below
        to confirm and complete the medical appointment booking procedure</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        <div>Thank you</div>

        `
    }
    return result;
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care thành công</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm</p>

        <div>Xin chân thành cảm ơn</div>

        `
    }
    if (dataSend.language === 'en') {
        result =
            `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You received this email because you booked an online medical appointment on Booking Care</p>
        <div>Thank you</div>

        `
    }
    return result;
}

let sendAttachment = async(dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        },
    })

    let info = await transporter.sendMail({
        from: '"Minh PK👻" <minh.phambku51@hcmut.edu.vn>', // sender address
        to: dataSend.email,   //"bar@example.com, baz@example.com",  list of receivers
        subject: "Kết quả đặt lịch khám bệnh", // Subject line
        // text: "Hello world?", // plain text body
        html: getBodyHTMLEmailRemedy(dataSend), // html body
        attachments:[
            {
                filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split("base64,")[1],
                encoding: 'base64'
            },
        ],
    })
}
module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
}