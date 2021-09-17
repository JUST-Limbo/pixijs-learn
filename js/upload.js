const app = new PIXI.Application({
	width: 800,
	height: 800
})
app.renderer.backgroundColor = 0x061639
document.getElementById('stage').appendChild(app.view)

function appendToStage(child) {
	app.stage.addChild(child)
}

// 从一个普通的JavaScriptImage对象创建一个纹理
function transformImgFileToSprite(imgFile) {
	let imageEle = new Image()
	imageEle.src = window.URL.createObjectURL(imgFile)
	let base = new PIXI.BaseTexture(imageEle)
	let texture = new PIXI.Texture(base)
	let sprite = new PIXI.Sprite(texture)

	// 释放一个之前已经存在的、通过调用 URL.createObjectURL() 创建的 URL 对象
	// setTimeout(() => {
	// 	window.URL.revokeObjectURL(imageEle.src)
	// }, 0)

	return sprite
}

function uploadFileToStage() {
	// document.getElementById('previewImg').src = window.URL.createObjectURL(this.files[0])
	let imgSprite = transformImgFileToSprite(this.files[0])
	appendToStage(imgSprite)
}

document.getElementById('inputFile').addEventListener('change', uploadFileToStage)

function exportImg() {
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
