import { Color } from "./color"
import { HorizontalPlane, Sphere } from "./object"
import { Ray } from "./ray"
import { RayMarchRenderer } from "./render"
import { Scene } from "./scene"
import { Vector } from "./vector"

describe('ray march renderer', () => {
    it('handles reflected rays', () => {
        const renderer = new RayMarchRenderer()
        const objects = [
            new HorizontalPlane(0,{color: new Color(1,1,1), spectralProbability: 1}),
            new Sphere(new Vector(2,1,0), .1, {color: new Color(1,0,0)}),
        ]
        const scene = new Scene(objects)
        const color = renderer['trace'](scene, new Ray(new Vector(0,1,0), new Vector(1,-1,0)))
        expect(color).toEqual(new Color(1,0,0))
    })
})