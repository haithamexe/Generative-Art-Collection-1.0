const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const tweakpane = require("tweakpane");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const params = {
  n: 1044,
  scaleMax: -0.8695652174,
  scaleMin: 0.02,
  rand: 9.91,
  rand2: 3.1,
  linew: 30.0,
  rads: 0.23,
  sliceh: 8.4782608696,
  slicew: 7.7608695652,
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    const cx = width * 0.5;
    const cy = height * 0.5;
    const w = width * 0.01;
    const h = height * 0.1;
    let x, y;
    const num = params.n;
    const radius = width * 0.3;

    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle * params.rand);
      y = cy + radius * Math.cos(angle * params.rand);

      context.strokeStyle = "white";
      context.fillStyle = "white";

      context.save();
      context.translate(x, y);
      context.rotate(-angle);
      context.scale(params.scaleMin, params.scaleMax);
      context.lineWidth = params.linew;
      context.beginPath();
      context.rect(
        random.range(0, w * 0.2),
        random.range(0, 1),
        w,
        h * params.rand2
      );
      context.fill();
      context.restore();

      context.save();
      context.translate(cx, cy);
      context.rotate(-angle);
      context.lineWidth = params.linew;
      context.beginPath();
      context.arc(
        0,
        0,
        radius * params.rads,
        slice * params.slicew,
        slice * params.sliceh
      );
      context.stroke();
      context.restore();
    }
  };
};

const createPane = () => {
  const pane = new tweakpane.Pane();
  let folder;
  folder = pane.addFolder({ title: "Grid" });
  folder = pane.addInput(params, "n", { min: 1, max: 6000, step: 1 });
  folder = pane.addInput(params, "scaleMin", { min: -60, max: 100, step: 1 });
  folder = pane.addInput(params, "scaleMax", { min: -60, max: 100, step: 1 });

  folder = pane.addFolder({ title: "Noise" });
  folder = pane.addInput(params, "rand", { min: -20, max: 100 });
  folder = pane.addInput(params, "rand2", { min: -20, max: 100 });
  folder = pane.addInput(params, "linew", { min: -3, max: 600 });
  folder = pane.addInput(params, "sliceh", { min: -3, max: 30 });
  folder = pane.addInput(params, "slicew", { min: -3, max: 30 });
};

createPane();
canvasSketch(sketch, settings);
