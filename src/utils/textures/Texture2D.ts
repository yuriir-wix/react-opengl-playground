import {ExpoWebGLRenderingContext} from 'expo-gl';

export default class Texture2D {
  gl: ExpoWebGLRenderingContext;
  texture: WebGLTexture;
  // texture image dimensions
  width: number;
  height: number; // width and height of loaded image in pixels
  // texture Format
  internalFormat: number; // format of texture object
  imageFormat: number; // format of loaded image
  // texture configuration
  wrapS: number; // wrapping mode on S axis
  wrapT: number; // wrapping mode on T axis
  filterMin: number; // filtering mode if texture pixels < screen pixels
  filterMax: number; // filtering mode if texture pixels > screen pixels

  constructor(
    gl: ExpoWebGLRenderingContext,
    width = 0,
    height = 0,
    internalFormat = 0,
    imageFormat = 0,
    wrapS = 0,
    wrapT = 0,
    filterMin = 0,
    filterMax = 0,
  ) {
    this.gl = gl;
    this.texture = gl.createTexture()!;
    this.width = width;
    this.height = height;
    this.internalFormat = internalFormat || gl.RGB;
    this.imageFormat = imageFormat || gl.RGB;
    this.wrapS = wrapS || gl.REPEAT;
    this.wrapT = wrapT || gl.REPEAT;
    this.filterMin = filterMin || gl.LINEAR;
    this.filterMax = filterMax || gl.LINEAR;
  }

  getTexture() {
    return this.texture;
  }

  // generates texture from image data
  generate(
    width: number,
    height: number,
    data: ImageData | ImageBitmap | Uint8ClampedArray | {localUrl: string},
  ) {
    this.width = width;
    this.height = height;
    // create Texture
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);

    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.internalFormat, width, height, 0, this.imageFormat, this.gl.UNSIGNED_BYTE, data);

    // set Texture wrap and filter modes
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.wrapS);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.wrapT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.filterMin);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAX_FILTER, this.filterMax);

    this.gl.bindTexture(this.gl.TEXTURE_2D, 0);
  }
  // binds the texture as the current active GL_TEXTURE_2D texture object
  bind() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
  }
}
