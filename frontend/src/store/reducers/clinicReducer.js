import actionTypes from "../actions/actionTypes";

const initialState = {
  clinics: [],
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ALL_CLINIC_SUCCESS:
      state.clinics = action.dataClinic;
      return {
        ...state,
      };
    case actionTypes.FETCH_ALL_CLINIC_FAILED:
      state.clinics = [];
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default appReducer;
