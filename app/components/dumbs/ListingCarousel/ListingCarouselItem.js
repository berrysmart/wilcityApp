import React, { PureComponent } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import he from "he";
import PropTypes from "prop-types";
import { ImageCover, FontIcon } from "../../../wiloke-elements";
import * as Consts from "../../../constants/styleConstants";
import AnimatedView from "../AnimatedView/AnimatedView";
export default class ListingCarouselItem extends PureComponent {
  static propTypes = {
    data: PropTypes.array
  };

  _keyExtractor = (item, index) => item.ID.toString();

  _handleListingItem = item => async () => {
    const { navigation } = this.props;
    navigation.navigate("ListingDetailScreen", {
      id: item.ID,
      name: he.decode(item.postTitle),
      tagline: !!item.tagLine ? he.decode(item.tagLine) : null,
      link: item.postLink,
      author: item.oAuthor,
      image:
        Consts.screenWidth > 420
          ? item.oFeaturedImg.large
          : item.oFeaturedImg.medium,
      logo: item.logo !== "" ? item.logo : item.oFeaturedImg.thumbnail
    });
  };

  _renderCoupon = item => {
    const { colorPrimary } = this.props;
    const text = !!item.highlight ? item.highlight : item.title;
    return (
      <View style={styles.wrapper}>
        <View style={styles.coupon}>
          <FontIcon name={item.icon} color={colorPrimary} size={15} />
          <Text style={[styles.highlight, { color: colorPrimary }]}>
            {text}
          </Text>
        </View>
      </View>
    );
  };

  _renderItem = ({ item, index }) => {
    const { colorPrimary } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={this._handleListingItem(item)}
      >
        <View style={{ flexDirection: "row", padding: 5 }}>
          <View style={styles.logo}>
            <ImageCover src={item.coverImg} width="100%" borderRadius={5} />
          </View>
          <View style={styles.infoListing}>
            <Text style={styles.name}>{he.decode(item.postTitle)}</Text>
            <View style={styles.address}>
              <FontIcon name="map-pin" size={15} color={colorPrimary} />
              <Text
                style={[
                  styles.text,
                  { paddingHorizontal: 5, width: Consts.screenWidth - 150 }
                ]}
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                {item.tagLine}
              </Text>
            </View>
            {!!item.oCoupon && this._renderCoupon(item.oCoupon)}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { data } = this.props;
    return (
      <AnimatedView>
        <FlatList
          data={data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          scrollEnabled={false}
          removeClippedSubviews={true}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: Consts.colorGray1
              }}
            />
          )}
        />
      </AnimatedView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 5
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 5
  },
  infoListing: {
    paddingLeft: 10
  },
  name: {
    fontSize: 12,
    color: "#333",
    flexWrap: "wrap",
    fontWeight: "bold",
    paddingVertical: 3,
    textTransform: "uppercase"
  },
  address: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5
  },
  text: {
    fontSize: 12,
    color: "#222"
  },
  wrapper: {
    paddingHorizontal: 5,
    borderRadius: 3,
    flexWrap: "wrap",
    alignItems: "flex-start",
    flexDirection: "row"
  },
  coupon: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Consts.colorGray1,
    paddingHorizontal: 5,
    borderRadius: 3
  },
  highlight: {
    paddingVertical: 4,
    paddingHorizontal: 3,
    fontSize: 10
  }
});
