import { Vector } from "./vector"

const xhat = new Vector(1,0,0)
const yhat = new Vector(0,1,0)
const zhat = new Vector(0,0,1)

describe('vector rotation', () => {
    test('to spherical', () => {
        expect(xhat.toSpherical()).toEqual({
            radius: 1,
            horizontalAngle: 0,
            verticalAngle: 0,
        })
        expect(yhat.toSpherical()).toEqual({
            radius: 1,
            horizontalAngle: 0,
            verticalAngle: Math.PI / 2
        })
        expect(zhat.toSpherical()).toEqual({
            radius: 1,
            horizontalAngle: Math.PI / 2,
            verticalAngle: 0,
        })
        expect(new Vector(1,0,1).toSpherical().radius).toEqual(Math.SQRT2)
        expect(new Vector(1,0,1).toSpherical().horizontalAngle).toBeCloseTo(Math.PI / 4)
        expect(new Vector(1,0,1).toSpherical().verticalAngle).toEqual(0)

        expect(new Vector(-1,0,1).toSpherical().radius).toEqual(Math.SQRT2)
        expect(new Vector(-1,0,1).toSpherical().horizontalAngle).toBeCloseTo(3 * Math.PI / 4)
        expect(new Vector(-1,0,1).toSpherical().verticalAngle).toEqual(0)

        expect(new Vector(1,0,-1).toSpherical().radius).toEqual(Math.SQRT2)
        expect(new Vector(1,0,-1).toSpherical().horizontalAngle).toBeCloseTo(-Math.PI / 4)
        expect(new Vector(1,0,-1).toSpherical().verticalAngle).toEqual(0)

        expect(new Vector(1,1,1).toSpherical().radius).toEqual(Math.sqrt(3))
        expect(new Vector(1,1,1).toSpherical().horizontalAngle).toBeCloseTo(Math.PI / 4)
        expect(new Vector(1,1,1).toSpherical().verticalAngle).toBeCloseTo(Math.acos(Math.SQRT2 / Math.sqrt(3)))

        expect(new Vector(1,-1,1).toSpherical().radius).toEqual(Math.sqrt(3))
        expect(new Vector(1,-1,1).toSpherical().horizontalAngle).toBeCloseTo(Math.PI / 4)
        expect(new Vector(1,-1,1).toSpherical().verticalAngle).toBeCloseTo(-Math.acos(Math.SQRT2 / Math.sqrt(3)))
    })

    test('from spherical', () => {
        expect(Vector.fromSpherical(xhat.toSpherical())).toEqual(xhat)

        expect(Vector.fromSpherical(yhat.toSpherical()).x).toBeCloseTo(0)
        expect(Vector.fromSpherical(yhat.toSpherical()).y).toBeCloseTo(1)
        expect(Vector.fromSpherical(yhat.toSpherical()).z).toBeCloseTo(0)

        expect(Vector.fromSpherical(zhat.toSpherical()).x).toBeCloseTo(0)
        expect(Vector.fromSpherical(zhat.toSpherical()).y).toBeCloseTo(0)
        expect(Vector.fromSpherical(zhat.toSpherical()).z).toBeCloseTo(1)

        expect(Vector.fromSpherical(new Vector(1,0,1).toSpherical()).x).toBeCloseTo(1)
        expect(Vector.fromSpherical(new Vector(1,0,1).toSpherical()).y).toBeCloseTo(0)
        expect(Vector.fromSpherical(new Vector(1,0,1).toSpherical()).z).toBeCloseTo(1)

        expect(Vector.fromSpherical(new Vector(-1,0,1).toSpherical()).x).toBeCloseTo(-1)
        expect(Vector.fromSpherical(new Vector(-1,0,1).toSpherical()).y).toBeCloseTo(0)
        expect(Vector.fromSpherical(new Vector(-1,0,1).toSpherical()).z).toBeCloseTo(1)

        expect(Vector.fromSpherical(new Vector(1,0,-1).toSpherical()).x).toBeCloseTo(1)
        expect(Vector.fromSpherical(new Vector(1,0,-1).toSpherical()).y).toBeCloseTo(0)
        expect(Vector.fromSpherical(new Vector(1,0,-1).toSpherical()).z).toBeCloseTo(-1)

        expect(Vector.fromSpherical(new Vector(1,1,1).toSpherical()).x).toBeCloseTo(1)
        expect(Vector.fromSpherical(new Vector(1,1,1).toSpherical()).y).toBeCloseTo(1)
        expect(Vector.fromSpherical(new Vector(1,1,1).toSpherical()).z).toBeCloseTo(1)

        expect(Vector.fromSpherical(new Vector(1,-1,1).toSpherical()).x).toBeCloseTo(1)
        expect(Vector.fromSpherical(new Vector(1,-1,1).toSpherical()).y).toBeCloseTo(-1)
        expect(Vector.fromSpherical(new Vector(1,-1,1).toSpherical()).z).toBeCloseTo(1)
    })

    test('rotation', () => {
        expect(xhat.rotate(Math.PI / 2, 0).x).toBeCloseTo(zhat.x)
        expect(xhat.rotate(Math.PI / 2, 0).y).toBeCloseTo(zhat.y)
        expect(xhat.rotate(Math.PI / 2, 0).z).toBeCloseTo(zhat.z)

        expect(xhat.rotate(0, Math.PI / 2).x).toBeCloseTo(yhat.x)
        expect(xhat.rotate(0, Math.PI / 2).y).toBeCloseTo(yhat.y)
        expect(xhat.rotate(0, Math.PI / 2).z).toBeCloseTo(yhat.z)

        expect(yhat.rotate(0, -Math.PI / 2).x).toBeCloseTo(xhat.x)
        expect(yhat.rotate(0, -Math.PI / 2).y).toBeCloseTo(xhat.y)
        expect(yhat.rotate(0, -Math.PI / 2).z).toBeCloseTo(xhat.z)
    })

    test('cross product', () => {
        expect(xhat.cross(zhat)).toEqual(yhat)
    })

    test('reflection', () => {
        expect(new Vector(1,1,0).reflect(new Vector(0,-1,0))).toEqual(new Vector(1,-1,0))
        expect(new Vector(1,2,0).reflect(new Vector(0,-1,0))).toEqual(new Vector(1,-2,0))
    })
})