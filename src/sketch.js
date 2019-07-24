const BORDER = 100;
let B_WDT, B_HGT;
let trees = [];

const setups = [{
  WEIGHT: 1,
  l: 50,
  w: 2,
  gr: 0.3,
  bd: 2.5,
  clr: [108,192,229]
},{
  WEIGHT: 2,
  l: 75,
  w: 25,
  gr:0.1,
  bd:4,
  clr: [251,79,79]
},{
  WEIGHT: 1,
  l: 25,
  w:5,
  gr:0.9,
  bd: 2,
  clr: [251,201,6]
}];

const totWeight = setups.reduce((cw,c) => {
  let iw = c.WEIGHT;
  c.WEIGHT += cw;
  cw += iw;
  return cw;
},0);

function setup() {
  createCanvas(windowWidth, windowHeight);
  //t = new T_Block(width * 0.5, height * 0.5, radians(random([0,90,180,270])), random([50,100]), random([2,25]), 0.3, 180/random(2.5,2,4,3));
  //t = new T_Block(width * 0.5, height * 0.5, radians(random([0,90,180,270])), 50, 2, 0.3, 180/2.5, color(255,0,0), BORDER);
  //DESIGNS: thick lines and thin lines
  //          thin geometrical tiling

  B_WDT = width - BORDER * 2;
  B_HGT = height - BORDER * 2;
}

function makeNew() {
  const choice = random(totWeight);
  let obj;
  for(const o of setups) {
    if(choice < o.WEIGHT) {
      obj = o;
      break;
    }
  }
  return new T_Block(width * 0.5, height * 0.5, radians(random([0,90,180,270])), obj.l, obj.w, obj.gr, 180/obj.bd, color(...obj.clr), BORDER);
}

function draw() {
  background(220);
  noFill();
  stroke(150);
  rect(BORDER,BORDER,B_WDT, B_HGT);
  while(trees.length < 5) {
    trees.push(makeNew());
  }
  trees.map((t) => t.step());
  trees.map((t) => t.render());
  trees = trees.filter((v) => v.ALPHA > 0.1);
}