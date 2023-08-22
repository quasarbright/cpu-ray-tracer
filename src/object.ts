import { Color } from "./color";
import { Vector } from "./vector";

export interface Material {
    color: Color
}

export interface Obj {
    // signed distance. negative is inside
    // it's a lower bound
    distanceEstimation(position: Vector): number
    // normal (unit) vector at that position. Assume dist is basically 0
    normAt(position: Vector): Vector
    material: Material
}

export class Sphere implements Obj {
    readonly position: Vector
    readonly radius: number
    readonly material: Material

    constructor(position: Vector, radius: number, material: Material) {
        this.position = position
        this.radius = radius
        this.material = material
    }

    distanceEstimation(position: Vector): number {
        return position.sub(this.position).mag() - this.radius
    }

    normAt(position: Vector): Vector {
        return position.sub(this.position).normalize()
    }
}

export class HorizontalPlane implements Obj {
    readonly y: number 
    readonly material: Material;

    constructor(y: number, material: Material) {
        this.y = y
        this.material = material
    }

    distanceEstimation(position: Vector): number {
        return Math.abs(position.y - this.y)
    }

    normAt(position: Vector): Vector {
        if (position.y < this.y) {
            return new Vector(0,-1,0)
        } else {
            return new Vector(0,1,0)
        }
    }
}