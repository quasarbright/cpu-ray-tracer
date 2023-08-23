import { Camera } from "./camera";
import { Color } from "./color";
import { Obj } from "./object";
import { Ray } from "./ray";
import { Scene } from "./scene";
import { Vector } from "./vector";

export interface Renderer {
    render(scene: Scene, camera: Camera, pixelWidth: number, pixelHeight: number): Color[][]
}

export class RayMarchRenderer implements Renderer {
    static HIT_DISTANCE = 0.0001
    static MAX_BOUNCES = 1
    static MAX_MARCH_ITER = 10000
    static MAX_RAY_MAGNITUDE = 200
    render(scene: Scene, camera: Camera, pixelWidth: number, pixelHeight: number): Color[][] {
        const rayGrid = camera.makeRays(pixelWidth, pixelHeight)
        const pixels = []
        for(const rays of rayGrid) {
            const row = []
            for(const ray of rays) {
                row.push(this.trace(scene, ray))
            }
            pixels.push(row)
        }
        return pixels
    }
    
    /**
     * determine what color the ray should be.
     */
    private trace(scene: Scene, ray: Ray): Color {
        // TODO convert to loop
        // TOOD max bounce count
        const hitInfo = this.march(scene, ray)
        if (hitInfo) {
            const {obj, ray: newRay} = hitInfo
            const material = obj.materialAt(newRay.position)
            const color = material.color
            if (Math.random() < (material.spectralProbability || 0)) {
                // spectral reflection
                const normal = hitInfo.obj.normAt(newRay.position)
                const reflectedRay = newRay.reflect(normal)
                // if we don't do this, if the reflected ray is on the surface, it'll never march away
                // because it will march 0 distance each step
                const nextRay = reflectedRay.march(RayMarchRenderer.HIT_DISTANCE)
                const reflectedColor = this.trace(scene, nextRay)
                // Color#reflect is monoidal and commutative so this is ok. this wouldn't be ok if we were averaging
                return color.reflect(reflectedColor)
            } else {
                // diffuse reflection
                // TODO reflect randomly and recur
                return color
            }
        } else {
            // didn't hit anything
            return new Color(0,0,0)
        }
    }
    
    /**
     * march the ray to an object if it hits one. undefined otherwise.
     * returns hit info
     */
    private march(scene: Scene, ray: Ray): {obj: Obj, ray: Ray} | undefined {
        let totalDistance = 0
        for(let i = 0; i < RayMarchRenderer.MAX_MARCH_ITER; i++) {
            if (ray.position.magSq() > RayMarchRenderer.MAX_RAY_MAGNITUDE * RayMarchRenderer.MAX_RAY_MAGNITUDE) {
                break
            }
            const {obj, distance} = scene.distanceEstimation(ray.position)
            // close and going into the surface
            if (distance < RayMarchRenderer.HIT_DISTANCE && ray.direction.dot(obj.normAt(ray.position)) < 0) {
                return {obj, ray}
            } else {
                ray = ray.march(distance)
                totalDistance += distance
            }
        }
        return undefined
    }
}