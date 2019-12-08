import axios from "axios";
import { mapObjectToFormData, axiosHandleError } from "../wiloke-elements";
import { POST_REVIEW, POST_REVIEW_ERROR } from "../constants/actionTypes";

export const submitReview = (
  listingID,
  results,
  totalReviews
) => async dispatch => {
  try {
    const formData = mapObjectToFormData(results);
    const { data } = await axios.post(`posts/${listingID}/reviews`, formData, {
      headers: {
        "content-type": "multipart/form-data"
      }
    });
    const { oItem, oGeneral, msg } = data;
    if (data.status === "success") {
      dispatch({
        type: POST_REVIEW,
        payload: { oItem, oGeneral, totalReviews, listingID }
      });
      dispatch({
        type: POST_REVIEW_ERROR,
        payload: msg
      });
    } else {
      const err = { message: msg };
      throw err;
    }
  } catch (err) {
    dispatch({
      type: POST_REVIEW_ERROR,
      payload: err.message
    });
    console.log(axiosHandleError(err));
  }
};
