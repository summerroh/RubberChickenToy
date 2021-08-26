import React, {Component, useEffect} from 'react';
import { StyleSheet, Text, View, StatusBar, Image, ImageBackground, TouchableWithoutFeedback , Alert, Button, Animated } from 'react-native';
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



export default class Chicken extends Component {

    constructor() {
      super();
      this.state = { 
        pressing: true,
        count: 0,
      };
    }

    static navigationOptions = {
      header: null,
    };

    renderImage()  {
      var imgSource = this.state.pressing? chicken : chickenPressed;
      return (
        <Image source={ imgSource } style={styles.image}/> );
    }

//playing sound starts
//tutorial: https://www.youtube.com/watch?v=HCvp2fZh--A
    async componentDidMount() {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        shouldDuckAndroid: true,
        staysActiveInBackground: false,
        playThroughEarpieceAndroid: false
      });
    }




//playing different sound files
//https://heartbeat.fritz.ai/how-to-build-a-xylophone-app-with-audio-api-react-native-and-expo-7d6754a0603c

    handlePlaySound = async note => {
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
            console.log(error)
          })
      } catch (error) {
        console.log(error)
      }
    }
//playing different sounds finish




   
    playSound() {
      if (this.state.count < 2){
        console.log("count is smaller than 2");
        this.handlePlaySound('one')
      }

      else if (this.state.count < 4){
        console.log("count is smaller than 4");
        this.handlePlaySound('three')
      }

      else if (this.state.count < 5){
        console.log("count is smaller than 5");
        this.handlePlaySound('five')
      }

      else if (this.state.count > 5){
        console.log("count is smaller than 5");
        this.handlePlaySound('seven')
      }
    };



    count=() => {
       interval = setInterval(() => {
        this.setState({ count: this.state.count + 1 })
        console.log(this.state.count);
      }, 500);
    }

    pressin=() => {
      this.setState({ pressing: !this.state.pressing })

      this.count()
    }

    pressout=() => {
      this.setState({ pressing: !this.state.pressing })
      this.playSound();
      // this.setOnPlaybackStatusUpdate();

      clearInterval(interval);
      this.setState({ count: 0 })
      // this.stopSound()
      
    }




    
    render() {
      return (
          <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#00000000" translucent={true}/>
            <ImageBackground source={require('./assets/metal_background.jpg')} style={styles.backgroundimage}>
              <View style={styles.contents}>

              {/* <Text>{date.getTime()}</Text> */}
                  {/* <Text style={styles.text}>Hold to Bleep</Text> */}
                  <TouchableWithoutFeedback
                    onPressIn={ () => this.pressin()  }
                    onPressOut={ () => this.pressout() } >
                    {this.renderImage()}
                  </TouchableWithoutFeedback>
              </View>
            </ImageBackground>  
          </View>
      );
      }
      }

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
  image:
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