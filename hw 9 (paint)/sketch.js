let previousMouseX, previousMouseY;
let canvas, selectArea;
let selectMode = 0;
let shapeButton, clearButton, penButton, backButton, widthSelect, colorSelect, shapeSelect, saveButton;
let forShape = false; 
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
  background(200); //холст
  noFill();
  stroke(0);

  // Создание кнопок
  penButton = createButton('Pen').position(810, 80);  // ручка
  eraserButton = createButton('Eraser').position(810, 125);  // ластик
  backButton = createButton('Background').position(810, 150); // фон
  widthSelect = createInput('10').position(855, 80).size(30);  // Толщина линии
  colorSelect = createColorSelect().position(810, 105); // силектор
  shapeButton = createButton('Shape').position(810, 175); // ФИГУРЫ
  clearButton = createButton('Clear').position(810, 200); // ОЧИСТКА
  saveButton = createButton('Save').position(810, 224);  //  сохранение

  // Обработчики кнопок
  penButton.mousePressed(() => selectMode = 0); // Обработчик для кнопки ручки
  backButton.mousePressed(() => selectMode = 2);  // Обработчик для кнопки ручки
  clearButton.mousePressed(() => background(200));  // Обработчик для кнопки фон
  shapeButton.mousePressed(() => showShapeSelect());     // Обработчик для кнопки фигуры 
  eraserButton.mousePressed(() => selectMode = 3);    // Обработчик для кнопки ластика 
  saveButton.mousePressed(saveCanvasImage);  // Обработчик для кнопки сохранения
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
    else if (selectMode === 3) {
      eraserFreehand(200);
    }
  }
}

function eraserFreehand(color) {
  strokeWeight(widthSelect.value());
  stroke(200);
  line(previousMouseX, previousMouseY, mouseX, mouseY);
  previousMouseX = mouseX;
  previousMouseY = mouseY;
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
  } else if (shape === '🔺') {  
    drawTriangle();
  }
}


// Функция для рисования круга
function drawRectangle() {
  if (forShape) {
    rect(previousMouseX, previousMouseY, mouseX - previousMouseX, mouseY - previousMouseY);
  } else {
    previousMouseX = mouseX;
    previousMouseY = mouseY;
    forShape = true;
  }
}

// Функция для рисования прямоугольника
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
    let x1 = previousMouseX;
    let y1 = previousMouseY;
    let x2 = mouseX;
    let y2 = mouseY;
    let x3 = (previousMouseX + mouseX) / 2;  // Середина между начальной и конечной точкой
    let y3 = previousMouseY - (mouseY - previousMouseY);  // Высота для треугольника

    triangle(x1, y1, x2, y2, x3, y3);  // Рисуем треугольник
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
  shapeSelect = createSelect().position(870, 175);
  shapeSelect.option('⬛');  // Прямоугольник
  shapeSelect.option('⚫️'); // Окружность
  shapeSelect.option('🔺'); // Треугольник
}

// Функция для сохранения изображения
function saveCanvasImage() {
  saveCanvas(canvas, 'my_drawing', 'png');  // Сохранение холста в формате PNG
}
