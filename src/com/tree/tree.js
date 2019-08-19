import Seg from './segment';

/**
 * draw function for tree
 * @param {*} p p5js argument object
 * @param {*} b bounds object
 * @return {Function} function to be used for a bounds draw
 */
export default function (p, b) {
  const s = new NoiseSeg(p, 0, 10, 25, {
    COUNT: 7000,
  });

  return function () {
    p.fill(150);
    p.noStroke();
    p.beginShape();
    s.step(b.o1.x + b.width * 0.5, b.o2.y, p.radians(-90), b);
    p.endShape();
  };
};

class NoiseSeg extends Seg {
  constructor(p, a, m, r, so, {
    growthRate = 1,
    growSpread = 18,
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
  wrapAngle(x) {
    const p = this._p;
    return x - 2 * p.PI * p.floor(x / (2 * p.PI) + 0.5);
  }
  step(ox, oy, cumA, b) {
    const p = this._p;
    let { tx, ty, rwx, rwy, lwx, lwy } = this.getCoords(ox, oy, cumA);

    switch (this.growthState) {
      case 0:
        this.growth += (1 - this.growth) * this.growthRate;
        if (p.round(this.growth * 100) == 100) {
          this.growth = 1;
          this.growthState = 1;
        }
        this.l = this.growth * this.targetL;
        this.r = this.growth * this.targetR;
        ({ tx, ty, rwx, rwy, lwx, lwy } = this.getCoords(ox, oy, cumA));
        // grow

        if (tx < b.o1.x) {
          const fa = this.wrapAngle(this.a + cumA);
          const dx = b.o1.x - ox;
          const dy = p.sqrt(this.l * this.l - dx * dx);
          this._d.x = dx;
          this._d.y = fa > 0 ? dy : -dy;
          this.a -= cumA;
          ({ tx, ty, rwx, rwy, lwx, lwy } = this.getCoords(ox, oy, cumA));
        }

        if (tx > b.o2.x) {
          const fa = this.wrapAngle(this.a + cumA);
          const dx = b.o2.x - ox;
          const dy = p.sqrt(this.l * this.l - dx * dx);
          this._d.x = dx;
          this._d.y = fa > 0 ? dy : -dy;
          this.a -= cumA;
          ({ tx, ty, rwx, rwy, lwx, lwy } = this.getCoords(ox, oy, cumA));
        }

        if (ty < b.o1.y) {
          let fa = this.wrapAngle(this.a + cumA + p.HALF_PI);
          const dy = b.o1.y - oy;
          const dx = p.sqrt(this.l * this.l - dy * dy);
          this._d.y = dy;
          this._d.x = fa > 0 ? dx : -dx;
          this.a -= cumA;
          ({ tx, ty, rwx, rwy, lwx, lwy } = this.getCoords(ox, oy, cumA));
        }

        if (ty > b.o2.y) {
          let fa = this.wrapAngle(this.a + cumA + p.HALF_PI);
          const dy = b.o2.y - oy;
          const dx = p.sqrt(this.l * this.l - dy * dy);
          this._d.y = dy;
          this._d.x = fa > 0 ? dx : -dx;
          this.a -= cumA;
          ({ tx, ty, rwx, rwy, lwx, lwy } = this.getCoords(ox, oy, cumA));
        }
        // bounds
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
              this.targetR + (0.1 - this.targetR) * 0.12,
              this.so,
              {
                branchRate: this.branchRate + (0.25 - this.branchRate) * 0.075//* 1.065
              }));
          }
        }
        this.growthState = 2;
        break;
    }

    p.vertex(lwx, lwy);
    if (this.children.length == 0) {
      p.vertex(tx, ty);
    } else {
      this.children.map((x) => x.step(tx, ty, this.a + cumA, b));
    }
    p.vertex(rwx, rwy);
  }
}
//TODO flower

//TODO make noise pen plotter box