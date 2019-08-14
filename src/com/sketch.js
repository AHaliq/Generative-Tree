
import '../style.scss';

import makeBox from './box';
import tree from './tree/tree';

const BORDER = 100;
let b;

// eslint-disable-next-line new-cap
new p5((p) => {
  /**
   * recalculates bounds object
   */
  function calcBounds() {
    b.o2.x = p.windowWidth - BORDER;
    b.o2.y = p.windowHeight - BORDER;
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    b = makeBox({x1: BORDER, y1: BORDER});
    b.draw = tree(p, b);
    calcBounds();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    calcBounds();
  };

  p.draw = () => {
    p.background(220);
    p.noFill();
    p.stroke(150);
    p.rectMode(p.CORNERS);
    p.rect(b.o1.x, b.o1.y, b.o2.x, b.o2.y);
    b.draw();
  };
});
