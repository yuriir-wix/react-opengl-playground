import Shader from './utils/shaders/Shader';
import Texture2D from './utils/textures/Texture2D';
import { vec2, vec3, mat4 } from 'gl-matrix';
import { ExpoWebGLRenderingContext } from 'expo-gl';

export default class SpriteRenderer {
  private shader: Shader;
  private gl: ExpoWebGLRenderingContext;
  private quadVAO: WebGLVertexArrayObject | undefined;

  constructor(gl: ExpoWebGLRenderingContext, shader: Shader) {
    this.gl = gl;
    this.shader = shader;
    this.initRenderData();
  }

  private initRenderData() {
    const vertices = [
      // pos      // tex
      0.0, 1.0, 0.0, 1.0,
      1.0, 0.0, 1.0, 0.0,
      0.0, 0.0, 0.0, 0.0,

      0.0, 1.0, 0.0, 1.0,
      1.0, 1.0, 1.0, 1.0,
      1.0, 0.0, 1.0, 0.0
    ];

    const VBO = this.gl.createBuffer()!;
    this.quadVAO = this.gl.createVertexArray()!;
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, VBO);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

    this.gl.bindVertexArray(this.quadVAO);
    this.gl.enableVertexAttribArray(0);
    this.gl.vertexAttribPointer(0, 4, this.gl.FLOAT, false, 4 * 4, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.bindVertexArray(null);
  }

  drawSprite(texture: Texture2D, position: vec2, size: vec2, rotate: number, color: vec3){

    this.shader.use();
    let model = mat4.create();
    mat4.translate(model, model, vec3.fromValues(position[0], position[1], 0));

    mat4.translate(model, model, [0.5 * size[0], 0.5 * size[1], 0]);
    mat4.rotate(model, model, rotate, [0, 0, 1]);
    mat4.translate(model, model, [-0.5 * size[0], -0.5 * size[1], 0]);

    mat4.scale(model, model, [size[0], size[1], 1]);

    this.shader.setMatrix4('model', model);
    this.shader.setVector3fv('spriteColor', color);

    texture.bind();
    this.gl.activeTexture(this.gl.TEXTURE0);

    this.gl.bindVertexArray(this.quadVAO!);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    this.gl.bindVertexArray(null);
  }
}
