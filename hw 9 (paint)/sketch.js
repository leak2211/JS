let previousMouseX, previousMouseY;
let canvas;
let selectMode = 0; // 0 - рисование вручную, 1 - рисование фигур, 2 - изменение фона, 3 - ластик
let penButton, eraserButton, backButton, widthSelect, colorSelect, shapeButton, clearButton, saveButton;
let forShape = false;  // Флаг для рисования фигур
let shapeSelect;  // Селектор фигур

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
  background(200);  // Белый фон
  noFill();
  stroke(0);

  // Создание кнопок
  penButton = createButton('Pen').position(810, 80);
  eraserButton = createButton('Eraser').position(810, 130);  // Кнопка для ластика
  backButton = createButton('Background').position(810, 155);
  widthSelect = createInput('10').position(855, 80).size(30);  // Толщина линии
  colorSelect = createColorSelect().position(810, 105);
  shapeButton = createButton('Shape').position(810, 180);
  clearButton = createButton('Clear').position(810, 205);
  saveButton = createButton('Save').position(810, 230);  // Кнопка для сохранения

  // Обработчики кнопок
  penButton.mousePressed(() => selectMode = 0);  // Включаем режим рисования ручкой
  eraserButton.mousePressed(() => selectMode = 3);  // Включаем режим ластика
  backButton.mousePressed(() => selectMode = 2);  // Включаем режим изменения фона
  clearButton.mousePressed(() => background(200));  // Очищаем холст
  saveButton.mousePressed(saveCanvasImage);  // Сохранение изображения
  shapeButton.mousePressed(() => showShapeSelect());  // Показать селектор форм
}

function draw() {
  let pickedColor = colorSelect.selected();
  let color = colorMap[pickedColor] || 'black';

  if (mouseIsPressed) {
    if (selectMode === 0) {
      drawFreehand(color);  // Рисуем вручную
    } else if (selectMode === 1) {
      drawShape(color);  // Рисуем фигуры
    } else if (selectMode === 2) {
      fillBackground(color);  // Меняем фон
    } else if (selectMode === 3) {
      erase();  // Используем ластик
    }
  }
}

function mousePressed() {
  // Этот метод будет запускаться при нажатии кнопки мыши
}

function mouseReleased() {
  previousMouseX = previousMouseY = undefined;
  forShape = false;  // Сброс флага после завершения рисования
}

// Функции для рисования

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

function erase() {
  strokeWeight(widthSelect.value());
  stroke(200);  // Цвет фона, чтобы стереть
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
  } else if (shape === '▲') {
    drawTriangle();
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

// Функция для рисования треугольника
function drawTriangle() {
  if (forShape) {
    let base = mouseX - previousMouseX;
    let height = mouseY - previousMouseY;
    let x1 = previousMouseX;
    let y1 = previousMouseY;
    let x2 = mouseX;
    let y2 = mouseY;
    let x3 = (previousMouseX + mouseX) / 2;
    let y3 = previousMouseY - height;  // Треугольник с основанием по горизонтали

    triangle(x1, y1, x2, y2, x3, y3);
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
  shapeSelect = createSelect().position(870, 180);
  shapeSelect.option('⬛');  // Прямоугольник
  shapeSelect.option('⚫️'); // Окружность
  shapeSelect.option('▲'); // Треугольник
}

function saveCanvasImage() {
  saveCanvas(canvas, 'my_drawing', 'png');  // Сохранение холста в формате PNG
}
