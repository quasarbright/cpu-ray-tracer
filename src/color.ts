export class Color {
    // from 0 to 1
    readonly r: number
    readonly g: number
    readonly b: number
    constructor(r: number, g: number, b: number) {
        this.r = r
        this.g = g
        this.b = b
    }

    // https://www.30secondsofcode.org/js/s/hsb-to-rgb/
    static fromHSB(h: number, s: number, b: number) {
        h *= 360
        const k = (n: number) => (n + h / 60) % 6;
        const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
        return new Color(f(5), f(3), f(1));
   }
}