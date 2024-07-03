import actionTypes from "../actions/actionTypes";

const initialState = {
  specialties: [],
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ALL_SPECIALTY_SUCCESS:
      state.specialties = action.dataSpecialty;
      return {
        ...state,
      };
    case actionTypes.FETCH_ALL_SPECIALTY_FAILED:
      state.specialties = [];
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default appReducer;
