class Image extends MyObject {
    constructor() {
        super()
        this.w = 256
        this.h = 256
        this.pixels = []
    }

    static fromImage(string) {
        let image = this.new()
        let [w, h] = string.split('\n').slice(2, 4)
        image.w = w
        image.h = h
        let formatted_list = string.split("\n").slice(4)
        for (let str of formatted_list) {
            let s = str.trim()
            if (s === "") {
                continue
            }
            let point_list = s.split(" ")
            for (let p of point_list) {
                let r = (p >>> 24) & 255
                let g = (p >>> 16) & 255
                let b = (p >>> 8) & 255
                let a = p & 255
                let pixel = [r, g, b, a]
                image.pixels.push(pixel)
            }
        }
        return image
    }

    color(u, v) {
        if (u < 0) {
            u = -u
        }
        if (u > 1) {
            u = 1
        }
        if (v < 0) {
            v = -v
        }
        if (v > 1) {
            v = 1
        }

        let int = Math.floor
        let x = int((this.w - 1) * u)
        let y = int((this.h - 1) * v)
        let i = int(x + y * this.w)
        let r = this.pixels[i][0]
        let g = this.pixels[i][1]
        let b = this.pixels[i][2]
        let a = this.pixels[i][3]
        return Color.new(r, g, b, a)
    }
}