import PrimitiveSetup from './setups/primitive_setup';
import BlockSetup from './setups/block_setup';
import "../style.scss"

const BORDER = 100;
let B_WDT, B_HGT, o;

new p5((p) => {
  function calcBounds() {
    B_WDT = p.width - BORDER * 2;
    B_HGT = p.height - BORDER * 2;
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    calcBounds();
    switch (new URL(window.location.href).searchParams.get("type")) {
      case 'flower':
        //o = new FlowerSetup(BORDER);
        break;
      case 'primitive':
        o = new PrimitiveSetup(p, BORDER);
        break;
      default: // block
        o = new BlockSetup(p, BORDER);
        break;
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    calcBounds();
  }

  p.draw = () => {
    p.background(220);
    p.noFill();
    p.stroke(150);
    p.rect(BORDER, BORDER, B_WDT, B_HGT);
    o.algo();
  }
});

// do flower tree