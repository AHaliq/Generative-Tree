export default class Seg {
  constructor(p, a, m, r) {
    this._p = p;
    this.children = [];
    this._d = new Vec(p, a, m, false);
    this._w = new Vec(p, a + p.HALF_PI, r, false);
  }
  set a(v) {
    this._d.a = v;
    this._w.a = v + this._p.HALF_PI;
  }
  get a() {
    return this._d.a;
  }
  set l(v) {
    this._d.m = v;
  }
  get l() {
    return this._d.m;
  }
  set r(v) {
    this._w.m = v;
  }
  get r() {
    return this._w.m;
  }
  step(ox, oy, cumA) {
    this.a += cumA;
    const tx = ox + this._d.x;
    const ty = oy + this._d.y;
    const rwx = ox + this._w.x;
    const rwy = oy + this._w.y;
    const lwx = ox - this._w.x;
    const lwy = oy - this._w.y;
    this._algo(ox, oy, tx, ty, rwx, rwy, lwx, lwy);
    this.children.map((x) => x.step(tx, ty, this.a));
    this._palgo(ox, oy, tx, ty, rwx, rwy, lwx, lwy);
    this.a -= cumA;
  }
  /** To be shadowed by subclasses */
  _algo(ox, oy, tx, ty, rwx, rwy, lwx, lwy) {

  }
  _palgo(ox, oy, tx, ty, rwx, rwy, lwx, lwy) {

  }
}

export class Vec {
  constructor(p, v1 = 0, v2 = 0, cartesian = true) {
    this._p = p;
    this._upCar = !cartesian;
    this._upAng = cartesian;
    this._upMag = cartesian;
    this._changed = true;
    this._x = cartesian ? v1 : 0;
    this._y = cartesian ? v2 : 0;
    this._a = cartesian ? 0 : v1;
    this._m = cartesian ? 0 : v2;
  }
  _updateCartesian() {
    if (this._upCar) {
      this._x = this._p.cos(this._a) * this._m;
      this._y = this._p.sin(this._a) * this._m;
      this._upCar = false;
    }
  }
  get x() {
    this._updateCartesian();
    return this._x;
  }
  set x(v) {
    this._x = v;
    this._upAng = this._upMag = this._changed = true;
  }
  get y() {
    this._updateCartesian();
    return this._y;
  }
  set y(v) {
    this._y = v;
    this._upAng = this._upMag = this._changed = true;
  }
  get a() {
    if (this._upAng) {
      this._a = this._p.atan2(this._y, this._x);
      this._upAng = false;
    }
    return this._a;
  }
  set a(v) {
    this._a = v;
    this._upCar = this._changed = true;
  }
  get m() {
    if (this._upMag) {
      this._m = this._p.sqrt(this._x * this._x + this._y * this._y);
      this._upMag = false;
    }
    return this._m;
  }
  set m(v) {
    this._m = v;
    this._upCar = this._changed = true;
  }
  check() {
    const s = this._changed;
    this._changed = false;
    return s;
  }
  static add(v1, v2) {
    return new Vec(v1._p, v1.x + v2.x, v1.y + v2.y);
  }
}