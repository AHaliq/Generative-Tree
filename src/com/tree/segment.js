/**
 * decorate a segment object with behaviours
 * @param {SegBase} s
 */
export function wrapSegBehaviour(s) {
  behaviours = [];
  Object.defineProperties(s, {
    addBehaviour: {
      value: function(b) {
        behaviours.push(b);
      },
    },
    step: {
      value: function() {
        behaviours.map((x) => x(s));
      },
    },
  });
}

/**
 * Helper shortcut to create SegBaseW
 * @param {p5js} p
 * @param {Number} x origin x
 * @param {Number} y origin y
 * @param {Number} a displacement angle
 * @param {Number} m displacement magnitude
 * @param {Number} r wing radius
 * @return {SegBaseW}
 */
export function makeSegBaseW(p, x, y, a, m, r) {
  return wrapSegBaseW(makeSegBase(p, x, y, a, m), r);
}

/**
 * wraps a SegBase object with wing vectors
 * @param {SegBase} s
 * @param {Number} r
 * @return {SegBaseW}
 */
export function wrapSegBaseW(s, r) {
  const p = s._p;
  const _w = makeVec(p, 0, r, false);
  let _rw; let _lw = {};
  let rchanged = true;
  const updateW = function() {
    if (s._tcheck() || rchanged) {
      _w.a = s.d.a + p.HALF_PI;
      _rw = {x: s.o.x + _w.x, y: s.o.y + _w.y};
      _lw = {x: s.o.x - _w.x, y: s.o.y - _w.y};
      rchanged = false;
    }
  };
  Object.defineProperties(s, {
    rw: {
      get: function() {
        s._updateT();
        updateW();
        return _rw;
      },
    },
    lw: {
      get: function() {
        s._updateT();
        updateW();
        return _lw;
      },
    },
    r: {
      set: function(v) {
        _w.m = v;
        rchanged = true;
      },
    },
  });
  return s;
}

/**
 * makes a segment object; origin and target point
 * @param {p5js} p p5js argument object
 * @param {Number} x origin x
 * @param {Number} y origin y
 * @param {Number} a displacement angle
 * @param {Number} m displacement magnitude
 * @return {SegBase}
 */
export function makeSegBase(p, x, y, a, m) {
  const _o = makeVec(p, x, y);
  const _d = makeVec(p, a, m, false);
  const _t = makeVec(p);
  /** updates target point */
  function __updateT() {
    if (_o.check() || _d.check()) {
      _t.x = _o.x + _d.x;
      _t.y = _o.y + _d.y;
    }
  }
  return {
    _p: p,
    _updateT: __updateT,
    _tcheck: _t.check,
    get o() {
      return _o;
    },
    get d() {
      return _d;
    },
    get t() {
      __updateT();
      return {x: _t.x, y: _t.y};
    },
  };
}

/**
 * makes a vector object
 * @param {p5js} p p5js argument object
 * @param {Number} v1 x or angle
 * @param {Number} v2 y or magnitude
 * @param {Boolean} cartesian determines the quantity v1 and v2 represents
 * @return {Vec} vector object
 */
export function makeVec(p, v1 = 0, v2 = 0, cartesian = true) {
  let upCar = !cartesian;
  let upAng = cartesian;
  let upMag = cartesian;
  let changed = true;
  let _x = cartesian ? v1 : 0;
  let _y = cartesian ? v2 : 0;
  let _a = cartesian ? 0 : v1;
  let _m = cartesian ? 0 : v2;
  return {
    get x() {
      if (upCar) {
        _x = p.cos(_a) * _m;
        _y = p.sin(_a) * _m;
        upCar = false;
      }
      return _x;
    },
    set x(v) {
      _x = v;
      upAng = upMag = changed = true;
    },
    get y() {
      if (upCar) {
        _x = p.cos(_a) * _m;
        _y = p.sin(_a) * _m;
        upCar = false;
      }
      return _y;
    },
    set y(v) {
      _y = v;
      upAng = upMag = changed = true;
    },
    get a() {
      if (upAng) {
        _a = p.atan2(_y, _x);
        upAng = false;
      }
      return _a;
    },
    set a(v) {
      _a = v;
      upCar = changed = true;
    },
    get m() {
      if (upMag) {
        _m = p.sqrt(_x * _x + _y * _y);
        upMag = false;
      }
      return _m;
    },
    set m(v) {
      _m = v;
      upCar = changed = true;
    },
    check: function() {
      const s = changed;
      changed = false;
      return s;
    },
  };
}
