# react-native-f2charts

[![License ISC](https://img.shields.io/badge/license-ISC-blue.svg)](https://opensource.org/licenses/ISC)

[F2](https://antv.alipay.com/zh-cn/f2/3.x/index.html) charts for react-native

<img src="example/image/ios.jpg" width="30%" height="30%"> <img src="example/image/android.jpg" width="28%" height="28%">


<img src="example/image/pie-chart.jpg" width="80%" height="80%">

## Installation

1. `yarn add react-native-f2charts or npm i react-native-f2charts`

2. Copy `node_moules/react-native-f2charts/src/f2chart.html` to `android/app/src/main/assets/f2chart.html`

## Example

Simple demo [example](example)

## Usage

```js
import Chart from "react-native-f2charts";

// Example from https://antv.alipay.com/zh-cn/f2/3.x/demo/line/basic.html
const initScript = data =>`
(function(){
    chart =  new F2.Chart({
        id: 'chart',
        pixelRatio: window.devicePixelRatio,
    });
    chart.source(${JSON.stringify(data)}, {
    value: {
    tickCount: 5,
    min: 0
    },
    date: {
    type: 'timeCat',
    range: [0, 1],
    tickCount: 3
    }
    });
    chart.tooltip({
    custom: true,
    showXTip: true,
    showYTip: true,
    snap: true,
    onChange: function(obj) {
        window.postMessage(stringify(obj))
    },
    crosshairsType: 'xy',
    crosshairsStyle: {
    lineDash: [2]
    }
    });
    chart.axis('date', {
    label: function label(text, index, total) {
    var textCfg = {};
    if (index === 0) {
        textCfg.textAlign = 'left';
    } else if (index === total - 1) {
        textCfg.textAlign = 'right';
    }
    return textCfg;
    }
    });
    chart.line().position('date*value');
    chart.render();
})();
`;

    ...
    render() {
        return (
            <View style={{ height: 350 }}>
              <Chart initScript={initScript(data)} />
            </View>
        )
    }
    ...
`
```

## Props

| Prop         | type          | Description                                                                                 | Required |
| ------------ | ------------- | ------------------------------------------------------------------------------------------- | -------- |
| `initScript` | string        | Initializes the F2 Chart                                                                    | `yes`    |
| `data`       | Array<Object> | Chart data to be drawn                                                                      | `no`     |
| `onChange`   | Function      | Tooltip onchange                                                                            | `no`     |
| `webView`    | ReactElement  | Use a custom WebView component (optional). By default, `react-native-webview` is used.      | `no`     |

## Notice

- Canvas `id` is `chart` instead of `mountNode' as described in the official documentation
- The tooltip's `onChange` handler is also defined in HTML. `JSON.stringify` can be used to inspect any [errors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value)
- If using `react-native-webview`，the `postMessage` tooltip is given by `window.ReactNativeWebView.postMessage`
