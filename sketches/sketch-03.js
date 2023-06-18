const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const Tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const params = {
  cols: 150,
  rows: 100,
  scaleMin: 1,
  scaleMax: 5,
  freq: 0.005,
  speed: 1,
  amp: 60,
  frame: 0,
  invert: false,
  animate: true,
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    params.invert
      ? (context.fillStyle = "black")
      : (context.fillStyle = "white");
    context.fillRect(0, 0, width, height);

    const marg = params.amp * 2 + params.scaleMax;
    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;
    const cellw = (width - marg * 0.5) / cols;
    const cellh = (height - marg) / rows;
    let ns, nt;

    context.lineCap = "round";
    context.lineJoin = "round";
    params.invert
      ? (context.strokeStyle = "white")
      : (context.strokeStyle = "black");

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cellw;
      const y = row * cellh;
      const w = cellw;
      const h = cellh;
      const f = params.animate ? frame : params.frame;

      col == 0
        ? (ns = random.noise3D(
            (col - 1) * cellw,
            y,
            f * params.speed,
            params.freq
          ))
        : (ns = nt);
      nt = random.noise3D(x + 1, y, f * params.speed, params.freq);

      const scale = math.mapRange(ns, -1, 1, params.scaleMin, params.scaleMax);

      context.lineWidth = scale;

      context.save();
      context.translate(marg * 0.25, marg * 0.5);
      context.translate(x, y);
      context.translate(cellw * 0.5, cellh * 0.5);
      context.beginPath();
      context.moveTo(w * -0.5, ns * params.amp);
      context.lineTo(w * 0.5, nt * params.amp);
      context.stroke();
      context.restore();
    }
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: "Lines" });
  folder.addInput(params, "cols", { min: 2, max: 200, step: 1 });
  folder.addInput(params, "rows", { min: 2, max: 200, step: 1 });
  folder.addInput(params, "scaleMin", { min: 1, max: 20, step: 1 });
  folder.addInput(params, "scaleMax", { min: 1, max: 20, step: 1 });
  folder.addInput(params, "invert", { min: 0, max: 999, step: 1 });

  folder = pane.addFolder({ title: "Noise" });
  folder.addInput(params, "freq", { min: 0, max: 0.01 });
  folder.addInput(params, "amp", { min: 1, max: 100, step: 1 });
  folder.addInput(params, "speed", { min: 1, max: 10, step: 1 });
  folder.addInput(params, "animate");
  folder.addInput(params, "frame", { min: 0, max: 999, step: 1 });
};

createPane();
canvasSketch(sketch, settings);
