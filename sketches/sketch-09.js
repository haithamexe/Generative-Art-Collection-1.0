const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const params = {
  cols: 200,
  rows: 12,
  scalemin: 200.0,
  scalemax: -6.52,
  freq: 0.005,
  amp: 1,
  frame: 0,
  animate: true,
  lineCap: "round",
  speed: 5,
  shape: "line",
  back: "#ffffff",
  front: "#000000",
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    // context.fillStyle = rgb(params.back.r,params.back.g,params.back.b);
    context.fillStyle = params.back;
    context.fillRect(0, 0, width, height);

    const f = params.animate ? frame : params.frame;

    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;
    const gridw = width * 0.8;
    const gridh = height * 0.8;
    const cellw = gridw / cols;
    const cellh = gridh / rows;
    const margx = (width - gridw) * 0.5;
    const margy = (height - gridh) * 0.5;

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.8;
      const h = cellh * 0.8;

      //const n = random.noise2D(x+frame*7,y,params.freq);

      const n = random.noise3D(
        x + f * params.speed,
        y,
        f * params.speed,
        params.freq
      );

      const angle = n * Math.PI * params.amp;
      const scale = math.mapRange(n, -1, 1, params.scalemin, params.scalemax);

      context.save();
      context.strokeStyle = params.front;
      context.translate(x, y);
      context.translate(margx, margy);
      context.translate(cellw * 0.5, cellh * 0.5);
      context.beginPath();
      context.rotate(angle);
      context.lineWidth = scale;
      context.lineCap = params.lineCap;
      if (params.shape === "line") {
        context.moveTo(w * -0.5, 0);
        context.lineTo(w * 0.5, 0);
      } else {
        context.arc(w * 0.5, y * 0.2, 20, 0, Math.PI * 2);
      }
      context.stroke();
      context.restore();
    }
  };
};

const createPane = () => {
  const pane = new tweakpane.Pane();
  let folder;
  folder = pane.addFolder({ title: "Grid" });
  folder = pane.addInput(params, "lineCap", {
    options: { butt: "butt", round: "round", square: "square" },
  });
  folder = pane.addInput(params, "shape", {
    options: { line: "line", square: "square" },
  });
  folder = pane.addInput(params, "cols", { min: 1, max: 200, step: 1 });
  folder = pane.addInput(params, "rows", { min: 1, max: 200, step: 1 });
  folder = pane.addInput(params, "scalemin", { min: -50, max: 200 });
  folder = pane.addInput(params, "scalemax", { min: -50, max: 200 });

  folder = pane.addFolder({ title: "Noise" });
  folder = pane.addInput(params, "speed", { min: 0, max: 50, step: 1 });
  folder = pane.addInput(params, "freq", { min: -0.1, max: 0.1 });
  folder = pane.addInput(params, "amp", { min: -1, max: 1 });
  folder = pane.addInput(params, "animate");
  folder = pane.addInput(params, "frame", { min: 0, max: 900 });

  folder = pane.addFolder({ title: "Color" });
  folder = pane.addInput(params, "back");
  folder = pane.addInput(params, "front");
};

createPane();
canvasSketch(sketch, settings);
