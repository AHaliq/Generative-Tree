/** distance from bounds where growth stops */
const BORDER = 50;

const FLOWER_COLOR = [255,100,100];
const SEGMENT_COLOR = [80,20,10];
const ROUND_A_S = 1000;
const ROUND_G_S = 10;

/** minimum width length for segment to branch */
const GROWTH_CAP = 1;
/** first segment's width */
const INITIAL_W = 12;
/** first segment's length */
const INITIAL_L = 12;
// initial conditions

/** [0,1] probability a segment has flowers */
let FLOWER_PROB = 0.2;
let FLOWER_GROW = 0.2;
// flower consts

/** (0,1] probability wilting will occur on -ve GROWTH_RATE */
let WILT_PROB = 0.5;
/** [-1,1] negative wilts, positive grows */
let GROWTH_RATE = 1;//0.8;
/** [0,1] factor of PI each branch randomly deviates */
let GROW_BEND = 0.5;
/** [0,1] branch width is current times this factor */
let WIDTH_DECAY = 0.97;
/** [0,1] branch length is current times this factor */
let LENGTH_DECAY = 0.97//99;
// grow/wilt constants

/** [0,1] factor of PI each branch if >= 2 randomly deviates */
let BRANCH_BEND = 1//0.25;
/** [0,90*BEND] quantized steps of branch random deviation */
let BRANCH_BEND_QUAN = 1//60;
/** [0,1) probability > 1 branch sprouts when a segment fully grown */
let BRANCH_PROB = 0.07;
// branch consts

/** TODO ease to BRANCH_BEND / N.length * index */
let SPREAD_RATE = 0//0.1;
/** [0,1] ease factor to parent segment's angle */
let STRAIGHTEN_RATE = 0//0.02;
/** [0,1] scale by random factor */
let LENGTH_RANDOMOFF = 0.5;
/** [0,1] scale factor */
let LENGTH_SCALE = 1//0.999;
// animation consts

let RBND, BBND;
const HPI = Math.PI * 0.5;
const GROW_BEND_MAG = HPI * GROW_BEND;
const BRANCH_BEND_MAG = HPI * BRANCH_BEND;
const BRANCH_BEND_QR = Math.PI / 180 * BRANCH_BEND_QUAN;
let SPREAD_RATE_MAG = HPI * SPREAD_RATE;
const LENGTH_RO_MAG = LENGTH_RANDOMOFF * 0.5;
// memoized calculations

let petals = [];

class Flower {
  constructor(x,y,tr,col) {
    this.x = x;
    this.xvel = 0;
    this.y = y;
    this.col = col;
    this.tr = tr;
    this.alpha = 255;
    this.fade = random(0.002,0.0025) * 255;
    this.grav = random(0.2,1.5);
    this.wind = random(2,4);
    this.reset();
  }
  reset() {
    this.r = 0; 
  }
  grow() {
    this.r += (this.tr - this.r) * FLOWER_GROW;
  }
  fall() {
    this.y += this.grav;
    this.xvel += (this.wind - this.xvel) * 0.01;
    this.x += this.xvel;
    this.t += 0.1;
    this.alpha -= this.fade;
    if(this.x > RBND || this.y > BBND || this.x < BORDER || this.y < BORDER) this.alpha = 0;
  }
  render() {
    noStroke();
    fill(...this.col,this.alpha);
    ellipse(this.x, this.y, this.r);
  }
}

