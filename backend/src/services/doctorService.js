import { raw } from "body-parser";
import db from "../models/index.js";
require("dotenv").config;
import _ from "lodash";
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
let getTopDoctorHome = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["value"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["value"],
          },
        ],
        raw: true,
        nest: true,
        where: { roleId: "R2" },
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getAllDoctors = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        attributes: {
          exclude: ["password", "image"],
        },
        where: { roleId: "R2" },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown ||
        !inputData.priceId ||
        !inputData.paymentId ||
        !inputData.provinceId ||
        !inputData.specialtyId ||
        !inputData.clinicId ||
        !inputData.description
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        //upsert to Markdown
        if (inputData.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            doctorId: inputData.doctorId,
          });
        } else if (inputData.action === "EDIT") {
          let doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = inputData.contentHTML;
            doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
            await doctorMarkdown.save();
          }
        }

        //upsert to Doctor_infor table

        let doctorInfor = await db.Doctor_Infor.findOne({
          where: {
            doctorId: inputData.doctorId,
          },
          raw: false,
        });

        if (doctorInfor) {
          //update
          doctorInfor.doctorId = inputData.doctorId;
          doctorInfor.priceId = inputData.priceId;
          doctorInfor.paymentId = inputData.paymentId;
          doctorInfor.provinceId = inputData.provinceId;
          doctorInfor.description = inputData.description;
          doctorInfor.note = inputData.note;
          doctorInfor.specialtyId = inputData.specialtyId;
          doctorInfor.clinicId = inputData.clinicId;
          await doctorInfor.save();
        } else {
          //create
          await db.Doctor_Infor.create({
            doctorId: inputData.doctorId,
            priceId: inputData.priceId,
            paymentId: inputData.paymentId,
            provinceId: inputData.provinceId,
            note: inputData.note,
            specialtyId: inputData.specialtyId,
            clinicId: inputData.clinicId,
            description: inputData.description,
          });
        }

        resolve({
          errCode: 0,
          errMessage: "Save infor doctor succeed!",
        });
      }
    } catch (error) {
      reject(0);
    }
  });
};

let getDetailDoctorById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: inputId,
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["value"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["value"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["value"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["value"],
                },
              ],
            },
          ],
          raw: true,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (!data) data = {};
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
let bulkCreateScheduleService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
        resolve({
          errCode: -1,
          errMessage: "Missing required param !",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            item.currentNumber = 0;
            return item;
          });
        }

        //get all existing data

        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formatedDate },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });

        // //convert date
        // if (existing && existing.length > 0) {
        //   existing = existing.map((item) => {
        //     item.date = new Date(item.date).getTime();
        //     return item;
        //   });
        // }

        //compare different
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && +a.date === +b.date;
        });

        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }
        resolve({
          errCode: 0,
          errMessage: "OK",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: +date,
            currentNumber: 0,
          },
          order: [["timeType", "DESC"]],
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["value"],
            },

            {
              model: db.User,
              as: "doctorData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (!dataSchedule) dataSchedule = [];
        resolve({
          errCode: 0,
          data: dataSchedule,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getExtraInforDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Doctor_Infor.findOne({
          where: {
            doctorId: doctorId,
          },
          attributes: {
            exclude: ["id", "doctorId"],
          },
          include: [
            {
              model: db.Allcode,
              as: "priceTypeData",
              attributes: ["value"],
            },
            {
              model: db.Allcode,
              as: "provinceTypeData",
              attributes: ["value"],
            },
            {
              model: db.Allcode,
              as: "paymentTypeData",
              attributes: ["value"],
            },
            {
              model: db.Clinic,
              attributes: {
                exclude: ["image"],
              },
            },
          ],
          raw: true,
          nest: true,
        });

        if (!data) data = {};
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

let getProfileDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.User.findOne({
          where: {
            id: doctorId,
            roleId: "R2",
          },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["value"],
            },
            {
              model: db.Doctor_Infor,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["value"],
                },
                {
                  model: db.Allcode,
                  as: "provinceTypeData",
                  attributes: ["value"],
                },
                {
                  model: db.Allcode,
                  as: "paymentTypeData",
                  attributes: ["value"],
                },
              ],
            },
          ],
          raw: true,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {}
  });
};

let getAllDoctorsByPositionSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        attributes: {
          exclude: ["password"],
        },
        where: { roleId: "R2" },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["value"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["value"],
          },
          {
            model: db.Doctor_Infor,

            include: [
              {
                model: db.Specialty,
                attributes: {
                  exclude: ["image"],
                },
              },
            ],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getListPatientForDoctor = (doctorId, date, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date || !status) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            statusId: status,
            doctorId: doctorId,
            date: date,
          },
          attributes: [
            "statusId",
            "doctorId",
            "patientId",
            "date",
            "reason",
            "timeType",
            "visit",
            "id",
          ],
          include: [
            {
              model: db.Patient,
              as: "patientData",
              attributes: [
                "email",
                "firstName",
                "lastName",
                "address",
                "phoneNumber",
                "gender",
                "birthday",
              ],
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
              as: "timeTypeDataPatient",
              attributes: ["value"],
            },
            {
              model: db.User,
              as: "doctorDataBooking",
              attributes: ["id", "firstName", "lastName"],
            },
          ],

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

let deleteDoctorInfor = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctor = await db.Doctor_Infor.findOne({
        where: { doctorId: id },
        raw: false,
      });
      if (doctor) {
        await db.Doctor_Infor.destroy({
          where: { doctorId: id },
        });
        await db.Markdown.destroy({
          where: { doctorId: id },
        });
        resolve({
          errCode: 0,
          message: `delete success`,
        });
      } else {
        resolve({
          errCode: 1,
          message: `delete failed`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let searchDoctors = (dataSearch) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!dataSearch) {
        let doctors = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
          where: { roleId: "R2" },
          include: [
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["value"],
            },
            {
              model: db.Allcode,
              as: "genderData",
              attributes: ["value"],
            },
            {
              model: db.Doctor_Infor,

              include: [
                {
                  model: db.Specialty,
                  attributes: {
                    exclude: ["image"],
                  },
                },
              ],
            },
          ],
          raw: true,
          nest: true,
        });
        resolve({
          errCode: 0,
          data: doctors,
        });
      } else {
        let doctors = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
          where: {
            roleId: "R2",
            [Op.or]: [
              { firstName: { [Op.like]: "%" + dataSearch + "%" } },
              { lastName: { [Op.like]: "%" + dataSearch + "%" } },
              { address: { [Op.like]: "%" + dataSearch + "%" } },
            ],
          },
          include: [
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["value"],
            },
            {
              model: db.Allcode,
              as: "genderData",
              attributes: ["value"],
            },
            {
              model: db.Doctor_Infor,

              include: [
                {
                  model: db.Specialty,
                  attributes: {
                    exclude: ["image"],
                  },
                },
              ],
            },
          ],
          raw: true,
          nest: true,
        });
        resolve({
          errCode: 0,
          data: doctors,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctors: getAllDoctors,
  saveDetailInforDoctor: saveDetailInforDoctor,
  getDetailDoctorById: getDetailDoctorById,
  bulkCreateScheduleService: bulkCreateScheduleService,
  getScheduleByDate: getScheduleByDate,
  getExtraInforDoctorById: getExtraInforDoctorById,
  getProfileDoctorById: getProfileDoctorById,
  getAllDoctorsByPositionSpecialty: getAllDoctorsByPositionSpecialty,
  getListPatientForDoctor: getListPatientForDoctor,
  deleteDoctorInfor: deleteDoctorInfor,
  searchDoctors: searchDoctors,
};
