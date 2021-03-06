import * as types from "../constants/actionTypes";
import axios from "axios";
import { filterMax, axiosHandleError } from "../wiloke-elements";

/**
 * GET LISTING DETAIL
 * @param {*} id listing
 */
export const getListingDetail = id => dispatch => {
  return axios
    .get(`listing-detail/${id}`)
    .then(res => {
      const { oAdmob } = res.data;
      console.log(res.data);
      const {
        oReview,
        oFavorite,
        oNavigation,
        oHomeSections,
        oButton,
        isReport,
        isReview
      } = res.data.oResults;
      dispatch({
        type: types.GET_LISTING_DETAIL,
        payload: {
          oReview,
          oFavorite,
          oNavigation,
          oHomeSections,
          oButton,
          oAdmob,
          isReport,
          isReview
        }
      });
      dispatch({
        type: types.ADD_LISTING_DETAIL_FAVORITES,
        id: oFavorite.isMyFavorite ? id : null
      });
    })
    .catch(err => console.log(axiosHandleError(err)));
};

/**
 * GET LISTING DETAIL DESCRIPTIONS
 * @param {*} id listing
 * @param {*} key = content
 */
export const getListingDescription = (id, key, max) => dispatch => {
  dispatch({
    type: types.LOADING_LISTING_DETAIL,
    loading: true
  });
  dispatch({
    type: types.LISTING_DETAIL_DES_REQUEST_TIMEOUT,
    isTimeout: false
  });
  return axios
    .get(`listing-meta/${id}/${key}`)
    .then(res => {
      const payload = res.data.status === "success" ? [res.data.oResults] : [];
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_DESTINATION,
          payload
        });
      } else {
        dispatch({
          type: types.GET_LISTING_DESTINATION_ALL,
          payload
        });
        dispatch({
          type: types.LOADING_LISTING_DETAIL,
          loading: false
        });
      }
      // dispatch({
      //   type: types.LISTING_DETAIL_DES_REQUEST_TIMEOUT,
      //   isTimeout: false
      // });
    })
    .catch(err => {
      // dispatch({
      //   type: types.LISTING_DETAIL_DES_REQUEST_TIMEOUT,
      //   isTimeout: true
      // });
      console.log(axiosHandleError(err));
    });
};

/**
 * GET LISTING DETAIL LIST FEATURE
 * @param {*} id listing
 * @param {*} key = tags
 * @param {*} max (maximumItemsOnHome)
 */
export const getListingListFeature = (id, key, max) => dispatch => {
  dispatch({
    type: types.LOADING_LISTING_DETAIL,
    loading: true
  });
  dispatch({
    type: types.LISTING_DETAIL_LIST_REQUEST_TIMEOUT,
    isTimeout: false
  });
  return axios
    .get(`listing-meta/${id}/${key}`, {
      params: {
        maximumItemsOnHome: max !== "" ? max : null
      }
    })
    .then(res => {
      const payload =
        res.data.status === "success"
          ? res.data.oResults.reduce((arr, item) => {
              return [...arr, { ...item, ...item.oIcon }];
            }, [])
          : [];
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_LIST_FEATURE,
          payload
        });
      } else {
        dispatch({
          type: types.GET_LISTING_LIST_FEATURE_ALL,
          payload
        });
        dispatch({
          type: types.LOADING_LISTING_DETAIL,
          loading: false
        });
      }
      // dispatch({
      //   type: types.LISTING_DETAIL_LIST_REQUEST_TIMEOUT,
      //   isTimeout: false
      // });
    })
    .catch(err => {
      // dispatch({
      //   type: types.LISTING_DETAIL_LIST_REQUEST_TIMEOUT,
      //   isTimeout: true
      // });
      console.log(axiosHandleError(err));
    });
};

/**
 * GET LISTING DETAIL PHOTOS
 * @param {*} id listing
 * @param {*} key = photos
 * @param {*} max (maximumItemsOnHome)
 */
