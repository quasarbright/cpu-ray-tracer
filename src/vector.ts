
// A point in spherical coordinates
// latitude and longitude
export interface Spherical {
    radius: number
    // from x axis, rotate withing xz plane
    horizontalAngle: number
    // from x axis, rotate out of xz plane
    verticalAngle: number
}

export class Vector {
    readonly x: number
    readonly y: number
    readonly z: number

    constructor(x: number, y: number, z: number) {
        this.x = x
        this.y = y
        this.z = z
    }

    static fromSpherical(coords: Spherical) {
        const x = coords.radius * Math.cos(coords.horizontalAngle) * Math.cos(coords.verticalAngle)
        const z = coords.radius * Math.sin(coords.horizontalAngle) * Math.cos(coords.verticalAngle)
        const y = coords.radius * Math.sin(coords.verticalAngle)
        return new Vector(x,y,z)
    }

    add(other: Vector) {
        return new Vector(this.x + other.x, this.y + other.y, this.z + other.z)
    }

    dot(other: Vector) {
        return this.x * other.x + this.y * other.y + this.z * other.z
    }

    scale(r: number) {
        return new Vector(r * this.x, r * this.y, r * this.z)
    }

    magSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z
    }

    mag() {
        return Math.sqrt(this.magSq())
    }

    normalize() {
        return this.scale(1 / this.mag())
    }

    sub(other: Vector) {
        return this.add(other.scale(-1))
    }

    toSpherical(): Spherical {
        const radius = this.mag()
        const horizontalAngle = (this.x === 0 && this.z === 0) ? 0 : Math.sign(this.z) * Math.acos(this.x  / Math.sqrt(this.x * this.x + this.z * this.z))
        const verticalAngle = Math.asin(this.y / radius)
        return {radius, horizontalAngle, verticalAngle}
    }

    // crude rotation based on spherical coordinates
    rotate(dHorizontalAngle: number, dVerticalAngle: number): Vector {
        const coords = this.toSpherical()
        const rotatedCoords: Spherical = {
            radius: coords.radius,
            horizontalAngle: coords.horizontalAngle + dHorizontalAngle,
            verticalAngle: coords.verticalAngle + dVerticalAngle,
        }
        return Vector.fromSpherical(rotatedCoords)
    }

    cross(other: Vector): Vector {
        const x = this.z * other.y - this.y * other.z
        const y = this.x * other.z - this.z * other.x
        const z = this.y * other.x - this.x * other.y
        return new Vector(x,y,z)
    }

    /**
     * treating this vector as an incident direction, reflect along the surface normal
     */
    reflect(normal: Vector) {
        return this.sub(normal.scale(2 * this.dot(normal)))
    }
}