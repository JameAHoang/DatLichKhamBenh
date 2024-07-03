import specialtyService from "../services/specialtyService";
let createSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.createSpecialty(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let getAllSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.getAllSpecialty();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let createDetailSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.createDetailSpecialty(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let getDetailSpecialtyById = async (req, res) => {
  try {
    let data = await specialtyService.getDetailSpecialtyById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let getDetailSpecialtyDoctorLocation = async (req, res) => {
  try {
    let data = await specialtyService.getDetailSpecialtyDoctorLocation(
      req.query.id,
      req.query.location
    );
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let deleteSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.deleteSpecialty(req.body.id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let editSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.editSpecialty(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let editDetailSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.editDetailSpecialty(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let deleteDetailSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.deleteDetailSpecialty(req.body.id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let searchSpecialty = async (req, res) => {
  try {
    let data = await specialtyService.searchSpecialty(req.query.data);
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
  createSpecialty: createSpecialty,
  getAllSpecialty: getAllSpecialty,
  createDetailSpecialty: createDetailSpecialty,
  getDetailSpecialtyById: getDetailSpecialtyById,
  editDetailSpecialty: editDetailSpecialty,
  getDetailSpecialtyDoctorLocation: getDetailSpecialtyDoctorLocation,
  deleteSpecialty: deleteSpecialty,
  editSpecialty: editSpecialty,
  deleteDetailSpecialty: deleteDetailSpecialty,
  searchSpecialty: searchSpecialty,
};
