import actionTypes from "../actions/actionTypes";

const initialState = {
  genders: [],
  roles: [],
  positions: [],
  users: [],
  topDoctors: [],
  allDoctors: [],
  allScheduleTime: [],
  allDoctorInfor: [],
  usersByRole: [],
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_GENDER_START:
      return {
        ...state,
      };
    case actionTypes.FETCH_GENDER_SUCCESS:
      let coppyState = { ...state };
      coppyState.genders = action.data;
      return {
        ...coppyState,
      };
    case actionTypes.FETCH_GENDER_FAILED:
      return {
        ...state,
      };
    case actionTypes.FETCH_POSITION_START:
      return {
        ...state,
      };
    case actionTypes.FETCH_POSITION_SUCCESS:
      let coppyStatePosition = { ...state };
      coppyStatePosition.positions = action.data;
      return {
        ...coppyStatePosition,
      };
    case actionTypes.FETCH_POSITION_FAILED:
      return {
        ...state,
      };
    case actionTypes.FETCH_ROLE_START:
      return {
        ...state,
      };
    case actionTypes.FETCH_ROLE_SUCCESS:
      let coppyStateRole = { ...state };
      coppyStateRole.roles = action.data;
      return {
        ...coppyStateRole,
      };
    case actionTypes.FETCH_ROLE_FAILED:
      return {
        ...state,
      };
    case actionTypes.FETCH_ALL_USERS_SUCCESS:
      state.users = action.users;
      return {
        ...state,
      };
    case actionTypes.FETCH_ALL_USERS_FAILED:
      state.users = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_TOP_DOCTORS_SUCCESS:
      state.topDoctors = action.dataDoctors;
      return {
        ...state,
      };
    case actionTypes.FETCH_TOP_DOCTORS_FAILED:
      state.topDoctors = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_ALL_DOCTORS_SUCCESS:
      state.allDoctors = action.dataDoctors;
      return {
        ...state,
      };
    case actionTypes.FETCH_ALL_DOCTORS_FAILED:
    case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
      state.allScheduleTime = action.dataTime;
      return {
        ...state,
      };
    case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED:
      state.allScheduleTime = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_DOCTOR_INFOR_SUCCESS:
      state.allDoctorInfor = action.data;
      return {
        ...state,
      };
    case actionTypes.FETCH_DOCTOR_INFOR_FAILED:
      state.allDoctorInfor = [];
      return {
        ...state,
      };
    case actionTypes.FETCH_USERS_BY_ROLE_SUCCESS:
      state.usersByRole = action.data;
      return {
        ...state,
      };
    case actionTypes.FETCH_USERS_BY_ROLE_FAILED:
      state.usersByRole = [];
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default adminReducer;
