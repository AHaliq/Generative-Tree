const BORDER = 100;
let B_WDT, B_HGT, o;

function setup() {
  createCanvas(windowWidth, windowHeight);
  B_WDT = width - BORDER * 2;
  B_HGT = height - BORDER * 2;
  switch (new URL(window.location.href).searchParams.get("type")) {
    case 'flower':
      //o = new FlowerSetup(BORDER);
      break;
    case 'primitive':
      o = new PrimitiveSetup(BORDER);
      break;
    default: // block
      o = new BlockSetup(BORDER);
      break;
  }
}

function draw() {
  background(220);
  noFill();
  stroke(150);
  rect(BORDER, BORDER, B_WDT, B_HGT);
  o.algo();
}
// webpack components
// do flower tree