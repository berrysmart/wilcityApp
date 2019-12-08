import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  Text,
  View,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Share,
  Platform,
  Alert,
  ScrollView
} from "react-native";
import he from "he";
import {
  NewGallery,
  cutTextEllipsis,
  LoadingFull,
  Modal,
  InputMaterial,
  wait
} from "../../wiloke-elements";
import { CommentReview } from "../dumbs";
import stylesBase from "../../stylesBase";
import { connect } from "react-redux";
import {
  getCommentInReviews,
  postCommentReview,
  likeReview,
  deleteReview,
  deleteCommentReview,
  editCommentReview,
  shareReview
} from "../../actions";
import * as Consts from "../../constants/styleConstants";
import _ from "lodash";

const TIME_FAKE = 4000;

class CommentListingScreen extends PureComponent {
  state = {
    isLoading: true,
    isDeleteReviewLoading: false,
    isDeleteCommentReviewLoading: false,
    messageEdit: "",
    reviewID: null,
    commentID: null,
    isVisibleFormEditComment: false,
    isSubmit: false
  };
  async componentDidMount() {
    const { navigation, getCommentInReviews } = this.props;
    const { params } = navigation.state;
    const { item } = params;
    const commentId = item.ID;
    await getCommentInReviews(commentId);
    this.setState({ isLoading: false });
    // RealTime Faker
    // this._realTimeFaker = setInterval(() => {
    //   getCommentInReviews(commentId);
    // }, TIME_FAKE);
  }

  // componentWillUnmount() {
  //   clearInterval(this._realTimeFaker);
  // }

  _handleGoBack = () => {
    const { navigation } = this.props;
    Keyboard.dismiss();
    navigation.goBack();
  };

  _handleAccountScreen = () => {
    const { translations, navigation } = this.props;
    Alert.alert(translations.login, translations.requiredLogin, [
      {
        text: translations.cancel,
        style: "cancel"
      },
      {
        text: translations.continue,
        onPress: () => navigation.navigate("AccountScreen")
      }
    ]);
  };

  _handleCommentReview = isLoggedIn => async content => {
    const { navigation, postCommentReview } = this.props;
    const { params } = navigation.state;
    const { ID: reviewID } = params.item;
    isLoggedIn
      ? await postCommentReview(reviewID, content)
      : this._handleAccountScreen();
    this.setState({
      isSubmit: true
    });
    await wait(300);
    this.setState({
      isSubmit: false
    });
  };

  _handleChangeComment = () => {
    this.state.isSubmit &&
      this.setState({
        isSubmit: false
      });
  };

  _handleLike = (isLoggedIn, reviewID) => () => {
    isLoggedIn ? this.props.likeReview(reviewID) : this._handleAccountScreen();
  };

