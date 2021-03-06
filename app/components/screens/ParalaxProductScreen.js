import React, { PureComponent } from "react";
import {
  Text,
  View,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import PropTypes from "prop-types";
import {
  ParallaxScreen,
  FontIcon,
  RequestTimeoutWrapped,
  Loader,
  bottomBarHeight,
  ViewWithLoading
} from "../../wiloke-elements";
import { colorPrimary } from "../../constants/styleConstants";
import { AnimatedView } from "../dumbs";
export default class ParalaxProductScreen extends PureComponent {
  static propTypes = {
    productName: PropTypes.string,
    renderButtonCart: PropTypes.func,
    renderContent: PropTypes.func,
    renderHeaderRight: PropTypes.func,
    isLoading: PropTypes.bool
  };

  static defaultProps = {
    renderButtonCart: () => {}
  };

  state = {
    scrollY: new Animated.Value(0),
    headerMaxHeight: 0,
    headerMinHeight: 0,
    animation: new Animated.Value(0)
  };

  componentDidMount() {
    this._startAnimation();
  }

  _startAnimation = () => {
    const { animation } = this.state;
    Animated.timing(animation, {
      toValue: 100,
      duration: 250
    }).start();
  };

  _handleGetScrollYAnimation = (scrollY, headerMeasure) => {
    const { headerMaxHeight, headerMinHeight } = headerMeasure;
    this.setState({
      scrollY,
      headerMaxHeight,
      headerMinHeight
    });
  };

  _getHeaderDistance = () => {
    const { headerMaxHeight, headerMinHeight } = this.state;
    return headerMaxHeight - headerMinHeight;
  };

  _renderHeaderLeft = () => {
    return (
      <TouchableOpacity style={styles.icon} onPress={this.props.onBack}>
        <FontIcon name="fa-angle-left" size={30} color="#fff" />
      </TouchableOpacity>
    );
  };

  _renderHeaderCenter = () => {
    const { productName } = this.props;
    return <Text style={styles.name}>{productName}</Text>;
  };

  _renderContent = () => {
    const {
      isProductDetailsTimeout,
      translations,
      settings,
      renderContent,
      isLoading
    } = this.props;
    const { scrollY } = this.state;
    const opacity = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance() / 2, this._getHeaderDistance()],
      outputRange: [0, 0.4, 1]
    });
    return (
      <RequestTimeoutWrapped
        isTimeout={isProductDetailsTimeout}
        // onPress={this._getProductDetails}
        text={translations.networkError}
        buttonText={translations.retry}
      >
        {isLoading ? <Loader /> : renderContent(opacity)}
      </RequestTimeoutWrapped>
      // <ViewWithLoading
      //   isLoading={isLoading}
      //   contentLoader="content"
      //   contentLoaderItemLength={2}
      //   gap={0}
      // >
      //   <RequestTimeoutWrapped
      //     isTimeout={isProductDetailsTimeout}
      //     // onPress={this._getProductDetails}
      //     text={translations.networkError}
      //     buttonText={translations.retry}
      //   >
      //   {renderContent(opacity)}
      //   </RequestTimeoutWrapped>
      // </ViewWithLoading>
    );
  };

  _getStyleButton = () => {
    const { scrollY } = this.state;
    const translateY = scrollY.interpolate({
      inputRange: [0, this._getHeaderDistance() / 2, this._getHeaderDistance()],
      outputRange: [0, 0, 2000],
      extrapolate: "clamp"
    });

    return {
      transform: [{ translateY }]
    };
  };

  _getStylesContainer = () => {
    const { animation } = this.state;
    const opacity = animation.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp"
    });
    return opacity;
  };

  render() {
    const {
      renderHeaderRight,
      renderButtonCart,
      renderContent,
      isLoading
    } = this.props;
    return (
      <View style={[styles.container]}>
        <AnimatedView>
          <ParallaxScreen
            {...this.props}
            renderHeaderRight={renderHeaderRight}
            // renderInsideImage={this._renderInsideImage}
            renderHeaderLeft={this._renderHeaderLeft}
            renderHeaderCenter={this._renderHeaderCenter}
            onGetScrollYAnimation={this._handleGetScrollYAnimation}
            renderContent={this._renderContent}
          />
          {!isLoading && (
            <Animated.View style={[styles.footer, this._getStyleButton()]}>
              {renderButtonCart()}
            </Animated.View>
          )}
        </AnimatedView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1,
    height: Dimensions.get("window").height
  },
  icon: {
    position: "relative",
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  name: {
    paddingHorizontal: 5,
    color: "#fff",
    fontWeight: "bold"
  },
  inside: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  footer: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    zIndex: 10
  }
});
