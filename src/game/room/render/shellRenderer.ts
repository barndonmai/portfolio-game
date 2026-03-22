import Phaser from 'phaser';
import { BASE_DEPTH } from '../config/depth';
import { FLOOR_TEXTURE_KEY } from '../config/textureKeys';
import { addEllipse, addRect } from './primitives';
import { createRoomScale } from './scale';

export function drawPubShell(
  scene: Phaser.Scene,
  roomWidth: number,
  roomHeight: number,
) {
  const { px, py, pw, ph } = createRoomScale(roomWidth, roomHeight);
  const topWallHeight = ph(156);
  const innerTopWallHeight = ph(54);
  const rightWallWidth = pw(156);
  const innerRightWallWidth = innerTopWallHeight;
  const topWallWidth = roomWidth - rightWallWidth;
  const topWallCenterX = topWallWidth / 2;
  const rightWallHeight = roomHeight;
  const rightWallCenterY = roomHeight / 2;
  const innerRightWallHeight = roomHeight - topWallHeight;
  const innerRightWallCenterY = topWallHeight + innerRightWallHeight / 2;
  const rightWallInnerCenterX =
    roomWidth - rightWallWidth + innerRightWallWidth / 2;
  const cornerFillCenterY = topWallHeight - innerTopWallHeight / 2;
  const rightWallTrimWidth = pw(28);
  const topTrimY = py(26);
  const topTrimHeight = ph(28);
  const rightTrimInset = topTrimY - ph(14);
  const rightWallTrimCenterX =
    roomWidth - rightTrimInset - rightWallTrimWidth / 2;
  const topTrimEndX = roomWidth - rightTrimInset;
  const topTrimWidth = topTrimEndX;
  const topTrimCenterX = topTrimWidth / 2;
  const rightWallTrimTop = topTrimY + topTrimHeight / 2;
  const rightWallTrimHeight = roomHeight - rightWallTrimTop;
  const rightWallTrimCenterY = rightWallTrimTop + rightWallTrimHeight / 2;

  addRect(
    scene,
    roomWidth / 2,
    roomHeight / 2,
    roomWidth,
    roomHeight,
    0x41281c,
  ).setDepth(BASE_DEPTH);

  if (scene.textures.exists(FLOOR_TEXTURE_KEY)) {
    const floorTexture = scene.add
      .renderTexture(0, 0, roomWidth, roomHeight)
      .setOrigin(0)
      .setDepth(BASE_DEPTH + 0.1);
    const baseFloorFrame = 5;

    for (let y = 0; y < roomHeight; y += 16) {
      for (let x = 0; x < roomWidth; x += 16) {
        floorTexture.draw(FLOOR_TEXTURE_KEY, x, y, baseFloorFrame);
      }
    }
  } else {
    const floor = scene.add.graphics().setDepth(BASE_DEPTH + 0.1);

    for (let x = 28; x < roomWidth; x += 30) {
      const color = x % 60 === 0 ? 0x563626 : 0x4d3022;
      floor.fillStyle(color, 1);
      floor.fillRect(x, 0, 22, roomHeight);
      floor.fillStyle(0x6a442d, 0.14);
      floor.fillRect(x + 16, 0, 2, roomHeight);
    }

    for (let y = 28; y < roomHeight; y += 48) {
      floor.fillStyle(0x2b1a14, 0.12);
      floor.fillRect(0, y, roomWidth, 2);
    }
  }

  const floorWear = scene.add.graphics().setDepth(BASE_DEPTH + 0.16);
  floorWear.fillStyle(0x4a2c1f, 0.22);
  floorWear.fillRect(0, 0, roomWidth, roomHeight);
  floorWear.fillStyle(0x6f4730, 0.14);
  floorWear.fillEllipse(900, 820, 980, 360);
  floorWear.fillEllipse(1380, 520, 240, 520);
  floorWear.fillEllipse(286, 266, 260, 180);
  floorWear.fillStyle(0x8a6244, 0.12);
  floorWear.fillEllipse(930, 910, 520, 120);
  floorWear.fillEllipse(1240, 820, 220, 120);
  floorWear.fillEllipse(760, 610, 180, 90);
  floorWear.fillStyle(0x2a1913, 0.08);

  addRect(scene, topWallCenterX, topWallHeight / 2, topWallWidth, topWallHeight, 0x35584f)
    .setDepth(BASE_DEPTH + 0.2);
  addRect(scene, roomWidth - rightWallWidth / 2, rightWallCenterY, rightWallWidth, rightWallHeight, 0x35584f)
    .setDepth(BASE_DEPTH + 0.2);
  addRect(
    scene,
    topWallCenterX,
    topWallHeight - innerTopWallHeight / 2,
    topWallWidth,
    innerTopWallHeight,
    0x274038,
    0.92,
  ).setDepth(BASE_DEPTH + 0.25);
  addRect(
    scene,
    rightWallInnerCenterX,
    cornerFillCenterY,
    innerRightWallWidth,
    innerTopWallHeight,
    0x274038,
    0.92,
  ).setDepth(BASE_DEPTH + 0.25);
  addRect(
    scene,
    rightWallInnerCenterX,
    innerRightWallCenterY,
    innerRightWallWidth,
    innerRightWallHeight,
    0x274038,
    0.92,
  ).setDepth(BASE_DEPTH + 0.25);
  addRect(scene, topTrimCenterX, topTrimY, topTrimWidth, topTrimHeight, 0x251611).setDepth(
    BASE_DEPTH + 0.3,
  );
  addRect(
    scene,
    rightWallTrimCenterX,
    rightWallTrimCenterY,
    rightWallTrimWidth,
    rightWallTrimHeight,
    0x251611,
  ).setDepth(BASE_DEPTH + 0.3);

  addEllipse(scene, px(292), py(226), pw(424), ph(310), 0x000000, 0.14).setDepth(
    BASE_DEPTH + 0.05,
  );
  addEllipse(scene, px(934), py(756), pw(1060), ph(620), 0x6a1f1f, 0.08).setDepth(
    BASE_DEPTH + 0.05,
  );
  addEllipse(scene, px(1324), py(926), pw(428), ph(212), 0xd0a15f, 0.08).setDepth(
    BASE_DEPTH + 0.08,
  );
}
