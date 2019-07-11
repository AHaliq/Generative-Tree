let BORDER = 50, RBRD, BBRD, OLDW;

let petals = [];
let trees = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  windowResized();
  trees.push(new ScaryFruitTree());
  trees[0].LBRD = trees[0].TBRD = BORDER;
  trees[0].RBRD = RBRD;
  trees[0].BBRD = BBRD;
  trees[0].init(width * 0.5, BBRD - BORDER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  RBRD = width - BORDER;
  BBRD = height - BORDER;
  trees.map((t) => {
    t.reposition(t.x / OLDW * width, BBRD - BORDER);
    t.RBRD = RBRD;
    t.BBRD = BBRD;
    return t;
  });
  OLDW = width;
}

function draw() {
  background(220);
  stroke(200);
  line(BORDER,BORDER,RBRD,BORDER);
  line(RBRD,BORDER,RBRD,BBRD);
  line(RBRD,BBRD,BORDER,BBRD);
  line(BORDER,BBRD,BORDER,BORDER);

  
  trees.map((t) => t.grow());
  trees.map((t) => t.render());

  petals = petals.reduce((ps,p) => {
    p.render();
    p.fall();
    if(p.x > RBRD || p.y > BBRD) p.alpha = 0;
    return p.alpha <= 0 ? ps : [...ps, p];
  }, []);
  
  /*if((i == 2 && tmr == 0) || i == 0) {
    if(i == 0) {
      s.a = PI;
      s.l = INITIAL_L;
      s.w = INITIAL_W;
      s.reset();
    }
    GROWTH_RATE *= -1;
    tmr = 100;
  }else if(i == 2 && tmr > 0) tmr--;*/
  
}