export const sdNeighbor = (function() {
  const behaviorFunction = function(s) {
    s.neighbor.map((x) => x.step());
  };
  return function(s) {
    Object.defineProperties(s, {
      neighbor: {
        value: [],
      },
    });
    s.addBehaviour(behaviorFunction);
  };
})();
export const sdGrow = (function() {
  const behaviorFunction = function(s) {
    s.CURRENT_GROWTH += (1 - s.CURRENT_GROWTH) * s.GROW_RATE;
    s.d.m = s.TARGET_LENGTH * s.CURRENT_GROWTH;
    s.r = s.TARGET_RADIUS * s.CURRENT_GROWTH;
  };
  return function(s, growRate = 0.1) {
    Object.defineProperties(s, {
      CURRENT_GROWTH: {
        value: 0,
        writable: true,
      },
      TARGET_LENGTH: {
        value: s.d.m,
        writable: true,
      },
      TARGET_RADIUS: {
        value: s.r,
        writable: true,
      },
      GROW_RATE: {
        value: growRate,
        writable: true,
      },
    });
    s.addBehaviour(behaviorFunction);
  };
})();
