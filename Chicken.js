import React, {Component, useEffect} from 'react';
import { StyleSheet, Text, View, StatusBar, Image, ImageBackground, TouchableWithoutFeedback , Alert, Button, Animated } from 'react-native';
import { Audio } from 'expo-av';
import chicken from './assets/chicken.png';
import chickenPressed from './assets/chicken_pressed.png';



export default class Chicken extends Component {

    constructor() {
      super();
      this.state = { 
        pressing: true,
        value: 0,
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

      this.sound = new Audio.Sound()

      const status = {
        shouldPlay: false
      };

      this.sound.loadAsync(require('./assets/1.mp3'), status, false);
    }
   
    playSound() {
      if (this.state.count < 2){
        console.log("count is smaller than 2");
      }
      else if (this.state.count < 5){
        console.log("count is smaller than 5");
        this.sound.playAsync();
      }
    };

    stopSound() {
      this.sound.stopAsync();
      // this.sound.unloadAsync();
    }

    
//playing sounds finish

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
      this.setOnPlaybackStatusUpdate();

      clearInterval(interval);
      this.setState({ count: 0 })
      // this.stopSound()
      
    }

    //this function lets me know that the sound did just finish and I should run stopSound function starts
    setOnPlaybackStatusUpdate() {
      this.sound.setOnPlaybackStatusUpdate((playbackStatus) => {
        // console.log(playbackStatus.didJustFinish)
        if (playbackStatus.didJustFinish==true) {
          this.stopSound()
        }
    })
    }
    //finshes



    
    render() {
      return (
          <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#00000000" translucent={true}/>
            <ImageBackground source={require('./assets/metal_background.jpg')} style={styles.backgroundimage}>
              <View style={styles.contents}>

              {/* <Text>{date.getTime()}</Text> */}
                  {/* <Text style={styles.text}>Hold to Bleep</Text> */}
                  <TouchableWithoutFeedback
                    onPressIn={ () => this.pressin() } 
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