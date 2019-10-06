import React, { PureComponent, createRef } from "react";
import { StyleSheet, Platform, Dimensions, DeviceEventEmitter } from "react-native";
import { WebView as RNWebView } from "react-native-webview";

const changeData = data => `chart.changeData(${JSON.stringify(data)});`;

const source = Platform.select({
  ios: require("./f2chart.html"),
  android: { uri: "file:///android_asset/f2chart.html" }
});

type Props = {
  initScript: string,
  data?: Array<Object>,
  onChange?: Function,
  webView?: any
};

export default class Chart extends PureComponent<Props> {
  static defaultProps = {
    onChange: () => {},
    initScript: "",
    data: [],
    webView: RNWebView
  };

  constructor(props) {
    super(props);
    this.chart = createRef();
    this.state = {
      deviceWidth: Dimensions.get("window").width,
      deviceHeight: Dimensions.get("window").height,
    };
  }

  componentDidMount() {
    DeviceEventEmitter.addListener(
      "didUpdateDimensions",
      this.handleDimensionsUpdate,
    );
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeListener(
      "didUpdateDimensions",
      this.handleDimensionsUpdate,
    );
  }

  handleDimensionsUpdate = () => {
    // Here we update the device dimensions in the state if the layout changed
    // (triggering a render)
    const deviceWidth = Dimensions.get("window").width;
    const deviceHeight = Dimensions.get("window").height;
    if (
      deviceWidth !== this.state.deviceWidth
        || deviceHeight !== this.state.deviceHeight
    ) {
      this.setState({ deviceWidth, deviceHeight }, this.repaint);
    }
  };

  componentWillReceiveProps(nextProps) {
    const { data } = this.props;
    if (data !== nextProps.data) {
      this.update(nextProps.data);
    }
  }

  update = data => {
    this.chart.current.injectJavaScript(changeData(data));
  };

  onMessage = event => {
    const {
      nativeEvent: { data }
    } = event;
    const { onChange } = this.props;
    const tooltip = JSON.parse(data);
    onChange(tooltip);
  };

  repaint = () => {
    this.setState({
      repaint: true,
    }, () => {
      this.setState({repaint: false});
    })
  };

  render() {
    const {
      webView: WebView,
      data,
      onChange,
      initScript,
      ...props
    } = this.props;
    if (this.state.repaint) {
      return null;
    }
    return (
      <WebView
        javaScriptEnabled
        ref={this.chart}
        scrollEnabled={false}
        style={styles.webView}
        injectedJavaScript={initScript}
        source={source}
        originWhitelist={["*"]}
        onMessage={this.onMessage}
        {...props}
      />
    );
  }
}

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    backgroundColor: "transparent"
  }
});