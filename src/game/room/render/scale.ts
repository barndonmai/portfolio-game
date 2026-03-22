export interface RoomScale {
  px: (value: number) => number;
  py: (value: number) => number;
  pw: (value: number) => number;
  ph: (value: number) => number;
}

export function createRoomScale(
  roomWidth: number,
  roomHeight: number,
): RoomScale {
  const scaleX = roomWidth / 1600;
  const scaleY = roomHeight / 1040;

  return {
    px: (value) => Math.round(value * scaleX),
    py: (value) => Math.round(value * scaleY),
    pw: (value) => Math.round(value * scaleX),
    ph: (value) => Math.round(value * scaleY),
  };
}
