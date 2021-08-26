import React, { Component } from 'react';
import {
    Animated,
    Easing,
    Image,
    View,
} from 'react-native';

export default class animation extends Component {
    animatedValue;

    constructor() {
        super();

        this.animatedValue = new Animated.Value(0);

        Animated.loop(
            Animated.sequence([
                Animated.timing(this.animatedValue, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.timing(this.animatedValue, {
                    toValue: 0,
                    duration: 0,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }

    render() {
        const imageWidth = 192;
        const translateX = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-imageWidth, 0],
        });

        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <View style={{
                    width: imageWidth,
                    overflow: 'hidden',
                }}>
                    <Animated.View style={{
                        width: 2 * imageWidth,
                        flexDirection: 'row',
                        overflow: 'hidden',
                        transform: [{
                            translateX: translateX,
                        }],
                    }}>
                        <Image source={require('./assets/chick.png')} />
                        <Image source={require('./assets/chick.png')} />
                    </Animated.View>
                </View>
            </View>
        );
    }
}