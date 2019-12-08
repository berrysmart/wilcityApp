import axios from "axios";
import { axiosHandleError } from "../../wiloke-elements";
import { POST_COMMENT_IN_REVIEWS } from "../../constants/actionTypes";

export const postCommentReview = (reviewID, content) => async dispatch => {
  try {
    console.log(reviewID, content);
    const endpoint = `reviews/${reviewID}/discussions`;
    const { data } = await axios.post(endpoint, {
      content
    });
    if (data.status === "success") {
      dispatch({
        type: POST_COMMENT_IN_REVIEWS,
        payload: {
          ...data,
          reviewID
        }
      });
    } else {
      console.log(JSON.stringify(data));
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
