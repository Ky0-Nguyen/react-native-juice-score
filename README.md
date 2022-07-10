# rn-juicyscore

React Native adapter for Juicyscore SDKs.

## Installation (autolinking)

```sh
yarn add file:/path/to/local/rn-juicyscore/
```

### iOS

It is necessary to import Info.plist of the library to general Info.plist of application. It is strongly recommended to include a request to User to permit geoposition collection NSLocationWhenInUseUsageDescription . Note, that geolocation is used with >1000 meters granularity.

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Some privacy text</string>
```

To support analysis of installed applications list Info.plist of your project should be complemented by the following:

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>youtube</string>
    <string>instagram</string>
    <string>fb</string>
    <string>vk</string>
    <string>whatsapp</string>
    <string>tg</string>
    <string>amazon</string>
    <string>vpn-master</string>
    <string>tor-browser</string>
    <string>vpn-express-free-mobile-vpn</string>
    <string>free-vpn-by-free-vpn-org</string>
    <string>slack</string>
    <string>asos</string>
    <string>ebay</string>
    <string>aliexpress-shopping-app</string>
    <string>skype</string>
    <string>linkedin</string>
    <string>weixin</string>
    <string>gosuslugi</string>
</array>
```

### Android

Add permissions to AndroidManifest.xml
Permission are not strictly required but helps collecting more details about device for better matching/scoring.

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.BLUETOOTH"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### Update libs

- Android: Replace `android/JuicyScoreSDK`
- iOS: Replace `ios/JuicyScoreSDK`


## Example application

Sample RN applications demonstrate usage of Juicyscore SDKs:
```sh
yarn
yarn example ios
yarn example android
```


## Usage

### Initialization
JuicyScore token will be availbale only after initialization (RNJuicyScoreSDK.create).

```js
import { RNJuicyScoreSDK } from 'rn-juicy-score';

export default function App() {
  // ...

  useEffect(() => {
    RNJuicyScoreSDK.create({ scanPorts: false, collectGeoInfo: true, collectMacAddress: false, debug: false }).then(() => {
      RNJuicyScoreSDK.getToken().then((token) => {
        setResult(token)
      })
    })

    RNJuicyScoreSDK.getJuicyScoreVersion().then(setVersion)
  }, [])

  // ...
}
```

### LifecycleDetector

Monitor app lifecycle: 'active' | 'background'

```js
import { useJuicyScoreLifecycleDetector } from 'rn-juicy-score';

export default function App() {
  useJuicyScoreLifecycleDetector()

  // ...
}
```

### ScrollDetector

For scroll detection component should be wrap by ScrollDetector.

```js
import { useJuicyScoreScrollDetector } from 'rn-juicy-score';

export default function ListScreen() {
  // ...

  const [onScrollBeginDrag, onScrollEndDrag] = useJuicyScoreScrollDetector()

  return (
    <ScrollView
      onScrollBeginDrag={onScrollBeginDrag}
      onScrollEndDrag={onScrollEndDrag}
    >
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat. Duis aute irure dolor in
        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
        culpa qui officia deserunt mollit anim id est laborum.
      </Text>
    </ScrollView>
  )
}
```

### GestureDetector

For collect gestures like tap and pinch, the target component should be wrapped by GestureDetector.

```js
import { JuicyScoreGestureDetector } from 'rn-juicy-score';

export default function ListScreen() {
  // ...

  return (
    <JuicyScoreGestureDetector>
      <Text>Juicy Score SDK</Text>
      <Text>Token: {token}</Text>
      <View>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder={"Start type some text"}
          value={text}
        />
      </View>
    </JuicyScoreGestureDetector>
  )
}
```

## Manual Integration (without autolinking)

```
yarn add file:/path/to/local/rn-juicyscore/
```

### iOS

1. Add the `Juicyscore SDK` to `podfile` and run `pod install`.

Example:

```
pod 'rn-juicy-score', path: "../node_modules/rn-juicy-score/"
```

2. Run `pod install` (inside `ios` directory).

### Android

##### **android/app/build.gradle**

Add the project to your dependencies
```gradle
dependencies {
  ...
  implementation project(':rn-juicy-score')
}
```

##### **android/settings.gradle**

Add the project

```gradle
include ':rn-juicy-score'
project(':rn-juicy-score').projectDir = new File(rootProject.projectDir, '../node_modules/rn-juicy-score/android')
```

##### **MainApplication.java**
Add:


1. `import com.rnjuicyscore.RnJuicyScorePackage;`

2.  In the `getPackages()` method register the module:
`new RnJuicyScorePackage()`

So `getPackages()` should look like:

```java
    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            //...
            new RnJuicyScorePackage()
            //...
      );
    }
```

## Troubleshooting

1. For the case when you use ReactNative below 0.60.0, update file rn-juicy-score.podspec

Replace dependency "React-Core" to "React/Core"

```
...
s.dependency "React/Core"
...
```

2. Metro: Duplicate module name.

Remove example app from `rn-juicy-score` npm package.

```
rm node_modules/rn-juicy-score/example/
```