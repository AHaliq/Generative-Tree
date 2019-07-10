let BORDER = 50, RBND, BBND, OLDW;

let petals = [];
let trees = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  windowResized();
  trees.push(new ScaryFruitTree());
  trees[0].init(width * 0.5, BBND - BORDER);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  RBND = width - BORDER;
  BBND = height - BORDER;
  trees.map((t) => t.reposition(t.x / OLDW * width, BBND - BORDER));
  OLDW = width;
}

function draw() {
  background(220);
  stroke(200);
  line(BORDER,BORDER,RBND,BORDER);
  line(RBND,BORDER,RBND,BBND);
  line(RBND,BBND,BORDER,BBND);
  line(BORDER,BBND,BORDER,BORDER);

  petals = petals.reduce((ps,p) => {
    p.render();
    p.fall();
    return p.alpha <= 0 ? ps : [...ps, p];
  }, []);
  
  trees.map((t) => t.grow());
  trees.map((t) => t.render());
  /*let [i,j] = s.grow();
  if(i==2 && j == 0 && SPREAD_RATE == 0) { 
    if(tmr == 0) {
      SPREAD_RATE = 0.25;
      SPREAD_RATE_MAG = HALF_PI * SPREAD_RATE;
      tmr=120;
    }else tmr--;
  }else if(i == 2 && j == 0 && SPREAD_RATE > 0) {
    GROWTH_RATE *= -1;
    SPREAD_RATE = 0;
    SPREAD_RATE_MAG = 0;
  }else if(i == 0 && GROWTH_RATE < 0) {
    s = new Segment(width / 2, 400, PI, INITIAL_W, INITIAL_L);
    GROWTH_RATE *= -1;
  }*/
  
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