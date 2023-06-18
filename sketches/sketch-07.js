const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

let elcanvas, points;

const sketch = ({ context, width, height, canvas }) => {
  points = [
    new Point({ x: 200, y: 540 }),
    new Point({ x: 400, y: 700 }),
    new Point({ x: 880, y: 540 }),
    new Point({ x: 600, y: 700 }),
    new Point({ x: 640, y: 900 }),
  ];

  canvas.addEventListener("mousedown", onMouseDown);
  elcanvas = canvas;
  return ({ context, width, height, canvas }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    context.strokeStyle = "#999";
    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }

    context.stroke();

    // for(let i=1;i<points.length;i+=2){
    //   context.quadraticCurveTo(points[i+0].x,points[i+0].y,points[i+1].x,points[i+1].y);
    // }

    context.beginPath();

    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i + 0];
      const next = points[i + 1];

      const mx = curr.x + (next.x - curr.x) * 0.5;
      const my = curr.y + (next.y - curr.y) * 0.5;

      // context.beginPath();
      // context.arc(mx,my,5,0,Math.PI*2);

      // context.fillStyle ='blue';
      // context.fill();
      if (i == 0) context.moveTo(mx, my);
      else if (i == points.length - 2)
        context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
      else context.quadraticCurveTo(curr.x, curr.y, mx, my);
    }

    context.strokeStyle = "blue";
    context.lineWidth = 4;
    context.stroke();

    points.forEach((point) => {
      point.drawArcs(context);
    });
  };
};

class Point {
  constructor({ x, y }) {
    this.x = x;
    this.y = y;
  }

  drawArcs(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.control ? "red" : "black";
    context.beginPath();
    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }

  hitTest(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    const dd = Math.sqrt(dx * dx + dy * dy);
    return dd < 11;
  }
}

function onMouseDown(e) {
  console.log(e);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  const x = (e.offsetX / elcanvas.offsetWidth) * elcanvas.width;
  const y = (e.offsetY / elcanvas.offsetHeight) * elcanvas.height;

  let hit = false;

  points.forEach((point) => {
    point.isDragged = point.hitTest(x, y);
    if (!hit && point.isDragged) hit = true;
  });

  if (!hit) points.push(new Point({ x, y }));
}

function onMouseMove(e) {
  const x = (e.offsetX / elcanvas.offsetWidth) * elcanvas.width;
  const y = (e.offsetY / elcanvas.offsetHeight) * elcanvas.height;

  points.forEach((point) => {
    if (point.isDragged) {
      point.x = x;
      point.y = y;
    }
  });
}

function onMouseUp(e) {
  console.log(e);
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
}

canvasSketch(sketch, settings);
