import { Transform } from "stream"
import { Camera } from "./camera"
import { Color } from "./color"
import { HorizontalPlane, Intersection, Obj, Rainbow, Repeating, Sphere, Transformed, Union } from "./object"
import { RayMarchRenderer } from "./render"
import { Scene } from "./scene"
import { saveImage } from "./to-image"
import { Vector } from "./vector"
import { linear, translation } from "./transform"

async function main() {
    const camera = new Camera(new Vector(0,0,0), new Vector(1,0,0).normalize())
    const objects: Obj[] = [
        // new Sphere(new Vector(10,0,0), 1, {color: new Color(1,0,0)}),
        // new Sphere(new Vector(5,0,-3), 2, {color: new Color(1,1,1), specularProbability: 1}),
        // new Sphere(new Vector(5,0,3), 2, {color: new Color(1,1,1), specularProbability: 1}),
        // new Sphere(new Vector(5,3,0), 2, {color: new Color(0,1,0), specularProbability: 1}),
        // new Rainbow(new Sphere(new Vector(12,0,-1), 1.9, {color: new Color(0,1,0)})),
        // new Rainbow(new Sphere(new Vector(12,0,-1), 1.9, {color: new Color(0,1,0)})),
        // new Rainbow(new Sphere(new Vector(12,4,-1), 1.9, {color: new Color(0,1,0)})),
        // new Rainbow(new Sphere(new Vector(12,8,-1), 1.9, {color: new Color(0,1,0)})),
        // new Rainbow(new Sphere(new Vector(12,12,-1), 1.9, {color: new Color(0,1,0)})),
        // new Rainbow(new Sphere(new Vector(12,0,-5), 1.9, {color: new Color(0,1,0)})),
        // new Rainbow(new Sphere(new Vector(12,0,-9), 1.9, {color: new Color(0,1,0)})),
        // new Rainbow(new Sphere(new Vector(12,0,-13), 1.9, {color: new Color(0,1,0)})),
        // new Sphere(new Vector(9,0,1), 1, {color: new Color(0,0,1)}),
        new HorizontalPlane(-2, {color: Color.BLACK, specularProbability: 0, emissionColor: Color.WHITE, emissionStrength: .1}),
        // new Rainbow(new Repeating(new Sphere(new Vector(5,5,5), 1, {color: new Color(1,0,0)}), 10)),
        // new Repeating(new Sphere(new Vector(5,5,5), 1, {color: Color.WHITE, specularProbability: 1}), 10),
        new Sphere(new Vector(5,1,0), 1, {color: Color.BLACK, emissionColor: Color.WHITE, emissionStrength: 1}),
        new Sphere(new Vector(6,0.5,-2), 1, {color: new Color(1,0,0)}),
        new Sphere(new Vector(6,1,2), 1, {color: new Color(0,1,0)}),
        new Sphere(new Vector(4,-1,1), 1, {color: new Color(0,0,1)}),
        ]
        const scene = new Scene(objects)
        const renderer = new RayMarchRenderer()
        const pixels = renderer.render(scene, camera, 400, 400)
        await saveImage(pixels, 'out/main.png')
    }
    
    if (require.main === module) {
        main()
    }