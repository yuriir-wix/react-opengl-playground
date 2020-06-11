import GameObject from './GameObject';
import SpriteRenderer from './SpriteRenderer';
import {vec2, vec3} from 'gl-matrix';
import Texture2D from './utils/textures/Texture2D';
import ResourceManager from './ResourceManager';

const colorMap: Record<number, vec3> = {
  1: [0.8, 0.8, 0.7],
  2: [0.2, 0.6, 1],
  3: [0, 0.7, 0],
  4: [0.8, 0.8, 0.4],
  5: [1, 0.5, 0],
};

export default class GameLevel {
  bricks: GameObject[] = [];

  constructor() {}

  load(tileData: number[][], levelWidth: number, levelHeight: number) {
    const width = tileData[0].length;
    const height = tileData.length;

    const unitWidth = levelWidth / width;
    const unitHeight = levelHeight / height;

    for (let y = 0; y < height; ++y) {
      for (let x = 0; x < width; ++x) {
        if (tileData[y][x] < 1) continue;
        const pos = vec2.fromValues(x * unitWidth, y * unitHeight);
        const size = vec2.fromValues(unitWidth, unitHeight);

        let color = colorMap[tileData[y][x]] || [1, 1, 1];

        let texture: Texture2D;
        if (tileData[y][x] === 1) {
          texture = ResourceManager.get().getTexture('blockSolid');
        } else {
          texture = ResourceManager.get().getTexture('block');
        }

        const obj = new GameObject(pos, size, texture, color);
        this.bricks.push(obj);
      }
    }
  }

  draw(renderer: SpriteRenderer) {
    this.bricks.forEach((brick) => {
      if (!brick.isDestroyed) {
        brick.draw(renderer);
      }
    });
  }

  isCompleted() {
    return (
      this.bricks.filter((brick) => !brick.isDestroyed && !brick.isSolid)
        .length > 0
    );
  }
}
