const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const tweakpane = require("tweakpane");
const { wrap } = require("canvas-sketch-util/math");

const settings = {
  dimensions: [2080, 2080],
};

const params = {
  radius: 10,
  n: 1,
  back: "#FFFFFF",
  dot: "#000000",
  line: "#000000",
  liney: 1,
  linex: 1,
  movex: 1,
  movey: 1,
};

const sketch = ({ context, width, height }) => {
  const agents = [];
  for (let i = 0; i < 1400; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);
    agents.push(new Agent(x, y));
  }

  return ({ context, width, height }) => {
    context.fillStyle = params.back;
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];

        const dist = agent.pos.getDist(other.pos);
        if (dist > 220) continue;

        context.lineWidth = math.mapRange(dist, 0, 800, 1, 1);
        context.beginPath();
        context.moveTo(agent.pos.x * params.movex, agent.pos.y * params.movey);
        context.lineTo(other.pos.x * params.linex, other.pos.y * params.liney);
        context.stroke();
      }
    }

    agents.forEach((agent) => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height);
    });
  };
};

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  getDist(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(1, -1), random.range(1, -1));
    this.radius = params.radius;
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context) {
    context.save();
    context.fillStyle = params.dot;
    context.strokeStyle = params.line;
    context.translate(this.pos.x, this.pos.y);
    context.fill();
    context.stroke();
    context.lineWidth = 4;
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.restore();
  }

  bounce(width, height) {
    if (this.pos.x <= 0 || this.pos.x >= width) {
      this.vel.x *= -1;
    }
    if (this.pos.y <= 0 || this.pos.y >= height) {
      this.vel.y *= -1;
    }
  }

  wrap(width, height) {
    if (this.pos.x < 0) {
      this.pos.x = width;
    }
    if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
    }
  }
}

const createPane = () => {
  const pane = new tweakpane.Pane();
  let folder;
  folder = pane.addFolder({ title: "Grid" });
  folder = pane.addInput(params, "linex", { min: -20, max: 20 });
  folder = pane.addInput(params, "liney", { min: -20, max: 20 });
  folder = pane.addInput(params, "movex", { min: -20, max: 20 });
  folder = pane.addInput(params, "movey", { min: -20, max: 20 });

  folder = pane.addFolder({ title: "Noise" });

  folder = pane.addFolder({ title: "Color" });
  folder = pane.addInput(params, "back");
  folder = pane.addInput(params, "dot");
  folder = pane.addInput(params, "line");
};
createPane();

canvasSketch(sketch, settings);
