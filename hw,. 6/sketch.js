let previousMouseX, previousMouseY;
let canvas, selectArea;
let selectMode = 0;
let shapeButton, clearButton, penButton, backButton, widthSelect, colorSelect, shapeSelect;
let forShape = false; // Универсальный флаг для рисования фигур
let currentShape = []; 

const colorMap = {
  '🔴': 'red',
  '🔵': 'blue',
  '🟢': 'green',
  '🟡': 'yellow',
  '⚫': 'black',
  '⚪': 'white',
  '🟣': 'purple',
  '🟠': 'orange'
};

function setup() {
  canvas = createCanvas(800, 800);
  background(200);
  noFill();
  stroke(0);

  // Кнопки
  penButton = createButton('Pen').position(10, 810);
  backButton = createButton('Background').position(10, 830);
  widthSelect = createInput(10).position(50, 810).size(30);
  colorSelect = createColorSelect().position(10, 850);
  shapeButton = createButton('Shape').position(10, 870);
  clearButton = createButton('Clear').position(810, 10);

  // Обработчики кнопок
  penButton.mousePressed(() => selectMode = 0);
  backButton.mousePressed(() => selectMode = 2);
  clearButton.mousePressed(() => background(200));
  shapeButton.mousePressed(() => showShapeSelect());
}

function draw() {
  let pickedColor = colorSelect.selected();
  let color = colorMap[pickedColor] || 'black';

  if (mouseIsPressed) {
    if (selectMode === 0) {
      drawFreehand(color);
    } else if (selectMode === 1) {
      drawShape(color);
    } else if (selectMode === 2) {
      fillBackground(color);
    }
  }
}

function mouseReleased() {
  previousMouseX = previousMouseY = undefined;
  forShape = false;  // Сброс флага после завершения рисования
}

// Функции для рисования и выбора

function createColorSelect() {
  let select = createSelect();
  Object.keys(colorMap).forEach(option => select.option(option));
  select.selected('🔴');
  return select;
}

function drawFreehand(color) {
  strokeWeight(widthSelect.value());
  stroke(color);
  line(previousMouseX, previousMouseY, mouseX, mouseY);
  previousMouseX = mouseX;
  previousMouseY = mouseY;
}

function drawShape(color) {
  fill(color);
  noStroke();
  let shape = shapeSelect.selected();

  if (shape === '⬛') {
    drawRectangle();
  } else if (shape === '⚫️') {
    drawEllipse();
  }
}

function drawRectangle() {
  if (forShape) {
    rect(previousMouseX, previousMouseY, mouseX - previousMouseX, mouseY - previousMouseY);
  } else {
    previousMouseX = mouseX;
    previousMouseY = mouseY;
    forShape = true;
  }
}

function drawEllipse() {
  if (forShape) {
    ellipse(previousMouseX, previousMouseY, mouseX - previousMouseX, mouseY - previousMouseY);
  } else {
    previousMouseX = mouseX;
    previousMouseY = mouseY;
    forShape = true;
  }
}

function fillBackground(color) {
  background(color);
  selectMode = 0; // Возвращаем в режим рисования
}

function showShapeSelect() {
  selectMode = 1;
  shapeSelect = createSelect().position(870, 40);
  shapeSelect.option('⬛');  // Прямоугольник
  shapeSelect.option('⚫️'); // Окружность
}
