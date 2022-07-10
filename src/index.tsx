import * as React from 'react';
import {
  PixelRatio,
  NativeModules,
  Platform,
  View,
  GestureResponderEvent,
  AppStateStatus,
  AppState,
  ViewStyle,
  StyleProp,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from 'react-native';

const LINKING_ERROR =
  `The package 'rn-juicy-score' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const RNJuicyScoreSDK = NativeModules.RnJuicyScore
  ? NativeModules.RnJuicyScore
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

interface RNJuicyScoreSDKOptions {
  debug?: boolean;
  collectGeoInfo?: boolean;
  collectMacAddress?: boolean;
  collectDeviceId?: boolean;
  scanPorts?: boolean;
}

class RNJuicyScoreSDKImpl {
  create(options: RNJuicyScoreSDKOptions = {}): Promise<void> {
    return RNJuicyScoreSDK.create(options);
  }

  getToken(): Promise<string> {
    return RNJuicyScoreSDK.getToken();
  }

  getJuicyScoreVersion(): Promise<string> {
    return RNJuicyScoreSDK.getJuicyScoreVersion();
  }

  pause(): void {
    RNJuicyScoreSDK.pause();
  }

  resume(): void {
    // Sync with Flutter implementation /main/lib/juicy_score_flutter_plugin.dart#L232
    if (Platform.OS === 'android') {
      return;
    }

    RNJuicyScoreSDK.resume();
  }

  setQuarters(event: GestureResponderEvent): void {
    if (Platform.OS === 'android') {
      const leftSide = Dimensions.get('window').width / 2 > event.nativeEvent.pageX;
      const upperSide = Dimensions.get('window').height / 2 > event.nativeEvent.pageY;

      RNJuicyScoreSDK.setQuarters({ leftSide, upperSide });
    } else {
      RNJuicyScoreSDK.setQuarters({
        x: event.nativeEvent.pageX,
        y: event.nativeEvent.pageY,
      });
    }
  }

  onSingleClick(): void {
    RNJuicyScoreSDK.onSingleClick();
  }

  onDoubleClick(): void {
    RNJuicyScoreSDK.onDoubleClick();
  }

  setScrollDistance(distance: number, time: number): void {
    RNJuicyScoreSDK.setScrollDistance({ distance, time });
  }

  onMinimizeApp(): void {
    RNJuicyScoreSDK.onMinimizeApp();
  }
}

interface JuicyScoreGestureDetectorProps {
  style?: StyleProp<ViewStyle>;
}

export const JuicyScoreGestureDetector: React.FC<JuicyScoreGestureDetectorProps> =
  ({ children, style }) => {
    const DEBOUNCE_TIME = 30; // ms
    const lastEventTime = React.useRef<number | null>(null);

    const onShouldSetResponder = React.useCallback(
      (event: GestureResponderEvent) => {
        // There is a bug on Android platform, it generates 2 events per one tap
        if (
          lastEventTime.current === null ||
          lastEventTime.current + DEBOUNCE_TIME <= new Date().getTime()
        ) {
          if (event.nativeEvent.touches.length >= 2) {
            RNJuicyScoreSDKImplSingleton.onDoubleClick();
          } else {
            RNJuicyScoreSDKImplSingleton.onSingleClick();
            RNJuicyScoreSDKImplSingleton.setQuarters(event);
          }

          lastEventTime.current = new Date().getTime();
        }

        return false;
      },
      []
    );

    return (
      <View style={style} onStartShouldSetResponder={onShouldSetResponder}>
        {children}
      </View>
    );
  };

export const useJuicyScoreLifecycleDetector = () => {
  const appState = React.useRef(AppState.currentState);

  React.useEffect(() => {
    const onChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        RNJuicyScoreSDKImplSingleton.resume();
      } else if (
        appState.current.match(/active/) &&
        nextAppState === 'background'
      ) {
        RNJuicyScoreSDKImplSingleton.onMinimizeApp();
        RNJuicyScoreSDKImplSingleton.pause();
      }

      appState.current = nextAppState;
    };

    AppState.addEventListener('change', onChange);

    return () => {
      AppState.removeEventListener('change', onChange);
    };
  }, []);
};

export const useJuicyScoreScrollDetector = () => {
  const beginEventPosition = React.useRef<number | null>(null);
  const beginEventStartTime = React.useRef<number | null>(null);

  const onScrollBeginDrag = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      beginEventPosition.current = event.nativeEvent.contentOffset.y;
      beginEventStartTime.current = new Date().getTime();
    },
    []
  );

  const onScrollEndDrag = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (
        beginEventPosition.current != null &&
        beginEventStartTime.current != null
      ) {
        const time = new Date().getTime() - beginEventStartTime.current;
        const distance = Math.abs(
          event.nativeEvent.contentOffset.y - beginEventPosition.current
        );
        const distanceInPX = Math.round(
          PixelRatio.getPixelSizeForLayoutSize(distance)
        );

        RNJuicyScoreSDKImplSingleton.setScrollDistance(distanceInPX, time);
      }

      beginEventPosition.current = null;
      beginEventStartTime.current = null;
    },
    []
  );

  return [onScrollBeginDrag, onScrollEndDrag];
};

const RNJuicyScoreSDKImplSingleton: RNJuicyScoreSDKImpl =
  new RNJuicyScoreSDKImpl();

export { RNJuicyScoreSDKImplSingleton as RNJuicyScoreSDK };
