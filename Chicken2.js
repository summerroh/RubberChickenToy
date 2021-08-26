import React, {useEffect, useState} from 'react';
import { StyleSheet, View, StatusBar, Image, ImageBackground, TouchableWithoutFeedback , Alert, Button, Animated } from 'react-native';
import { Audio } from 'expo-av';
import chicken from './assets/chicken.png';
import chickenPressed from './assets/chicken_pressed.png';

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











//background stuff finishes//

function Chicken2(props) {

    const [pressing,setPressing] = useState(true);
    const [count,setCount] = useState(1);


    const renderImage = () => {
      var imgSource = pressing? chicken : chickenPressed;
      return (
        <Image source={ imgSource } style={styles.chickenimage}/> );
    }

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



    
      return (
          <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#00000000" translucent={true}/>
            <ImageBackground source={require('./assets/metal_background.jpg')} style={styles.backgroundimage}>
              <View style={styles.contents}>

              {/* <Text>{date.getTime()}</Text> */}
                  {/* <Text style={styles.text}>Hold to Bleep</Text> */}
                  <TouchableWithoutFeedback
                    onPressIn={ () => pressin()  }
                    onPressOut={ () => pressout() } >
                    {renderImage()}
                  </TouchableWithoutFeedback>
              </View>
            </ImageBackground>  
          </View>
      );
      
      };
      export default Chicken2;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      flexDirection: "column"
    //   paddingHorizontal: 30,
    //   paddingVertical: 100,
    //   backgroundColor: "pink"
  },
  backgroundimage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  contents:{
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  chickenimage:
  {
    // Setting up image width.
    width: 350,
    // Setting up image height.
    height: 480
  },
  text: {
    color: "white",
    fontSize: 30,
    marginBottom: 10
}
});