import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";
import { Rated, RatedSmall } from "../dumbs";
import { connect } from "react-redux";
import { ContentBox, ViewWithLoading } from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import _ from "lodash";

class AverageDetailReviewContainer extends Component {
  renderItem = (mode, len) => (item, index) => {
    return (
      <RatedSmall
        key={index.toString()}
        max={mode}
        rate={item.average}
        text={item.text}
        horizontal={true}
        style={[
          styles.rated,
          {
            paddingBottom: index === len - 1 ? 0 : 10
          }
        ]}
      />
    );
  };
  renderAverageReviews = () => {
    const { listingReviews, listingDetail } = this.props;
    const { oAverageDetailsReview } = listingReviews;
    const { mode } = listingDetail.oReview;
    return (
      !_.isEmpty(oAverageDetailsReview) &&
      oAverageDetailsReview.map(
        this.renderItem(mode, oAverageDetailsReview.length)
      )
    );
  };
  renderAverageTotal = () => {
    const { listingReviews, listingDetail } = this.props;
    const { average, quality } = listingReviews;
    const { mode } = listingDetail.oReview;
    return (
      <View style={{ marginBottom: 10 }}>
        <Rated max={mode} rate={average} text={quality} />
      </View>
    );
  };
  render() {
    const {
      translations,
      listingReviews,
      loadingReview,
      settings
    } = this.props;
    const { oAverageDetailsReview } = listingReviews;
    return (
      <ViewWithLoading isLoading={loadingReview} contentLoader="contentHeader">
        {!_.isEmpty(oAverageDetailsReview) && (
          <ContentBox
            headerIcon="star"
            headerTitle={translations.averageRating}
            style={{ marginBottom: 10 }}
            colorPrimary={settings.colorPrimary}
          >
            <View>
              {this.renderAverageTotal()}
              {this.renderAverageReviews()}
            </View>
          </ContentBox>
        )}
      </ViewWithLoading>
    );
  }
}

const styles = StyleSheet.create({
  rated: {
    borderTopWidth: 1,
    borderTopColor: Consts.colorGray1,
    paddingTop: 10,
    paddingHorizontal: 10,
    marginHorizontal: -10
  }
});

const mapStateToProps = state => ({
  listingReviews: state.listingReviews,
  listingDetail: state.listingDetail,
  loadingReview: state.loadingReview,
  translations: state.translations,
  settings: state.settings
});

export default connect(mapStateToProps)(AverageDetailReviewContainer);
