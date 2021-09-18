const app = new PIXI.Application({
	width: 800,
	height: 800
})
app.renderer.backgroundColor = 0x99ffff
document.getElementById('stage').appendChild(app.view)

document.getElementById('inputFile').addEventListener('change', uploadFileToStage)

let containerIndex = 0
let actionType = ''
let targetName = ''
let currentTargetName = ''
let dragPointerStartPos = {
	x: 0,
	y: 0
}
let dragParentStartPos = {
	x: 0,
	y: 0
}

function uploadFileToStage() {
	let imgSprite = transformImgFileToSprite(this.files[0])
	let container = new PIXI.Container()
	container.name = `imgContainer${containerIndex++}`
	container.interactive = true
	// container.on('pointerdown', pointerDown).on('pointerup', pointerUp)
	container.addChild(imgSprite)
	appendToStage(container)
}

// 从一个普通的JavaScriptImage对象创建一个纹理
function transformImgFileToSprite(imgFile) {
	let imageEle = new Image()
	imageEle.src = window.URL.createObjectURL(imgFile)
	let base = new PIXI.BaseTexture(imageEle)
	let texture = new PIXI.Texture(base)
	let sprite = new PIXI.Sprite(texture)
	sprite.name = 'importImg'
	sprite.interactive = true
	sprite.cursor = 'move'
	sprite.on('pointerdown', pointerDown).on('pointermove', pointerMove).on('pointerup', pointerUp)
	return sprite
}

function pointerDown(e) {
	console.log(this)
	if (this.name == 'importImg') {
		targetName = this.parent.name
		dragPointerStartPos = {
			x: e.data.global.x,
			y: e.data.global.y
		}
		dragParentStartPos = {
			x: this.parent.getGlobalPosition().x,
			y: this.parent.getGlobalPosition().y
		}
	}
}

function pointerMove(e) {
	if (this.parent.name == targetName) {
		let currentPointerPos = {
			x: e.data.global.x,
			y: e.data.global.y
		}
		this.parent.position.set(dragParentStartPos.x + (currentPointerPos.x - dragPointerStartPos.x), dragParentStartPos.y + (currentPointerPos.y - dragPointerStartPos.y))
	}
}

function pointerUp() {
	targetName = ''
}

function appendToStage(child) {
	app.stage.addChild(child)
}

function exportStage() {
	if (!app.stage.height || !app.stage.width) {
		console.log('stage 宽*高=0')
		return
	}
	let dataURL = app.renderer.plugins.extract.base64(app.stage) // app.stage宽高有0时运行至此处会报错
	downloadImage(dataURL)
}

function exportCanvasImg() {
	app.render()
	let dataURL = app.view.toDataURL('image/png')
	downloadImage(dataURL)
}

function downloadImage(dataURL) {
	let a = document.createElement('a') // 创建一个a节点
	a.download = '目标下载图片的文件名' // 设置a节点的download属性值
	a.href = dataURL
	let event = new MouseEvent('click')
	a.dispatchEvent(event)
}
