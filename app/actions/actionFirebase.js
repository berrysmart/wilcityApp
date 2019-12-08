import { FIREBASE } from "../constants/actionTypes";
import * as firebase from "firebase";
import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";
export const firebaseInitApp = __ => dispatch => {
  return axios
    .get("firebase-configuration")
    .then(({ data }) => {
      if (data.status === "success") {
        const { oConfiguration } = data;
        const firebaseInitApp = firebase.initializeApp(oConfiguration);
        const payload = firebaseInitApp.database();
        dispatch({
          type: FIREBASE,
          payload
        });
      }
    })
    .catch(err => console.log(axiosHandleError(err)));
};
