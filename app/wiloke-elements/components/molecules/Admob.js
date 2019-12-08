import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, ViewPropTypes } from "react-native";
import { AdMobBanner, AdMobInterstitial, AdMobRewarded } from "expo-ads-admob";
import { wait } from "../../functions/wilokeFunc";

export default class Admob extends Component {
  static propTypes = {
    bannerSize: PropTypes.oneOf([
      "banner",
      "largeBanner",
      "mediumRectangle",
      "fullBanner",
      "leaderboard"
    ]),
    adUnitID: PropTypes.string.isRequired,
    variant: PropTypes.oneOf(["banner", "interstitial", "rewarded"]),
    style: ViewPropTypes.style
  };

  static defaultProps = {
    bannerSize: "fullBanner",
    variant: "banner"
  };

  state = {
    isShow: true
  };

  _handleBannerError = err => {
    console.log(err);
    this.setState({
      isShow: false
    });
  };

  render() {
    const { bannerSize, adUnitID, variant, style } = this.props;
    const { isShow } = this.state;
    return (
      <View style={[styles.container, style]}>
        {variant === "banner" && isShow && (
          <AdMobBanner
            bannerSize={bannerSize}
            adUnitID={adUnitID}
            testDeviceID=""
            onDidFailToReceiveAdWithError={this._handleBannerError}
            onAdViewWillPresentScreen={event => console.log(event)}
          />
        )}
      </View>
    );
  }
}

export const adMobModal = async ({ adUnitID, variant }) => {
  try {
    if (variant === "interstitial") {
      AdMobInterstitial.setAdUnitID(adUnitID);
      AdMobInterstitial.setTestDeviceID("");
      await wait(1000);
      await AdMobInterstitial.requestAdAsync();
      await AdMobInterstitial.showAdAsync();
    } else if (variant === "rewarded") {
      AdMobRewarded.setAdUnitID(adUnitID);
      AdMobRewarded.setTestDeviceID("");
      await wait(1000);
      await AdMobRewarded.requestAdAsync();
      await AdMobRewarded.showAdAsync();
    }
  } catch (err) {
    console.log(err);
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  }
});
