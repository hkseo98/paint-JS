const canvas = document.getElementById("canvas");
const colors = document.getElementsByClassName("controls__color");
const range = document.getElementsByClassName("controls__range");
const clear = document.getElementById("jsClear");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const currentColor = document.getElementById("current__color");

const ctx = canvas.getContext("2d");

const CANVAS__SIZE = 700;
const DEFAULT__COLOR = "#2c2c2c";
canvas.width = CANVAS__SIZE; // 실제 픽셀 사이즈를 줘야함
canvas.height = CANVAS__SIZE;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS__SIZE, CANVAS__SIZE);
ctx.strokeStyle = DEFAULT__COLOR;
ctx.lineWidth = 15;
ctx.fillStyle = DEFAULT__COLOR;

let on = false;
let modes = "Draw";

function onMouseMove(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  if (modes == "Draw") {
    if (!on) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  } else if (modes == "Spread") {
    if (!on) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.closePath();
    }
  }
}

function startPainting(event) {
  on = true;
  event;
}
function stopPainting(event) {
  on = false;
}

function changeColor(event) {
  const color = event.target.style.backgroundColor;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  currentColor.style.backgroundColor = color;
}

function rangeChange(event) {
  //   console.log(event.target.value);
  ctx.lineWidth = event.target.value;
}

function onClear(event) {
  ctx.clearRect(0, 0, CANVAS__SIZE, CANVAS__SIZE);
}

function changeMode() {
  if (modes == "Draw") {
    modes = "Paint";
    mode.innerText = "Paint";
  } else if ("Paint") {
    modes = "Spread";
    mode.innerText = "Spread";
  } else {
    modes = "Draw";
    mode.innerText = "Draw";
  }
}

function clickCanvas(event) {
  if (modes == "Paint") {
    ctx.fillRect(0, 0, CANVAS__SIZE, CANVAS__SIZE);
  }
}

function handleCM(event) {
  event.preventDefault();
}

function handleSave() {
  const image = canvas.toDataURL();
  const link = document.createElement("a");
  link.href = image;
  link.download = "image1/png";
  link.click();
  //   console.log(link);
}

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("click", clickCanvas);
  canvas.addEventListener("contextmenu", handleCM);
}

if (colors) {
  Array.from(colors).forEach((color) =>
    color.addEventListener("click", changeColor)
  );
}

if (range) {
  // console.log
  range[0].addEventListener("input", rangeChange);
}

if (clear) {
  clear.addEventListener("click", onClear);
}

if (mode) {
  mode.addEventListener("click", changeMode);
}

if (saveBtn) {
  saveBtn.addEventListener("click", handleSave);
}

if (currentColor) {
  console.log(currentColor.style.backgroundColor);
  // currentColor.addEventListener()
}
