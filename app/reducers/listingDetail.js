import * as types from "../constants/actionTypes";
import _ from "lodash";

const reducers = type => (state = [], action) => {
  switch (action.type) {
    case type:
      return action.payload;
    case types.RESET_LISTING_DETAIL:
      return [];
    default:
      return state;
  }
};
export const listingDetail = reducers(types.GET_LISTING_DETAIL);
export const listingDescription = reducers(types.GET_LISTING_DESTINATION);
export const listingDescriptionAll = reducers(
  types.GET_LISTING_DESTINATION_ALL
);
export const listingListFeature = reducers(types.GET_LISTING_LIST_FEATURE);
export const listingListFeatureAll = reducers(
  types.GET_LISTING_LIST_FEATURE_ALL
);
export const listingVideos = reducers(types.GET_LISTING_VIDEOS);
export const listingVideosAll = reducers(types.GET_LISTING_VIDEOS_ALL);
export const listingProducts = reducers(types.GET_LISTING_PRODUCTS);

const postReview = (state, action) => {
  if (_.isEmpty(state.aReviews)) {
    return {
      ...state,
      ...action.payload.oGeneral,
      total: 1,
      aReviews: [action.payload.oItem]
    };
  }
  return {
    ...state,
    ...action.payload.oGeneral,
    total: action.payload.totalReviews + 1,
    aReviews: state.aReviews
      .map(item => item.ID)
      .includes(action.payload.oItem.ID)
      ? state.aReviews
      : [action.payload.oItem, ...state.aReviews]
  };
};

const putReview = (state, action) => {
  if (_.isEmpty(state.aReviews)) return state;
  return {
    ...state,
    ...action.payload.oGeneral,
    aReviews: state.aReviews.map(item => ({
      ...(item.ID === action.payload.oItem.ID ? action.payload.oItem : item)
    }))
  };
};

const deleteReview = (state, action) => {
  if (_.isEmpty(state.aReviews)) return state;
  return {
    ...state,
    ...action.payload.oGeneral,
    total: state.total === 0 ? 0 : action.payload.totalReviews - 1,
    aReviews: state.aReviews.filter(item => item.ID !== action.payload.reviewID)
  };
};

const likeReview = (state, action) => {
  if (_.isEmpty(state.aReviews)) return state;
  return {
    ...state,
    aReviews: state.aReviews.map(item => {
      const { reviewID, isLiked, countLiked } = action.payload;
      return {
        ...item,
        countLiked: item.ID === reviewID ? countLiked : item.countLiked,
        isLiked: item.ID === reviewID ? isLiked : item.isLiked
      };
    })
  };
};

const postCommentInReview = (state, action) => {
  if (_.isEmpty(state.aReviews)) return state;
  return {
    ...state,
    aReviews: state.aReviews.map(item => {
      const { reviewID, oReview } = action.payload;
      const { countComments } = oReview;
      return {
        ...item,
        countDiscussions:
          item.ID === reviewID ? countComments : item.countDiscussions
      };
    })
  };
};

const deleteCommentInReview = (state, action) => {
  if (_.isEmpty(state.aReviews)) return state;
  return {
    ...state,
    aReviews: state.aReviews.map(item => {
      const { reviewID, countDiscussions } = action.payload;
      return {
        ...item,
        countDiscussions:
          item.ID === reviewID ? countDiscussions : item.countDiscussions
      };
    })
  };
};

const shareCommentInReview = (state, action) => {
  if (_.isEmpty(state.aReviews)) return state;
  return {
    ...state,
    aReviews: state.aReviews.map(item => {
      const { reviewID, countShared } = action.payload;
      return {
        ...item,
        countShared: item.ID === reviewID ? countShared : item.countShared
      };
    })
  };
};

