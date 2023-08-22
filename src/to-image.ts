import sharp from "sharp";
import { Color } from "./color";

export async function saveImage(pixels: Color[][], path: string) {
    const height = pixels.length
    const width = pixels[0].length
    const values = []
    for(const row of pixels) {
        for (const pixel of row) {
            values.push(Math.floor(pixel.r * 255))
            values.push(Math.floor(pixel.g * 255))
            values.push(Math.floor(pixel.b * 255))
        }
    }
    const image = sharp(Uint8Array.from(values), {
        raw: {
            width,
            height,
            channels: 3,
        },
    })
    return await image.toFile(path)
}

async function main() {
    await saveImage([[new Color(1,0,0), new Color(0,1,0), new Color(0,0,1)], [new Color(0,1,1), new Color(1,0,1), new Color(1,1,0)]], 'out/main.png')
}

if (require.main === module) {
    main()
}