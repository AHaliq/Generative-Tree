

export default function (p, b) {
  let l = [];

  function pen() {
    return {
      past: [],
      t: p.random(100),
      ang: p.random(2 * p.PI),
      speed: p.random(3, 5),
      steer: p.PI * 0.25,
      noiseStep: p.random(0.01, 0.01),
      col: p.random([p.color(255, 0, 0), p.color(255, 0, 255), p.color(0, 0, 0)]),
      x: p.random(b.width),
      y: p.random(b.height)
    }
  }

  function penKill({ past }) {
    if (past.length > 0) past.shift();
  }

  function penOutOfBounds({ x, y }) {
    return x < b.o1.x || x > b.o2.x || y < b.o1.y || y > b.o2.y;
  }

  function penTraverse(pen) {
    let { x, y, ang, t, past, speed, noiseStep, steer } = pen;
    past.push({ x, y });
    if (past.length > 100) past.shift();
    pen.x += p.cos(ang) * speed;
    pen.y += p.sin(ang) * speed;
    pen.ang += p.map(p.noise(t), 0, 1, -steer, steer);
    pen.t += noiseStep;
  }

  function penRender({ past, col }) {
    p.stroke(col);
    p.beginShape();
    past.map(({ x, y }) => p.vertex(x, y));
    p.endShape();
  }

  return function () {
    p.noFill();
    while (l.length < 35) l.push(pen());
    l.map(x => penOutOfBounds(x) ? penKill(x) : penTraverse(x));
    l = l.filter((x) => !penOutOfBounds(x) || x.past.length > 0);
    l.map(x => penRender(x));
  }
}