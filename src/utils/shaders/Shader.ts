import {createProgramFromShaderSource} from './shaderCreation';
import {ExpoWebGLRenderingContext} from 'expo-gl';

export default class Shader {
  private program: WebGLProgram;
  private gl: ExpoWebGLRenderingContext;

  constructor(
    gl: ExpoWebGLRenderingContext,
    vertexShaderSource: string,
    fragmentShaderSource: string,
  ) {
    this.gl = gl;
    this.program = createProgramFromShaderSource(
      gl,
      vertexShaderSource,
      fragmentShaderSource,
    )!;
  }

  use() {
    this.gl.useProgram(this.program);
    return this;
  }

  getProgram() {
    return this.program;
  }

  setFloat(name: string, value: number) {
    this.gl.uniform1f(this.gl.getUniformLocation(this.program, name), value);
  }

  setInteger(name: string, value: number) {
    this.gl.uniform1i(this.gl.getUniformLocation(this.program, name), value);
  }

  setVector2f(name: string, x: number, y: number) {
    this.gl.uniform2f(this.gl.getUniformLocation(this.program, name), x, y);
  }

  setVector2fv(name: string, value: Float32Array | ArrayLike<number>) {
    this.gl.uniform2fv(this.gl.getUniformLocation(this.program, name), value);
  }

  setVector3f(name: string, x: number, y: number, z: number) {
    this.gl.uniform3f(this.gl.getUniformLocation(this.program, name), x, y, z);
  }

  setVector3fv(name: string, value: Float32Array | ArrayLike<number>) {
    this.gl.uniform3fv(this.gl.getUniformLocation(this.program, name), value);
  }

  setVector4f(name: string, x: number, y: number, z: number, w: number) {
    this.gl.uniform4f(this.gl.getUniformLocation(this.program, name), x, y, z, w);
  }

  setVector4fv(name: string, value: Float32Array | ArrayLike<number>) {
    this.gl.uniform4fv(this.gl.getUniformLocation(this.program, name), value);
  }

  setMatrix4(name: string, value: Float32Array | ArrayLike<number>) {
    this.gl.uniformMatrix4fv(this.gl.getUniformLocation(this.program, name), false, value);
  }
}
