import axios from "../axios";

const handleLoginApi = (userEmail, userPassword) => {
  return axios.post("/api/login", { email: userEmail, password: userPassword });
};

const getAllUsers = (inputId) => {
  return axios.get(`/api/get-all-users?id=${inputId}`);
};
const createNewUserService = (data) => {
  console.log("check data from service", data);
  return axios.post(`/api/create-new-user`, data);
};

const deleteUserService = (userId) => {
  // return axios.delete("/api/delete-user", { id: userId });
  return axios.delete("/api/delete-user", {
    // headers: {
    //   Authorization: authorizationToken,
    // },
    data: {
      id: userId,
    },
  });
};
const editUserService = (inputData) => {
  // return axios.delete("/api/delete-user", { id: userId });
  return axios.put("/api/edit-user", inputData);
};
const changePassUser = (data) => {
  // return axios.delete("/api/delete-user", { id: userId });
  return axios.put("/api/change-pass", data);
};
const getAllCodeService = (typeData) => {
  return axios.get(`/api/allcode?type=${typeData}`);
};

const getTopDoctorHomeService = (limit) => {
  return axios.get(`/api/top-doctor-home?limit=${limit}`);
};
const getAllDoctorService = (limit) => {
  return axios.get(`/api/get-all-doctors`);
};

const saveDetailDoctorService = (data) => {
  return axios.post("/api/save-infor-doctors", data);
};

const getDetailDoctorService = (id) => {
  return axios.get(`/api/get-detail-doctor-by-id?id=${id}`);
};
const saveBulkScheduleDoctor = (data) => {
  return axios.post("/api/bulk-create-schedule", data);
};
const getScheduleByDate = (doctorId, date) => {
  return axios.get(
    `/api/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`
  );
};

const getExtraInforDoctorId = (doctorId) => {
  return axios.get(`/api/get-extra-infor-doctor-by-id?doctorId=${doctorId}`);
};

const getProfileDoctorById = (doctorId) => {
  return axios.get(`api/get-profile-doctor-by-id?doctorId=${doctorId}`);
};

const postPatientBookAppointment = (data) => {
  return axios.post("/api/patient-book-appointment", data);
};

const getUsersByRole = (roleId) => {
  return axios.get(`/api/get-users-by-role?roleId=${roleId}`);
};
const postVerifyBookAppointment = (data) => {
  return axios.post("/api/verify-book-appointment", data);
};
const DoctorConfirmSuccess = (data) => {
  return axios.put("/api/doctor-confirm", data);
};
const getAllDoctorsAndLocationSpecialty = () => {
  return axios.get(`api/get-all-doctors-by-position-specialty`);
};
const getListPatientForDoctor = (doctorId, date, status) => {
  return axios.get(
    `/api/get-list-patient-for-doctor?doctorId=${doctorId}&date=${date}&status=${status}`
  );
};

//SEARCH
const getUsersByRoleName = (roleId, name) => {
  return axios.get(`/api/get-user-by-role-name?roleId=${roleId}&name=${name}`);
};

//DELETE DOCTOR INFFOR
const deleteDoctorInfor = (id) => {
  return axios.delete("/api/delete/doctor-infor", {
    data: {
      id: id,
    },
  });
};

//Count ALL
const getCountDoctor = () => {
  return axios.get(`/api/get-count-doctor`);
};
const getCountPatient = () => {
  return axios.get(`/api/get-count-patient`);
};
const getCountSpecialty = () => {
  return axios.get(`/api/get-count-specialty`);
};
const getCountClinic = () => {
  return axios.get(`/api/get-count-clinic`);
};
const searchDoctor = (data) => {
  return axios.get(`/api/search-doctors?data=${data}`);
};
export {
  handleLoginApi,
  getAllUsers,
  createNewUserService,
  deleteUserService,
  editUserService,
  getAllCodeService,
  getTopDoctorHomeService,
  getAllDoctorService,
  saveDetailDoctorService,
  getDetailDoctorService,
  saveBulkScheduleDoctor,
  getScheduleByDate,
  getExtraInforDoctorId,
  getProfileDoctorById,
  postPatientBookAppointment,
  getUsersByRole,
  postVerifyBookAppointment,
  getAllDoctorsAndLocationSpecialty,
  getListPatientForDoctor,
  DoctorConfirmSuccess,
  getUsersByRoleName,
  deleteDoctorInfor,
  changePassUser,
  getCountDoctor,
  getCountPatient,
  getCountSpecialty,
  getCountClinic,
  searchDoctor,
};
