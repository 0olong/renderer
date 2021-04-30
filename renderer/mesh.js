class Mesh extends MyObject {
    constructor() {
        super()
        this.position = Vector.new(0, 0, 0)
        this.rotation = Vector.new(0, 0, 0)
        // this.scale = Vector.new(1, 1, 1)
        this.triangles = []
        this.vertices = []
        this.indices = []
        this.texture = null
    }

    static from3dModel(string) {
        let splitList = string.split("\n")
        let mesh = this.new()
        let triangles = []
        if (string.indexOf('vertices') !== -1) {
            let numberOfVertices = parseInt(splitList[2].split(" ")[1])
            let formattedList = splitList.slice(4)
            let verticesList = formattedList.slice(0, numberOfVertices)
            let indicesList = formattedList.slice(numberOfVertices)
            for (let vertices of verticesList) {
                let buffer = vertices.split(" ")
                let [x, y, z, nx, ny, nz, u, v] = buffer.map(i => parseFloat(i))
                let vector = Vector.new(x, y, z)
                let normal = Vector.new(nx, ny, nz)
                let color = Color.black()
                let vertex = Vertex.new(vector, u, v, normal, color)
                mesh.vertices.push(vertex)
            }
            for (let i of indicesList) {
                let index = i.split(" ").map(x => parseInt(x))
                mesh.indices.push(index)
            }
            // log('from3dModel mesh.indices', mesh.indices)
        } else {
            let formattedList = splitList.slice(3)
            for (let str of formattedList) {
                let s = str.trim()
                if (s === "") {
                    continue
                }
                let pointList = s.split("#")
                for (let p of pointList) {
                    let buffer = p.split(" ")
                    if (buffer.length === 5) {
                        let [x, y, z, u, v] = buffer.map(i => parseFloat(i))
                        let vector = Vector.new(x, y, z)
                        let vertex = Vertex.new(vector, u, v)
                        triangles.push(vertex)
                    } else if (buffer.length === 3) {
                        let [x, y, z] = buffer.map(i => parseFloat(i))
                        let vector = Vector.new(x, y, z)
                        // let color = Color.grey()
                        let vertex = Vertex.new(vector)
                        triangles.push(vertex)
                    }
                }
            }
            for (let i = 0; i < triangles.length; i += 3) {
                mesh.triangles.push(triangles.slice(i, i + 3))
            }
        }

        return mesh
    }

    static cube() {
        // 8 points
        let points = [
            -1, 1, -1,     // 0
            1, 1, -1,     // 1
            -1, -1, -1,     // 2
            1, -1, -1,     // 3
            -1, 1, 1,      // 4
            1, 1, 1,      // 5
            -1, -1, 1,      // 6
            1, -1, 1,      // 7
        ]

        let vertices = []
        for (let i = 0; i < points.length; i += 3) {
            let v = Vector.new(points[i], points[i + 1], points[i + 2])
            vertices.push(Vertex.new(v))
        }

        // 12 triangles * 3 vertices each = 36 vertex indices
        let indices = [
            // 12
            [0, 1, 2],
            [1, 3, 2],
            [1, 7, 3],
            [1, 5, 7],
            [5, 6, 7],
            [5, 4, 6],
            [4, 0, 6],
            [0, 2, 6],
            [0, 4, 5],
            [5, 1, 0],
            [2, 3, 7],
            [2, 7, 6],
        ]
        let m = this.new()
        m.vertices = vertices
        m.indices = indices
        return m
    }

    static sphere(h = 16) {
        let m = this.new()
        let vertices = []
        let indices = []
        let w = 2 * h
        let r = 1
        let color = Color.white()
        let index = 0
        let grid = []
        let pi = Math.PI
        for (let iy = 0; iy <= h; iy++) {
            let v = iy / h
            let row = []
            for (let ix = 0; ix <= w; ix++) {
                let u = ix / w
                let x = -r * Math.cos(u * 2 * pi) * Math.sin(v * pi)
                let y = r * Math.cos(v * pi)
                let z = r * Math.sin(u * 2 * pi) * Math.sin(v * pi)
                let p = Vector.new(x, y, z)
                let n = p.normalize()
                let vertex = Vertex.new(p, u, v, n, color)
                vertices.push(vertex)
                row.push(index)
                index++
            }
            grid.push(row)
        }
        for (let iy = 0; iy < h; iy++) {
            for (let ix = 0; ix < w; ix++) {
                let a = grid[iy][ix + 1]
                let b = grid[iy][ix]
                let c = grid[iy + 1][ix]
                let d = grid[iy + 1][ix + 1]

                if (iy !== 0) {
                    indices.push([a, b, d])
                }

                if (iy !== h - 1) {
                    indices.push([b, c, d])
                }
            }
        }
        m.vertices = vertices
        m.indices = indices

        return m
    }
}
