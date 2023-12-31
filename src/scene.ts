import { Obj } from "./object"
import { Vector } from "./vector"

export class Scene {
    readonly objects: Obj[]
    constructor(objects: Obj[]) {
        this.objects = objects
    }

    // estimate a lower bound for the distance to the closest object
    distanceEstimation(position: Vector): { obj: Obj, distance: number } {
        let minDistance = Infinity
        let minObject = undefined
        for(const object of this.objects) {
            const distance = object.distanceEstimation(position)
            // use <= in case there are objects who return infinite distance estimations
            if (distance <= minDistance && distance >= 0) {
                minDistance = distance
                minObject = object
            }
        }
        if (!minObject) {
            throw new Error('unable to find closest object')
        } else {
            return {obj: minObject, distance: minDistance}
        }
    }
}