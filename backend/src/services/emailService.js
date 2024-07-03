require("dotenv").config();
import nodemailer from "nodemailer";
let sendSimpleEamil = async (data) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.PASSWORD_APP, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Nguyễn Đức Hoàng Anh 👻" <hoanganhdev99@gmail.com>', // sender address
    to: data.email, // list of receivers
    subject: getSubject(data), // Subject line
    // text: "Hello world?", // plain text body
    html: getBodyHTMLEmail(data), // html body
  });
};

let getBodyHTMLEmail = (data) => {
  let result = `
    <h3>Xin chào ${data.patientName}!</h3
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Jame</p>
    <p>Thông tin đặt lịch khám bênh:</p>
    <div><b>Thời gian: ${data.time}</b></div>
    <div><b>Bác sĩ: ${data.doctorName}</b></div>
    <p>Nếu các thông tin trên là đúng sự thật. vui lòng bấm vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
    <div>
        <a href=${data.redirectLink} target="_blank">Bấm vào đây</a>
    </div>

    <div>Xin chân thành cảm ơn!</div>
    `;

  return result;
};

let getSubject = (data) => {
  let result = `
    Thông tin đặt lịch khám bệnh
    `;

  return result;
};

let sendConfirm = async (data) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP, // generated ethereal user
      pass: process.env.PASSWORD_APP, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Nguyễn Đức Hoàng Anh 👻" <hoanganhdev99@gmail.com>', // sender address
    to: data.email, // list of receivers
    subject: getSubjectConfirm(data), // Subject line
    // text: "Hello world?", // plain text body
    html: getBodyHTMLEmailConfirm(data), // html body
  });
};
let getSubjectConfirm = (data) => {
  let result = `
      Xác nhận khám bệnh thành công
    `;
  return result;
};

let getBodyHTMLEmailConfirm = (data) => {
  let result = `
    <h3>Xin chào ${data.patientName}!</h3
    <p>Xác nhận bạn đã khám bệnh thành công. Cảm ơn bạn đã sử dụng dịch vụ đặt lịch khám bệnh online trên Booking Jame</p>
    <p>Thông tin khám bệnh:</p>
    <div><b>Thời gian: ${data.time}</b></div>
    <div><b>Bác sĩ: ${data.doctorName}</b></div>
   
    <div>Xin chân thành cảm ơn!</div>
    `;

  return result;
};
module.exports = {
  sendSimpleEamil,
  sendConfirm,
};
