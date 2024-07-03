import db from "../models/index.js";
require("dotenv").config;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
let checkCodeSpecialty = (code) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findOne({
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
let createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.name || !data.code) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let isExist = await checkCodeSpecialty(data.code);

        if (!isExist) {
          await db.Specialty.create({
            code: data.code,
            name: data.name,
            image: data.image,
          });
          resolve({
            errCode: 0,
            errMessage: "Create a new specialty succeed!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Specialist has existed!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let specialty = await db.Specialty.findAll({
        attributes: ["id", "code", "name", "image"],

        include: [
          {
            model: db.Markdown,
            attributes: ["specialtyId", "contentHTML", "contentMarkdown"],
          },
        ],
        raw: true,
        nest: true,
      });
      if (!specialty) specialty = {};

      resolve({
        errCode: 0,
        data: specialty,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let checkDetailSpecialty = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Markdown.findOne({
        where: { specialtyId: id },
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
let createDetailSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.specialtyId || !data.contentHTML || !data.contentMarkdown) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let check = await checkDetailSpecialty(data.specialtyId);
        if (!check) {
          await db.Markdown.create({
            specialtyId: data.specialtyId,
            contentHTML: data.contentHTML,
            contentMarkdown: data.contentMarkdown,
          });
          resolve({
            errCode: 0,
            errMessage: "Create detail specialty succeed!",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Detail Specialist has existed!",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailSpecialtyById = (inputId) => {
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
            specialtyId: inputId,
          },
          attributes: ["id", "contentHTML", "contentMarkdown", "specialtyId"],
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

let getDetailSpecialtyDoctorLocation = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = {};
        // data = await db.Markdown.findOne({
        //   where: {
        //     specialtyId: inputId,
        //   },
        //   attributes: ["specialtyId", "contentHTML", "contentMarkdown"],
        // });
        data = await db.Specialty.findOne({
          where: {
            id: inputId,
          },
          attributes: ["id", "code", "name"],
          include: [
            {
              model: db.Markdown,
              attributes: ["specialtyId", "contentHTML", "contentMarkdown"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (data) {
          if (location === "ALL") {
            let doctorSpecialty = await db.Doctor_Infor.findAll({
              where: {
                specialtyId: inputId,
              },
              attributes: ["doctorId", "provinceId"],
            });
            data.doctorSpecialty = doctorSpecialty;
          } else {
            let doctorSpecialty = await db.Doctor_Infor.findAll({
              where: {
                specialtyId: inputId,
                provinceId: location,
              },
              attributes: ["doctorId", "provinceId"],
            });
            data.doctorSpecialty = doctorSpecialty;
          }
        } else {
          data = {};
        }

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

let deleteSpecialty = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let specialty = await db.Specialty.findOne({
        where: { id: id },
        raw: false,
      });
      if (specialty) {
        await db.Specialty.destroy({
          where: { id: id },
        });
        await db.Doctor_Infor.update(
          {
            specialtyId: null,
          },
          {
            where: { specialtyId: id },
          }
        );
        await db.Markdown.destroy({
          where: { specialtyId: id },
        });

        resolve({
          errCode: 0,
          message: `The user is deleted`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let editSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let specialty = await db.Specialty.findOne({
        where: {
          id: data.id,
        },
        raw: false,
      });
      if (specialty) {
        specialty.code = data.code;
        specialty.name = data.name;
        specialty.image = data.image;
        await specialty.save();
        resolve({
          errCode: 0,
          message: "Update specialty succeed!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Specialty's not found!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let editDetailSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let specialty = await db.Markdown.findOne({
        where: {
          specialtyId: data.id,
        },
        raw: false,
      });
      if (specialty) {
        specialty.contentHTML = data.contentHTML;
        specialty.contentMarkdown = data.contentMarkdown;
        await specialty.save();
        resolve({
          errCode: 0,
          message: "Update specialty succeed!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Specialty's not found!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let deleteDetailSpecialty = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let specialty = await db.Markdown.findOne({
        where: { specialtyId: id },
        raw: false,
      });
      if (specialty) {
        await db.Markdown.destroy({
          where: { specialtyId: id },
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

let searchSpecialty = (dataSearch) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!dataSearch) {
        let data = await db.Specialty.findAll({
          order: [["id", "ASC"]],
        });
        resolve({
          errCode: 0,
          data: data,
        });
      } else {
        let data = await db.Specialty.findAll({
          where: {
            [Op.or]: [
              { code: { [Op.like]: "%" + dataSearch + "%" } },
              { name: { [Op.like]: "%" + dataSearch + "%" } },
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
  createSpecialty,
  getAllSpecialty,
  createDetailSpecialty,
  getDetailSpecialtyById,
  getDetailSpecialtyDoctorLocation,
  deleteSpecialty,
  editSpecialty,
  editDetailSpecialty,
  deleteDetailSpecialty,
  searchSpecialty,
};
