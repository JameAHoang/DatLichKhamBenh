import { raw } from "body-parser";
import db from "../models/index.js";
import emailService from "../services/emailService.js";
require("dotenv").config;
import { v4 as uuidv4 } from "uuid";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};
let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.firstName ||
        !data.lastName ||
        !data.phoneNumber ||
        !data.address ||
        !data.reason ||
        !data.birthday ||
        !data.gender ||
        !data.doctorName ||
        !data.timeString
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

        await emailService.sendSimpleEamil({
          email: data.email,
          patientName: data.lastName + " " + data.firstName,
          time: data.timeString,
          doctorName: data.doctorName,
          redirectLink: buildUrlEmail(data.doctorId, token),
        });

        //upsert patient
        let patient = await db.Patient.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            birthday: data.birthday,
          },
        });

        if (patient) {
          // patient.firstName = data.firstName;
          // patient.lastName = data.lastName;
          // patient.address = data.address;
          // patient.phoneNumber = data.phoneNumber;
          // patient.gender = data.gender;
          // patient.birthday = data.birthday;
          // await patient.save();
          let countVisit = await db.Booking.findAndCountAll({
            where: { patientId: patient[0].id },
          });
          await db.Booking.findOrCreate({
            where: { patientId: patient[0].id, statusId: "S1" },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: patient[0].id,
              date: data.date,
              reason: data.reason,
              timeType: data.timeType,
              token: token,
              visit: countVisit.count + 1,
            },
          });

          resolve({
            errCode: 0,
            errMessage: "Save infor patient succeed!",
          });
        }
        let count = await db.Booking.findAndCountAll({
          where: {
            doctorId: data.doctorId,
            date: data.date,
            timeType: data.timeType,
          },
        });
        if (count) {
          let updateSchelude = await db.Schedule.findOne({
            where: {
              doctorId: data.doctorId,
              date: data.date,
              timeType: data.timeType,
            },
            raw: false,
          });
          if (updateSchelude) {
            updateSchelude.currentNumber = count.count;
            await updateSchelude.save();
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let postVerifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          resolve({
            errCode: 0,
            errMessage: "Update the appointment succeed!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has ben activated or dose not exist!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let putDoctorConfirmSuccess = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.statusId || !data.doctorId || !data.patientId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        await emailService.sendConfirm({
          email: data.email,
          patientName: data.patientName,
          time: data.time,
          doctorName: data.doctorName,
          language: data.language,
        });
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            statusId: "S2",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S3";
          await appointment.save();

          await db.History.create({
            patientId: data.patientId,
            doctorId: data.doctorId,
            timeType: data.timeType,
            reason: data.reason,
            date: data.date,
            visit: data.visit,
            files: data.files,
          });

          resolve({
            errCode: 0,
            errMessage: "Update the appointment succeed!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has ben confirm or dose not exist!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllPatients = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataPatient = await db.Patient.findAndCountAll({
        include: [
          {
            model: db.Allcode,
            as: "genderDataPatient",
            attributes: ["value"],
          },
        ],
        order: [["id", "ASC"]],
        raw: true,
        nest: true,
      });
      if (dataPatient) {
        resolve({
          errCode: 0,
          data: dataPatient,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let searchPatients = (dataSearch) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!dataSearch) {
        let data = await db.Patient.findAll({
          include: [
            {
              model: db.Allcode,
              as: "genderDataPatient",
              attributes: ["value"],
            },
          ],
          order: [["id", "ASC"]],
          raw: true,
          nest: true,
        });
        resolve({
          errCode: 0,
          data: data,
        });
      } else {
        let data = await db.Patient.findAll({
          where: {
            // id: dataSearch,
            [Op.or]: [
              { id: dataSearch },
              { firstName: { [Op.like]: "%" + dataSearch + "%" } },
              { lastName: { [Op.like]: "%" + dataSearch + "%" } },
              { address: { [Op.like]: "%" + dataSearch + "%" } },
            ],
          },
          include: [
            {
              model: db.Allcode,
              as: "genderDataPatient",
              attributes: ["value"],
            },
          ],
          order: [["id", "ASC"]],
          raw: true,
          nest: true,
        });
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let deleteBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let booking = await db.Booking.findOne({
        where: { id: data.id, statusId: data.statusId },
      });
      if (booking) {
        await db.Booking.destroy({
          where: { id: data.id, statusId: data.statusId },
        });
        resolve({
          errCode: 0,
          message: "Xóa thành công!",
        });
      }
      let count = await db.Booking.findAndCountAll({
        where: {
          doctorId: data.doctorId,
          date: data.date,
          timeType: data.timeType,
        },
      });
      if (count) {
        let updateSchelude = await db.Schedule.findOne({
          where: {
            doctorId: data.doctorId,
            date: data.date,
            timeType: data.timeType,
          },
          raw: false,
        });
        if (updateSchelude) {
          updateSchelude.currentNumber = count.count;
          await updateSchelude.save();
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let editPatient = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.id ||
        !data.firstName ||
        !data.lastName ||
        !data.phoneNumber ||
        !data.birthday ||
        !data.gender
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let patient = await db.Patient.findOne({
          where: {
            id: data.id,
          },
          raw: false,
        });
        if (patient) {
          patient.firstName = data.firstName;
          patient.lastName = data.lastName;
          patient.phoneNumber = data.phoneNumber;
          patient.birthday = data.birthday;
          patient.gender = data.gender;
          patient.address = data.address;
          await patient.save();
          resolve({
            errCode: 0,
            errMessage: "Sửa thông tin bệnh nhân thành công!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Không tồn tại id bệnh nhân!!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let deletePatient = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let patient = await db.Patient.findOne({
        where: { id: data.id },
      });
      if (patient) {
        await db.Patient.destroy({
          where: { id: data.id },
        });
        resolve({
          errCode: 0,
          message: "Xóa thành công!",
        });
      } else {
        resolve({
          errCode: 1,
          message: "Không tồn tại bệnh nhân!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getHistoryPatient = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataHistory = await db.History.findAll({
        include: [
          {
            model: db.Patient,
            as: "patientDataHistory",
            include: [
              {
                model: db.Allcode,
                as: "genderDataPatient",
                attributes: ["value"],
              },
            ],
          },
          {
            model: db.Allcode,
            as: "timeTypeDataHistory",
            attributes: ["value"],
          },
          {
            model: db.User,
            as: "doctorDataHistory",
            attributes: {
              exclude: ["password", "image"],
            },
          },
        ],
        order: [["date", "ASC"]],
        raw: true,
        nest: true,
      });
      if (dataHistory) {
        resolve({
          errCode: 0,
          data: dataHistory,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let searchHistoryPatient = (dataSearch) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!dataSearch) {
        let dataHistory = await db.History.findAll({
          include: [
            {
              model: db.Patient,
              as: "patientDataHistory",
              include: [
                {
                  model: db.Allcode,
                  as: "genderDataPatient",
                  attributes: ["value"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataHistory",
              attributes: ["value"],
            },
            {
              model: db.User,
              as: "doctorDataHistory",
              attributes: {
                exclude: ["password", "image"],
              },
            },
          ],
          order: [["date", "ASC"]],
          raw: true,
          nest: true,
        });

        resolve({
          errCode: 0,
          data: dataHistory,
        });
      } else {
        let dataHistory = await db.History.findAll({
          where: { patientId: dataSearch },
          include: [
            {
              model: db.Patient,
              as: "patientDataHistory",
              include: [
                {
                  model: db.Allcode,
                  as: "genderDataPatient",
                  attributes: ["value"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataHistory",
              attributes: ["value"],
            },
            {
              model: db.User,
              as: "doctorDataHistory",
              attributes: {
                exclude: ["password", "image"],
              },
            },
          ],
          order: [["date", "ASC"]],
          raw: true,
          nest: true,
        });

        resolve({
          errCode: 0,
          data: dataHistory,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
  putDoctorConfirmSuccess: putDoctorConfirmSuccess,
  getAllPatients: getAllPatients,
  searchPatients: searchPatients,
  deleteBookAppointment: deleteBookAppointment,
  editPatient: editPatient,
  deletePatient: deletePatient,
  getHistoryPatient: getHistoryPatient,
  searchHistoryPatient: searchHistoryPatient,
};
