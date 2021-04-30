const __main = function() {
    const bindEvents = () => {
        _e('#buttonLight').addEventListener('click', () => {
            canvas.lightSwitch = !canvas.lightSwitch
        })
        _e('#buttonEarth').addEventListener('click', () => {
            mesh = sphere
        })
        _e('#buttonSnowman').addEventListener('click', () => {
            mesh = snowman
        })
        _e('#buttonStone').addEventListener('click', () => {
            mesh = stone
        })
        _e('#buttonFrostmourne').addEventListener('click', () => {
            mesh = frostmourne
        })
        _e('#buttonChest').addEventListener('click', () => {
            mesh = chest
        })
    }

    initSliders()
    bindEvents()
    let sphere = Mesh.sphere()
    sphere.texture = Image.fromImage(earthTexture)
    let snowman = Mesh.from3dModel(snowmanModel)
    snowman.texture = Image.fromImage(snowmanTexture)
    let stone = Mesh.from3dModel(stoneModel)
    stone.texture = Image.fromImage(stoneTexture)
    let frostmourne = Mesh.from3dModel(frostmourneModel)
    frostmourne.texture = Image.fromImage(frostmourneTexture)
    let chest = Mesh.from3dModel(chestModel)
    chest.texture = Image.fromImage(chestTexture)

    let mesh = sphere
    let canvas = Canvas.new('#id-canvas')
    canvas.drawMesh(mesh)
    canvas.render()

    requestAnimationFrame(function() {
        canvas.clear()

        canvas.camera = Camera.new()
        mesh.rotation.x = config.rotation_x.value
        mesh.rotation.y = config.rotation_y.value
        mesh.rotation.z = config.rotation_z.value
        canvas.light.x = config.light_x.value
        canvas.light.y = config.light_y.value
        canvas.light.z = config.light_z.value

        canvas.drawMesh(mesh)
        canvas.render()
        requestAnimationFrame(arguments.callee)
    })
}

__main()