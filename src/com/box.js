/**
 * Returns a box with boundaries and draw function
 * @param {Function} param.draw draw function to be called
 * @param {Number} param.x1 top left x coordinate
 * @param {Number} param.y1 top left y coordinate
 * @param {Number} param.x2 btm right x coordinate
 * @param {Number} param.y2 btm right y coordinate
 * @return {Object} box object with boundaries
 */
export default function makeBox({draw, x1 = 0, y1 = 0, x2 = 0, y2 = 0} = {}) {
  const _o1 = {x: x1, y: y1};
  const _o2 = {x: x2, y: y2};
  return {
    draw: draw,
    o1: _o1,
    o2: _o2,
    get width() {
      return _o2.x - _o1.x;
    },
    get height() {
      return _o2.y - _o1.y;
    },
    set width(v) {
      _o2.x = v + _o1.x;
    },
    set height(v) {
      _o2.y = v + _o1.y;
    },
  };
}
