import db from "../models/index.js";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    let userData = {};
    try {
      let isExist = await checkUserEmail(email);
      if (isExist) {
        //user already exist
        //compare password
        let user = await db.User.findOne({
          attributes: [
            "id",
            "email",
            "roleId",
            "password",
            "firstName",
            "lastName",
          ],
          where: { email: email },
          include: [
            {
              model: db.Allcode,
              as: "roleData",
              attributes: ["value"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (user) {
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Đăng nhập thành công!";
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Sai mật khẩu";
          }
        }
      } else {
        //return error
        userData.errCode = 1;
        userData.errMessage = `Email không tồn tại!.`;
        resolve(userData);
      }
      resolve(userData);
    } catch (error) {
      reject(error);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(e);
    }
  });
};

let getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (userId && userId !== "ALL") {
        users = await db.User.findOne({
          where: { id: userId },
          exclude: ["password"],
        });
      }
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};
let hasUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};
let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          message: "Your email is already in used, Plz try another email!",
        });
      } else {
        let hashPasswordFromBcrypt = await hasUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phonenumber: data.phonenumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
          image: data.image,
          birthday: data.birthday,
        });
        resolve({
          errCode: 0,
          message: "OK",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let deleteNewUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: id },
      });
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: `The user isn't exist`,
        });
      }
      if (user) {
        await db.User.destroy({
          where: { id: id },
        });
        await db.Doctor_Infor.destroy({
          where: { doctorId: id },
        });
        await db.Markdown.destroy({
          where: { doctorId: id },
        });
        await db.Booking.destroy({
          where: { patientId: id },
        });
      }
      resolve({
        errCode: 0,
        message: `The user is deleted`,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.roleId || !data.gender) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });

      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.roleId = data.roleId;
        user.positionId = data.positionId;
        user.gender = data.gender;
        user.phonenumber = data.phonenumber;
        user.birthday = data.birthday;
        if (data.image) {
          user.image = data.image;
        }
        await user.save();
        resolve({
          errCode: 0,
          message: "Update the user succeed!",
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "User's not found!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errCode = 0;
        res.data = allcode;
        resolve(res);
      }
    } catch (error) {
      reject(error);
    }
  });
};
let handleGetUsersByRole = (roleId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!roleId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let data = "";
        if (roleId === "R0") {
          data = await db.User.findAll({
            attributes: {
              exclude: ["password"],
            },
          });
        }
        if (roleId && roleId !== "R0") {
          data = await db.User.findAll({
            where: { roleId: roleId },
            attributes: {
              exclude: ["password"],
            },
          });
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
let getUserByRoleName = (roleId, name) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!roleId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters",
        });
      } else {
        let data = "";

        if (roleId && !name) {
          if (roleId === "R0") {
            data = await db.User.findAll({
              attributes: {
                exclude: ["password"],
              },
            });
          } else {
            data = await db.User.findAll({
              where: {
                roleId: roleId,
              },
              attributes: {
                exclude: ["password"],
              },
            });
          }
        } else {
          if (roleId === "R0") {
            data = await db.User.findAll({
              attributes: {
                exclude: ["password"],
              },

              where: {
                [Op.or]: [
                  { firstName: { [Op.like]: "%" + name + "%" } },
                  { lastName: { [Op.like]: "%" + name + "%" } },
                  { address: { [Op.like]: "%" + name + "%" } },
                ],
              },
              raw: true,
              nest: true,
            });
          }
          if (roleId && roleId == "R1") {
            data = await db.User.findAll({
              where: {
                [Op.and]: [
                  {
                    roleId: roleId,
                  },
                  {
                    [Op.or]: [
                      { firstName: { [Op.like]: "%" + name + "%" } },
                      { lastName: { [Op.like]: "%" + name + "%" } },
                      { address: { [Op.like]: "%" + name + "%" } },
                    ],
                  },
                ],
              },
              attributes: {
                exclude: ["password"],
              },
            });
          }
          if (roleId && roleId == "R2") {
            data = await db.User.findAll({
              where: {
                [Op.and]: [
                  {
                    roleId: roleId,
                  },
                  {
                    [Op.or]: [
                      { firstName: { [Op.like]: "%" + name + "%" } },
                      { lastName: { [Op.like]: "%" + name + "%" } },
                      { address: { [Op.like]: "%" + name + "%" } },
                    ],
                  },
                ],
              },
              attributes: {
                exclude: ["password"],
              },
            });
          }
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

let searchUsers = (dataSearch) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!dataSearch) {
        let data = await db.User.findAll({
          attributes: {
            exclude: ["password", "image"],
          },
        });
        resolve({
          errCode: 0,
          data: data,
        });
      } else {
        let data = await db.User.findAll({
          attributes: {
            exclude: ["password", "image"],
          },

          where: {
            [Op.or]: [
              { firstName: { [Op.like]: "%" + dataSearch + "%" } },
              { lastName: { [Op.like]: "%" + dataSearch + "%" } },
              { address: { [Op.like]: "%" + dataSearch + "%" } },
            ],
          },
          include: [
            {
              model: db.Allcode,
              as: "roleData",
              attributes: ["value"],
            },
          ],
          raw: true,
          nest: true,
        });
        resolve({
          errCode: 1,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let handleChangePasss = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("check data from sv", data);
      if (!data.id || !data.password) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters",
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });

      if (user) {
        let hashPasswordFromBcrypt = await hasUserPassword(data.password);
        if (user.password === hashPasswordFromBcrypt) {
          resolve({
            errCode: 3,
            message: "The new password is the same as the old password!",
          });
        } else {
          user.password = hashPasswordFromBcrypt;
          await user.save();
          resolve({
            errCode: 0,
            message: "Update the user succeed!",
          });
        }
      } else {
        resolve({
          errCode: 1,
          errMessage: "User's not found!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteNewUser: deleteNewUser,
  updateUserData: updateUserData,
  getAllCodeService: getAllCodeService,
  handleGetUsersByRole: handleGetUsersByRole,
  getUserByRoleName: getUserByRoleName,
  searchUsers: searchUsers,
  handleChangePasss: handleChangePasss,
};