export const listingReviews = (state = [], action) => {
  switch (action.type) {
    case types.GET_LISTING_REVIEWS:
      return action.payload;
    case types.POST_REVIEW:
      return postReview(state, action);
    case types.PUT_REVIEW:
      return putReview(state, action);
    case types.DELETE_REVIEW:
      return deleteReview(state, action);
    case types.LIKE_REVIEW:
      return likeReview(state, action);
    case types.POST_COMMENT_IN_REVIEWS:
      return postCommentInReview(state, action);
    case types.DELETE_COMMENT_IN_REVIEWS:
      return deleteCommentInReview(state, action);
    case types.SHARE_REVIEW:
      return shareCommentInReview(state, action);
    case types.RESET_LISTING_DETAIL:
      return [];
    default:
      return state;
  }
};
export const listingReviewsAll = (state = [], action) => {
  switch (action.type) {
    case types.GET_LISTING_REVIEWS_ALL:
      return action.payload;
    case types.POST_REVIEW:
      return postReview(state, action);
    case types.PUT_REVIEW:
      return putReview(state, action);
    case types.DELETE_REVIEW:
      return deleteReview(state, action);
    case types.LIKE_REVIEW:
      return likeReview(state, action);
    case types.POST_COMMENT_IN_REVIEWS:
      return postCommentInReview(state, action);
    case types.DELETE_COMMENT_IN_REVIEWS:
      return deleteCommentInReview(state, action);
    case types.SHARE_REVIEW:
      return shareCommentInReview(state, action);
    case types.GET_LISTING_REVIEWS_ALL_LOADMORE:
      return {
        ...state,
        next: action.payload.next,
        aReviews: [...state.aReviews, ...action.payload.aReviews]
      };
    case types.RESET_LISTING_DETAIL:
      return [];
    default:
      return state;
  }
};
export const listingReviewError = (state = "", action) => {
  switch (action.type) {
    case types.POST_REVIEW_ERROR:
      return action.payload;
    default:
      return state;
  }
};

export const listingEvents = reducers(types.GET_LISTING_EVENTS);
export const listingEventsAll = reducers(types.GET_LISTING_EVENTS_ALL);
export const listingSidebar = reducers(types.GET_LISTING_SIDEBAR);

export const commentInReviews = (state = [], action) => {
  switch (action.type) {
    case types.GET_COMMENT_IN_REVIEWS:
      return action.payload;
    case types.POST_COMMENT_IN_REVIEWS:
      return [action.payload, ...state];
    case types.DELETE_COMMENT_IN_REVIEWS:
      return state.filter(item => item.ID !== action.payload.commentID);
    case types.EDIT_COMMENT_IN_REVIEWS:
      return state.map(item => ({
        ...item,
        postContent:
          item.ID === action.payload.commentID
            ? action.payload.content
            : item.postContent
      }));
    case types.RESET_LISTING_DETAIL:
      return [];
    default:
      return state;
  }
};

const photoInitState = {
  large: [],
  medium: []
};
export const listingPhotos = (state = photoInitState, action) => {
  switch (action.type) {
    case types.GET_LISTING_PHOTOS:
      return action.payload;
    case types.RESET_LISTING_DETAIL:
      return photoInitState;
    default:
      return state;
  }
};

export const listingPhotosAll = (state = photoInitState, action) => {
  switch (action.type) {
    case types.GET_LISTING_PHOTOS_ALL:
      return action.payload;
    case types.RESET_LISTING_DETAIL:
      return photoInitState;
    default:
      return state;
  }
};

export const listingDetailNav = (state = [], action) => {
  switch (action.type) {
    case types.GET_LISTING_DETAIL_NAV:
      return action.detailNav;
    case types.CHANGE_LISTING_DETAIL_NAV:
      return state.map(item => {
        const condition = item.key === action.key;
        return {
          ...item,
          current: condition ? true : false,
          loaded: condition ? true : item.loaded
        };
      });
    case types.RESET_LISTING_DETAIL:
      return [];
    default:
      return state;
  }
};

export const listingCustomBox = (state = [], action) => {
  switch (action.type) {
    case types.GET_LISTING_BOX_CUSTOM:
    case types.GET_LISTING_BOX_CUSTOM_ALL:
      return {
        ...state,
        [action.payload.key]:
          typeof action.payload.data === "object"
            ? action.payload.data
            : [action.payload.data]
      };
    case types.RESET_LISTING_DETAIL:
      return {};
    default:
      return state;
  }
};

export const listingRestaurantMenu = (state = {}, action) => {
  switch (action.type) {
    case types.GET_LISTING_RESTAURANT_MENU:
      return action.payload;
    default:
      return state;
  }
};
