class Canvas extends MyObject {
    constructor(selector) {
        super()
        this.canvas = _e(selector)
        this.context = this.canvas.getContext('2d')
        this.w = this.canvas.width
        this.h = this.canvas.height
        this.pixels = this.context.getImageData(0, 0, this.w, this.h)
        this.bytesPerPixel = 4
        this.initZ = Number.MAX_SAFE_INTEGER
        this.depth = new Array(this.w * this.h * this.bytesPerPixel).fill(this.initZ)
        this.camera = Camera.new()
        this.texture = null
        this.backgroundColor = Color.black()
        this.light = Vector.new(config.light_x.value, config.light_y.value, config.light_z.value)
        this.lightSwitch = false
    }

    render() {
        let {pixels, context} = this
        context.putImageData(pixels, 0, 0)
    }

    clear(color = this.backgroundColor) {
        let {w, h} = this
        this.depth = new Array(this.w * this.h * this.bytesPerPixel).fill(this.initZ)
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                this._setPixel(x, y, this.initZ, color)
            }
        }
        this.render()
    }

    _setPixel(x, y, z, color) {
        let int = Math.round
        x = int(x)
        y = int(y)

        let i = (y * this.w + x) * this.bytesPerPixel
        if (this.depth[i] === this.initZ || this.depth[i] > z) {

            let p = this.pixels.data
            let {r, g, b, a} = color

            p[i] = r
            p[i + 1] = g
            p[i + 2] = b
            p[i + 3] = a

            this.depth[i] = z
        }
    }

    drawPoint(point, color = Color.black()) {
        let {w, h} = this
        let {x, y, z} = point
        x = Math.round(x)
        y = Math.round(y)
        if (x >= 0 && x <= w) {
            if (y >= 0 && y <= h) {
                let c = Color.mix(color, this.backgroundColor)
                this._setPixel(x, y, z, c)
            }
        }
    }

    drawLine(p1, p2, color = Color.black()) {
        let [x1, y1, x2, y2, z1, z2] = [p1.x, p1.y, p2.x, p2.y, p1.z, p2.z]
        let dx = x2 - x1
        let dy = y2 - y1
        let R = (dx ** 2 + dy ** 2) ** 0.5
        let ratio = dx === 0 ? undefined : dy / dx
        let angle
        if (ratio === undefined) {
            const p = Math.PI / 2
            angle = dy >= 0 ? p : -p
        } else {
            const t = Math.abs(dy / R)
            const sin = ratio >= 0 ? t : -t
            const asin = Math.asin(sin)
            angle = dx > 0 ? asin : asin + Math.PI
        }
        for (let r = 0; r <= R; r++) {
            const x = x1 + Math.cos(angle) * r
            const y = y1 + Math.sin(angle) * r
            // this.drawPoint(Vector.new(x, y), color)
            const z = z1 + (z2 - z1) * (r / R) - 0.0001
            this.drawPoint(Vector.new(x, y, z), color)
        }
    }

    drawScanline(v1, v2, texture) {
        let [a, b] = [v1, v2].sort((va, vb) => va.position.x - vb.position.x)
        let x1 = a.position.x
        let x2 = b.position.x
        let y = a.position.y
        for (let x = x1; x <= x2; x++) {
            let factor = 0
            if (x2 !== x1) {
                factor = (x - x1) / (x2 - x1)
            }
            if (texture) {
                let {position: {z}, c, u, v} = a.interpolate(b, factor)
                c = texture.color(u, v).cos(a.intensity)
                this.drawPoint(Vector.new(x, y, z), c)
            } else {
                let c = a.color.interpolate(b.color, factor).cos(a.intensity)
                let p = a.position.interpolate(b.position, factor)
                this.drawPoint(p, c)
            }

        }
    }

    drawTriangle(v1, v2, v3, texture) {
        let [a, b, c] = [v1, v2, v3].sort((va, vb) => va.position.y - vb.position.y)
        // log('drawTriangle', a, b, c)
        let middle_factor = 0
        if (c.position.y - a.position.y !== 0) {
            middle_factor = (b.position.y - a.position.y) / (c.position.y - a.position.y)
        }
        let middle = a.interpolate(c, middle_factor)
        let start_y = a.position.y
        let end_y = b.position.y
        for (let y = start_y; y <= end_y; y++) {
            let factor = 0
            if (end_y !== start_y) {
                factor = (y - start_y) / (end_y - start_y)
            }
            let va = a.interpolate(middle, factor)
            let vb = a.interpolate(b, factor)
            // log(va.position, vb.position)
            this.drawScanline(va, vb, texture)
        }
        start_y = b.position.y
        end_y = c.position.y
        for (let y = start_y; y <= end_y; y++) {
            let factor = 0
            if (end_y !== start_y) {
                factor = (y - start_y) / (end_y - start_y)
            }
            let va = middle.interpolate(c, factor)
            let vb = b.interpolate(c, factor)
            // log(va.position, vb.position)
            this.drawScanline(va, vb, texture)
        }
    }

    drawLineOfTriangle(v1, v2, v3) {
        this.drawLine(v1.position, v2.position)
        this.drawLine(v1.position, v3.position)
        this.drawLine(v2.position, v3.position)
    }

    project(coordVector, transformMatrix) {
        let {w, h} = this
        let [w2, h2] = [w / 2, h / 2]
        // log('project transformMatrix', transformMatrix, coordVector)
        let point = transformMatrix.transform(coordVector.position)
        let x = point.x * w2 + w2
        let y = -point.y * h2 + h2
        let z = point.z
        // let v = Vector.new(x, y, coordVector.position.z)
        let v = Vector.new(x, y, z)
        return Vertex.new(v, coordVector.u, coordVector.v, coordVector.normal, coordVector.color, coordVector.intensity)
    }

    drawMesh(mesh) {
        let self = this
        // camera
        let {w, h} = this
        let {position, target, up} = self.camera
        let view = Matrix.lookAtLH(position, target, up)
        // field of view
        let projection = Matrix.perspectiveFovLH(0.8, w / h, 0.1, 1)
        // 得到 mesh 中点在世界中的坐标
        let rotation = Matrix.rotation(mesh.rotation)
        let translation = Matrix.translation(mesh.position)
        let world = rotation.multiply(translation)
        let transform = world.multiply(view).multiply(projection)
        let light = world.transform(this.light)
        if (mesh.triangles.length !== 0) {
            for (let t of mesh.triangles) {
                // 拿到三角形的三个顶点
                let [a, b, c] = t
                // 拿到屏幕上的 3 个像素点
                let [v1, v2, v3] = [a, b, c].map(v => self.project(v, transform))
                self.drawTriangle(v1, v2, v3, mesh.texture)
                self.drawLineOfTriangle(v1, v2, v3)
            }
        } else {
            for (let t of mesh.indices) {
                let [a, b, c] = t.map(i => mesh.vertices[i])
                let v1, v2, v3
                if (this.lightSwitch) {
                    let [v4, v5, v6] = Vertex.calculateIntensity(a, b, c, light);
                    [v1, v2, v3] = [v4, v5, v6].map(v => self.project(v, transform))
                } else {
                    let [v4, v5, v6] = Vertex.defaultIntensity(a, b, c);
                    [v1, v2, v3] = [a, b, c].map(v => self.project(v, transform))
                }
                self.drawTriangle(v1, v2, v3, mesh.texture)
                // 背面剔除
                // let angle = this.camera.cosBetweenNormalAndCamera(v1, v2, v3)
                // if (angle < 0) {
                //     self.drawTriangle(v1, v2, v3, mesh.texture)
                //     // self.drawLineOfTriangle(v1, v2, v3)
                // }
            }
        }

    }

    drawImage(image) {
        let p = image.pixels
        let int = Math.floor
        for (let i = 0; i < p.length; i++) {
            let x = i % image.w
            let y = int(i / image.w)
            let r = p[i][0]
            let g = p[i][1]
            let b = p[i][2]
            let a = p[i][3]
            let color = Color.new(r, g, b, a)
            let v = Vector.new(x, y, 1)
            this.drawPoint(v, color)
        }
    }

    __debug_draw_demo() {
        let {context, pixels} = this
        let data = pixels.data
        for (let i = 0; i < data.length; i += 4) {
            let [r, g, b, a] = data.slice(i, i + 4)
            r = 255
            a = 255
            data[i] = r
            data[i + 3] = a
        }
        context.putImageData(pixels, 0, 0)
    }
}
