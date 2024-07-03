import axios from "../axios";
const CreateSpecialty = (data) => {
  return axios.post(`/api/create-new-specialty`, data);
};
const getAllSpecialty = () => {
  return axios.get(`/api/get-all-specialty`);
};
const createDetailSpecialty = (data) => {
  return axios.post(`/api/create-detail-specialty`, data);
};
const getDetailSpecialtyById = (inputId) => {
  return axios.get(`/api/get-detail-specialty-by-id?id=${inputId}`);
};
const getDetailSpecialtyDoctorLocation = (inputId, location) => {
  return axios.get(
    `/api/get-detail-specialty-doctor-location?id=${inputId}&location=${location}`
  );
};
const deleteSpecialty = (id) => {
  return axios.delete("/api/delete-specialty", {
    data: {
      id: id,
    },
  });
};
const editSpecialty = (data) => {
  return axios.put("/api/edit-specialty", data);
};
const editDetailSpecialty = (data) => {
  return axios.put("/api/edit-detail-specialty", data);
};
const deleteDetailSpecialty = (id) => {
  return axios.delete("/api/delete-detail-specialty", {
    data: {
      id: id,
    },
  });
};
const searchSpecialty = (data) => {
  return axios.get(`/api/search-specialty?data=${data}`);
};

export {
  CreateSpecialty,
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
