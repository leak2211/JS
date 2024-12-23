let brushSize, colorPicker, eraserBtn, saveBtn, penBtn, shapeBtn, backgroundBtn, shapeSelect, shapeOptions
let currentColor = '#000000'
let currentBrushSize = 5
let erasing = false
let selectMode = 0
let previousMouseX, previousMouseY
let startX, startY
let savedCanvas
let earseAllBtn

function setup() {
    let canvas = createCanvas(800, 600)
    canvas.parent('canvasContainer')
    background(255)
    brushSize = select('#brushSize')
    colorPicker = select('#colorPicker')
    eraserBtn = select('#eraser')
    saveBtn = select('#saveBtn')
    penBtn = select('#penBtn')
    shapeBtn = select('#shapeBtn')
    backgroundBtn = select('#backgroundBtn')
    earseAllBtn = select('#earseAllBtn')
    shapeOptions = select('#shapeOptions')
    shapeSelect = select('#shapeSelect')
    brushSize.input(() => currentBrushSize = brushSize.value())
    colorPicker.input(() => {
        currentColor = colorPicker.value()
        erasing = false
    })
    eraserBtn.mousePressed(() => {
        erasing = true
        selectMode = 0
        shapeOptions.style('display', 'none')
    })
    penBtn.mousePressed(() => {
        selectMode = 0
        erasing = false
        shapeOptions.style('display', 'none')
    })
    shapeBtn.mousePressed(() => {
        selectMode = 1
        erasing = false
        shapeOptions.style('display', 'flex')
    })
    backgroundBtn.mousePressed(() => {
        selectMode = 2
        erasing = false
        shapeOptions.style('display', 'none')
    })
    earseAllBtn.mousePressed(() => {
        background(255)
        selectMode = 0
        erasing = false
        shapeOptions.style('display', 'none')
    })
    saveBtn.mousePressed(() => saveCanvas(canvas, 'drawing', 'png'))
}

function draw() {
    if (mouseIsPressed) {
        if (selectMode === 0) {
            drawFreehand()
        }
    }
    if (selectMode === 1 && mouseIsPressed) {
        if (savedCanvas) {
            image(savedCanvas, 0, 0)
        }
        stroke(currentColor)
        strokeWeight(currentBrushSize)
        noFill()
        let shapeType = shapeSelect.value()
        if (shapeType === 'rectangle') {
            rect(startX, startY, mouseX - startX, mouseY - startY)
        } else if (shapeType === 'ellipse') {
            ellipse((startX + mouseX) / 2, (startY + mouseY) / 2, abs(mouseX - startX), abs(mouseY - startY))
        }
    }
}

function mousePressed() {
    if (selectMode === 1) {
        startX = mouseX
        startY = mouseY
        savedCanvas = get()
    }
}

function mouseReleased() {
    if (selectMode === 1) {
        stroke(currentColor)
        strokeWeight(currentBrushSize)
        noFill()
        let shapeType = shapeSelect.value()
        if (shapeType === 'rectangle') {
            rect(startX, startY, mouseX - startX, mouseY - startY)
        } else if (shapeType === 'ellipse') {
            ellipse((startX + mouseX) / 2, (startY + mouseY) / 2, abs(mouseX - startX), abs(mouseY - startY))
        }
    }
    if (selectMode === 2) {
        background(currentColor)
        selectMode = 0
    }
    previousMouseX = previousMouseY = undefined
}

function drawFreehand() {
    if (previousMouseX !== undefined && previousMouseY !== undefined) {
        strokeWeight(currentBrushSize)
        if (erasing) {
            stroke(255)
        } else {
            stroke(currentColor)
        }
        line(previousMouseX, previousMouseY, mouseX, mouseY)
    }
    previousMouseX = mouseX
    previousMouseY = mouseY
}
