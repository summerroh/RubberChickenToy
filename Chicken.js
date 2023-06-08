import React, { useMemo, useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import Animated, {
  EasingNode,
  stopClock,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import * as Animatable from "react-native-animatable";
import { Asset } from "expo-asset";
// import { AdMobBanner } from 'expo-ads-admob';
// react-native--animatable explanation
// https://dev-yakuza.posstree.com/en/react-native/react-native-animatable/

const chickenSounds = {
  one: require("./assets/1.mp3"),
  two: require("./assets/2.mp3"),
  three: require("./assets/3.mp3"),
  four: require("./assets/4.mp3"),
  five: require("./assets/5.mp3"),
  six: require("./assets/6.mp3"),
  seven: require("./assets/7.mp3"),
  eight: require("./assets/8.mp3"),
  nine: require("./assets/9.mp3"),
  ten: require("./assets/10.mp3"),
  eleven: require("./assets/11.mp3"),
  twelve: require("./assets/12.mp3"),
  thirteen: require("./assets/13.mp3"),
  fourteen: require("./assets/14.mp3"),
};

const ChickenSoundKeys = Object.keys(chickenSounds);

//background animation stuff starts//
const imageSize = {
  width: 192,
  height: 192,
};

const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;
const animatedWidth = screenWidth + imageSize.width;
const animatedHeight = screenHeight + imageSize.height;

const {
  useCode,
  block,
  set,
  Value,
  Clock,
  eq,
  clockRunning,
  not,
  cond,
  startClock,
  timing,
  interpolateNode,
  and,
} = Animated;

const runTiming = (clock) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 5000,
    toValue: 1,
    easing: EasingNode.inOut(EasingNode.linear),
  };

  return block([
    // we run the step here that is going to update position
    cond(
      not(clockRunning(clock)),
      set(state.time, 0),
      timing(clock, state, config)
    ),
    cond(eq(state.finished, 1), [
      set(state.finished, 0),
      set(state.position, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
    ]),
    state.position,
  ]);
};

//background animation stuff finishes//

function Chicken() {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [quackLocation, setQuackLocation] = useState([
    styles.quackLocation1,
    styles.quackLocation2,
  ]);
  const [quackIndex, setQuackIndex] = useState(0);
  // const [count,setCount] = useState(1);

  // preloading the assets, if the assets are not loaded, show splash screen starts //
  const preLoad = async () => {
    try {
      // await Font.loadAsync({
      //   ...Ionicons.font
      // });
      await Asset.loadAsync([
        require("./assets/chicken.png"),
        require("./assets/chick.png"),
        require("./assets/clickme.png"),
        require("./assets/quack.png"),
      ]);
      setLoaded(true);
    } catch (e) {
      // console.log(e);
    }
  };

  useEffect(() => {
    preLoad();
  }, []);
  // preloading the assets, if the assets are not loaded, show splash screen starts //

  const renderImage = () => {
    var imgSource = require("./assets/chicken.png");
    return (
      <Animatable.Image
        ref={AnimationRef}
        source={imgSource}
        style={styles.chickenimage}
      />
    );
  };
  const renderTextImage = () => {
    var textImgSource = require("./assets/clickme.png");
    return (
      <Animatable.Image
        ref={TextAnimationRef}
        source={textImgSource}
        style={styles.clickme}
      />
    );
  };
  const renderQuack = () => {
    var quackImgSource = require("./assets/quack.png");

    return visible ? (
      <Animatable.Image
        ref={QuackAnimationRef}
        source={quackImgSource}
        style={[styles.quack, quackLocation[quackIndex]]}
      />
    ) : (
      <Animatable.Image ref={QuackAnimationRef} style={styles.quack} />
    );
  };

  //playing sound starts
  //tutorial: https://www.youtube.com/watch?v=HCvp2fZh--A
  useEffect(() => {
    Audio.setAudioModeAsync({
      shouldDuckAndroid: true,
      staysActiveInBackground: false,
      playThroughEarpieceAndroid: false,
    });
    startAnimation();
  }, []);

  //playing different sound files
  //https://heartbeat.fritz.ai/how-to-build-a-xylophone-app-with-audio-api-react-native-and-expo-7d6754a0603c

  const handlePlaySound = async (note) => {
    if (soundObject) {
      soundObject.unloadAsync();
    }
    const soundObject = new Audio.Sound();

    try {
      let source = chickenSounds[note];
      await soundObject.loadAsync(source);
      await soundObject
        .playAsync()
        .then(async (playbackStatus) => {
          setTimeout(() => {
            soundObject.unloadAsync();
          }, playbackStatus.playableDurationMillis);
        })
        .catch((error) => {
          // console.log(error)
        });
    } catch (error) {
      // console.log(error)
    }
  };
  //playing different sounds finish

  const playSound = () => {
    const note =
      ChickenSoundKeys[Math.floor(Math.random() * ChickenSoundKeys.length)];
    handlePlaySound(note);
  };

  const pressout = () => {
    playSound();
  };

  // chicken rubberband & text animation with Animatable starts //
  const AnimationRef = useRef(null);
  const TextAnimationRef = useRef(null);
  const QuackAnimationRef = useRef(null);

  const _onPress = () => {
    if (AnimationRef) {
      AnimationRef.current?.rubberBand(1000);
    }
    if (TextAnimationRef) {
      TextAnimationRef.current?.wobble(1200);
    }
    if (QuackAnimationRef) {
      setVisible(true);
      setQuackIndex((quackIndex + 1) % 2);
      setTimeout(() => {
        setVisible(false);
      }, 400);
      QuackAnimationRef.current?.tada(300);
    }
  };
  // chicken rubberband & text animation with Animatable finishes //

  // background parallel animation stuff starts //
  const { progress, clock } = useMemo(
    () => ({
      progress: new Value(0),
      clock: new Clock(),
    }),
    []
  );

  useCode(
    () =>
      block([
        cond(and(not(clockRunning(clock)), eq(1, 1)), startClock(clock)),
        cond(and(clockRunning(clock), eq(1, 0)), stopClock(clock)),
        set(progress, runTiming(clock)),
      ]),
    [progress, clock]
  );

  const translateX = interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [0, -imageSize.width],
  });

  const translateY = interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [0, -imageSize.width],
  });
  // background parallel animation stuff finishes //

  // background color interpolation starts //
  // https://www.youtube.com/watch?v=bLfT6KJyFzI
  // https://github.com/osama256/Animation-color-interpolate/blob/master/App.js

  const animation = useSharedValue(0);

  const animationColor = useDerivedValue(() => {
    return interpolateColor(animation.value, [0, 1], ["#f9e52b", "#FFD741"]);
  });
  const startAnimation = () => {
    animation.value = withRepeat(
      withTiming(1, {
        duration: 2000,
      }),
      -1,
      true
    );
  };
  const animationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: animationColor.value,
    };
  });
  // background color interpolation finishes //

  return (
    <View>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#00000000"
        translucent={true}
      />
      <Animated.View style={[{ transform: [{ translateX }, { translateY }] }]}>
        <Animated.Image
          style={[styles.image, animationStyle]}
          source={require("./assets/chick.png")}
          resizeMode="repeat"
        />
      </Animated.View>

      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={_onPress}>
          {renderTextImage()}
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback>{renderQuack()}</TouchableWithoutFeedback>

        <Animatable.View
          animation={"bounce"}
          iterationCount={"infinite"}
          iterationDelay={1000}
        >
          <TouchableWithoutFeedback
            onPress={_onPress}
            // onPressIn={ () => pressin()  }
            onPressOut={() => pressout()}
          >
            {renderImage()}
          </TouchableWithoutFeedback>
        </Animatable.View>

        {/* // Display a banner ad */}
        {/* <AdMobBanner
              style={{position: 'absolute',
                      bottom: 0,
                      alignSelf: 'center',
                    }}
              bannerSize="banner"
              adUnitID="ca-app-pub-7215370286680655/7594439473"
              servePersonalizedAds={false} // true or false
              onDidFailToReceiveAdWithError={this.bannerError} /> */}
      </View>
    </View>
  );
}
export default Chicken;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: "20%",
    justifyContent: "center",
    alignItems: "center",
  },

  chickenimage: {
    width: 350,
    height: 480,
  },

  image: {
    width: animatedWidth,
    height: animatedHeight,
    backgroundColor: "#f9e52b",
  },
  clickme: {
    width: 220,
    height: 33,
    marginBottom: 20,
  },
  quack: {
    position: "absolute",
    width: 110,
    height: 18,
  },
  quackLocation1: {
    top: 250,
    right: 15,
  },
  quackLocation2: {
    left: 14,
  },
});
