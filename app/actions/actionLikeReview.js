import axios from "axios";
import { axiosHandleError } from "../wiloke-elements";
import { LIKE_REVIEW } from "../constants/actionTypes";

export const likeReview = reviewID => async dispatch => {
  try {
    const { data } = await axios.post(`reviews/${reviewID.toString()}/like`);
    if (data.status === "success") {
      const { countLiked, isLiked } = data;
      dispatch({
        type: LIKE_REVIEW,
        payload: {
          countLiked,
          isLiked,
          reviewID
        }
      });
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
