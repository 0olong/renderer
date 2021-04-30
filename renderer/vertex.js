class Vertex extends MyObject {
    constructor(position, u = 0, v = 0, normal = Vector.new(0, 0, 0), color = Color.randomColor(), intensity = 1) {
        super()
        this.position = position
        this.u = u
        this.v = v
        this.normal = normal
        this.color = color
        this.intensity = intensity
    }

    interpolate(other, factor) {
        let a = this
        let b = other
        let p = a.position.interpolate(b.position, factor)
        let u = interpolate(a.u, b.u, factor)
        let v = interpolate(a.v, b.v, factor)
        let n = a.normal.interpolate(b.normal, factor)
        let c = a.color.interpolate(b.color, factor)
        let i = a.intensity
        return Vertex.new(p, u, v, n, c, i)
    }

    static calculateIntensity(v1, v2, v3, light) {
        let a = v1
        let b = v2
        let c = v3
        // log('calculateIntensity', a, b, c)
        // 计算法向量
        let temp1 = a.normal.add(b.normal).add(c.normal)
        let normal = Vector.new(temp1.x / 3, temp1.y / 3, temp1.z / 3)
        // 计算重心
        let temp2 = a.position.add(b.position).add(c.position)
        let center = Vector.new(temp2.x / 3, temp2.y / 3, temp2.z / 3)
        // 入射光向量
        let incident = center.sub(light)
        // 计算入射角（光强度）
        let intensity = incident.dot(normal) / (incident.length() * normal.length())
        a.intensity = intensity
        b.intensity = intensity
        c.intensity = intensity
        // log(a, b, c)
        return [a, b, c]
    }

    static defaultIntensity(v1, v2, v3) {
        let a = v1
        let b = v2
        let c = v3
        a.intensity = 1
        b.intensity = 1
        c.intensity = 1
        return [a, b, c]
    }
}