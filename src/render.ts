import { Camera } from "./camera";
import { Color, averageColor } from "./color";
import { Obj } from "./object";
import { Ray } from "./ray";
import { Scene } from "./scene";
import { mod } from "./transform";
import { Vector } from "./vector";

export interface Renderer {
    render(scene: Scene, camera: Camera, pixelWidth: number, pixelHeight: number): Color[][]
}

export class RayMarchRenderer implements Renderer {
    static HIT_DISTANCE = 0.0001
    static MAX_BOUNCES = 3
    static MAX_MARCH_ITER = 1000
    static MAX_RAY_MAGNITUDE = 200
    static RAYS_PER_PIXEL = 100
    render(scene: Scene, camera: Camera, pixelWidth: number, pixelHeight: number): Color[][] {
        const rayGrid = camera.makeRays(pixelWidth, pixelHeight)
        const pixels = []
        for(const rays of rayGrid) {
            const row = []
            for(const ray of rays) {
                const colors = []
                for(let i = 0; i < RayMarchRenderer.RAYS_PER_PIXEL; i++) {
                    colors.push(this.trace(scene, ray))
                }
                row.push(averageColor(colors))
            }
            pixels.push(row)
        }
        return pixels
    }
    
    /**
     * determine what color the ray should be.
     */
    private trace(scene: Scene, ray: Ray): Color {
        // color of all materials hit
        // intersection of wavelengths of material colors
        let rayColor = Color.WHITE
        // from light sources, filtered according to materials hit
        let incomingLight = Color.BLACK
        for(let i = 0; i < RayMarchRenderer.MAX_BOUNCES + 1; i++) {
            const hitInfo = this.march(scene, ray)
            if (hitInfo) {
                const { obj, ray: newRay } = hitInfo
                const material = obj.materialAt(newRay.position)
                const emittedColor = (material.emissionColor || Color.BLACK).scale(material.emissionStrength || 0)
                // we want the emitted color to be filtered according to materials that the emitted light ray
                // hits between the light source and the camera. Since we're in reverse, reflecting by
                // rayColor filters with all the materials between the light source and the camera.
                // the sum represents multiple emitted photons hitting the camera
                incomingLight = incomingLight.add(emittedColor.reflect(rayColor))
                // Color#reflect is monoidal and commutative so this is ok. this wouldn't be ok if we were averaging
                rayColor = rayColor.reflect(material.color)
                if(material.emissionColor && material.emissionStrength) {

                }
                const normal = hitInfo.obj.normAt(newRay.position)
                let reflectedRay
                if (Math.random() < (material.specularProbability || 0)) {
                    // specular reflection
                    reflectedRay = newRay.reflect(normal)
                } else {
                    // diffuse reflection
                    // cosine weighted to handle incident-angle-based intensity
                    const newDirection = normal.add(Vector.randomDirection()).normalize()
                    reflectedRay = new Ray(newRay.position, newDirection)
                }
                // if we don't do this, if the reflected ray is on the surface, it'll never march away
                // because it will march 0 distance each step
                ray = reflectedRay.march(RayMarchRenderer.HIT_DISTANCE)
            } else {
                // didn't hit anything
                incomingLight = incomingLight.add(this.skyBox(ray.direction).reflect(rayColor))
                break
            }
        }
        return incomingLight
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

    skyBox(direction: Vector) {
        return Color.BLACK
        // black and white checkerboard on the sphere, 24x24
        const coord = direction.toSpherical()
        const w = 24
        const h = 24
        // 0 or 1
        const horiz = Math.floor(mod(coord.horizontalAngle, Math.PI * 2) * w / (Math.PI * 2)) % 2
        const vert = Math.floor(mod(coord.verticalAngle, Math.PI * 2) * h / (Math.PI * 2)) % 2
        const c = (horiz + vert) % 2
        return new Color(c,c,c)
    }
}