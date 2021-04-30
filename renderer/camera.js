class Camera extends MyObject {
    constructor() {
        super()
        // 镜头在世界坐标系中的坐标
        this.position = Vector.new(config.camera_position_x.value, config.camera_position_y.value, config.camera_position_z.value)
        // 镜头看的地方
        this.target = Vector.new(config.camera_target_x.value, config.camera_target_y.value, config.camera_target_z.value)
        // 镜头向上的方向
        this.up = Vector.new(config.camera_up_x.value, config.camera_up_y.value, config.camera_up_z.value)
        this.positionToTarget = this.target.sub(this.position)
    }

    cosBetweenNormalAndCamera(v1, v2, v3) {
        let temp1 = v1.normal.add(v2.normal).add(v3.normal)
        let normal = Vector.new(temp1.x / 3, temp1.y / 3, temp1.z / 3)
        let cameraVector = this.positionToTarget
        return cameraVector.dot(normal) / (cameraVector.length() * normal.length())
    }
}