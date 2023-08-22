import { Camera } from "./camera"
import { Color } from "./color"
import { HorizontalPlane, Rainbow, Repeating, Sphere } from "./object"
import { RayMarchRenderer } from "./render"
import { Scene } from "./scene"
import { saveImage } from "./to-image"
import { Vector } from "./vector"

async function main() {
    const camera = new Camera(new Vector(0,0,0), new Vector(1,0,0))
    const objects = [
        new Sphere(new Vector(10,0,0), 1, {color: new Color(1,0,0)}),
        new Sphere(new Vector(12,0,-1), 2, {color: new Color(0,1,0)}),
        new Sphere(new Vector(9,0,1), 1, {color: new Color(0,0,1)}),
        new HorizontalPlane(-5, {color: new Color(1,1,1)}),
        new Rainbow(new Repeating(new Sphere(new Vector(5,5,5), 1, {color: new Color(1,0,0)}), 10)),
    ]
    const scene = new Scene(objects)
    const renderer = new RayMarchRenderer()
    const pixels = renderer.render(scene, camera, 400, 400)
    await saveImage(pixels, 'out/main.png')
}

if (require.main === module) {
    main()
}