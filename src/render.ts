import { Camera } from "./camera";
import { Color } from "./color";
import { Ray } from "./ray";
import { Scene } from "./scene";

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
                row.push(this.march(scene, ray))
            }
            pixels.push(row)
        }
        return pixels
    }

    private march(scene: Scene, ray: Ray): Color {
        const maxIter = 10000
        const maxMagnitude = 200
        let totalDistance = 0
        for(let i = 0; i < maxIter; i++) {
            if (ray.position.magSq() > maxMagnitude * maxMagnitude) {
                break
            }
            const {obj, distance} = scene.distanceEstimation(ray.position)
            if (distance < RayMarchRenderer.HIT_DISTANCE) {
                return obj.materialAt(ray.position).color
            } else {
                ray = ray.march(distance)
                totalDistance += distance
            }
        }
        return {r: 0, g: 0, b: 0}
    }
}