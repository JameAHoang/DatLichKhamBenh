import countService from "../services/countService";
let getCountDoctor = async (req, res) => {
  try {
    let data = await countService.getCountDoctor();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let getCountPatient = async (req, res) => {
  try {
    let data = await countService.getCountPatient();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let getCountSpecialty = async (req, res) => {
  try {
    let data = await countService.getCountSpecialty();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let getCountClinic = async (req, res) => {
  try {
    let data = await countService.getCountClinic();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
module.exports = {
  getCountDoctor: getCountDoctor,
  getCountPatient: getCountPatient,
  getCountSpecialty: getCountSpecialty,
  getCountClinic: getCountClinic,
};
