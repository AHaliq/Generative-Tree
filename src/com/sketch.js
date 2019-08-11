import { H_SegBaseW } from './segment';
import "../style.scss";

const BORDER = 100;
let bounds, s;

new p5((p) => {
  function calcBounds() {
    bounds.o2.x = p.windowWidth - BORDER;
    bounds.o2.y = p.windowHeight - BORDER;
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    bounds = DrawBox({
      x1: BORDER, y1: BORDER,
      draw: (function () {
        let s = H_SegBaseW(p, p.windowWidth * 0.5, p.windowHeight * 0.5, 0, 50, 10);
        let t = 0;
        return function (p) {
          s.d.a = p.atan2(p.mouseY - p.height / 2, p.mouseX - p.width / 2);
          s.r = p.sin(t) * 50;
          p.ellipse(s.o.x, s.o.y, 10);
          p.ellipse(s.t.x, s.t.y, 10);
          p.ellipse(s.rw.x, s.rw.y, 5);
          p.ellipse(s.lw.x, s.lw.y, 5);
          t += p.PI / 180;
        }
      })()
    });
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
    p.rect(bounds.o1.x, bounds.o1.y, bounds.o2.x, bounds.o2.y);
    bounds.draw(p);
  }
});

/**
 * 
 * @param {*} param0 spec object:
 * draw   draw function taking in p5js instance object as argument
 * x1,y1,x2,y2  box spec arguments
 */
function DrawBox({ draw, x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = {}) {
  return {
    draw: draw,
    ...Box({ x1, x2, y1, y2 })
  };
}

/**
 * 
 * @param {*} param0 spec object:
 * x1 top left x coordinate;
 * y1 top left y coordinate;
 * x2 btm right x coordinate;
 * y2 btm right y coordinate
 */
function Box({ x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = {}) {
  return {
    o1: { x: x1, y: y1 },
    o2: { x: x2, y: y2 }
  }
}