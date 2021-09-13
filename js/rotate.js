const app = new PIXI.Application({
	width: 800,
	height: 800,
	transparent: true
})
document.getElementById('stage').appendChild(app.view)

let container = new PIXI.Container()
container.name = 'container'
container.position.set(100, 300)
container.width = 150
container.height = 150
container.pivot.x = 75
container.pivot.y = 75
container.interactive = true
// app.ticker.add(function (delta) {
// 	container.rotation -= 0.01 * delta
// })
let cat = new PIXI.Sprite.fromImage('../images/xx.png')
cat.width = 150
cat.height = 150
// cat.position.set(30, 30)
cat.name = 'cat'
cat.interactive = true

// let borderline = new PIXI.Graphics()
// borderline.name = 'borderline'
// borderline.lineStyle(1, 0xaaaaaa)
// borderline.drawRoundedRect(0, 0, 120, 120, 10)
// borderline.visible = false

// let resizeBtn = new PIXI.Sprite.fromImage('../images/btn-resize.png')
// resizeBtn.name = 'resizeBtn'
// resizeBtn.width = 30
// resizeBtn.height = 30
// resizeBtn.position.set(90, 0)
// resizeBtn.interactive = true
// resizeBtn.visible = false

// let delBtn = new PIXI.Sprite.fromImage('../images/btn-del.png')
// delBtn.name = 'delBtn'
// delBtn.width = 30
// delBtn.height = 30
// delBtn.interactive = true
// delBtn.visible = false

container.addChild(cat)
// container.addChild(borderline)
// container.addChild(resizeBtn)
// container.addChild(delBtn)

//拖拽
container.on('pointerdown', catPointerDown).on('pointermove', catPointerMove).on('pointerup', pointerUp)
let startPos = {
	x: 0,
	y: 0
}
let objPos = {
	x: 0,
	y: 0
}
let targetName = ''
let rotatePosition = {
	x: 100,
	y: 300
}
let originDeg
let moveDeg
function catPointerDown(e) {
  targetName=this.name
	// console.log(`旋转中心坐标(${container.getGlobalPosition().x + container.width / 2}, ${container.getGlobalPosition().y + container.height / 2})`)
	// console.log(e)
	console.log(e.data.global)
	console.log(rotatePosition)
	startPos = {
		x: e.data.global.x,
		y: e.data.global.y
	}
	let ex = startPos.x - rotatePosition.x
	let ey = startPos.y - rotatePosition.y
	originDeg = (360 * Math.atan(ey / ex)) / (2 * Math.PI)
	if (ex < 0) {
		originDeg += 180
	} else if (ey < 0) {
		originDeg += 360
	}
	// console.log(originDeg)
}
function catPointerMove(e) {
  if(targetName!==this.name) return
	let tempPos = {
		x: e.data.global.x,
		y: e.data.global.y
	}
	let ex = tempPos.x - rotatePosition.x
	let ey = tempPos.y - rotatePosition.y
	moveDeg = (360 * Math.atan(ey / ex)) / (2 * Math.PI)
	if (ex < 0) {
		moveDeg += 180
	} else if (ey < 0) {
		moveDeg += 360
	}
	// console.log(moveDeg)
	let includedAngle = moveDeg - originDeg
  includedAngle = (includedAngle/360)*(2* Math.PI)
  console.log(includedAngle)
  container.rotation=includedAngle
}
function pointerUp(e) {
	targetName = ''
}


app.stage.addChild(container)
