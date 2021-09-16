const app = new PIXI.Application({
	width: 800,
	height: 800,
	transparent: true
})
document.getElementById('stage').appendChild(app.view)

function uploadFile() {
	document.getElementById('previewImg').src = window.URL.createObjectURL(this.files[0])
	transformImgElementToSprite(this.files[0])
}

function appendToStage(child) {
	app.stage.addChild(child)
}
// 从一个普通的JavaScriptImage对象创建一个纹理
function transformImgElementToSprite(imgFile) {
	let imageEle = new Image()
	imageEle.src = window.URL.createObjectURL(imgFile)

	let base = new PIXI.BaseTexture(imageEle)
	let texture = new PIXI.Texture(base)
	let sprite = new PIXI.Sprite(texture)
	appendToStage(sprite)
}

document.getElementById('inputFile').addEventListener('change', uploadFile)
