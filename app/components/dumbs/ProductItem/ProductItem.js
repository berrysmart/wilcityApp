import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { ImageCover, HtmlViewer, Rating } from "../../../wiloke-elements";
import * as Consts from "../../../constants/styleConstants";
import GradeView from "../GradeView/GradeView";
import TextDecode from "../TextDecode/TextDecode";

export default class ProductItem extends PureComponent {
  static propTypes = {
    productName: PropTypes.string,
    priceHTML: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    featureImage: PropTypes.string,
    containerStyle: PropTypes.object,
    onPress: PropTypes.func,
    salePriceHTML: PropTypes.string,
    rating: PropTypes.number,
    colorPrimary: PropTypes.string
  };

  _renderFooter = () => {
    const { category, rating } = this.props;
    return (
      <View style={styles.footer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Rating
            startingValue={rating}
            fractions={2}
            ratingCount={5}
            showRating={false}
            readonly={true}
            imageSize={10}
            style={{ padding: 5 }}
          />
          <Text style={styles.category}>{category}</Text>
        </View>
      </View>
    );
  };

  _renderGradeView = () => {
    const { discount, colorPrimary } = this.props;
    return (
      <View style={styles.gradeView}>
        <GradeView
          containerStyle={{ borderRadius: 3 }}
          RATED_SIZE={25}
          textStyle={{ fontSize: 10 }}
          gradeText={discount}
          colorPrimary={colorPrimary}
        />
      </View>
    );
  };

  render() {
    const {
      containerStyle,
      featureImage,
      productName,
      priceHTML,
      salePrice,
      onPress,
      salePriceHTML,
      rating,
      colorPrimary
    } = this.props;
    return (
      <TouchableOpacity
        style={[styles.container, containerStyle]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={styles.logo}>
          <ImageCover src={featureImage} width="100%" />
        </View>
        <View style={styles.details}>
          <TextDecode
            text={productName}
            style={styles.name}
            numberOfLines={1}
            ellipsizeMode="tail"
          />
          <View>
            {!!salePrice && (
              <HtmlViewer
                html={salePriceHTML}
                containerStyle={{ padding: 0, paddingRight: 5 }}
                htmlWrapCssString={`color: ${colorPrimary}`}
              />
            )}
            <HtmlViewer
              html={priceHTML}
              containerStyle={{
                padding: 0
              }}
              htmlWrapCssString={
                !!salePrice
                  ? `text-decoration-line: line-through; color:#e5e5e5;`
                  : `color: ${colorPrimary}`
              }
            />
          </View>
        </View>
        {this._renderFooter()}
        {!!salePrice && this._renderGradeView()}
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: "100%",
    flex: 1,
    position: "relative",
    zIndex: 1,
    borderRadius: 5
  },
  details: {
    paddingHorizontal: 7,
    paddingTop: 7,
    paddingBottom: 40
  },
  logo: {
    width: "100%",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5
  },
  name: {
    fontSize: 15,
    color: "#333",
    flexWrap: "wrap",
    fontWeight: "bold"
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 3,
    width: "100%"
  },
  category: {
    fontSize: 12,
    color: "#333",
    padding: 10
  },
  gradeView: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10
  }
});
