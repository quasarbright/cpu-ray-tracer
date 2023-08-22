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
        const hitInfo = this.march(scene, ray)
        if (hitInfo) {
            return hitInfo.obj.materialAt(hitInfo.position).color
        } else {
            // didn't hit anything
            return new Color(0,0,0)
        }
    }
    
    /**
     * march the ray to an object if it hits one. undefined otherwise.
     * returns hit info
     */
    private march(scene: Scene, ray: Ray): {obj: Obj, position: Vector} | undefined {
        const maxIter = 10000
        const maxMagnitude = 200
        let totalDistance = 0
        for(let i = 0; i < maxIter; i++) {
            if (ray.position.magSq() > maxMagnitude * maxMagnitude) {
                break
            }
            const {obj, distance} = scene.distanceEstimation(ray.position)
            if (distance < RayMarchRenderer.HIT_DISTANCE) {
                return {obj, position: ray.position}
            } else {
                ray = ray.march(distance)
                totalDistance += distance
            }
        }
        return undefined
    }
}