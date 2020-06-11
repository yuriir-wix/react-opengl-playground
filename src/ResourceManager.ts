import {ExpoWebGLRenderingContext} from 'expo-gl';
import Shader from './utils/shaders/Shader';
import Texture2D from './utils/textures/Texture2D';
import {Asset} from 'expo-asset';

export default class ResourceManager {
  private static instance?: ResourceManager = undefined;

  private gl: ExpoWebGLRenderingContext;
  private shaders: Record<string, Shader> = {};
  private textures: Record<string, Texture2D> = {};

  private constructor(gl: ExpoWebGLRenderingContext) {
    this.gl = gl;
  }

  static get(gl?: ExpoWebGLRenderingContext) {
    if (!ResourceManager.instance) {
      if (!gl) throw new Error('Invalid Resource Manageer initialization!!!');
      ResourceManager.instance = new ResourceManager(gl);
    }
    return ResourceManager.instance;
  }

  loadShader(vertexShaderSource: string, fragmentShaderSource: string, name: string){
    const shader = new Shader(this.gl, vertexShaderSource, fragmentShaderSource);
    this.shaders[name] = shader;
  }

  getShader(name: string) {
    return this.shaders[name];
  }

  async loadTexture2DAsync(source: number, alpha: boolean, name: string) {
    const asset = Asset.fromModule(source);
    if (!asset.localUri) {
      await asset.downloadAsync();
    }

    this.loadTexture2D(asset, alpha, name);
  }

  loadTexture2D(source: any, alpha: boolean, name: string) {
    const texture = new Texture2D(this.gl);
    if (alpha) {
      texture.internalFormat = this.gl.RGBA;
      texture.imageFormat = this.gl.RGBA;
    }
    texture.generate(source.width, source.height, source);
    this.textures[name] = texture;
  }

  getTexture(name: string) {
    return this.textures[name];
  }

  clear() {
    for (const key in this.shaders)
      this.gl.deleteProgram(this.shaders[key].getProgram());

    for (const key in this.textures)
      this.gl.deleteTexture(this.textures[key].getTexture());
  }
}
