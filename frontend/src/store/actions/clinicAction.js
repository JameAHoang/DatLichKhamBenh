import { getAllClinic } from "../../services/clinicService";
import actionTypes from "./actionTypes";

export const fetchAllClinic = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllClinic();
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALL_CLINIC_SUCCESS,
          dataClinic: res.data,
        });
      } else {
        dispatch({
          type: actionTypes.FETCH_ALL_CLINIC_FAILED,
        });
      }
    } catch (error) {
      console.log("FETCH_ALL_CLINIC_FAILED", error);
      dispatch({
        type: actionTypes.FETCH_ALL_CLINIC_FAILED,
      });
    }
  };
};
