const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const tweakpane = require("tweakpane");

const settings = {
  dimensions: [4080, 4080],
  animate: true,
  frame: 0,
};

let manager, image;
let text = "هيثم هيثم هيثم هيثم"; // change text here
let fontSize = 1200;
let fontFamily = "Serif";

const typecanvas = document.createElement("canvas");
const typecontext = typecanvas.getContext("2d");

const sketch = ({ context, width, height }) => {
  const cell = 20;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typecanvas.width = cols;
  typecanvas.height = rows;

  return ({ context, width, height }) => {
    typecontext.fillStyle = "black";
    typecontext.fillRect(0, 0, cols, rows);

    fontSize = cols * 1.2;

    typecontext.save();
    typecontext.drawImage(image, 0, 0, cols, rows); // draw image
    typecontext.restore();

    typecontext.fillStyle = "white";
    typecontext.font = `${fontSize * 0.1}px ${fontFamily}`;
    typecontext.textBaseline = "top";

    const metrics = typecontext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const tx = (cols - mw) * 0.5 - mx;
    const ty = (rows - mh) * 0.5 - my;

    typecontext.save();
    typecontext.translate(tx, ty * 1.94);
    typecontext.beginPath();
    typecontext.stroke();
    typecontext.fillText(text, 0, 0);
    typecontext.restore();

    const typeData = typecontext.getImageData(0, 0, cols, rows).data;

    context.drawImage(typecanvas, 0, 0);
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.textBaseline = "middle";
    context.textAlign = "center";

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const glyph = getGlyph(g);

      context.font = `${cell * 2}px ${fontFamily}`;
      if (Math.random() < 0.09)
        context.font = `${cell * Math.random() * (13 - 1) + 1}px ${fontFamily}`;

      //context.fillStyle = `rgb(${r},${g},${b},${a})`;
      context.fillStyle = "white";

      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5);
      context.fillText(glyph, 0, 0);
      context.restore();
    }
  };
};

const getGlyph = (v) => {
  if (v < 90) return "";
  if (v < 100) return ".";
  if (v < 150) return "-";
  if (v < 200) return ",";
  if (v < 215) return ";";
  if (v < 300) return "+";
  if (v < 310) return "هـ";
  const glyphs = "_=/|".split("");
  return random.pick(glyphs);
};

// const onKeyUp = (e)=>{
//   text = e.key.toUpperCase();
//   manager.render();
// }

// document.addEventListener('keydown',onKeyUp);

// const start =  async()=>{
//   manager = await canvasSketch(sketch, settings);
// };
// start();

const loadMeSomeImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  });
};

const start = async () => {
  const url = "photo_2021-01-12_08-30-30.jpg"; // change img url here
  image = await loadMeSomeImage(url);
  manager = await canvasSketch(sketch, settings);
};

start();
