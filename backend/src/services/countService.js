import db from "../models/index.js";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
require("dotenv").config;
let getCountDoctor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctor = await db.User.findAndCountAll({
        where: {
          roleId: "R2",
        },
      });
      resolve({
        errCode: 0,
        data: doctor.count,
        errMessage: "Thành công!",
      });
    } catch (error) {
      reject(error);
    }
  });
};
let getCountPatient = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctor = await db.Patient.findAndCountAll();
      resolve({
        errCode: 0,
        data: doctor.count,
        errMessage: "Thành công!",
      });
    } catch (error) {
      reject(error);
    }
  });
};
let getCountSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctor = await db.Specialty.findAndCountAll();
      resolve({
        errCode: 0,
        data: doctor.count,
        errMessage: "Thành công!",
      });
    } catch (error) {
      reject(error);
    }
  });
};
let getCountClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctor = await db.Clinic.findAndCountAll();
      resolve({
        errCode: 0,
        data: doctor.count,
        errMessage: "Thành công!",
      });
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  getCountDoctor,
  getCountPatient,
  getCountSpecialty,
  getCountClinic,
};
