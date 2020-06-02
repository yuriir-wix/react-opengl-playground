/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';

import {GLView, ExpoWebGLRenderingContext} from 'expo-gl';

declare const global: {HermesInternal: null | {}};

const vertSrc = `
void main(void) {
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  gl_PointSize = 100.0;
}
`;

const fragSrc = `
void main(void) {
  gl_FragColor = vec4(1.0,0.0,0.0,1.0);
}
`;

const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  gl.clearColor(0, 1, 1, 1);

  // Compile vertex and fragment shader
  const vert = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vert, vertSrc);
  gl.compileShader(vert);
  const frag = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(frag, fragSrc);
  gl.compileShader(frag);

  // Link together into a program
  const program = gl.createProgram()!;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  gl.useProgram(program);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.POINTS, 0, 1);

  let then = Date.now();
  const start = then;
  let now = 0;
  while (Date.now() - start < 5000) {
    now = Date.now();
    const delta = now - then;
    then = now;
    console.log(delta);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, 1);
    gl.flush();
    gl.endFrameEXP();
  }

  //
  //
};

const App = () => {
  return (
    <>
      <StatusBar />
      <SafeAreaView style={{flex: 1}}>
        <GLView style={{flex: 1}} onContextCreate={onContextCreate} />
      </SafeAreaView>
    </>
  );
};

export default App;
