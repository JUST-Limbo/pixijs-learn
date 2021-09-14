const app = new PIXI.Application({
	width: 800,
	height: 800,
	transparent: true
})
document.getElementById('stage').appendChild(app.view)

let container = new PIXI.Container()
container.name = 'container'

app.stage.addChild(container)

let cat = new PIXI.Sprite.fromImage('../images/cat.png')
cat.position.set(0, 0)
cat.width = 128
cat.height = 128
cat.name = 'cat'
cat.interactive = true

let borderline = new PIXI.Graphics()
borderline.name = 'borderline'
borderline.lineStyle(2, 0xaaaaaa)
borderline.drawRect(0, 0, 128, 128)
borderline.visible = true

let resizeBtn = new PIXI.Sprite.fromImage('../images/scale.png')
resizeBtn.name = 'resizeBtn'
resizeBtn.width = 32
resizeBtn.height = 32
resizeBtn.position.set(64, 0)
resizeBtn.interactive = true
resizeBtn.visible = true

let delBtn = new PIXI.Sprite.fromImage('../images/del.png')
delBtn.name = 'delBtn'
delBtn.width = 32
delBtn.height = 32
delBtn.interactive = true
delBtn.visible = true

let rotateBtn = new PIXI.Sprite.fromImage('../images/rotate.png')
rotateBtn.name = 'rotateBtn'
rotateBtn.width = 32
rotateBtn.height = 32
rotateBtn.interactive = true
rotateBtn.visible = true

let visibleBtn = new PIXI.Sprite.fromImage('../images/visible.png')
visibleBtn.name = 'visibleBtn'
visibleBtn.width = 32
visibleBtn.height = 32
visibleBtn.interactive = true
visibleBtn.visible = true

container.addChild(cat)
container.addChild(borderline)
container.addChild(resizeBtn)
container.addChild(delBtn)
container.addChild(rotateBtn)
container.addChild(visibleBtn)

container.pivot.set(container.getBounds().width / 2, container.getBounds().height / 2)
container.position.set(100, 100)

delBtn.position.set(container.getBounds().width - delBtn.width, 0)
resizeBtn.position.set(container.getBounds().width - resizeBtn.width, container.getBounds().height - resizeBtn.height)
visibleBtn.position.set(0, container.getBounds().height - visibleBtn.height)

console.log(container.width)
