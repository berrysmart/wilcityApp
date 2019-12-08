import React, { PureComponent } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import {
  ImageCover,
  FontIcon,
  HtmlViewer,
  CheckBox
} from "../../../wiloke-elements";
// import { colorPrimary } from "../../../constants/styleConstants";
import TextDecode from "../TextDecode/TextDecode";

export default class ListingProductItemClassic extends PureComponent {
  static propTypes = {
    src: PropTypes.string,
    productName: PropTypes.string,
    priceHtml: PropTypes.string,
    salePriceHtml: PropTypes.string,
    onPress: PropTypes.func,
    category: PropTypes.string,
    author: PropTypes.string,
    status: PropTypes.string,
    salePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    colorPrimary: PropTypes.string
  };

  render() {
    const {
      src,
      productName,
      priceHtml,
      salePriceHtml,
      onPress,
      category,
      author,
      salePrice,
      status,
      colorPrimary
    } = this.props;
    return (
      <View style={styles.container}>
        <View style={{ padding: 5, flexDirection: "row" }}>
          <View style={styles.logo}>
            <ImageCover src={src} width="100%" borderRadius={5} />
          </View>
          <View style={styles.infoProduct}>
            <TextDecode
              text={productName}
              style={styles.name}
              numberOfLines={1}
              ellipsizeMode="tail"
            />
            <View>
              {!!salePrice && (
                <HtmlViewer
                  html={salePriceHtml}
                  containerStyle={{ padding: 0, paddingRight: 5 }}
                  htmlWrapCssString={`color: ${colorPrimary}; font-size: 10px;`}
                />
              )}
              <HtmlViewer
                html={priceHtml}
                containerStyle={{
                  padding: 0
                }}
                htmlWrapCssString={
                  !!salePrice
                    ? `text-decoration-line: line-through; color:#e5e5e5; font-size: 10px;`
                    : `color: ${colorPrimary}, font-size: 12px;`
                }
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.text}>{author}</Text>
              <Text style={styles.text}>{category}</Text>
              {status && (
                <Text style={[styles.text, { color: "#32C267" }]}>
                  {status}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 5
  },
  infoProduct: {
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
  text: {
    fontSize: 12,
    color: "#222",
    paddingRight: 5
  }
});
