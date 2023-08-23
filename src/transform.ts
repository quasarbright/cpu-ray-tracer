import { Vector } from "./vector";

// to be used with Transformed object
export const translation = (displacement: Vector) => (position: Vector) => position.add(displacement)
export const dilation = (xScale: number, yScale: number, zScale: number) => (position: Vector) => new Vector(position.x * xScale, position.y * yScale, position.z * zScale)
// this is ray reflection, which might not quite be what you want. should be the same, but not sure
export const reflection = (normal: Vector) => (position: Vector) => position.reflect(normal)
// linear transformation, represented by where it sends each unit vector
export const linear = (xhat: Vector, yhat: Vector, zhat: Vector) => (position: Vector) => xhat.scale(position.x).add(yhat.scale(position.y)).add(zhat.scale(position.z))

function mod(a: number, b: number): number {
    return ((a % b) + b) % b
}
// transform the into pacman space
export const repeating = (period: number) => (position: Vector) => new Vector(mod(position.x, period), mod(position.y, period), mod(position.z, period))