export const getListingPhotos = (id, key, max) => dispatch => {
  dispatch({
    type: types.LOADING_LISTING_DETAIL,
    loading: true
  });
  dispatch({
    type: types.LISTING_DETAIL_PHOTOS_REQUEST_TIMEOUT,
    isTimeout: false
  });
  return axios
    .get(`listing-meta/${id}/${key}`, {
      params: {
        maximumItemsOnHome: max !== "" ? max : null
      }
    })
    .then(res => {
      console.log(res.data);
      const { large, medium } = res.data.oResults;
      const galleryLarge = filterMax(large);
      const galleryMedium = filterMax(medium);
      const gallery = maxItem =>
        res.data.status === "success"
          ? {
              large: !maxItem ? large : galleryLarge(maxItem),
              medium: !maxItem ? medium : galleryMedium(maxItem)
            }
          : {};
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_PHOTOS,
          payload: gallery(false)
        });
      } else {
        dispatch({
          type: types.GET_LISTING_PHOTOS_ALL,
          payload: gallery(false)
        });
        dispatch({
          type: types.LOADING_LISTING_DETAIL,
          loading: false
        });
      }
      // dispatch({
      //   type: types.LISTING_DETAIL_PHOTOS_REQUEST_TIMEOUT,
      //   isTimeout: false
      // });
    })
    .catch(err => {
      // dispatch({
      //   type: types.LISTING_DETAIL_PHOTOS_REQUEST_TIMEOUT,
      //   isTimeout: true
      // });
      console.log(axiosHandleError(err));
    });
};

export const resetListingDetail = () => dispatch => {
  dispatch({
    type: types.RESET_LISTING_DETAIL
  });
};

/**
 * GET LISTING DETAIL VIDEOS
 * @param {*} id listing
 * @param {*} key = videos
 * @param {*} max (maximumItemsOnHome)
 */
export const getListingVideos = (id, key, max) => dispatch => {
  dispatch({
    type: types.LOADING_LISTING_DETAIL,
    loading: true
  });
  dispatch({
    type: types.LISTING_DETAIL_VID_REQUEST_TIMEOUT,
    isTimeout: false
  });
  return axios
    .get(`listing-meta/${id}/${key}`, {
      params: {
        maximumItemsOnHome: max !== "" ? max : null
      }
    })
    .then(res => {
      const videos = res.data.status === "success" ? res.data.oResults : [];
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_VIDEOS,
          payload: filterMax(videos)(1)
        });
      } else {
        dispatch({
          type: types.GET_LISTING_VIDEOS_ALL,
          payload: filterMax(videos)(12)
        });
        dispatch({
          type: types.LOADING_LISTING_DETAIL,
          loading: false
        });
      }
      // dispatch({
      //   type: types.LISTING_DETAIL_VID_REQUEST_TIMEOUT,
      //   isTimeout: false
      // });
    })
    .catch(err => {
      // dispatch({
      //   type: types.LISTING_DETAIL_VID_REQUEST_TIMEOUT,
      //   isTimeout: true
      // });
      console.log(axiosHandleError(err));
    });
};

/**
 * GET LISTING DETAIL REVIEWS
 * @param {number} id listing
 * @param {string} key reviews
 * @param {number} max (maximumItemsOnHome)
 */
export const getListingReviews = (id, key, max) => dispatch => {
  dispatch({
    type: types.LOADING_LISTING_DETAIL,
    loading: true
  });
  dispatch({
    type: types.LOADING_REVIEW,
    loading: true
  });
  dispatch({
    type: types.LISTING_DETAIL_REVIEWS_REQUEST_TIMEOUT,
    isTimeout: false
  });
  console.log({ key });
  return axios
    .get(`listing-meta/${id}/${key}`, {
      params: {
        maximumItemsOnHome: max !== "" ? max : null,
        postsPerPage: 5
      }
    })
    .then(res => {
      const payload = res.data.status === "success" ? res.data.oResults : [];
      console.log(payload);
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_REVIEWS,
          payload
        });
        dispatch({
          type: types.LOADING_REVIEW,
          loading: false
        });
      } else {
        dispatch({
          type: types.GET_LISTING_REVIEWS_ALL,
          payload
        });
        dispatch({
          type: types.LOADING_LISTING_DETAIL,
          loading: false
        });
        dispatch({
          type: types.LOADING_REVIEW,
          loading: false
        });
      }
      // dispatch({
      //   type: types.LISTING_DETAIL_REVIEWS_REQUEST_TIMEOUT,
      //   isTimeout: false
      // });
    })
    .catch(err => {
      // dispatch({
      //   type: types.LISTING_DETAIL_REVIEWS_REQUEST_TIMEOUT,
      //   isTimeout: true
      // });
      console.log(axiosHandleError(err));
    });
};

