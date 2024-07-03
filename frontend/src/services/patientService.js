import axios from "../axios";

const getAllPatients = () => {
  return axios.get(`/api/get-all-patients`);
};
const searchPatients = (data) => {
  return axios.get(`/api/search-patients?data=${data}`);
};
const deleteBookAppointment = (data) => {
  return axios.delete("/api/delete-book-appointment", { data });
};

const editPatient = (data) => {
  return axios.put("/api/edit-patient", data);
};

const deletePatient = (data) => {
  return axios.delete("/api/delete-patient", { data });
};

const getHistoryPatient = () => {
  return axios.get(`/api/get-history-patient`);
};
const searchHistoryPatient = (data) => {
  return axios.get(`/api/search-history-patient?data=${data}`);
};
export {
  getAllPatients,
  searchPatients,
  deleteBookAppointment,
  editPatient,
  deletePatient,
  getHistoryPatient,
  searchHistoryPatient,
};
