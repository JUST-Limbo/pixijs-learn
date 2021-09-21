document.getElementById('stage').oncontextmenu = (e) => {
	e.preventDefault()
}
const menu = document.querySelector('.menu')
const menuHeight = menu.offsetHeight - parseInt(getComputedStyle(menu)['paddingTop']) - parseInt(getComputedStyle(menu)['paddingBottom'])
menu.style.height = '0'

const app = new PIXI.Application({
	width: 800,
	height: 800
})
// app.stage.interactive=true
// app.stage.on('mousedown', function () {
// 	closeMenu()
// })
app.view.addEventListener('click', closeMenu)

app.renderer.backgroundColor = 0x99ffff
document.getElementById('stage').appendChild(app.view)

document.getElementById('inputFile').addEventListener('change', importFileToStage)

let containerIndex = 0
let actionType = ''
let targetName = ''
let pointerDownTargetName = ''
let dragPointerStartPos = {
	x: 0,
	y: 0
}
let dragParentStartPos = {
	x: 0,
	y: 0
}
let resizeStartPosX = 0
let originDeg
let beginDeg = 0

function importFileToStage() {
	let container = new PIXI.Container()
	container.name = `imgContainer${containerIndex++}`
	container.interactive = true
	let img = new Image()
	img.src = window.URL.createObjectURL(this.files[0])
	img.onload = function () {
		let base = new PIXI.BaseTexture(img)
		let texture = new PIXI.Texture(base)
		let imgSprite = new PIXI.Sprite(texture)
		imgSprite.name = 'importImg'
		imgSprite.interactive = true
		imgSprite.cursor = 'move'
		imgSprite.on('pointerdown', pointerDown).on('pointermove', pointerMove).on('pointerup', pointerUp).on('rightclick', rightclick)
		container.addChild(imgSprite)

		let resizeBtn = new PIXI.Sprite.fromImage('../images/scale.png')
		resizeBtn.name = 'resizeBtn'
		resizeBtn.width = 15
		resizeBtn.height = 15
		resizeBtn.interactive = true
		resizeBtn.visible = true
		resizeBtn.cursor = 'se-resize'
		resizeBtn.position.set(container.getBounds().width - resizeBtn.width, container.getBounds().height - resizeBtn.height)
		resizeBtn.on('pointerdown', pointerDown).on('pointermove', pointerMove).on('pointerup', pointerUp).on('pointerupoutside', pointerUp)
		container.addChild(resizeBtn)

		let rotateBtn = new PIXI.Sprite.fromImage('../images/rotate.png')
		rotateBtn.name = 'rotateBtn'
		rotateBtn.width = 15
		rotateBtn.height = 15
		rotateBtn.interactive = true
		rotateBtn.visible = true
		rotateBtn.cursor = 'grab'
		rotateBtn.position.set(0, container.getBounds().height - rotateBtn.height)
		rotateBtn.on('pointerdown', pointerDown).on('pointermove', pointerMove).on('pointerup', pointerUp).on('pointerupoutside', pointerUp)
		container.addChild(rotateBtn)

		container.pivot.set(container.getBounds().width / 2, container.getBounds().height / 2)
		container.on('pointerover', pointerover).on('pointerout', pointerout)
	}
	appendToStage(container)
}

function pointerDown(e) {
	// drag
	if (this.name == 'importImg') {
		targetName = this.parent.name
		pointerDownTargetName = this.name
		dragPointerStartPos = {
			x: e.data.global.x,
			y: e.data.global.y
		}
		dragParentStartPos = {
			x: this.parent.getGlobalPosition().x,
			y: this.parent.getGlobalPosition().y
		}
	} else if (this.name == 'resizeBtn') {
		targetName = this.parent.name
		pointerDownTargetName = this.name
		resizeStartPosX = e.data.global.x
	} else if (this.name == 'rotateBtn') {
		targetName = this.parent.name
		pointerDownTargetName = this.name
		dragPointerStartPos = {
			x: e.data.global.x,
			y: e.data.global.y
		}
		let ex = dragPointerStartPos.x - this.parent.position.x
		let ey = dragPointerStartPos.y - this.parent.position.y
		originDeg = (360 * Math.atan(ey / ex)) / (2 * Math.PI)
		if (ex < 0) {
			originDeg += 180
		} else if (ey < 0) {
			originDeg += 360
		}
	}
}

function pointerMove(e) {
	if (this.parent.name !== targetName || this.name !== pointerDownTargetName) return
	if (this.name == 'importImg') {
		this.parent.alpha = 0.5
		let currentPointerPos = {
			x: e.data.global.x,
			y: e.data.global.y
		}
		this.parent.position.set(dragParentStartPos.x + (currentPointerPos.x - dragPointerStartPos.x), dragParentStartPos.y + (currentPointerPos.y - dragPointerStartPos.y))
	} else if (this.name == 'resizeBtn') {
		this.parent.alpha = 0.5
		let tempPosX = e.data.global.x
		let dur = Math.abs(tempPosX - this.parent.position.x) - Math.abs(resizeStartPosX - this.parent.position.x)
		resizeStartPosX = tempPosX
		if (dur > 0) {
			//放大
			let scale1 = this.parent.scale.x + 0.03
			this.parent.scale.set(scale1, scale1)
		} else if (dur < 0) {
			//缩小
			let sclae2 = this.parent.scale.x - 0.03
			this.parent.scale.set(sclae2, sclae2)
		}
	} else if (this.name == 'rotateBtn') {
		this.parent.alpha = 0.5
		let tempPos = {
			x: e.data.global.x,
			y: e.data.global.y
		}
		let ex = tempPos.x - this.parent.position.x
		let ey = tempPos.y - this.parent.position.y
		moveDeg = (360 * Math.atan(ey / ex)) / (2 * Math.PI)
		if (ex < 0) {
			moveDeg += 180
		} else if (ey < 0) {
			moveDeg += 360
		}
		let includedAngle = moveDeg - originDeg
		includedAngle = (includedAngle / 360) * (2 * Math.PI) // 弧度
		this.parent.rotation = beginDeg + includedAngle
	}
}

function pointerUp() {
	if (this.parent.name !== targetName || this.name !== pointerDownTargetName) return
	if (this.name == 'importImg') {
		let containerArr = app.stage.children
		let nearestContainer
		let nearestDistance
		containerArr.forEach((item, index, arr) => {
			if (item.name == this.parent.name) return
			let distance = calcDistance(this.parent.position, item.position)
			if (distance < item.width / 2) {
				if (nearestDistance == undefined) {
					nearestContainer = item
					nearestDistance = distance
				} else if (distance < nearestDistance) {
					nearestContainer = item
					nearestDistance = distance
				}
			}
		})
		if (nearestContainer && nearestDistance) {
			this.parent.position.set(nearestContainer.position.x, nearestContainer.position.y)
		}
	} else if (this.name == 'rotateBtn') {
		beginDeg = this.parent.rotation
	}
	targetName = ''
	pointerDownTargetName = ''
}

function rightclick(e) {
	openMenu(e.data.global.x, e.data.global.y)
}

function pointerover() {
	this.alpha = 0.5
}

function pointerout() {
	this.alpha = 1
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

function calcDistance(a, b) {
	let distance
	distance = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
	return distance
}

function openMenu(x, y) {
	menu.style.left = `${x}px`
	menu.style.top = `${y + 5}px`
	menu.style.height = `${menuHeight}px`
	menu.classList.add('is-active')
}
function closeMenu() {
	menu.style.height = '0'
	menu.classList.remove('is-active')
}