  _handleShare = (link, reviewID) => async () => {
    try {
      const result = await Share.share({
        ...Platform.select({
          ios: {
            message: "",
            url: link
          },
          android: {
            message: link
          }
        })
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          this.props.shareReview(reviewID);
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (err) {
      console.log(err);
    }
  };

  _handleDeleteReview = (listingID, reviewID) => () => {
    this.setState({ isDeleteReviewLoading: true });
    this.props.navigation.goBack();
    this.props.deleteReview(listingID, reviewID);
  };

  _handleDeleteCommentReview = (reviewID, commentID) => async () => {
    this.setState({ isDeleteCommentReviewLoading: true });
    await this.props.deleteCommentReview(reviewID, commentID);
    this.setState({ isDeleteCommentReviewLoading: false });
  };

  _handleEditCommentFormBackdropPress = () => {
    this.setState({ isVisibleFormEditComment: false, messageEdit: "" });
  };

  _handleEditCommentReview = (reviewID, commentID, message) => {
    this.setState({
      isVisibleFormEditComment: true,
      messageEdit: message,
      reviewID,
      commentID
    });
  };

  _handleSubmitEditCommentReview = async () => {
    const { reviewID, commentID, messageEdit } = this.state;
    await this.props.editCommentReview(reviewID, commentID, messageEdit);
    this.setState({
      isVisibleFormEditComment: false
    });
  };

  _handleChangeTextEditComment = text => {
    this.setState({
      messageEdit: text
    });
  };

  componentWillUnmount() {
    this.setState({ isDeleteReviewLoading: false });
  }

  renderReviewGallery = item => {
    const { settings } = this.props;
    if (_.isEmpty(item.oGallery)) return false;
    return (
      !!item.oGallery && (
        <View style={{ paddingTop: 8 }}>
          <NewGallery
            thumbnails={item.oGallery.medium.map(item => item.url)}
            modalSlider={item.oGallery.large.map(item => item.url)}
            colorPrimary={settings.colorPrimary}
          />
        </View>
      )
    );
  };

  _renderModalEditComment = () => {
    const { translations, settings } = this.props;
    return (
      <Modal
        isVisible={this.state.isVisibleFormEditComment}
        headerIcon="edit"
        headerTitle={translations.edit}
        colorPrimary={settings.colorPrimary}
        cancelText={translations.cancel}
        submitText={translations.update}
        onBackdropPress={this._handleEditCommentFormBackdropPress}
        onSubmitAsync={this._handleSubmitEditCommentReview}
      >
        <View>
          <InputMaterial
            autoFocus
            multiline
            clearTextEnabled={false}
            placeholder={""}
            colorPrimary={settings.colorPrimary}
            value={this.state.messageEdit}
            onChangeText={this._handleChangeTextEditComment}
          />
        </View>
      </Modal>
    );
  };

  render() {
    // console.log(this.props.navigation);
    const {
      navigation,
      translations,
      commentInReviews,
      auth,
      settings,
      shortProfile,
      listingReviews,
      listingReviewsAll,
      listingDetail
    } = this.props;
    const { isDeleteReviewLoading, isDeleteCommentReviewLoading } = this.state;
    const { isLoggedIn } = auth;
    const { params } = navigation.state;
    const { id, key, autoFocus, item: _item, mode } = params;
    const { userID: reviewUserID, ID: reviewID } = params.item;
    const reviews = !_.isEmpty(listingReviewsAll.aReviews)
      ? listingReviewsAll.aReviews
      : listingReviews.aReviews;
    const item = {
      ..._item,
      ...(!_.isEmpty(reviews)
        ? reviews.filter(item => item.ID === reviewID)[0]
        : [])
    };
    const { userID } = shortProfile;
    const { isLoading } = this.state;
    const flatten = isLoggedIn && reviewUserID === userID;
    const dataComments =
      commentInReviews.length > 0
        ? commentInReviews.map(item => ({
            id: item.ID,
            image: item.oUserInfo.avatar,
            title: item.oUserInfo.displayName,
            userID: item.oUserInfo.userID,
            message: item.postContent,
            text: item.postDate
          }))
        : [];
    return (
      <View>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}> */}
        <View>
          {this._renderModalEditComment()}
          <StatusBar barStyle="dark-content" />
          <LoadingFull visible={isDeleteReviewLoading} />
          <LoadingFull visible={isDeleteCommentReviewLoading} />
          <CommentReview
            fullScreen={true}
            isSubmit={this.state.isSubmit}
            colorPrimary={settings.colorPrimary}
            inputAutoFocus={autoFocus ? true : false}
            headerActionSheet={{
              options: [
                translations.cancel,
                translations.like,
                translations.share,
                ...(flatten ? [translations.editReview] : []),
                ...(flatten ? [translations.deleteReview] : [])
              ],
              title: he.decode(item.postTitle),
              message: he.decode(cutTextEllipsis(40)(item.postContent)),
              destructiveButtonIndex: 4,
              cancelButtonIndex: 0,
              onPressButtonItem: () => {
                console.log("press");
              },

              onAction: buttonIndex => {
                console.log(buttonIndex);
                switch (buttonIndex) {
                  case 1:
                    this._handleLike(isLoggedIn, reviewID)();
                    break;
                  case 2:
                    this._handleShare(item.shareURL, reviewID)();
                    break;
                  case 3:
                    navigation.navigate("ReviewFormScreen", {
                      mode: listingDetail.oReview.mode,
                      id,
                      reviewID,
                      item,
                      type: "edit"
                    });
                    break;
                  case 4:
                    Alert.alert(
                      `${translations.delete} ${he.decode(item.postTitle)}`,
                      translations.confirmDeleteReview,
                      [
                        {
                          text: translations.cancel,
                          style: "cancel"
                        },
                        {
                          text: translations.ok,
                          onPress: this._handleDeleteReview(params.id, reviewID)
                        }
                      ],
                      { cancelable: false }
                    );
                    break;
                  default:
                    return false;
                }
              }
            }}
            rated={item.oReviews.average}
            ratedMax={mode}
            ratedText={item.oReviews.quality ? item.oReviews.quality : ""}
            headerAuthor={{
              image: item.oUserInfo.avatar,
              title: he.decode(item.oUserInfo.displayName),
              text: item.postDate
            }}
            renderContent={() => (
              <View>
                <Text style={[stylesBase.h5, { marginBottom: 3 }]}>
                  {he.decode(item.postTitle)}
                </Text>
                <Text style={stylesBase.text}>
                  {he.decode(item.postContent)}
                </Text>
                {this.renderReviewGallery(item)}
                <View style={{ height: 3 }} />
              </View>
            )}
            shares={{
              count: item.countShared,
              text:
                item.countShared > 1 ? translations.shares : translations.share
            }}
            comments={{
              data: dataComments.reverse(),
              count: item.countDiscussions,
              isLoading,
              text:
                item.countDiscussions > 1
                  ? translations.comments
                  : translations.comment
            }}
            likes={{
              count: item.countLiked,
              text: item.countLiked > 1 ? translations.likes : translations.like
            }}
            commentsActionSheet={(title, message, commentUserID, commentID) => {
              const flatten = isLoggedIn && commentUserID === userID;
              return {
                options: [
                  translations.cancel,
                  ...(flatten ? [translations.edit] : []),
                  ...(flatten ? [translations.delete] : [])
                ],
                destructiveButtonIndex: 2,
                cancelButtonIndex: 0,
                title: he.decode(title),
                message: he.decode(message),
                onAction: buttonIndex => {
                  console.log(buttonIndex);
                  switch (buttonIndex) {
                    case 1:
                      this._handleEditCommentReview(
                        reviewID,
                        commentID,
                        message
                      );
                      break;
                    case 2:
                      Alert.alert(
                        `${translations.delete} ${he.decode(message)}`,
                        translations.confirmDeleteComment,
                        [
                          {
                            text: translations.cancel,
                            style: "cancel"
                          },
                          {
                            text: translations.ok,
                            onPress: this._handleDeleteCommentReview(
                              reviewID,
                              commentID
                            )
                          }
                        ],
                        { cancelable: false }
                      );
                      break;
                    default:
                      return false;
                  }
                }
              };
            }}
            goBack={this._handleGoBack}
            style={{ borderWidth: 0 }}
            likeText={item.isLiked ? translations.liked : translations.like}
            likeTextColor={
              item.isLiked ? settings.colorPrimary : Consts.colorDark3
            }
            onSubmitCommentReview={this._handleCommentReview(isLoggedIn)}
            onChangeText={this._handleChangeComment}
            onLike={this._handleLike(isLoggedIn, reviewID)}
            onShare={this._handleShare(item.permalink, reviewID)}
          />
        </View>
        {/* </TouchableWithoutFeedback> */}
      </View>
    );
  }
}

const mapStateToProps = ({
  translations,
  commentInReviews,
  settings,
  auth,
  shortProfile,
  listingReviews,
  listingReviewsAll,
  listingDetail
}) => ({
  translations,
  commentInReviews,
  settings,
  auth,
  shortProfile,
  listingReviews,
  listingReviewsAll,
  listingDetail
});

const mapDispatchToProps = {
  getCommentInReviews,
  postCommentReview,
  likeReview,
  deleteReview,
  deleteCommentReview,
  editCommentReview,
  shareReview
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentListingScreen);
