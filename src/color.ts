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

    // simulate a material with this color absorbing and re-emitting light with the given color,
    // like white contains all colors, black contains none, and other colors are mixtures of red, green, and blue light
    reflect(lightColor: Color): Color {
        return new Color(this.r * lightColor.r, this.g * lightColor.g, this.b * lightColor.b)
    }
}

export function averageColor(colors: Color[]) {
    let r = 0
    let g = 0
    let b = 0
    for(const color of colors) {
        r += color.r * color.r
        g += color.g * color.g
        b += color.b * color.b
    }
    r /= colors.length
    g /= colors.length
    b /= colors.length
    r = Math.sqrt(r)
    g = Math.sqrt(g)
    b = Math.sqrt(b)
    return new Color(r,g,b)
}