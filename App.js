import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  SafeAreaView
} from 'react-native';

let SCREEN_WIDTH = Dimensions.get('window').width;
let SCREEN_HEIGHT = Dimensions.get('window').height;

const images = [
  { id: 1, src: require('./assets/1.jpg') },
  { id: 2, src: require('./assets/2.jpg') },
  { id: 3, src: require('./assets/3.jpg') },
  { id: 4, src: require('./assets/4.jpg') }
];

export default class App extends React.Component {
  state = {
    activeImage: null
  };

  componentWillMount() {
    this.allImages = {};
    this.oldPosition = {};
    this.position = new Animated.ValueXY();
    this.dimensions = new Animated.ValueXY();
    this.animation = new Animated.Value(0);
    this.activeImageStyle = null;
  }

  openImage = index => {
    this.allImages[index].measure((x, y, width, height, pageX, pageY) => {
      this.oldPosition.x = pageX;
      this.oldPosition.y = pageY;
      this.oldPosition.width = width;
      this.oldPosition.height = height;

      this.position.setValue({
        x: pageX,
        y: pageY
      });

      this.dimensions.setValue({
        x: width,
        y: height
      });
    });

    this.setState(
      {
        activeImage: images[index]
      },
      () => {
        this.viewImage.measure((dx, dy, dWidth, dHeight, dPageX, dPageY) => {
          Animated.parallel([
            Animated.timing(this.position.x, {
              toValue: dPageX,
              duration: 300
            }),
            Animated.timing(this.position.y, {
              toValue: dPageY,
              duration: 300
            }),
            Animated.timing(this.dimensions.x, {
              toValue: dWidth,
              duration: 300
            }),
            Animated.timing(this.dimensions.y, {
              toValue: dHeight,
              duration: 300
            }),
            Animated.timing(this.animation, {
              toValue: 1,
              duration: 300
            })
          ]).start();
        });
      }
    );
  };

  closeImage = () => {
    Animated.parallel([
      Animated.timing(this.position.x, {
        toValue: this.oldPosition.x,
        duration: 300
      }),
      Animated.timing(this.position.y, {
        toValue: this.oldPosition.y,
        duration: 300
      }),
      Animated.timing(this.dimensions.x, {
        toValue: this.oldPosition.width,
        duration: 300
      }),
      Animated.timing(this.dimensions.y, {
        toValue: this.oldPosition.height,
        duration: 300
      }),
      Animated.timing(this.animation, {
        toValue: 0,
        duration: 300
      })
    ]).start(() => {
      this.setState({
        activeImage: null
      });
    });
  };

  render() {
    const activeImageStyle = {
      width: this.dimensions.x,
      height: this.dimensions.y,
      left: this.position.x,
      top: this.position.y
    };

    const animatedContentY = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [-150, 0]
    });

    const animatedContentOpacity = this.animation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 1, 1]
    });

    const animatedContentStyle = {
      opacity: animatedContentOpacity,
      transform: [
        {
          translateY: animatedContentY
        }
      ]
    };

    const animatedCrossOpacity = {
      opacity: this.animation
    };

    const animatedBorderRadius = this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: [20, 0]
    });

    const animatedBorderStyle = {
      borderRadius: animatedBorderRadius
    };

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {images.map((image, index) => (
            <TouchableWithoutFeedback
              key={image.id}
              onPress={() => this.openImage(index)}
            >
              <Animated.View
                style={{
                  height: SCREEN_HEIGHT - 250,
                  width: SCREEN_WIDTH,
                  padding: 15
                }}
              >
                <Image
                  source={image.src}
                  ref={image => (this.allImages[index] = image)}
                  style={{
                    flex: 1,
                    height: null,
                    width: null,
                    resizeMode: 'cover',
                    borderRadius: 20
                  }}
                />
              </Animated.View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>

        <View
          style={StyleSheet.absoluteFill}
          pointerEvents={this.state.activeImage ? 'auto' : 'none'}
        >
          <View
            style={{ flex: 2, zIndex: 1001 }}
            ref={view => (this.viewImage = view)}
          >
            <Animated.Image
              source={
                this.state.activeImage ? this.state.activeImage.src : null
              }
              style={[
                {
                  resizeMode: 'cover',
                  top: 0,
                  left: 0,
                  height: null,
                  width: null
                },
                activeImageStyle,
                animatedBorderStyle
              ]}
            />
            <TouchableWithoutFeedback onPress={this.closeImage}>
              <Animated.View
                style={[
                  { position: 'absolute', top: 40, right: 30 },
                  animatedCrossOpacity
                ]}
              >
                <Text style={{ fontSize: 24, color: 'white' }}>x</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
          <Animated.View
            style={[
              {
                flex: 1,
                zIndex: 1000,
                backgroundColor: 'white',
                padding: 20,
                paddingTop: 50
              },
              animatedContentStyle
            ]}
          >
            <Text style={{ fontSize: 24, paddingBottom: 10 }}>Lorem Ipsum</Text>
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet
              facere neque, quisquam praesentium explicabo pariatur labore
              maxime. Blanditiis cumque possimus, nesciunt quia ipsum libero sed
              voluptas sit, et, asperiores recusandae.
            </Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }
}