export const getListingReviewsLoadmore = (id, next) => async dispatch => {
  try {
    const { data } = await axios.get(`listing-meta/${id}/reviews`, {
      params: {
        postsPerPage: 5,
        page: next
      }
    });
    const { aReviews, next: _next } = data.oResults;
    if (data.status === "success") {
      dispatch({
        type: types.GET_LISTING_REVIEWS_ALL_LOADMORE,
        payload: { aReviews, next: _next }
      });
    }
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};

/**
 * GET LISTING DETAIL EVENTS
 * @param {*} id listing
 * @param {*} key = events
 * @param {*} max (maximumItemsOnHome)
 */
export const getListingEvents = (id, key, max) => dispatch => {
  dispatch({
    type: types.LOADING_LISTING_DETAIL,
    loading: true
  });
  // dispatch({
  //   type: types.LISTING_DETAIL_EVENT_REQUEST_TIMEOUT,
  //   isTimeout: false
  // });
  return axios
    .get(`listing-meta/${id}/${key}`, {
      params: {
        maximumItemsOnHome: max !== "" ? max : null
      }
    })
    .then(res => {
      const payload = res.data.status === "success" ? res.data.oResults : [];
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_EVENTS,
          payload: filterMax(payload)(2)
        });
      } else {
        dispatch({
          type: types.GET_LISTING_EVENTS_ALL,
          payload
        });
        dispatch({
          type: types.LOADING_LISTING_DETAIL,
          loading: false
        });
      }
      // dispatch({
      //   type: types.LISTING_DETAIL_EVENT_REQUEST_TIMEOUT,
      //   isTimeout: false
      // });
    })
    .catch(err => {
      // dispatch({
      //   type: types.LISTING_DETAIL_EVENT_REQUEST_TIMEOUT,
      //   isTimeout: true
      // });
      console.log(axiosHandleError(err));
    });
};

/**
 * GET_LISTING_BOX_CUSTOM
 * @param {*} id listing
 * @param {*} key = events
 * @param {*} max (maximumItemsOnHome)
 */
export const getListingBoxCustom = (id, key, max) => dispatch => {
  dispatch({
    type: types.LOADING_LISTING_DETAIL,
    loading: true
  });
  return axios
    .get(`listing-meta/${id}/${key}`, {
      params: {
        maximumItemsOnHome: max !== "" ? max : null
      }
    })
    .then(res => {
      const data = res.data.status === "success" ? res.data.oResults : [];
      if (max !== null) {
        dispatch({
          type: types.GET_LISTING_BOX_CUSTOM,
          payload: {
            data,
            key
          }
        });
      } else {
        dispatch({
          type: types.GET_LISTING_BOX_CUSTOM_ALL,
          payload: {
            data,
            key
          }
        });
        dispatch({
          type: types.LOADING_LISTING_DETAIL,
          loading: false
        });
      }
    })
    .catch(err => {
      console.log(axiosHandleError(err));
    });
};

/**
 * GET LISTING DETAIL NAVIGATION
 * @param {*} data = oNavigation
 */
export const getListingDetailNavigation = data => dispatch => {
  dispatch({
    type: types.GET_LISTING_DETAIL_NAV,
    detailNav: data
  });
};

/**
 * CHANGE LISTING DETAIL NAVIGATION
 * @param {*} key
 */
export const changeListingDetailNavigation = key => dispatch => {
  dispatch({
    type: types.CHANGE_LISTING_DETAIL_NAV,
    key
  });
};

export const getListingSidebar = listingId => dispatch => {
  dispatch({
    type: types.LISTING_DETAIL_SIDEBAR_REQUEST_TIMEOUT,
    isTimeout: false
  });
  console.log(`listing/sidebar/${listingId}`);
  return axios
    .get(`listing/sidebar/${listingId}`)
    .then(res => {
      dispatch({
        type: types.GET_LISTING_SIDEBAR,
        payload: res.data.status === "success" ? res.data.oResults : []
      });
      // dispatch({
      //   type: types.LISTING_DETAIL_SIDEBAR_REQUEST_TIMEOUT,
      //   isTimeout: false
      // });
    })
    .catch(err => {
      // dispatch({
      //   type: types.LISTING_DETAIL_SIDEBAR_REQUEST_TIMEOUT,
      //   isTimeout: true
      // });
      console.log(axiosHandleError(err));
    });
};
export const getListingRestaurantMenu = listingId => async dispatch => {
  try {
    const endpoint = `/listing-meta/${listingId}/restaurant_menu`;
    const { data } = await axios.get(endpoint);
    dispatch({
      type: types.GET_LISTING_RESTAURANT_MENU,
      payload: data.status === "success" ? data.oResults : {}
    });
  } catch (err) {
    console.log(axiosHandleError(err));
  }
};
export const getListingProducts = (id, type) => async dispatch => {
  try {
    const endpoint = `listing-meta/${id}/${type}`;
    const { data } = await axios.get(endpoint);
    if (data.status === "success") {
      dispatch({
        type: types.GET_LISTING_PRODUCTS,
        payload: data.oResults
      });
    }
  } catch (err) {
    console.log(err);
  }
};
