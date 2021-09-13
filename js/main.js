const app = new PIXI.Application({
	width: 800,
	height: 800,
	transparent: true
})
document.getElementById('stage').appendChild(app.view)

let container = new PIXI.Container()
container.name = 'container'
container.position.set(0, 0)
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

//拖拽
cat.on('pointerdown', catPointerDown).on('pointermove', catPointerMove).on('pointerup', pointerUp)
let startPos = {
	x: 0,
	y: 0
}
let objPos = {
	x: 0,
	y: 0
}
let targetName = ''
function catPointerDown(e) {
  console.log(this.parent)
	targetName = this.parent.name
	this.parent.children[1].visible = true
	this.parent.children[2].visible = true
	this.parent.children[3].visible = true

	startPos = {
		x: e.data.global.x,
		y: e.data.global.y
	}

	objPos = {
		x: this.parent.getGlobalPosition().x,
		y: this.parent.getGlobalPosition().y
	}
}
function catPointerMove(e) {
	// console.log(e)
	if (this.parent.name == targetName) {
		let tempPos = {
			x: e.data.global.x,
			y: e.data.global.y
		}

		this.parent.position.set(objPos.x + (tempPos.x - startPos.x), objPos.y + (tempPos.y - startPos.y))
	}
}
function pointerUp(e) {
	targetName = ''
}

// 缩放
resizeBtn.on('pointerdown', resizePointerDown).on('pointermove', resizePointerMove).on('pointerup', pointerUp).on('pointerupoutside', pointerUp)

let resizeStartPosX = 0

function resizePointerDown(e) {
	if (this.name == 'resizeBtn') {
		targetName = 'resizeBtn'
		resizeStartPosX = e.data.global.x
	}
}
function resizePointerMove(e) {
	if (this.name == 'resizeBtn' && targetName == 'resizeBtn') {
		let tempPosX = e.data.global.x

		let dur = tempPosX - resizeStartPosX
		resizeStartPosX = tempPosX

		if (dur > 0) {
			//放大
			let scale1 = app.stage.getChildByName('container').scale.x + 0.03
			if (app.stage.getChildByName('container').scale.x <= 1.5) {
				app.stage.getChildByName('container').scale.set(scale1, scale1)
			}
		}

		if (dur < 0) {
			//缩小
			if (app.stage.getChildByName('container').scale.x >= 0.4) {
				let sclae2 = app.stage.getChildByName('container').scale.x - 0.03
				app.stage.getChildByName('container').scale.set(sclae2, sclae2)
			}
		}
	}
}
app.stage.addChild(container)
