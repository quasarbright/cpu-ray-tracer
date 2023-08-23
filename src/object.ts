import { Color } from "./color";
import { Vector } from "./vector";

export interface Material {
    color: Color
    spectralProbability?: number
}

export interface Obj {
    // signed distance. negative is inside
    // it's a lower bound
    distanceEstimation(position: Vector): number
    // normal (unit) vector at that position. Assume dist is basically 0
    normAt(position: Vector): Vector
    materialAt(position: Vector): Material
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

    materialAt(position: Vector): Material {
        return this.material
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

    materialAt(position: Vector): Material {
        return this.material
    }
}

function mod(a: number, b: number): number {
    return ((a % b) + b) % b
}

export class Repeating implements Obj {
    // TODO replace with transformed
    // object should be contained in 0,0,0 to period,period,period box
    readonly obj: Obj
    readonly period: number
    constructor(obj: Obj, period: number) {
        this.obj = obj
        this.period = period
    }

    private mod(position: Vector): Vector {
        return new Vector(mod(position.x, this.period), mod(position.y, this.period), mod(position.z, this.period))
    }

    distanceEstimation(position: Vector): number {
        return this.obj.distanceEstimation(this.mod(position))
    }

    normAt(position: Vector): Vector {
        return this.obj.normAt(this.mod(position))
    }

    materialAt(position: Vector): Material {
        // this should be modded too, but rainbow repeating looks better like this
        return this.obj.materialAt(position)
    }
}

export class Transformed implements Obj {
    readonly obj: Obj
    readonly transformation: (position: Vector) => Vector
    constructor(obj: Obj, transformation: (position: Vector) => Vector) {
        this.obj = obj
        this.transformation = transformation
    }


    distanceEstimation(position: Vector): number {
        return this.obj.distanceEstimation(this.transformation(position))
    }

    normAt(position: Vector): Vector {
        return this.obj.normAt(this.transformation(position))
    }

    materialAt(position: Vector): Material {
        return this.obj.materialAt(this.transformation(position))
    }
}

export class Rainbow implements Obj {
    readonly obj: Obj
    constructor(obj: Obj) {
        this.obj = obj
    }

    distanceEstimation(position: Vector): number {
        return this.obj.distanceEstimation(position)
    }

    normAt(position: Vector): Vector {
        return this.obj.normAt(position)
    }

    materialAt(position: Vector): Material {
        const hu = 1 / 3 + (Math.sin(position.x) + Math.sin(position.y) + Math.sin(position.z)) / 3
        return {color: Color.fromHSB(hu, 1, 1)}
    }
}
