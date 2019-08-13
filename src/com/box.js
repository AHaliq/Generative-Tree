export default function Box({ draw, x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = {}) {
  let _o1 = { x: x1, y: y1 };
  let _o2 = { x: x2, y: y2 };
  return {
    draw: draw,
    o1: _o1,
    o2: _o2,
    get width() { return _o2.x - _o1.x },
    get height() { return _o2.y - _o1.y },
    set width(v) { _o2.x = v + _o1.x; },
    set height(v) { _o2.y = v + _o1.y; }
  }
}
