import React, { PureComponent } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import * as WebBrowser from "expo-web-browser";
import AnimatedView from "../AnimatedView/AnimatedView";
import ListingProductItem from "../ProductItem/ListingProductItem";
import * as Consts from "../../../constants/styleConstants";
import ListingProductItemClassic from "../ProductItem/ListingProductItemClassic";

export default class ListingProductClassic extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    aSettings: PropTypes.object,
    colorPrimary: PropTypes.string
  };
  static defaultProps = {
    data: []
  };
  constructor(props) {
    super(props);
    this.state = {};
  }

  _handleItem = item => async => {
    const { navigation } = this.props;
    if (item.type === "booking") {
      WebBrowser.openBrowserAsync(item.link);
      return;
    }
    navigation.navigate("ProductDetailScreen", { productID: item.id });
  };

  _keyExtractor = (item, index) => item.id.toString();

  _renderItem = ({ item, index }) => {
    const { colorPrimary } = this.props;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={{ padding: 5 }}
        onPress={this._handleItem(item)}
      >
        <ListingProductItemClassic
          productName={item.name}
          author={item.oAuthor.displayName}
          category={item.oCategories[0]}
          salePrice={item.salePrice}
          salePriceHtml={item.salePriceHtml}
          priceHtml={item.regularPriceHtml}
          onPress={this._handleItem(item)}
          src={item.oFeaturedImg.medium}
          colorPrimary={colorPrimary}
        />
      </TouchableOpacity>
    );
  };

  render() {
    const { data } = this.props;
    return (
      <AnimatedView>
        <FlatList
          data={data}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          removeClippedSubviews={true}
          scrollEnabled={false}
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
