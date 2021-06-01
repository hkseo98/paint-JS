const canvas = document.getElementById("canvas");
const colors = document.getElementsByClassName("controls__color");
const range = document.getElementsByClassName("controls__range");
const clear = document.getElementById("jsClear");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const currentColor = document.getElementById("current__color");
const back = document.getElementById("back_btn");
const redo = document.getElementById("redo_btn");
const image__name = document.getElementById("image_name");

const ctx = canvas.getContext("2d");

let pathsry = [];
let points = [];
let backColor = "white";

var mouse = { x: 0, y: 0 };
var previous = { x: 0, y: 0 };

const CANVAS__SIZE = 550;
const DEFAULT__COLOR = "#2c2c2c";
canvas.width = CANVAS__SIZE; // 실제 픽셀 사이즈를 줘야함
canvas.height = CANVAS__SIZE;

ctx.lineJoin = "round";
ctx.lineCap = "round";
ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS__SIZE, CANVAS__SIZE);
ctx.strokeStyle = DEFAULT__COLOR;
ctx.lineWidth = 15;
ctx.fillStyle = DEFAULT__COLOR;

let on = false;
let modes = "Draw";
let arrayForRedo = [];
let imageName = "";

function onImageName(event) {
  imageName = event.target.value;
}

function Undo() {
  // remove the last path from the paths array
  // console.log(pathsry);
  arrayForRedo.push(pathsry.pop());
  console.log(arrayForRedo);
  // draw all the paths in the paths array
  drawPaths();
}

function Redo() {
  let re = arrayForRedo.pop();
  if (re) {
    pathsry.push(re);
    drawPaths();
  }
}

function onMouseMove(event) {
  if (modes == "Draw") {
    if (!on) {
      ctx.beginPath();
    } else {
      previous = { x: mouse.x, y: mouse.y };
      mouse = { x: event.offsetX, y: event.offsetY };
      points.push({ x: mouse.x, y: mouse.y });
      ctx.moveTo(previous.x, previous.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
  } else if (modes == "Spread") {
    if (!on) {
      ctx.beginPath();
      previous = { x: event.offsetX, y: event.offsetY };
      ctx.moveTo(previous.x, previous.y);
    } else {
      mouse = { x: event.offsetX, y: event.offsetY };
      points.push({ x: mouse.x, y: mouse.y });
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
      ctx.closePath();
    }
  }
}

function startPainting(event) {
  on = true;
  previous = { x: mouse.x, y: mouse.y };
  mouse = { x: event.offsetX, y: event.offsetY };
  points = [];
  points.push({ x: mouse.x, y: mouse.y });
}

function stopPainting(event) {
  if (modes == "Draw" || modes == "Spread") {
    on = false;
    pathsry.push([points, ctx.strokeStyle, modes, ctx.lineWidth]);
    arrayForRedo = [];
  }
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
  pathsry = [];
  arrayForRedo = [];
}

function changeMode() {
  if (modes == "Draw") {
    modes = "Paint";
    mode.innerText = "Paint";
  } else if (modes == "Paint") {
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
  console.log(pathsry);
}

function handleCM(event) {
  event.preventDefault();
}

function handleSave() {
  const image = canvas.toDataURL();
  const link = document.createElement("a");
  link.href = image;
  link.download = imageName;
  link.click();
  image__name.value = "";
}

function drawPaths() {
  // delete everything
  ctx.clearRect(0, 0, CANVAS__SIZE, CANVAS__SIZE);
  // draw all the paths in the paths array
  pathsry.forEach((path) => {
    if (path[2] == "Draw") {
      ctx.strokeStyle = path[1];
      ctx.lineWidth = path[3];
      ctx.beginPath();
      if (path[0][0].x) {
        ctx.moveTo(path[0][0].x, path[0][0].y);
        for (let i = 1; i < path[0].length; i++) {
          ctx.lineTo(path[0][i].x, path[0][i].y);
        }
        ctx.stroke();
      }
    } else if (path[2] == "Spread") {
      ctx.strokeStyle = path[1];
      ctx.lineWidth = path[3];
      ctx.beginPath();
      if (path[0][0].x) {
        ctx.moveTo(path[0][0].x, path[0][0].y);
        for (let i = 1; i < path[0].length; i++) {
          ctx.lineTo(path[0][i].x, path[0][i].y);
          ctx.stroke();
          ctx.closePath();
        }
      }
    } else {
      ctx.fillStyle = path[1];
      ctx.fillRect(0, 0, CANVAS__SIZE, CANVAS__SIZE);
    }
  });
}

function leaveCanvas() {
  if (on) {
    on = false;
    pathsry.push([points, ctx.strokeStyle, modes]);
    arrayForRedo = [];
  } else {
    on = false;
  }
}

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseleave", leaveCanvas);
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

if (back) {
  back.addEventListener("click", Undo);
}

if (redo) {
  redo.addEventListener("click", Redo);
}

if (image__name) {
  image__name.addEventListener("input", onImageName);
}
