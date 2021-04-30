class Color extends MyObject {
    constructor(r, g, b, a) {
        super()
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }

    interpolate(other, factor) {
        let c1 = this
        let c2 = other
        let r = c1.r + (c2.r - c1.r) * factor
        let g = c1.g + (c2.g - c1.g) * factor
        let b = c1.b + (c2.b - c1.b) * factor
        let a = c1.a + (c2.a - c1.a) * factor
        return Color.new(r, g, b, a)
    }

    cos(cos) {
        if (cos > 0) {
            let r = cos * this.r
            let g = cos * this.g
            let b = cos * this.b
            let a = this.a
            return Color.new(r, g, b, a)
        } else {
            return Color.new(0, 0, 0, this.a)
        }
    }

    static randomColor() {
        return this.new(random01(), random01(), random01(), random01())
    }

    static black() {
        return this.new(0, 0, 0, 255)
    }

    static white() {
        return this.new(255, 255, 255, 255)
    }

    static grey() {
        return this.new(128, 128, 128, 1)
    }

    static transparent() {
        return this.new(0, 0, 0, 0)
    }

    static red() {
        return this.new(255, 0, 0, 255)
    }

    static green() {
        return this.new(0, 255, 0, 255)
    }

    static blue() {
        return this.new(0, 0, 255, 255)
    }

    static mix(c1, c2) {
        let alpha1 = c1.a / 255
        let alpha2 = c2.a / 255
        let alpha = 1 - (1 - alpha1) * (1 - alpha2)

        let r = (1 - alpha) * c2.r + alpha * c1.r
        let g = (1 - alpha) * c2.g + alpha * c1.g
        let b = (1 - alpha) * c2.b + alpha * c1.b

        return Color.new(r, g, b, alpha * 255)
    }
}
