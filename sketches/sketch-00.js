const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");

// https://github.com/bpostlethwaite/colormap
const colormap = require("colormap");

// docs: https://github.com/dataarts/dat.gui/blob/master/API.md
const dat = require("dat.gui");

// https://github.com/freeman-lab/control-panel#readme
// const control = require("control-panel");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const params = {
  cols: 200,
  rows: 200,
  gridSize: 0.6000000000000001,
  xOffset: 0.257,
  yOffset: 0.257,
  freq: 0.001,
  amp: 90,
  animSpeed: 2,
  bgColour: "#000000",
  colourRange: "portland",
  colourAlpha: 1,
};
let cols, rows, marginX, marginY;
let points;
let cellW, cellH;
let freq, amp;
// set like this so setup can read them easily
const width = settings.dimensions[0];
const height = settings.dimensions[1];

const colormapOptions = [
  "viridis",
  "jet",
  "hsv",
  "hot",
  "spring",
  "summer",
  "autumn",
  "winter",
  "bone",
  "copper",
  "greys",
  "yignbu",
  "greens",
  "yiorrd",
  "bluered",
  "rdbu",
  "picnic",
  "rainbow",
  "portland",
  "blackbody",
  "earth",
  "electric",
  "alpha",
  "inferno",
  "magma",
  "plasma",
  "warm",
  "cool",
  "rainbowsoft",
  "bathymetry",
  "cdom",
  "chlorophyll",
  "density",
  "oxygen",
  "par",
  "phase",
  "salinity",
  "temperature",
  "turbidity",
  "velocity-blue",
  "velocity-green",
  "cubehelix",
];

const sketch = () => {
  setupControls();
  setupSketch();

  return ({ context: ctx, frame }) => {
    draw({ ctx, frame });
  };
};

// Kick off Sketch
canvasSketch(sketch, settings);

// DRAW
const draw = ({ ctx, frame }) => {
  ctx.fillStyle = params.bgColour;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.translate(marginX, marginY);
  ctx.translate(cellW * 0.5, cellH * 0.5);

  // update position for animation

  points.forEach((pt) => {
    const animInc = frame * params.animSpeed;
    n = random.noise2D(pt.ix + animInc, pt.iy, freq, amp);
    // n = random.noise2D(pt.ix + animInc, pt, freq, amp);

    pt.x = pt.ix + n;
    pt.y = pt.iy + n;
  });

  let lastX, lastY;

  // draw lines
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const currPt = points[r * cols + c + 0];
      const nextPt = points[r * cols + c + 1];

      const middleX = currPt.x + (nextPt.x - currPt.x) * 0.8;
      const middleY = currPt.y + (nextPt.y - currPt.y) * 5.5;

      if (c === 0) {
        lastX = currPt.x;
        lastY = currPt.y;
      }

      ctx.beginPath();
      ctx.lineWidth = currPt.lineWidth;
      ctx.strokeStyle = currPt.color;
      // ctx.globalCompositeOperation = "difference";
      ctx.moveTo(lastX, lastY);
      ctx.quadraticCurveTo(currPt.x, currPt.y, middleX, middleY);
      // ctx.bezierCurveTo(20, 100, 200, 100, 200, 20);
      ctx.stroke();

      lastX = middleX - (c / cols) * 250;
      lastY = middleY - (r / rows) * 250;
    }
  }

  ctx.restore();
  // points.forEach((pt) => pt.draw(ctx));
};

// SET UP CONTROLS
const setupControls = () => {
  const gui = new dat.GUI();
  gui.useLocalStorage = true;
  gui.remember(params);
  // general layout, positions etc
  const layout = gui.addFolder("layout");
  layout.add(params, "cols").min(1).max(250).step(1).onChange(setupSketch);
  layout.add(params, "rows").min(1).max(250).step(1).onChange(setupSketch);
  layout
    .add(params, "gridSize")
    .min(0.1)
    .max(1.0)
    .step(0.1)
    .onChange(setupSketch);
  layout.add(params, "xOffset").min(0).max(1).step(0.001).onChange(setupSketch);
  layout.add(params, "yOffset").min(0).max(1).step(0.001).onChange(setupSketch);
  // line wiggle params
  const wiggles = gui.addFolder("wiggles");
  wiggles
    .add(params, "freq")
    .min(0.001)
    .max(0.01)
    .step(0.001)
    .onChange(setupSketch);
  wiggles.add(params, "amp").min(9).max(100).step(1).onChange(setupSketch);
  wiggles
    .add(params, "animSpeed")
    .min(-10)
    .max(10)
    .step(1)
    .onChange(setupSketch);
  // colours params
  const colours = gui.addFolder("colours");
  colours.closed = false;
  colours.addColor(params, "bgColour").listen();
  colours
    .add(params, "colourRange")
    .options(colormapOptions)
    .onChange(setupSketch);
  colours
    .add(params, "colourAlpha")
    .min(0.1)
    .max(1.0)
    .step(0.1)
    .onChange(setupSketch);

  // starting folder state
  layout.closed = false;
  wiggles.closed = false;
  colours.closed = false;
};

// SET UP SKETCH
const setupSketch = () => {
  cols = params.cols;
  rows = params.rows;
  const numCells = cols * rows;

  // grid
  const gridW = width * params.gridSize;
  const gridH = height * params.gridSize;
  // offsets
  const xOffset = params.xOffset * width;
  const yOffset = params.yOffset * height;
  // margin
  marginX = xOffset;
  marginY = yOffset;
  // cell
  const cellW = gridW / cols;
  const cellH = gridH / rows;

  points = [];
  let x, y, n, lineWidth, color;
  freq = params.freq;
  amp = params.amp;

  let colors = colormap({
    colormap: params.colourRange,
    nshades: amp,
    format: "rgbaString",
    alpha: params.colourAlpha,
  });

  for (let i = 0; i < numCells; i++) {
    x = (i % cols) * cellW;
    y = Math.floor(i / cols) * cellH;
    n = random.noise2D(x, y, freq, amp);

    lineWidth = math.mapRange(n, -amp, amp, 0, 5);
    const colorIndex = Math.floor(math.mapRange(n, -amp, amp, 0, amp));
    color = colors[colorIndex];

    points.push(new Point({ x, y, n, lineWidth, color }));
  }
};

// UTILS
class Point {
  constructor({ x, y, lineWidth, color }) {
    this.x = x;
    this.y = y;
    this.lineWidth = lineWidth;
    this.color = color;

    this.radius = 10;

    this.ix = x;
    this.iy = y;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.restore();
  }
}
