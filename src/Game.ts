import {mat4, vec2} from 'gl-matrix';
import SpriteRenderer from './SpriteRenderer';
import ResourceManager from './ResourceManager';
import {ExpoWebGLRenderingContext} from 'expo-gl';
import {vertex as spriteVS, fragment as spriteFS} from './shaders/sprite';
import GameLevel from './GameLevel';
import GameObject from './GameObject';

type Cursor = {
  x: number;
  y: number;
  active: boolean;
};
type GameState = 'active' | 'menu' | 'win';

export default class Game {
  // game state
  gl: ExpoWebGLRenderingContext;
  state: GameState;
  levels: GameLevel[] = [];
  currentLevel = 0;

  playerSize: vec2 = [100, 20];
  playerVelocity = 500;
  player: GameObject;

  cursor: Cursor;
  width: number;
  height: number;
  renderer: SpriteRenderer;
  resourceManager: ResourceManager;
  // initialize game state (load all shaders/textures/levels)
  async init() {
    this.resourceManager.loadShader(spriteVS, spriteFS, 'sprite');

    const projection = mat4.ortho(mat4.create(), 0, this.width, this.height, 0, -1, 1);
    this.resourceManager.getShader('sprite').use().setInteger('image', 0);
    this.resourceManager.getShader('sprite').setMatrix4('projection', projection);

    this.renderer = new SpriteRenderer(this.gl, this.resourceManager.getShader('sprite'));
    //Load textures
    await this.resourceManager.loadTexture2DAsync(require('./imgs/awesomeface.png'), true, 'face');
    await this.resourceManager.loadTexture2DAsync(require('./imgs/block.png'), true, 'block');
    await this.resourceManager.loadTexture2DAsync(require('./imgs/block_solid.png'), true, 'blockSolid');
    await this.resourceManager.loadTexture2DAsync(require('./imgs/background.jpg'), true, 'background');
    await this.resourceManager.loadTexture2DAsync(require('./imgs/paddle.png'), true, 'paddle');

    const playerPos = [this.width / 2 - this.playerSize[0] / 2, this.height - this.playerSize[1]] as vec2;
    this.player = new GameObject(
      playerPos,
      this.playerSize,
      this.resourceManager.getTexture('paddle'),
    );
    this.cursor = {x: playerPos[0], y: playerPos[1], active: false};

    //Load levels
    const one = new GameLevel();
    one.load(require('./levels/1.json'), this.width, this.height / 2);
    const two = new GameLevel();
    two.load(require('./levels/2.json'), this.width, this.height / 2);
    const three = new GameLevel();
    three.load(require('./levels/3.json'), this.width, this.height / 2);
    const four = new GameLevel();
    four.load(require('./levels/4.json'), this.width, this.height / 2);

    this.levels.push(one);
    this.levels.push(two);
    this.levels.push(three);
    this.levels.push(four);
    this.currentLevel = 0;
  }
  // game loop
  processInput(dt: number) {
    if (this.state === 'active') {
      const delta = this.cursor.x - this.player.position[0] - this.playerSize[0] / 2;
      let distanceTraveled = Math.min(dt * this.playerVelocity, Math.abs(delta));
      if (Math.abs(delta) > 5 && this.cursor.active)
        this.player.position[0] += (delta > 0 ? 1 : -1) * distanceTraveled;
    }
  }

  update(dt: number) {

  }

  render() {
    //console.log(this.cursor);
    if (this.state === 'active') {
      this.renderer.drawSprite(this.resourceManager.getTexture('background'),[0, 0], [this.width, this.height], 0, [1, 1, 1]);
      this.levels[this.currentLevel].draw(this.renderer);
      this.player.draw(this.renderer);
    }
  }

  constructor(gl: ExpoWebGLRenderingContext, width: number, height: number, state = 'active' as GameState, cursor = {x:0, y:0, active: false} as Cursor){
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.state = state;
    this.cursor = cursor;
    this.resourceManager = ResourceManager.get(this.gl);
  }
}