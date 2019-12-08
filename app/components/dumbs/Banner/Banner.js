import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Carousel from "react-native-snap-carousel";
import he from "he";
import * as WebBrowser from "expo-web-browser";
import PropTypes from "prop-types";
import { screenWidth } from "../../../constants/styleConstants";
import { ImageAutoSize } from "../../../wiloke-elements";

export default class Banner extends PureComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  };
  static defaultProps = {
    data: []
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  _handlePressItem = item => async () => {
    const { type, navigation } = this.props;
    if (type === "EXTERNAL_BANNERS" && !!item.link_to) {
      WebBrowser.openBrowserAsync(item.link_to);
      return;
    }
    navigation.navigate("ListingDetailScreen", {
      id: item.postID,
      name: he.decode(item.oListing.postTitle),
      tagline: !!item.oListing.tagLine
        ? he.decode(item.oListing.tagLine)
        : null,
      link: item.oListing.postLink,
      author: item.oListing.oAuthor,
      image:
        screenWidth > 420
          ? item.oListing.oFeaturedImg.large
          : item.oListing.oFeaturedImg.medium,
      logo:
        item.oListing.logo !== ""
          ? item.oListing.logo
          : item.oListing.oFeaturedImg.thumbnail
    });
  };

  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity activeOpacity={1} onPress={this._handlePressItem(item)}>
        <ImageAutoSize source={{ uri: item.image }} maxWidth={screenWidth} />
      </TouchableOpacity>
    );
  };

  render() {
    const { data } = this.props;
    return (
      <View style={[styles.container]}>
        <Carousel
          data={data}
          renderItem={this._renderItem}
          itemWidth={screenWidth}
          sliderWidth={screenWidth}
          useScrollView={true}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          activeSlideAlignment="center"
          loop={true}
          // enableMomentum={true}
          swipeThreshold={0}
          autoplay={true}
          autoplayInterval={this.props.timeInterval}
          hasParallaxImages={true}
          activeAnimationType="timing"
          scrollEnabled={data.length > 1}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {},
  image: {
    borderRadius: 5
  }
});
