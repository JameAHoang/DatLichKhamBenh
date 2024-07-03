import clinicService from "../services/clinicService";

let getAllClinic = async (req, res) => {
  try {
    let data = await clinicService.getAllClinic();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let createClinic = async (req, res) => {
  try {
    let data = await clinicService.createClinic(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let createDetailClinic = async (req, res) => {
  try {
    let data = await clinicService.createDetailClinic(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let getDetailClinicById = async (req, res) => {
  try {
    let data = await clinicService.getDetailClinicById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let getClinicByAddress = async (req, res) => {
  try {
    let data = await clinicService.getClinicByAddress(req.query.address);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let getDetailClinicDoctorById = async (req, res) => {
  try {
    let data = await clinicService.getDetailClinicDoctorById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let editDetailClinic = async (req, res) => {
  try {
    let data = await clinicService.editDetailClinic(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let deletaDetailClinic = async (req, res) => {
  try {
    let data = await clinicService.deletaDetailClinic(req.body.id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let deleteClinic = async (req, res) => {
  try {
    let data = await clinicService.deleteClinic(req.body.id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let editClinic = async (req, res) => {
  try {
    let data = await clinicService.editClinic(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let searchClinics = async (req, res) => {
  try {
    let data = await clinicService.searchClinics(req.query.data);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
module.exports = {
  createClinic: createClinic,
  getAllClinic: getAllClinic,
  deleteClinic: deleteClinic,
  createDetailClinic: createDetailClinic,
  getDetailClinicById: getDetailClinicById,
  getClinicByAddress: getClinicByAddress,
  getDetailClinicDoctorById: getDetailClinicDoctorById,
  editDetailClinic: editDetailClinic,
  deletaDetailClinic: deletaDetailClinic,
  editClinic: editClinic,
  searchClinics: searchClinics,
};
