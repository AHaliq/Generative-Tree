import { H_SegBaseW } from './segment';
import "../style.scss";


//TODO DO BOUNDING BOX and folder per module

const BORDER = 100;
let b, s;

new p5((p) => {
  function calcBounds() {
    b.o2.x = p.windowWidth - BORDER;
    b.o2.y = p.windowHeight - BORDER;
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    b = Box({ x1: BORDER, y1: BORDER });
    b.draw = (function () {
      let s = H_SegBaseW(p, 0, 0, 0, 50, 10);
      let t = 0;
      return function (p) {
        p.translate(b.o1.x + b.width * 0.5, b.o1.y + b.height * 0.5);
        s.d.a = p.atan2(p.mouseY - b.o1.y - b.height / 2, p.mouseX - b.o1.x - b.width / 2);
        s.r = p.sin(t) * 50;
        p.ellipse(s.o.x, s.o.y, 10);
        p.ellipse(s.t.x, s.t.y, 10);
        p.ellipse(s.rw.x, s.rw.y, 5);
        p.ellipse(s.lw.x, s.lw.y, 5);
        t += p.PI / 180;
      }
    })();
    calcBounds();
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    calcBounds();
  }

  p.draw = () => {
    p.background(220);
    p.noFill();
    p.stroke(150);
    p.rectMode(p.CORNERS);
    p.rect(b.o1.x, b.o1.y, b.o2.x, b.o2.y);
    b.draw(p);
  }
});

function Box({ draw, x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = {}) {
  let _o1 = { x: x1, y: y1 };
  let _o2 = { x: x2, y: y2 };
  return {
    draw: draw,
    o1: _o1,
    o2: _o2,
    get width() { return _o2.x - _o1.x },
    get height() { return _o2.y - _o1.y },
    set width(v) { _o2.x = v + _o1.x; },
    set height(v) { _o2.y = v + _o1.y; }
  }
}
