import React, { PureComponent } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { getListingRestaurantMenu, getScrollTo } from "../../actions";
import {
  ViewWithLoading,
  isEmpty,
  ContentBox,
  FontIcon,
  DeepLinkingSocial
} from "../../wiloke-elements";
import RestaurantMenuItem from "../dumbs/RestaurantMenu/RestaurantMenuItem.js";
import { colorGray1 } from "../../constants/styleConstants";

class ListingResMenuContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  async componentDidMount() {
    const { getListingRestaurantMenu, params } = this.props;
    const { id, item } = params;
    await getListingRestaurantMenu(id);
    this.setState({ isLoading: false });
  }

  _getData = data => {
    return Object.keys(data).map(item => {
      return data[item];
    });
  };

  _handleListingItem = link => () => {
    if (link === "#") return;
    return DeepLinkingSocial(link);
  };

  _renderMenuItem = ({ item, index, separators }) => {
    const isGallery = !!item.gallery;
    return (
      <RestaurantMenuItem
        title={item.title}
        description={item.description}
        price={item.price}
        gallery={(isGallery && Object.values(item.gallery).map(i => i)) || []}
        onPress={this._handleListingItem(item.link_to)}
      />
    );
  };

  _keyExtractor = (item, index) => index.toString();

  _renderHeaderItem = (item, index) => () => {
    const { translations, settings } = this.props;
    return (
      <View style={styles.headerItem}>
        <Text style={styles.text}>{item.group_title}</Text>
        <FontIcon
          name={item.group_icon}
          size={22}
          color={settings.colorPrimary}
        />
      </View>
    );
  };

  _renderItem = length => (item, index) => {
    return (
      <FlatList
        key={item.wrapper_class}
        data={item.items}
        keyExtractor={this._keyExtractor}
        ListHeaderComponent={this._renderHeaderItem(item, index)}
        renderItem={this._renderMenuItem}
        style={
          length > 1 && {
            borderBottomWidth: 1,
            borderBottomColor: colorGray1
          }
        }
      />
    );
  };

  _renderContent = (id, item, isLoading, restaurantMenu) => {
    const { translations, settings } = this.props;
    const restaurantList = this._getData(restaurantMenu);
    const length = restaurantList.length;

    return (
      <ViewWithLoading isLoading={isLoading} contentLoader="contentHeader">
        {!isEmpty(restaurantList) && (
          <ContentBox
            headerTitle={item.name}
            headerIcon={item.icon}
            style={{
              marginBottom: 10,
              marginTop: 10,
              width: "100%"
            }}
            // renderFooter={
            //   item.status &&
            //   item.status === "yes" &&
            //   this._renderFooterContentBox(id, item.key)
            // }
            colorPrimary={settings.colorPrimary}
          >
            {restaurantList.map(this._renderItem(length))}
          </ContentBox>
        )}
      </ViewWithLoading>
    );
  };

  // _renderFooterContentBox = (id, key) => {
  //   const {
  //     translations,
  //     changeListingDetailNavigation,
  //     getListingEvents,
  //     getScrollTo
  //   } = this.props;
  //   return (
  //     <ButtonFooterContentBox
  //       text={translations.viewAll.toUpperCase()}
  //       onPress={() => {
  //         changeListingDetailNavigation(key);
  //         getListingEvents(listingId, key, null);
  //         getScrollTo(0);
  //       }}
  //     />
  //   );
  // };

  render() {
    const { params, listingRestaurantMenu } = this.props;
    const { id, item } = params;
    const { isLoading } = this.state;
    return this._renderContent(id, item, isLoading, listingRestaurantMenu);
  }
}

const styles = StyleSheet.create({
  headerItem: {
    justifyContent: "center",
    alignItems: "center",
    padding: 7
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textTransform: "uppercase",
    paddingHorizontal: 5,
    paddingBottom: 8
  },
  separator: {
    height: 3,
    width: "100%",
    backgroundColor: "#333"
  }
});
const mapStateToProps = state => ({
  translations: state.translations,
  settings: state.settings,
  listingRestaurantMenu: state.listingRestaurantMenu
});
const mapDispatchToProps = {
  getScrollTo,
  getListingRestaurantMenu
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListingResMenuContainer);
