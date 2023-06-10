import React, { useMemo, useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  StatusBar,
  TouchableWithoutFeedback,
} from "react-native";
import { Audio } from "expo-av";

import * as Animatable from "react-native-animatable";
import { Asset } from "expo-asset";
import {
  BannerAd,
  TestIds,
  BannerAdSize,
} from "react-native-google-mobile-ads";

import Background from "./components/Background";

const chickenimage = require("./assets/chicken.png");
const textImage = require("./assets/clickme.png");
const quackImgSource = require("./assets/quack.png");

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

function Chicken() {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);
  const [quackLocation, setQuackLocation] = useState([
    styles.quackLocation1,
    styles.quackLocation2,
  ]);
  const [quackIndex, setQuackIndex] = useState(0);

  // preloading the assets, if the assets are not loaded, show splash screen starts //
  const preLoad = async () => {
    try {
      await Asset.loadAsync([
        require("./assets/chicken.png"),
        require("./assets/chick.png"),
        require("./assets/clickme.png"),
        require("./assets/quack.png"),
      ]);
      setLoaded(true);
    } catch (e) {}
  };

  useEffect(() => {
    preLoad();
  }, []);
  // preloading the assets, if the assets are not loaded, show splash screen starts //

  const renderImage = () => {
    return (
      <Animatable.Image
        ref={AnimationRef}
        source={chickenimage}
        style={styles.chickenimage}
      />
    );
  };
  const renderTextImage = () => {
    return (
      <Animatable.Image
        ref={TextAnimationRef}
        source={textImage}
        style={styles.clickme}
      />
    );
  };
  const renderQuack = () => {
    return visible ? (
      <Animatable.Image
        ref={QuackAnimationRef}
        source={quackImgSource}
        style={[styles.quack, quackLocation[quackIndex]]}
      />
    ) : (
      <Animatable.Image
        ref={QuackAnimationRef}
        source={quackImgSource}
        style={[styles.quack, { display: "none" }]}
      />
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
    // startAnimation();
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

  return loaded ? (
    <View>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#00000000"
        translucent={true}
      />
      <Background />

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
        {/* adUnitID="ca-app-pub-7215370286680655/7594439473" */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            alignSelf: "center",
          }}
        >
          <BannerAd
            unitId={TestIds.BANNER}
            size={BannerAdSize.BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      </View>
    </View>
  ) : null;
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

  // image: {
  //   width: animatedWidth,
  //   height: animatedHeight,
  //   backgroundColor: "#f9e52b",
  // },
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
