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
