import React, { PureComponent } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { ImageCover, NewGallery } from "../../../wiloke-elements";
import { isEmpty } from "lodash";

export default class RestaurantMenuItem extends PureComponent {
  static propTypes = {
    imageFeature: PropTypes.string,
    gallery: PropTypes.array,
    description: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.string,
    link: PropTypes.string,
    customStyle: PropTypes.object,
    onPress: PropTypes.func
  };

  _renderImage = () => {
    const { imageFeature } = this.props;
    return (
      <View style={styles.imageFeature}>
        <ImageCover src={imageFeature} width="100%" borderRadius={5} />
      </View>
    );
  };

  _renderGallery = () => {
    const { gallery } = this.props;
    return (
      !isEmpty(gallery) && (
        <View style={{ width: 90, flex: 0.3 }}>
          <NewGallery
            thumbnails={gallery}
            thumbnailMax={1}
            column={1}
            modalSlider={gallery}
            borderRadius={7}
            isOverlay={false}
          />
        </View>
      )
    );
  };

  _renderContent = () => {
    const { title, description, price, link, onPress } = this.props;
    return (
      <TouchableOpacity style={styles.content} onPress={onPress}>
        <View style={styles.contentCenter}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description} ellipsizeMode="tail">
            {description}
          </Text>
          <Text style={styles.price}>{price}</Text>
        </View>
        <Text />
        {this._renderGallery()}
      </TouchableOpacity>
    );
  };

  render() {
    const { customStyles } = this.props;
    return (
      <View style={[styles.container, customStyles]}>
        {this._renderContent()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10
  },
  imageFeature: {
    width: 60,
    borderRadius: 5
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  contentCenter: {
    marginHorizontal: 10,
    flexDirection: "column",
    flex: 0.7
  },
  title: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    padding: 5
  },
  description: {
    color: "#9EA6BA",
    fontSize: 14,
    padding: 5,
    flexWrap: "wrap",
    flexShrink: 0
  },
  price: {
    color: "#FC6464",
    fontSize: 14,
    fontWeight: "600",
    padding: 5
  }
});
