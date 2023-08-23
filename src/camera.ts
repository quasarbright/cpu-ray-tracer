import { Ray } from "./ray";
import { Vector } from "./vector";

export class Camera {
    /*
     We have an image plane 1 unit in front of the camera.
     Its width and height are such that its angular width is the horizontal fov and
     its angular height is the vertical fov.
     We divide up the image plane into a grid of pixels according to the given resolution
     and genrate rays through each pixel.
     */
    readonly position: Vector
    readonly direction: Vector
    // in radians
    readonly horizontalFov: number
    readonly verticalFov: number
    constructor(position: Vector, direction: Vector) {
        this.position = position
        this.direction = direction
        this.horizontalFov = 70 * 2 * Math.PI / 360
        this.verticalFov = 70 * 2 * Math.PI / 360
    }

    // make 2d array of rays corresponding to pixels
    makeRays(pixelWidth: number, pixelHeight: number): Ray[][] {
        // TODO play with different implementations to mimic different kinds of lenses and stuff
        const rays = []
        const {up, right} = this.getImagePlaneVectors()
        const {width, height} = this.getImagePlaneDimensions()
        for(let r = 0; r < pixelHeight; r++) {
            const row = []
            for(let c = 0; c < pixelWidth; c++) {
                // convert pixel space to image plane space
                // this x and y are the components of a position vector on the image plane
                // with basis vectors 'right' and 'up'
                const x = c * width / pixelWidth - width / 2
                // negate vertically bc pixel y goes down
                const y = -(r * height / pixelHeight - height / 2)
                // Since the image plane is one unit in front of us and direction is a unit vector, we just add
                // the scaled up and right vectors to the direction to get a vector from here to the pixel's location on the plane.
                // Then we normalize so it can be a ray direction.
                const direction = this.direction.add(up.scale(y)).add(right.scale(x)).normalize()
                const ray = new Ray(this.position, direction)
                row.push(ray)
            }
            rays.push(row)
        }
        return rays
    }

    // returns vectors mutually orthogonal to the camera's direction
    // They form an orthonormal basis for the image plane
    private getImagePlaneVectors(): {up: Vector, right: Vector} {
        const up = this.direction.rotate(0, Math.PI / 2)
        const right = this.direction.cross(up)
        return {up, right}
    }

    // physical dimensions of the image plane to satisfy fov
    // if the image plane is 1 unit in front of the camera
    private getImagePlaneDimensions(): {width: number, height: number} {
        // tan(half fov) = half length / 1
        const width = 2 * Math.tan(this.horizontalFov / 2)
        const height = 2 * Math.tan(this.verticalFov / 2)
        return {width, height}
    }
}