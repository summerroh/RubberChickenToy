import React, { useMemo, useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
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

const chickImage = require("../assets/chick.png");

export default function Background() {
  useEffect(() => {
    startAnimation();
  }, []);

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
    // outputRange: [0, -imageSize.width],
    outputRange: [0, 0],
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
      <Animated.View style={[animationStyle]}>
        <Animated.Image
          style={[
            styles.image,
            { transform: [{ translateX }, { translateY }] },
          ]}
          source={chickImage}
          resizeMode="repeat"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: animatedWidth,
    height: animatedHeight,
  },
});
