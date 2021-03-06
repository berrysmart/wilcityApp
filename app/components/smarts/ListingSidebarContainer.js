import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { getListingSidebar } from "../../actions";
import {
  ViewWithLoading,
  ContentBox,
  isEmpty,
  RequestTimeoutWrapped,
  P,
  HtmlViewer,
  Loader
} from "../../wiloke-elements";
import * as Consts from "../../constants/styleConstants";
import {
  ListingHours,
  ListingBusinessInfo,
  PriceRange,
  ListingCatList,
  ListingStatistic,
  ListingTagList,
  ListingCoupon,
  ListingProductClassic,
  ListingProduct,
  WilWebView
} from "../dumbs";
import { WebView } from "react-native-webview";

class ListingSidebarContainer extends Component {
  static propTypes = {
    navigation: PropTypes.object
  };

  state = {
    isLoading: true
  };

  _getListingSidebar = async () => {
    const { getListingSidebar, listingId } = this.props;
    await getListingSidebar(listingId);
    this.setState({ isLoading: false });
  };
  componentDidMount() {
    this._getListingSidebar();
  }

  // _getIcon = key => {
  //   switch (key) {
  //     case "businessHours":
  //       return "clock";
  //     case "categories":
  //       return "layers";
  //     case "statistic":
  //       return "bar-chart-2";
  //     case "tags":
  //       return "tag";
  //     case "businessInfo":
  //       return "repeat";
  //     default:
  //       return "check-circle";
  //   }
  // };

  _checkItemContent = item => {
    const { navigation, translations, settings } = this.props;
    switch (item.aSettings.key) {
      case "businessHours":
        return (
          <ListingHours
            data={item.oContent}
            alwaysOpenText={translations.always_open}
          />
        );
      case "priceRange":
        return (
          <View>
            {!!item.oContent.desc && (
              <P style={{ paddingBottom: 5 }}>{item.oContent.desc}</P>
            )}
            <PriceRange
              data={item.oContent}
              colorPrimary={settings.colorPrimary}
            />
          </View>
        );
      case "categories":
        return <ListingCatList data={item.oContent} />;
      case "statistic":
        return <ListingStatistic data={item.oContent} />;
      case "wilcity_single_sidebar_my_checkbox2_field":
      case "wilcity_single_sidebar_my_select_field":
      case "tags":
        return <ListingTagList data={item.oContent} />;
      case "businessInfo":
        return (
          <ListingBusinessInfo data={item.oContent} navigation={navigation} />
        );
      case "coupon":
        return (
          <ListingCoupon
            data={item.oContent}
            translations={translations}
            colorPrimary={settings.colorPrimary}
          />
        );
      case "myProducts":
        return (
          <ListingProductClassic
            data={item.oContent}
            aSettings={item.aSettings}
            translations={translations}
            navigation={navigation}
            auth={this.props.auth}
            colorPrimary={settings.colorPrimary}
          />
        );
      case "woocommerceBooking":
        return item.aSettings.style === "listPersons" ? (
          <ListingProduct
            data={item.oContent}
            aSettings={item.aSettings}
            translations={translations}
            navigation={navigation}
            auth={this.props.auth}
            colorPrimary={settings.colorPrimary}
          />
        ) : (
          <ListingProductClassic
            data={item.oContent}
            aSettings={item.aSettings}
            translations={translations}
            navigation={navigation}
            auth={this.props.auth}
            colorPrimary={settings.colorPrimary}
          />
        );
      // case "wilcity_single_sidebar_image":
      // case "wilcity_single_sidebar_my_textarea_field":
      //   return (
      //     <View style={{ marginLeft: -10 }}>
      //       <HtmlViewer
      //         html={item.oContent}
      //         htmlWrapCssString={`font-size: 13px; color: ${
      //           Consts.colorDark2
      //         }; line-height: 1.4em`}
      //         containerMaxWidth={Consts.screenWidth - 22}
      //         containerStyle={{ paddingLeft: 10, paddingRight: 0 }}
      //       />
      //     </View>
      //   );
      default:
        return item.aSettings.isWebView ? (
          <View style={{ marginLeft: -10, paddingVertical: 20 }}>
            <WebView
              source={{ html: `${item.oContent}` }}
              originWhitelist={["https://*", "git://*"]}
              startInLoadingState={true}
              renderLoading={() => <Loader />}
              renderError={err => console.log("errooorr", err)}
            />
          </View>
        ) : (
          <View style={{ marginLeft: -10 }}>
            <HtmlViewer
              html={item.oContent}
              htmlWrapCssString={`font-size: 13px; color: ${Consts.colorDark2}; line-height: 1.4em`}
              containerMaxWidth={Consts.screenWidth - 22}
              containerStyle={{ paddingLeft: 10, paddingRight: 0 }}
            />
          </View>
        );
    }
  };

  renderStatusHours = item => {
    if (!item.oContent.oDetails) {
      return false;
    }
    const { status, text } = item.oContent.oDetails.oCurrent;
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor:
            status === "closed" || status === "close" || status === "day_off"
              ? Consts.colorQuaternary
              : Consts.colorSecondary,
          borderRadius: 2,
          paddingVertical: 3,
          paddingHorizontal: 8
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color:
              status === "closed" || status === "close" || status === "day_off"
                ? Consts.colorQuaternary
                : Consts.colorSecondary
          }}
        >
          {text}
        </Text>
      </View>
    );
  };

  renderItem = (item, index) => {
    const { settings } = this.props;
    if (typeof item === "object") {
      const { key, name, icon } = item.aSettings;
      if (
        key === "t???i_???ng_d???ng_icare-plus.vn" ||
        key === "co_the_ban_quan_tam"
      ) {
        return false;
      }
      return (
        item.oContent.mode !== "no_hours_available" && (
          <ContentBox
            key={index.toString()}
            headerTitle={name ? name : ""}
            headerIcon={icon}
            showHeader={item.aSettings.key !== "coupon"}
            renderRight={() => {
              return key === "businessHours" && this.renderStatusHours(item);
            }}
            style={{ marginBottom: 10 }}
            colorPrimary={settings.colorPrimary}
          >
            {this._checkItemContent(item)}
          </ContentBox>
        )
      );
    }
  };

  render() {
    const { isLoading } = this.state;
    const {
      listingSidebar,
      isListingDetailSidebarRequestTimeout,
      translations
    } = this.props;
    return (
      <RequestTimeoutWrapped
        isTimeout={isListingDetailSidebarRequestTimeout}
        onPress={this._getListingSidebar}
        text={translations.networkError}
        buttonText={translations.retry}
      >
        <ViewWithLoading
          isLoading={isLoading}
          contentLoader="contentHeader"
          contentLoaderItemLength={1}
        >
          {!isEmpty(listingSidebar) && listingSidebar.map(this.renderItem)}
        </ViewWithLoading>
      </RequestTimeoutWrapped>
    );
  }
}

const mapStateToProps = state => ({
  listingSidebar: state.listingSidebar,
  translations: state.translations,
  isListingDetailSidebarRequestTimeout:
    state.isListingDetailSidebarRequestTimeout,
  settings: state.settings,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getListingSidebar }
)(ListingSidebarContainer);
