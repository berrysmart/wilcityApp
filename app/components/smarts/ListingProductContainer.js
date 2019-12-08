import React, { PureComponent } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { getListingProducts } from "../../actions";
import { ViewWithLoading, ContentBox } from "../../wiloke-elements";
import { ProductsWC, ListingProductClassic } from "../dumbs";

class ListingProductContainer extends PureComponent {
  state = {
    isLoading: true
  };

  async componentDidMount() {
    const { getListingProducts, params, type } = this.props;
    const { id, item } = params;
    await getListingProducts(id, type);
    this.setState({
      isLoading: false
    });
  }

  // _renderItem = ({ item, index }) => {};

  // _keyExtractor = (item, index) => item.id;

  _renderContent = (id, item, isLoading, listingProducts) => {
    const { translations, settings, navigation } = this.props;

    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        <ContentBox
          headerTitle={item.name}
          headerIcon={item.icon}
          style={{
            marginBottom: 10,
            width: "100%"
          }}
          colorPrimary={settings.colorPrimary}
        >
          <ListingProductClassic
            data={listingProducts}
            navigation={navigation}
            colorPrimary={settings.colorPrimary}
          />
        </ContentBox>
      </ViewWithLoading>
    );
  };

  render() {
    const { params, listingProducts } = this.props;
    const { id, item } = params;
    const { isLoading } = this.state;
    return this._renderContent(id, item, isLoading, listingProducts);
  }
}

const mapStateToProps = state => ({
  translations: state.translations,
  settings: state.settings,
  listingProducts: state.listingProducts
});
const mapDispatchToProps = {
  getListingProducts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingProductContainer);
