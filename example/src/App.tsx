import * as React from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  View,
} from 'react-native';
import {
  JuicyScoreGestureDetector,
  RNJuicyScoreSDK,
  useJuicyScoreLifecycleDetector,
  useJuicyScoreScrollDetector,
} from 'rn-juicy-score';

export default function App() {
  useJuicyScoreLifecycleDetector();

  const [text, onChangeText] = React.useState('');
  const [result, setResult] = React.useState<string | undefined>();
  const [version, setVersion] = React.useState<string | undefined>();

  React.useEffect(() => {
    RNJuicyScoreSDK.create({
      scanPorts: false,
      collectGeoInfo: true,
      regionDomain: "ams01-static",
      collectMacAddress: false,
      debug: true,
    }).then(() => {
      RNJuicyScoreSDK.getToken().then((token) => {
        console.warn({ token: token });
        setResult(token);
      });
    });

    RNJuicyScoreSDK.getJuicyScoreVersion().then(setVersion);
  }, []);

  const [onScrollBeginDrag, onScrollEndDrag] = useJuicyScoreScrollDetector();

  return (
    <SafeAreaView style={styles.container}>
      <JuicyScoreGestureDetector style={{ padding: 8, width: '100%' }}>
        <Text>Juicy Score SDK: v{version}</Text>
        <Text>Token: {result}</Text>
        <View style={{ width: '100%' }}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            placeholder={'Start type some text'}
            value={text}
          />
        </View>
      </JuicyScoreGestureDetector>

      <ScrollView
        style={{paddingHorizontal: 8}}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
      >
        <Text style={styles.textBlock}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  input: {
    marginTop: 25,
    marginBottom: 25,
    height: 40,
    borderWidth: 1,
    padding: 0,
    width: '100%',
  },
  textBlock: {
    fontSize: 42,
    paddingTop: 30,
  },
});
