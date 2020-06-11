/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
//Idea adapted(actually copied) from https://learnopengl.com/In-Practice/2D-Game/Breakout

import React from 'react';
import {
  PixelRatio,
  ImageBackground,
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
} from 'react-native';
import {GLView, ExpoWebGLRenderingContext} from 'expo-gl';

import Game from './Game';

let canvasWidth: number, canvasHeight: number; // Definetly not react-style programming, but it's OpenGL, it is not react!
const gameWidth = 1600;
const gameHeight = 900;
let glContext: ExpoWebGLRenderingContext;
let breakout: Game;

const calculateDimensions = (
  width: number,
  height: number,
  aspectXY: number,
) => {
  let newWidth = height * aspectXY;
  let newHeight;
  if (newWidth <= width) {
    newHeight = height;
  } else {
    newWidth = width;
    newHeight = newWidth / aspectXY;
  }
  return {width: newWidth, height: newHeight};
};

const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
  console.log(require('./levels/1.json')[0]);
  breakout = new Game(gl, gameWidth, gameHeight);
  glContext = gl;
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 1, 1, 1);

  await breakout.init();

  let start = Date.now();
  let then = start;
  let now = 0;

  breakout.state = 'active';

  const render = () => {
    now = Date.now();
    const delta = (now - then) / 1000;
    then = now;
    //console.log(1/delta);
    let elapsedTime = (now - start) / 1000.0;

    breakout.processInput(delta);

    breakout.update(delta);

    gl.clear(gl.COLOR_BUFFER_BIT);

    breakout.render();

    gl.flush();
    gl.endFrameEXP();
    requestAnimationFrame(render);
  };

  render();
};

const onSize = (width: number, height: number) => {
  console.log(width, height);
  if (glContext) {
    glContext.viewport(
      0,
      0,
      width * PixelRatio.get(),
      height * PixelRatio.get(),
    );
  }
  canvasWidth = width;
  canvasHeight = height;
};

const onTouch = (evt: GestureResponderEvent) => {
  let coordinates = screenToNormalizedCoordinates(
    evt.nativeEvent.locationX,
    evt.nativeEvent.locationY,
  );
  breakout.cursor = {...coordinates, active: true};
};

const onTouchRelease = (evt: GestureResponderEvent) => {
  breakout.cursor.active = false;
};

const screenToNormalizedCoordinates = (x: number, y: number) => {
  const coords = {
    x: gameWidth * (x / canvasWidth),
    y: gameHeight * (y / canvasHeight),
  };
  //console.log(x, y, coords.x, coords.y);
  return coords;
};

//TODO Extract game to another component. Otherwise canvas dimensions will not be recalculated on screen rotation
const App = () => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;

  console.log(
    Dimensions.get('window').width,
    Dimensions.get('window').height,
    width,
    height,
  );

  return (
    <>
      <ImageBackground
        source={require('./imgs/stars.jpg')}
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <GLView
          style={width > height ? s.landscapeCanvas : s.portraitCanvas}
          onContextCreate={onContextCreate}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderGrant={onTouch}
          onResponderMove={onTouch}
          onResponderRelease={onTouchRelease}
          onLayout={({nativeEvent}) =>
            onSize(nativeEvent.layout.width, nativeEvent.layout.height)
          }
        />
      </ImageBackground>
    </>
  );
};

const s = StyleSheet.create({
  landscapeCanvas: {
    height: '100%',
    aspectRatio: 16 / 9,
  },
  portraitCanvas: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
});
export default App;