class Segment {
  constructor(x,y,a,w,l) {
    this.x = x;
    this.y = y;
    this.a = a;
    this.w = w;
    this.l = l;
    this.reset();
  }
  reset() {
    this.flower = undefined;
    this.c = 0;
    this.N = [];
    this.matured = false;
  }
  get peak() {
    return [
      this.x - Math.cos(this.a - HPI) * this.c,
      this.y - Math.sin(this.a - HPI) * this.c];
  }
  resize() {
    let lr = 1 + random(-LENGTH_RO_MAG, LENGTH_RO_MAG);
    this.l *= lr;
    this.N.map((s) => s.resize());
  }
  grow() { // 0 - wilted, 1 - wilting/growing, 2 - grown
    this.l *= LENGTH_SCALE;
    this.c *= LENGTH_SCALE;
    let res;
    let anm = 0, acap;
    const SRMQ = 2 * SPREAD_RATE_MAG / (this.N.length - 1);
    const oldNL = this.N.length;
    [this.N,res] = this.N.reduce(([nn,p],s,i) => {
      let [px,py] = this.peak;
      s.x = px;
      s.y = py;
      acap = s.a;
      s.a += (this.a - s.a) * STRAIGHTEN_RATE;
      s.a += (this.a + (oldNL == 1 ? 0 : -SPREAD_RATE_MAG + SRMQ * i) - s.a) * SPREAD_RATE;
      let [j,banm] = s.grow();
      if(banm == 1 || round((s.a - acap) * ROUND_A_S) != 0) anm = 1;
      return [j == 0 ? nn : [...nn,s], p == 1 ? 1 : j];
    }, [[],2]);
    const stopWilt = oldNL > 0 && this.N.length == 0;
    
    if(this.flower && GROWTH_RATE < 0) {
      petals.push(this.flower);
      this.flower = undefined;
    }else if(this.N.length == 0 && GROWTH_RATE < 0 && !stopWilt) {
      if(Math.random() < WILT_PROB) this.c += this.c * GROWTH_RATE;
    }else if(this.x > RBND || this.x < BORDER || this.y > BBND || this.y < BORDER) {
      this.c = this.l
    }else if(this.c != this.l) {
      this.c += (this.l - this.c) * GROWTH_RATE;
      if(round((this.l - this.c) * ROUND_G_S) == 0 && !this.matured) {
        this.matured = true;
        this.c = this.l;
        if(!(this.l < GROWTH_CAP || this.w < GROWTH_CAP)) {
          this.branch(random(-GROW_BEND_MAG, GROW_BEND_MAG));
          while(random() < BRANCH_PROB)
            this.branch(round(random(-BRANCH_BEND_MAG, BRANCH_BEND_MAG) /
              BRANCH_BEND_QR) * BRANCH_BEND_QR);
          return [1,anm];
        }else if(random() < FLOWER_PROB) {
          this.flower = new Flower(...this.peak, random(5,10), FLOWER_COLOR.map((v) => v * (0.5+random())));
        }
      }
    }
    if(this.flower) this.flower.grow();
    
    if(GROWTH_RATE < 0 && round(this.c * ROUND_G_S) == 0) return [0,anm];
    else if(GROWTH_RATE >= 0 && this.c == this.l) return [res,anm];
    return [1,anm];
  }
  branch(na) {
    this.N.push(new Segment(
      ...this.peak,
      this.a + na,
      this.w * WIDTH_DECAY,
      this.l * LENGTH_DECAY
    ));
  }
  render() {
    const
    af = this.w * 0.5 * (this.c / this.l),
    dx = Math.cos(this.a) * af,
    dy = Math.sin(this.a) * af;
    
    vertex(this.x - dx, this.y - dy);
    if(this.N.length > 0 ) {
      this.N.map((s) => s.render());
    }else {
      let [px, py] = this.peak;
      vertex(px, py);
      if(this.flower) {
        this.flower.x = px;
        this.flower.y = py;
        this.flower.render();
      }
    }
    vertex(this.x + dx,this.y + dy);
  }
}

let s;
function setup() {
  createCanvas(600, 600);
  RBND = width - BORDER;
  BBND = height - BORDER;
  s = new Segment(width / 2, 400, PI, INITIAL_W, INITIAL_L);
  button = createButton('shuffle lengths');
  button.mousePressed(() => s.resize());
}

let phase = 0, tmr = 120;
function draw() {
  background(220);
  stroke(200);
  line(BORDER,BORDER,RBND,BORDER);
  line(RBND,BORDER,RBND,BBND);
  line(RBND,BBND,BORDER,BBND);
  line(BORDER,BBND,BORDER,BORDER);
  
  let [i,j] = s.grow();
  petals = petals.reduce((ps,p) => {
    p.render();
    p.fall();
    return p.alpha <= 0 ? ps : [...ps, p];
  }, []);
  
  noStroke();
  beginShape();
  
  if(i==2 && j == 0 && SPREAD_RATE == 0) { 
    if(tmr == 0) {
      SPREAD_RATE = 0.25;
      SPREAD_RATE_MAG = HPI * SPREAD_RATE;
      tmr=120;
    }else tmr--;
  }else if(i == 2 && j == 0 && SPREAD_RATE > 0) {
    GROWTH_RATE *= -1;
    SPREAD_RATE = 0;
    SPREAD_RATE_MAG = 0;
  }else if(i == 0 && GROWTH_RATE < 0) {
    s = new Segment(width / 2, 400, PI, INITIAL_W, INITIAL_L);
    GROWTH_RATE *= -1;
  }
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
  s.render();
  fill(...SEGMENT_COLOR);
  endShape();
}