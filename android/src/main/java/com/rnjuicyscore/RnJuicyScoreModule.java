package com.rnjuicyscore;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;

import juicylab.juicyscore.Juicyscore;

import android.app.Activity;

import android.os.Build;
import android.util.Log;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.modules.core.PermissionListener;

@ReactModule(name = RnJuicyScoreModule.NAME)
public class RnJuicyScoreModule extends ReactContextBaseJavaModule implements PermissionListener {
    public static final String NAME = "RnJuicyScore";

    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";

    @Override
    public boolean onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults)
    {
//      super.onRequestPermissionsResult(requestCode, permissions, grantResults);
      Juicyscore.onRequestPermissionsResult(permissions, grantResults);
      return true;
    }

    public RnJuicyScoreModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod()
    public void create(ReadableMap arguments, Promise promise) {
      final Activity activity = getCurrentActivity();

//      Log.d("! Build.VERSION.SDK_INT", Integer.toString(Build.VERSION.SDK_INT));

      if (activity == null) {
        promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
        return;
      }

      Juicyscore.Builder builder = Juicyscore.Builder.with(activity.getApplicationContext());

      if (arguments.hasKey("debug")) {
        builder.debug(arguments.getBoolean("debug"));
      }

      if (arguments.hasKey("saveLastInstance")) {
        builder.saveLastInstance(arguments.getBoolean("saveLastInstance"));
      }

      if (arguments.hasKey("collectGeoInfo")) {
        builder.collectGeoInfo(arguments.getBoolean("collectGeoInfo"));
      }

      if (arguments.hasKey("regionDomain")) {
        builder.regionDomain(arguments.getString("regionDomain"));
      }

      if (arguments.hasKey("collectMacAddress")) {
        builder.collectMacAddress(arguments.getBoolean("collectMacAddress"));
      }

      if (arguments.hasKey("collectDeviceId")) {
        builder.collectDeviceId(arguments.getBoolean("collectDeviceId"));
      }

      if (arguments.hasKey("scanPorts")) {
        builder.scanPorts(arguments.getBoolean("scanPorts"));
      }

      builder.setOnInitComplete(() -> {
        promise.resolve(null);
      });

      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          builder.init();
        }
      });
    }

    @ReactMethod
    public void getJuicyScoreVersion(Promise promise) {
      promise.resolve(Juicyscore.getJuicyScoreVersion());
    }

    @ReactMethod
    public void pause(Promise promise) {
      Juicyscore.onPause();
      promise.resolve(null);
    }

    @ReactMethod
    public void start(Promise promise) {
      final Activity activity = getCurrentActivity();

      if (activity == null) {
        promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
        return;
      }

      Juicyscore.start(activity.getApplicationContext());

      promise.resolve(null);
    }

    @ReactMethod
    public void getToken(Promise promise) {
      promise.resolve(Juicyscore.getToken());
    }

    @ReactMethod()
    public void setQuarters(ReadableMap arguments, Promise promise) {
      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          Juicyscore.setQuarters(arguments.getBoolean("leftSide"), arguments.getBoolean("upperSide"));
        }
      });

      promise.resolve(null);
    }

    @ReactMethod
    public void onSingleClick(Promise promise) {
      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          Juicyscore.onSingleClick();
        }
      });

      promise.resolve(null);
    }

    @ReactMethod
    public void onDoubleClick(Promise promise) {
      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          Juicyscore.setDoubleClick();
        }
      });

      promise.resolve(null);
    }

    @ReactMethod()
    public void setScrollDistance(ReadableMap arguments, Promise promise) {
      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          Juicyscore.setScrollDistance(arguments.getInt("distance"), arguments.getInt("time"));
        }
      });

      promise.resolve(null);
    }

    @ReactMethod()
    public void setButtonDispersion(ReadableMap arguments, Promise promise) {
      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
      Juicyscore.setButtonDispersion(arguments.getInt("deltaX"), arguments.getInt("deltaY"));
        }
      });

      promise.resolve(null);
    }

    @ReactMethod
    public void onMinimizeApp(Promise promise) {
      UiThreadUtil.runOnUiThread(new Runnable() {
        @Override
        public void run() {
          Juicyscore.onMinimizeApp();
        }
      });

      promise.resolve(null);
    }
}
