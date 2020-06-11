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

import {createProgramFromShaderSource} from './utils/shaders/shaderCreation';

declare const global: {HermesInternal: null | {}};

const vertSrc = `#version 300 es
precision highp float;
precision highp int;
layout(location = 0) in vec2 aPosition;
layout(location = 1) in vec3 aColor;

out vec3 vColor;
out vec4 fragPos;
void main(void) {
  gl_Position = vec4(aPosition, 1.0, 1.0);
  fragPos = gl_Position;
  vColor = aColor;
}
`;

const fragSrc = `#version 300 es
#define PI 3.14159265359
precision highp float;
precision highp int;
in vec3 vColor;
in vec4 fragPos;
out vec4 fragColor;

uniform vec2 uMouse;
uniform float uTime;

float plot(float p, float pct){
  return smoothstep(pct-0.02, pct, p) - smoothstep( pct, pct+0.02, p);
}

float figure(float anchor, float var, float phase, float ampl1, float freq1, float ampl2, float freq2){
  return anchor + ampl1 * sin(var * 2. * PI * freq1 +  phase) + ampl2 * cos(var * 2. * PI * freq2 +phase);
}

void main(void) {
  float freq = 5. * cos(uTime/2.);
  float ampl = 0.1 * sin(uTime/3.);
  float lh1 = figure(uMouse.y, fragPos.x, uTime * 10., ampl, freq, ampl/2., freq/2.);
  float lh2 = figure(uMouse.y, fragPos.x, uTime * 10., 1.5 * ampl, freq * 0.75, ampl * 0.3, freq);
  float lh3 = figure(uMouse.y, fragPos.x, uTime * 23., ampl/3., freq, ampl/6., freq*20.);
  float lv1 = figure(uMouse.x, fragPos.y, uTime * 10., ampl, freq, ampl/2., freq/2.);
  float lv2 = figure(uMouse.x, fragPos.y, uTime * 20., ampl, freq/5., ampl/2., freq/10.);
  float lv3 = figure(uMouse.x, fragPos.y, uTime * 10., 1.5 * ampl, freq * 0.75, ampl * 0.3, freq);
  
  vec3 color = vColor;

  float pct = plot(fragPos.y,lh1);
  color = mix(color,vec3(0.0,1.0,0.0),pct);
  pct = plot(fragPos.y,lh2);
  color = mix(color,vec3(0.645,0.310,1.000),pct);
  pct = plot(fragPos.y,lh3);
  color = mix(color,vec3(1.000,0.599,0.474),pct);
  pct = plot(fragPos.x,lv1);
  color = mix(color,vec3(0.731,1.000,0.347),pct);
  pct = plot(fragPos.x,lv2);
  color = mix(color,vec3(0.950,0.128,1.000),pct);
  pct = plot(fragPos.x,lv3);
  color = mix(color,vec3(0.464,1.000,0.875),pct);
  fragColor = vec4(color, 1.0);
}
`;
let screenWidth: number, screenHeight: number; // Definetly not react-style programming, but it's OpenGL, it is not react!
let cursor = {x: 0, y: 0};

const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  gl.clearColor(0, 1, 1, 1);

  const squareVAO = createSquareVAO(gl);

  // Link together into a program
  const program = createProgramFromShaderSource(gl, vertSrc, fragSrc)!;

  let start = Date.now();
  let then = start;
  let now = 0;

  const render = () => {
    now = Date.now();
    const delta = now - then;
    then = now;
    let elapsedTime = (now - start) / 1000.0;

    gl.clear(gl.COLOR_BUFFER_BIT);

    //Set all program variables
    gl.useProgram(program);
    gl.uniform2fv(
      gl.getUniformLocation(program, 'uMouse'),
      new Float32Array([cursor.x, cursor.y]),
    );
    gl.uniform1f(gl.getUniformLocation(program, 'mTime'), elapsedTime);

    //Bind VAO and draw
    gl.bindVertexArray(squareVAO);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    gl.bindVertexArray(null);
    gl.useProgram(null);

    gl.flush();
    gl.endFrameEXP();
    requestAnimationFrame(render);
  };

  render();
};

const createSquareVAO = (gl: ExpoWebGLRenderingContext) => {
  // eslint-disable-next-line prettier/prettier
  const square = [1, 1, 0, 1, 0,
                  -1, 1, 1, 0, 0,
                  1, -1, 0, 0, 1,
                  -1, -1, 0, 0, 0];

  let VAO = gl.createVertexArray()!;
  let VBO = gl.createBuffer()!;

  gl.bindVertexArray(VAO);
  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(square), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 5 * 4, 0);

  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 5 * 4, 2 * 4);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  gl.bindVertexArray(null);
  return VAO;
};

const onSize = (width: number, height: number) => {
  //Here should be also viewport call, but width and height on ios are different from gl.drawingBufferWidth and gl.drawingBufferHeight
  screenWidth = width;
  screenHeight = height;
};

const screenToNormalizedCoordinates = (x: number, y: number) => {
  const coords = {
    x: 2 * (x / screenWidth) - 1,
    y: (2 * (screenHeight - y)) / screenHeight - 1,
  };
  return coords;
};

const App = () => {
  return (
    <>
      <StatusBar />
      <SafeAreaView style={{flex: 1}}>
        <GLView
          style={{flex: 1}}
          onContextCreate={onContextCreate}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderMove={(evt) => {
            cursor = screenToNormalizedCoordinates(
              evt.nativeEvent.locationX,
              evt.nativeEvent.locationY,
            );
          }}
          onLayout={({nativeEvent}) =>
            onSize(nativeEvent.layout.width, nativeEvent.layout.height)
          }
        />
      </SafeAreaView>
    </>
  );
};

export default App;
