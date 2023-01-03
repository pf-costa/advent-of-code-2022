export type Point = {
  x: number;
  y: number;
};

export type Vector = Point;

export const create = (point1: Point, point2: Point): Vector => {
  return {
    x: point2.x - point1.x,
    y: point2.y - point1.y,
  };
};

export const distance = (vector: Vector) => {
  return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
};

export const normalize = (vector: Vector) => {
  const d = distance(vector);

  const normalized = {
    x: Math.round(vector.x / d),
    y: Math.round(vector.y / d),
  };

  return normalized;
};

export default Vector;
