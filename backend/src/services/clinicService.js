import db from "../models/index.js";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
require("dotenv").config;
let checkCodeClinic = (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findOne({
        where: { code: code },
      });
      if (data) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(e);
    }
  });
};
let createClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.name || !data.code || !data.address) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let isExist = await checkCodeClinic(data.code);

        if (!isExist) {
          await db.Clinic.create({
            code: data.code,
            name: data.name,
            address: data.address,
            image: data.image,
          });
          resolve({
            errCode: 0,
            errMessage: "Create a new clinic succeed!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Clinic has existed!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll({
        attributes: ["id", "code", "name", "address", "image"],
      });
      if (!data) data = {};
      resolve({
        errCode: 0,
        data: data,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let checkDetailClinic = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Markdown.findOne({
        where: { clinicId: id },
      });
      if (data) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(e);
    }
  });
};
let createDetailClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.clinicId || !data.contentMarkdown || !data.contentHTML) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let isExist = await checkDetailClinic(data.clinicId);

        if (!isExist) {
          await db.Markdown.create({
            clinicId: data.clinicId,
            contentHTML: data.contentHTML,
            contentMarkdown: data.contentMarkdown,
          });
          resolve({
            errCode: 0,
            errMessage: "Create detail clinic succeed!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Detail Clinic has existed!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getDetailClinicById = (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Markdown.findOne({
          where: {
            clinicId: inputId,
          },
          attributes: ["id", "contentHTML", "contentMarkdown", "clinicId"],
        });
        resolve({
          errCode: 0,
          data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getClinicByAddress = (address) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!address) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Clinic.findAll({
          where: {
            address: {
              [Op.like]: `%${address}%`,
            },
          },
          attributes: ["id", "code", "name", "address"],
        });
        if (!data) data = {};
        resolve({
          errCode: 0,
          data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailClinicDoctorById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Doctor_Infor.findAll({
          where: {
            clinicId: id,
          },
        });
        console.log("checkk id", id);
        resolve({
          errCode: 0,
          data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let editDetailClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinic = await db.Markdown.findOne({
        where: {
          clinicId: data.id,
        },
        raw: false,
      });
      if (clinic) {
        clinic.contentHTML = data.contentHTML;
        clinic.contentMarkdown = data.contentMarkdown;
        await clinic.save();
        resolve({
          errCode: 0,
          message: "Update clinic succeed!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Clinic's not found!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deletaDetailClinic = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinic = await db.Markdown.findOne({
        where: { clinicId: id },
        raw: false,
      });

      if (clinic) {
        await db.Markdown.destroy({
          where: { clinicId: id },
        });
        resolve({
          errCode: 0,
          message: `delete success`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let deleteClinic = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinic = await db.Clinic.findOne({
        where: { id: id },
        raw: false,
      });

      if (clinic) {
        await db.Clinic.destroy({
          where: { id: id },
        });
        await db.Doctor_Infor.update(
          {
            clinicId: null,
          },
          {
            where: { clinicId: id },
          }
        );
        await db.Markdown.destroy({
          where: { clinicId: id },
        });
        resolve({
          errCode: 0,
          message: `delete success`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let editClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let clinic = await db.Clinic.findOne({
        where: {
          id: data.id,
        },
        raw: false,
      });
      if (clinic) {
        clinic.code = data.code;
        clinic.name = data.name;
        clinic.address = data.address;
        clinic.image = data.image;
        await clinic.save();
        resolve({
          errCode: 0,
          message: "Update clinic succeed!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Clinic's not found!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let searchClinics = (dataSearch) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!dataSearch) {
        let data = await db.Clinic.findAll({
          order: [["id", "ASC"]],
        });
        resolve({
          errCode: 0,
          data: data,
        });
      } else {
        let data = await db.Clinic.findAll({
          where: {
            [Op.or]: [
              { code: { [Op.like]: "%" + dataSearch + "%" } },
              { name: { [Op.like]: "%" + dataSearch + "%" } },
              { address: { [Op.like]: "%" + dataSearch + "%" } },
            ],
          },
          order: [["id", "ASC"]],
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
module.exports = {
  createClinic,
  getAllClinic,
  createDetailClinic,
  getDetailClinicById,
  getClinicByAddress,
  getDetailClinicDoctorById,
  editDetailClinic,
  deletaDetailClinic,
  deleteClinic,
  editClinic,
  searchClinics,
};
