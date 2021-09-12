const app = new PIXI.Application({
	width: 1000,
	height: 1000,
	transparent: true
})
document.getElementById('stage').appendChild(app.view)

let container = new PIXI.Container()
container.position.set(200, 200)
container.width = 150
container.height = 150

let cat = new PIXI.Sprite.fromImage('../images/cat.png')
cat.position.set(30, 30)
cat.name = 'cat'
cat.interactive = true

let borderline = new PIXI.Graphics()
borderline.name = 'borderline'
borderline.lineStyle(1, 0xaaaaaa)
borderline.drawRoundedRect(0, 0, 120, 120, 10)
borderline.visible = false

let resizeBtn = new PIXI.Sprite.fromImage('../images/btn-resize.png')
resizeBtn.name = 'resizeBtn'
resizeBtn.width = 30
resizeBtn.height = 30
resizeBtn.position.set(90, 0)
resizeBtn.interactive = true
resizeBtn.visible = false

let delBtn = new PIXI.Sprite.fromImage('../images/btn-del.png')
delBtn.name = 'delBtn'
delBtn.width = 30
delBtn.height = 30
delBtn.interactive = true
delBtn.visible = false

container.addChild(cat)
container.addChild(borderline)
container.addChild(resizeBtn)
container.addChild(delBtn)

cat.on('touchstart', catTouchStart).on('touchmove', catTouchMove).on('touchend', catTouchEnd)
//拖拽
let startPos = {
	x: 0,
	y: 0
}
let objPos = {
	x: 0,
	y: 0
}
function catTouchStart(e) {
	this.parent.children[1].visible = true
	this.parent.children[2].visible = true
	this.parent.children[3].visible = true
}
function catTouchMove(e) {}
function catTouchEnd(e) {}
app.stage.addChild(container)
