import { vec2, vec3 } from 'gl-matrix';
import Texture2D from './utils/textures/Texture2D';
import SpriteRenderer from './SpriteRenderer';

export default class GameObject {
  position: vec2;
  size: vec2;
  velocity: vec2;
  color: vec3;
  rotation = 0;
  isSolid = false;
  isDestroyed = false;

  sprite: Texture2D;

  constructor(pos: vec2, size: vec2, sprite: Texture2D, color?: vec3, velocity?: vec2) {
    this.position = pos || vec2.fromValues(0, 0);
    this.size = size || vec2.fromValues(1, 1);
    this.sprite = sprite;
    this.color = color || vec3.fromValues(1, 1, 1);
    this.velocity = velocity || vec2.fromValues(0, 0);
  }

  draw(renderer: SpriteRenderer) {
    renderer.drawSprite(this.sprite, this.position, this.size, this.rotation, this.color);
  }
}
