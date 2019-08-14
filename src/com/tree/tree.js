import {makeSegBaseW} from './segment';

/**
 * draw function for tree
 * @param {*} p p5js argument object
 * @param {*} b bounds object
 * @return {Function} function to be used for a bounds draw
 */
export default function(p, b) {
  const s = makeSegBaseW(p, 0, 0, 0, 50, 10);
  let t = 0;
  return function() {
    p.translate(b.o1.x + b.width * 0.5, b.o1.y + b.height * 0.5);
    s.d.a = p.atan2(
        p.mouseY - b.o1.y - b.height / 2,
        p.mouseX - b.o1.x - b.width / 2);
    s.r = p.sin(t) * 50;
    p.ellipse(s.o.x, s.o.y, 10);
    p.ellipse(s.t.x, s.t.y, 10);
    p.ellipse(s.rw.x, s.rw.y, 5);
    p.ellipse(s.lw.x, s.lw.y, 5);
    t += p.PI / 180;
  };
};
