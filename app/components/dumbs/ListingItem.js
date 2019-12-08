import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  ViewPropTypes
} from "react-native";
import _ from "lodash";
import * as Consts from "../../constants/styleConstants";
import stylesBase from "../../stylesBase";
import Heading from "./Heading";
import { IconTextSmall, ImageCover, mapDistance } from "../../wiloke-elements";
import Rated from "./Rated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH_HORIZONTAL = (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) / 1.8;
const ITEM_WIDTH_VERTICAL = (SCREEN_WIDTH > 600 ? 600 : SCREEN_WIDTH) / 2 - 15;

export default class ListingItem extends PureComponent {
  static propTypes = {
    layout: PropTypes.oneOf(["vertical", "horizontal"]),
    image: PropTypes.string,
    logo: PropTypes.string,
    name: PropTypes.string,
    tagline: PropTypes.string,
    location: PropTypes.string,
    phone: PropTypes.string,
    reviewMode: PropTypes.number,
    reviewAverage: PropTypes.number,
    businessStatus: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.objectOf(PropTypes.string)
    ]),
    onPress: PropTypes.func,
    colorPrimary: PropTypes.string,
    containerStyle: ViewPropTypes.style,
    featureImageWidth: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    mapDistance: PropTypes.string
  };
  static defaultProps = {
    contentLoader: false,
    colorPrimary: Consts.colorPrimary,
    isFooterAutoDisable: true,
    mapDistance: ""
  };

  renderRated() {
    const { reviewMode, reviewAverage } = this.props;
    return (
      <Rated
        rate={reviewAverage}
        max={reviewMode}
        rateStyle={{ fontSize: 13, marginRight: 2 }}
        maxStyle={{ fontSize: 9 }}
      />
    );
  }

  renderImage() {
    const { layout, image, featureImageWidth } = this.props;
    return (
      <ImageCover
        src={image}
        width={
          layout === "horizontal" ? ITEM_WIDTH_HORIZONTAL : ITEM_WIDTH_VERTICAL
        }
        modifier="16by9"
        overlay={0.3}
        styles={{
          borderTopLeftRadius: Consts.round,
          borderTopRightRadius: Consts.round,
          width: featureImageWidth
        }}
      />
    );
  }

  renderFooter = () => {
    const { businessStatus } = this.props;
    return (
      <View style={styles.footer}>
        {this.renderRated()}
        <Text
          style={{
            fontSize: 11,
            color:
              businessStatus.status === "open"
                ? Consts.colorSecondary
                : Consts.colorQuaternary
          }}
        >
          {businessStatus.text}
        </Text>
      </View>
    );
  };

  renderContent = () => {
    const {
      businessStatus,
      reviewAverage,
      isFooterAutoDisable,
      location,
      logo,
      onPress,
      title,
      tagline,
      colorPrimary,
      mapDistance
    } = this.props;
    const footerCondition =
      !isFooterAutoDisable || (!!businessStatus || !!reviewAverage);
    return (
      <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
        <View>
          <View style={styles.wrap}>
            {this.renderImage()}
            {!!mapDistance && (
              <View
                style={[
                  styles.mapDistance,
                  {
                    backgroundColor: Consts.colorSecondary
                  }
                ]}
              >
                <Text style={styles.mapDistanceText}>{mapDistance}</Text>
              </View>
            )}
            <View style={styles.logoWrap}>
              <ImageCover
                src={logo}
                width={30}
                styles={styles.logo}
                borderRadius={15}
              />
              <Image
                source={require("../../../assets/wave.png")}
                style={styles.wave}
              />
            </View>
          </View>
          <View style={[stylesBase.pd10, styles.pd]}>
            <Heading
              title={title}
              text={tagline}
              titleSize={12}
              textSize={11}
              titleNumberOfLines={1}
              textNumberOfLines={1}
            />
            {!!location && (
              <View style={styles.textWrap}>
                <IconTextSmall
                  text={location}
                  iconName="map-pin"
                  numberOfLines={1}
                  iconColor={colorPrimary}
                />
              </View>
            )}
            {footerCondition && this.renderFooter()}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { layout, containerStyle } = this.props;
    return (
      <View
        style={[
          styles.container,
          {
            width:
              layout === "horizontal"
                ? ITEM_WIDTH_HORIZONTAL
                : ITEM_WIDTH_VERTICAL
          },
          containerStyle
        ]}
      >
        {this.renderContent()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: Consts.round,
    margin: 5
  },
  logoWrap: {
    position: "relative",
    zIndex: 9,
    marginTop: -15.5,
    marginLeft: 0,
    marginBottom: -5,
    width: 66
  },
  wave: {
    width: 66,
    height: (66 * 131) / 317,
    position: "absolute",
    zIndex: -1,
    top: 0,
    left: 0
  },
  logo: {
    marginLeft: 18,
    marginTop: 2
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // borderTopWidth: 1,
    // borderTopColor: Consts.colorGray2,
    marginTop: 8,
    marginBottom: -2,
    marginHorizontal: -10,
    paddingTop: 5,
    paddingHorizontal: 10
  },
  textWrap: { marginRight: 10, marginTop: 2 },
  pd: { paddingTop: 10, paddingBottom: 10 },
  wrap: {
    position: "relative"
  },
  mapDistance: {
    position: "absolute",
    zIndex: 9,
    top: 6,
    right: 6,
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: Consts.round
  },
  mapDistanceText: {
    color: "#fff",
    fontSize: 13
  }
});
