import { Vector } from "./vector";

export class Ray {
    readonly position: Vector
    // unit vector
    readonly direction: Vector
    constructor(position: Vector, direction: Vector) {
        this.position = position
        this.direction = direction
    }

    march(distance: number) {
        const position = this.position.add(this.direction.scale(distance))
        return new Ray(position, this.direction)
    }

    reflect(normal: Vector) {
        const direction = this.direction.reflect(normal)
        return new Ray(this.position, direction)
    }
}