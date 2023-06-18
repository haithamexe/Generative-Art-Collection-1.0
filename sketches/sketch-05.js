const canvasSketch = require("canvas-sketch");
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [1080, 1080],
  animate: true,
  fps: 60,
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
    const num = 1000;
    const radius = width * 0.3;

    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      context.strokeStyle = "white";
      context.fillStyle = "white";

      context.save();
      context.translate(x, y);
      context.rotate(-angle);
      context.scale(random.range(0, 0.1), random.range(0, 1));

      context.beginPath();
      context.rect(random.range(0, w * 0.2), random.range(0, 1), w, h);
      context.fill();
      context.restore();

      context.save();
      context.translate(cx, cy);
      context.rotate(-angle);
      context.lineWidth = random.range(1, 3);
      context.beginPath();
      context.arc(
        0,
        0,
        radius * random.range(0, 1),
        slice * random.range(1, 0),
        slice * random.range(1, 30)
      );
      context.stroke();
      context.restore();
    }
  };
};
canvasSketch(sketch, settings);
