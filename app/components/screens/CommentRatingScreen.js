import React, { PureComponent } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated
} from "react-native";
import { connect } from "react-redux";
import { isEmpty } from "lodash";
import Constants from "expo-constants";
import {
  ViewWithLoading,
  RequestTimeoutWrapped,
  FontIcon,
  ContentBox
} from "../../wiloke-elements";
import {
  getCommentsRating,
  getRatingStatics,
  getCommentsLoadMore
} from "../../actions";
import { TotalRating, CommentRatingItem } from "../dumbs";
import * as Consts from "../../constants/styleConstants";

class CommentRatingScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      animated: new Animated.Value(0),
      refreshing: false,
      currentPage: 1,
      loadmore: false
    };
  }

  componentDidMount() {
    this._getRatingComments();
  }

  _startAnimated = () => {
    const { animated } = this.state;
    Animated.timing(animated, {
      duration: 200,
      toValue: 100,
      useNativeDriver: true
    }).start();
  };

  _getRatingComments = async () => {
    const { getCommentsRating, getRatingStatics } = this.props;
    const { currentPage } = this.state;
    const productID = this.props.navigation.getParam("id", 1234);
    await getCommentsRating(productID, currentPage);
    await getRatingStatics(productID);
    const { comments } = this.props;
    if (!isEmpty(comments)) {
      this.setState(
        {
          isLoading: false,
          refreshing: false,
          currentPage: this.state.currentPage + 1
        },
        () => this._startAnimated()
      );
    }
  };

  _handleGoBack = () => {
    this.props.navigation.goBack();
  };

  _handleRefresh = async () => {
    await this.setState({
      refreshing: true,
      currentPage: 1
    });
    this._getRatingComments();
  };

  _handleLoadMore = async () => {
    const { getCommentsLoadMore, product } = this.props;
    if (this.state.currentPage > product.totalPage) return;
    const productID = this.props.navigation.getParam("id", 1234);
    await this.setState({
      loadmore: true
    });
    await getCommentsLoadMore(productID, this.state.currentPage);
    await this.setState({
      loadmore: false,
      currentPage: this.state.currentPage + 1
    });
  };

  _getOpacity = () => {
    const { animated } = this.state;
    return animated.interpolate({
      inputRange: [0, 50, 100],
      outputRange: [0, 0.5, 1],
      extrapolate: "clamp"
    });
  };

  _keyExtractor = (item, index) => item.ID.toString();

  _renderItem = ({ item, index }) => {
    const { settings } = this.props;
    return (
      <View style={{ padding: 5, paddingHorizontal: 10 }}>
        <CommentRatingItem
          rating={item.rating}
          author={item.author}
          authorAvatar={item.authorAvatar}
          date={item.date}
          content={item.content}
        />
      </View>
    );
  };

  _renderHeaderList = () => {
    const { staticRating } = this.props;
    const { oDetailStatistics } = staticRating;
    const data = Object.keys(oDetailStatistics)
      .map(item => {
        return {
          numberRating: item,
          value: oDetailStatistics[item]
        };
      })
      .sort((a, b) => b.numberRating - a.numberRating);
    return (
      <TotalRating
        avarageRating={staticRating.average_rating}
        ratingText={`${staticRating.average_rating}`}
        ratingCount={staticRating.rating_count}
        data={data}
      />
    );
  };

  _renderFooterList = () => {
    const { loadmore } = this.state;
    if (!loadmore) return null;
    return (
      <ViewWithLoading
        isLoading={true}
        contentLoader="contentHeaderAvatar"
        contentLoaderItemLength={1}
        featureRatioWithPadding={10}
      />
    );
  };

  _renderHeader = () => {
    const { translations, settings } = this.props;
    return (
      <View style={[styles.header, { backgroundColor: settings.colorPrimary }]}>
        <TouchableOpacity style={styles.icon} onPress={this._handleGoBack}>
          <FontIcon name="fa-angle-left" size={30} color="#fff" />
        </TouchableOpacity>
        <View style={styles.center}>
          <Text style={styles.title}>
            {translations.oChart.oLabels.ratings}
          </Text>
        </View>
        <Text style={{ width: "20%" }} />
      </View>
    );
  };

  render() {
    const { isLoading } = this.state;
    const { comments, isProductDetailsTimeout, translations } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: Consts.colorGray1 }}>
        {this._renderHeader()}
        <ViewWithLoading
          isLoading={isLoading}
          contentLoader="contentHeaderAvatar"
          contentLoaderItemLength={3}
          featureRatioWithPadding={10}
        >
          <RequestTimeoutWrapped
            isTimeout={isProductDetailsTimeout}
            onPress={this._getRatingComments}
            text={translations.networkError}
            buttonText={translations.retry}
          >
            <Animated.View
              style={[styles.list, { opacity: this._getOpacity() }]}
            >
              <FlatList
                data={comments}
                renderItem={this._renderItem}
                keyExtractor={this._keyExtractor}
                ListHeaderComponent={this._renderHeaderList}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      width: "100%",
                      height: 1,
                      backgroundColor: Consts.colorGray1
                    }}
                  />
                )}
                showsVerticalScrollIndicator={false}
                refreshing={this.state.refreshing}
                onRefresh={this._handleRefresh}
                ListFooterComponent={this._renderFooterList}
                onEndReached={this._handleLoadMore}
                onEndReachedThreshold={0.2}
                removeClippedSubviews={true}
              />
            </Animated.View>
          </RequestTimeoutWrapped>
        </ViewWithLoading>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  header: {
    paddingTop: Constants.statusBarHeight,
    height: 52 + Constants.statusBarHeight,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
    paddingRight: 10
  },
  center: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center"
  },
  icon: {
    width: "20%",
    paddingLeft: 15
  },
  list: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 7
  }
});

const mapStateToProps = state => ({
  comments: state.productReducer.comments,
  product: state.productReducer,
  staticRating: state.productReducer.staticRating,
  translations: state.translations,
  settings: state.settings,
  isProductTimeout: state.isProductDetailsTimeout
});
const mapDispatchToProps = {
  getCommentsRating,
  getRatingStatics,
  getCommentsLoadMore
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentRatingScreen);
