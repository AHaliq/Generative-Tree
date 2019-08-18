import Seg from './segment';

/**
 * draw function for tree
 * @param {*} p p5js argument object
 * @param {*} b bounds object
 * @return {Function} function to be used for a bounds draw
 */
export default function (p, b) {
  const s = new NoiseSeg(p, 0, 10, 25, {
    GROWTH_RATE: 0.1,
    COUNT: 7000,
  });

  return function () {
    p.translate(b.o1.x + b.width * 0.5, b.o2.y);
    p.fill(150);
    p.noStroke();
    p.beginShape();
    s.step(0, 0, p.radians(-90));
    p.endShape();
  };
};

class NoiseSeg extends Seg {
  constructor(p, a, m, r, so, {
    growthRate = 1,
    growSpread = 20,
    branchRate = 0.05,
    branchSpread = 45
  } = {}) {
    super(p, a, 0, 0);
    this.growth = 0;
    this.growthState = 0;
    this.growthRate = growthRate;
    this.growSpread = growSpread;
    this.branchRate = branchRate;
    this.branchSpread = branchSpread;
    this.targetL = m;
    this.targetR = r;
    this.so = so;
  }
  _algo(ox, oy, tx, ty, rwx, rwy, lwx, lwy) {
    const p = this._p;

    switch (this.growthState) {
      case 0:
        this.growth += (1 - this.growth) * this.growthRate;
        if (p.round(this.growth * 100) == 100) {
          this.growth = 1;
          this.growthState = 1;
        }
        this.l = this.growth * this.targetL;
        this.r = this.growth * this.targetR;
        break;
      case 1:
        if (this.so.COUNT-- > 0) {
          const toSplit = p.random() < this.branchRate;
          const cCount = toSplit ? 2 : 1;
          const sprd = toSplit ? this.branchSpread : this.growSpread;
          for (let i = 0; i < cCount; i++) {
            this.children.push(new NoiseSeg(
              p,
              p.radians(p.random(-1, 1) * sprd),
              this.targetL,
              this.targetR + (0.5 - this.targetR) * 0.12,
              this.so,
              {
                branchRate: this.branchRate * 1.05
              }));
          }
        }
        this.growthState = 2;
        break;
    }

    p.vertex(lwx, lwy);
    if (this.children.length == 0) {
      p.vertex(tx, ty);
    }
  }
  _palgo(ox, oy, tx, ty, rwx, rwy, lwx, lwy) {
    const p = this._p;
    p.vertex(rwx, rwy);
  }
}