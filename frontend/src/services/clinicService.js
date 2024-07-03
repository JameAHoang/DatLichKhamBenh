import axios from "../axios";
const createClinic = (data) => {
  return axios.post(`/api/create-new-clinic`, data);
};
const getAllClinic = () => {
  return axios.get(`/api/get-all-clinic`);
};
const createDetailClinic = (data) => {
  return axios.post(`/api/create-detail-clinic`, data);
};
const getDetailClinicById = (inputId) => {
  return axios.get(`/api/get-detail-clinic-by-id?id=${inputId}`);
};
const getClinicByAddress = (address) => {
  return axios.get(`/api/get-clinic-by-address?address=${address}`);
};
const getDetailClinicDoctorById = (inputId) => {
  return axios.get(`/api/get-detail-clinic-doctor-by-id?id=${inputId}`);
};
const editDetailClinic = (data) => {
  return axios.put(`/api/edit-detail-clinic`, data);
};
const deletaDetailClinic = (id) => {
  return axios.delete("/api/delete-detail-clinic", {
    data: {
      id: id,
    },
  });
};
const deleteClinic = (id) => {
  return axios.delete("/api/delete-clinic", {
    data: {
      id: id,
    },
  });
};
const editClinic = (data) => {
  return axios.put(`/api/edit-clinic`, data);
};
const searchClinic = (data) => {
  return axios.get(`/api/search-clinics?data=${data}`);
};
export {
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
  searchClinic,
};
