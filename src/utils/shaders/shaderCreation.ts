import {ExpoWebGLRenderingContext} from 'expo-gl';

export function createShader(
  gl: ExpoWebGLRenderingContext,
  shaderType: number,
  shaderSource: string,
) {
  let shader = gl.createShader(shaderType)!;

  gl.shaderSource(shader, shaderSource);

  gl.compileShader(shader);

  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    console.log(
      '---> Ошибка: компиляция шейдера не удалась:\n' +
        gl.getShaderInfoLog(shader),
    );
  }

  return shader;
}

export function createProgram(
  gl: ExpoWebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader,
) {
  let program = gl.createProgram()!;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

export function createProgramFromShaderSource(
  gl: ExpoWebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
) {
  let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  let fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );
  return createProgram(gl, vertexShader, fragmentShader);
}
