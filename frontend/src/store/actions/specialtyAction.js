import { getAllSpecialty } from "../../services/specialtyService";
import actionTypes from "./actionTypes";

export const fetchAllSpecialty = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllSpecialty();
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALL_SPECIALTY_SUCCESS,
          dataSpecialty: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_ALL_SPECIALTY_FAILED,
        });
      }
    } catch (error) {
      console.log("FETCH_ALL_SPECIALTY_FAILED", error);
      dispatch({
        type: actionTypes.FETCH_ALL_SPECIALTY_FAILED,
      });
    }
  };
};
