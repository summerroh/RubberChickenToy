import React, { useMemo, useEffect, useState } from 'react';
import { StyleSheet, View, StatusBar, Image, ImageBackground, TouchableWithoutFeedback , Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import chicken from './assets/chicken.png';
import chickenPressed from './assets/chicken_pressed.png';
import Animated, { EasingNode, stopClock, useAnimatedStyle, useSharedValue, withRepeat, withSpring } from 'react-native-reanimated';
import * as Animatable from 'react-native-animatable';

const chickenSounds = {
	one: require('./assets/1.mp3'),
	two: require('./assets/2.mp3'),
	three: require('./assets/3.mp3'),
	four: require('./assets/4.mp3'),
	five: require('./assets/5.mp3'),
	six: require('./assets/7.mp3'),
	seven: require('./assets/8.mp3')
}


//background stuff starts//

const imageSize = {
  width: 192,
  height: 192,
};

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
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
  interpolateNode ,
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
      timing(clock, state, config),
    ),
    cond(eq(state.finished, 1), [
      set(state.finished, 0),
      set(state.position, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
    ]),
    state.position,
  ]);
}

//background stuff finishes//



function Chicken(props) {

    const [pressing,setPressing] = useState(true);
    const [count,setCount] = useState(1);
    const [animation,setAnimation] = useState('bounce');


    const renderImage = () => {
      var imgSource = pressing? chicken : chickenPressed;
      return (
        <Image source={ imgSource } style={styles.chickenimage}/> );
    }

// // chicken animation stuff starts //

//     // const chickenProgress = useSharedValue(1);
//     const scale = useSharedValue(2);

//     const reanimatedStyle = useAnimatedStyle(() => {
//       return {
//         // opacity: chickenProgress.value,
//         transform: { scale: scale.value }
//       };
//     }, []);

//     useEffect(() => {
//       // chickenProgress.value = withRepeat(withSpring(0.5),3);
//       scale.value = withRepeat(withSpring(1), 3);
//     }, []);

// // chicken animation stuff finishes //


//playing sound starts
//tutorial: https://www.youtube.com/watch?v=HCvp2fZh--A


    useEffect(()=>{
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
        playThroughEarpieceAndroid: false
      });
      setPlay(!play);
    },[])

    useEffect(()=>{
      console.log(count);
    },[count])



//playing different sound files
//https://heartbeat.fritz.ai/how-to-build-a-xylophone-app-with-audio-api-react-native-and-expo-7d6754a0603c

const handlePlaySound = async note => {
      const soundObject = new Audio.Sound()

      try {
        let source = chickenSounds[note]
        await soundObject.loadAsync(source)
        await soundObject
          .playAsync()
          .then(async playbackStatus => {
            setTimeout(() => {
              soundObject.unloadAsync()
            }, playbackStatus.playableDurationMillis)
          })
          .catch(error => {
            // console.log(error)
          })
      } catch (error) {
        // console.log(error)
      }
    }
//playing different sounds finish

   
    const playSound = () => {
      if (count <= 1){
        console.log("count is smaller than 1");
        handlePlaySound('one')
      }

      else if (count <= 2){
        console.log("count is smaller than 2");
        handlePlaySound('two')
      }

      else if (count <= 3){
        console.log("count is smaller than 3");
        handlePlaySound('three')
      }

      else if (count <= 4){
        console.log("count is smaller than 5");
        handlePlaySound('four')
      }

      else if (count <= 5){
        console.log("count is smaller than 5");
        handlePlaySound('five')
      }

      else if (count > 5){
        console.log("count is bigger than 5");
        handlePlaySound('seven')
      }
    };


    const counting=() => {
       interval = setInterval(() => {
        setCount(count => count + 1)
        // console.log(count);
      }, 400);
    }

    const pressin=() => {
      setPressing({ pressing: !pressing })

      counting()
      
    }

    const pressout=() => {
      setPressing({ pressing: !pressing })
      playSound();
      // setOnPlaybackStatusUpdate();
      

      clearInterval(interval);
      setCount(count === 1)
      // stopSound()
    }


    // background animation stuff starts //

    const [play, setPlay] = useState(false);
  const {progress, clock, isPlaying} = useMemo(
    () => ({
      progress: new Value(0),
      isPlaying: new Value(0),
      clock: new Clock(),
    }),
    [],
  );

  useEffect(() => {
    isPlaying.setValue(play ? 1 : 0);
  }, [play, isPlaying]);

  useCode(
    () =>
      block([
        cond(and(not(clockRunning(clock)), eq(isPlaying, 1)), startClock(clock)),
        cond(and(clockRunning(clock), eq(isPlaying, 0)), stopClock(clock)),
        set(progress, runTiming(clock)),
      ]),
    [progress, clock],
  );

  const translateX = interpolateNode (progress, {
    inputRange: [0, 1],
    outputRange: [0, -imageSize.width],
  });

  const translateY = interpolateNode (progress, {
    inputRange: [0, 1],
    outputRange: [0, -imageSize.width],
  });

  // background animation stuff finishes //


    
      return (
          <View>
            <StatusBar barStyle="light-content" backgroundColor="#00000000" translucent={true}/>
            <Animated.View style={[{ transform: [{ translateX }, { translateY }]}]}>
              <Image
                style={styles.image}
                source={require('./assets/chick.png')}
                resizeMode="repeat"
              />
            </Animated.View>
            
            <View style={styles.container}>
              <Animatable.View animation={animation} iterationCount={'infinite'} iterationDelay={1000}>

                  <TouchableWithoutFeedback
                    onPressIn={ () => pressin()  }
                    onPressOut={ () => pressout() } >
                    {renderImage()}
                  </TouchableWithoutFeedback>

              </Animatable.View>
            </View>
          </View>
      );
      
      };
      export default Chicken;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: '20%', 
    justifyContent: 'center', 
    alignItems: 'center',
  },

  chickenimage:
  {
    width: 350,
    height: 480,
  },

  image: {
    width: animatedWidth,
    height: animatedHeight,
    backgroundColor: '#f9e52b'
  },
});