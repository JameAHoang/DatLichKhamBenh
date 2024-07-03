import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import countController from "../controllers/countController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);
  router.get("/crud", homeController.getCRUD);
  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displaygetCRUD);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);
  router.put("/api/change-pass", userController.handleChangePasss);
  //search
  router.get("/api/get-users-by-role", userController.handleGetUsersByRole);

  router.get("/api/allcode", userController.getAllcode);

  //doctor
  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
  router.get("/api/get-all-doctors", doctorController.getAllDoctors);
  router.post("/api/save-infor-doctors", doctorController.postInforDoctor);
  router.delete("/api/delete/doctor-infor", doctorController.deleteDoctorInfor);
  router.get(
    "/api/get-detail-doctor-by-id",
    doctorController.getDetailDoctorById
  );
  router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);
  router.get(
    "/api/get-schedule-doctor-by-date",
    doctorController.getScheduleByDate
  );
  router.get(
    "/api/get-extra-infor-doctor-by-id",
    doctorController.getExtraInforDoctorById
  );
  router.get(
    "/api/get-profile-doctor-by-id",
    doctorController.getProfileDoctorById
  );
  router.get(
    "/api/get-all-doctors-by-position-specialty",
    doctorController.getAllDoctorsByPositionSpecialty
  );

  router.get(
    "/api/get-list-patient-for-doctor",
    doctorController.getListPatientForDoctor
  );

  //patient
  router.post(
    "/api/patient-book-appointment",
    patientController.postBookAppointment
  );
  router.post(
    "/api/verify-book-appointment",
    patientController.postVerifyBookAppointment
  );
  router.put("/api/doctor-confirm", patientController.putDoctorConfirmSuccess);
  router.get("/api/get-all-patients", patientController.getAllPatients);
  router.delete(
    "/api/delete-book-appointment",
    patientController.deleteBookAppointment
  );
  router.put("/api/edit-patient", patientController.editPatient);
  router.delete("/api/delete-patient", patientController.deletePatient);

  //specialty
  router.get("/api/get-all-specialty", specialtyController.getAllSpecialty);
  router.post("/api/create-new-specialty", specialtyController.createSpecialty);
  router.put("/api/edit-specialty", specialtyController.editSpecialty);
  router.delete("/api/delete-specialty", specialtyController.deleteSpecialty);

  //specialty >> Markdown
  router.post(
    "/api/create-detail-specialty",
    specialtyController.createDetailSpecialty
  );
  router.get(
    "/api/get-detail-specialty-by-id",
    specialtyController.getDetailSpecialtyById
  );
  router.put(
    "/api/edit-detail-specialty",
    specialtyController.editDetailSpecialty
  );
  router.delete(
    "/api/delete-detail-specialty",
    specialtyController.deleteDetailSpecialty
  );

  //get detail specialty and doctor specialty and search by location of doctor
  router.get(
    "/api/get-detail-specialty-doctor-location",
    specialtyController.getDetailSpecialtyDoctorLocation
  );

  //Clinic
  router.get("/api/get-all-clinic", clinicController.getAllClinic);
  router.post("/api/create-new-clinic", clinicController.createClinic);
  router.put("/api/edit-clinic", clinicController.editClinic);
  router.delete("/api/delete-clinic", clinicController.deleteClinic);
  router.get("/api/get-clinic-by-address", clinicController.getClinicByAddress);
  router.get(
    "/api/get-detail-clinic-doctor-by-id",
    clinicController.getDetailClinicDoctorById
  );
  //CLinic >> Markdown

  router.get(
    "/api/get-detail-clinic-by-id",
    clinicController.getDetailClinicById
  );
  router.post("/api/create-detail-clinic", clinicController.createDetailClinic);
  router.put("/api/edit-detail-clinic", clinicController.editDetailClinic);
  router.delete(
    "/api/delete-detail-clinic",
    clinicController.deletaDetailClinic
  );
  //SEARCH ALL USER
  router.get("/api/get-user-by-role-name", userController.getUserByRoleName);
  router.get("/api/search-users", userController.searchUsers);

  //SEARCH PATIENT
  router.get("/api/search-patients", patientController.searchPatients);
  //SEARCH SPECIALTY
  router.get("/api/search-specialty", specialtyController.searchSpecialty);
  //SEARCH CLINIC
  router.get("/api/search-clinics", clinicController.searchClinics);
  //SEARCH DOCTOR
  router.get("/api/search-doctors", doctorController.searchDoctors);
  //COUNT
  router.get("/api/get-count-doctor", countController.getCountDoctor);
  router.get("/api/get-count-patient", countController.getCountPatient);
  router.get("/api/get-count-specialty", countController.getCountSpecialty);
  router.get("/api/get-count-clinic", countController.getCountClinic);

  //Get History and search by patientId
  router.get("/api/get-history-patient", patientController.getHistoryPatient);
  router.get(
    "/api/search-history-patient",
    patientController.searchHistoryPatient
  );
  return app.use("/", router);
};

module.exports = initWebRoutes;
