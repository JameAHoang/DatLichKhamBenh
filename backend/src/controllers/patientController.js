import patientService from "../services/patientService";

let postBookAppointment = async (req, res) => {
  try {
    let data = await patientService.postBookAppointment(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let postVerifyBookAppointment = async (req, res) => {
  try {
    let data = await patientService.postVerifyBookAppointment(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let putDoctorConfirmSuccess = async (req, res) => {
  try {
    let data = await patientService.putDoctorConfirmSuccess(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let getAllPatients = async (req, res) => {
  try {
    let data = await patientService.getAllPatients();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};
let searchPatients = async (req, res) => {
  try {
    let data = await patientService.searchPatients(req.query.data);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let deleteBookAppointment = async (req, res) => {
  try {
    let response = await patientService.deleteBookAppointment(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let editPatient = async (req, res) => {
  try {
    let data = await patientService.editPatient(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let deletePatient = async (req, res) => {
  try {
    let response = await patientService.deletePatient(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let getHistoryPatient = async (req, res) => {
  try {
    let data = await patientService.getHistoryPatient();
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      message: "Error from server...",
    });
  }
};

let searchHistoryPatient = async (req, res) => {
  try {
    let data = await patientService.searchHistoryPatient(req.query.data);
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
