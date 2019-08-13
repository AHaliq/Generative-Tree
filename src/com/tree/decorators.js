export function sd_neighbor(s) {
  Object.defineProperties(s, {
    neighbor: {
      value: []
    }
  });
  s.addBehaviour(sd_neighbor_b);
}
function sd_neighbor_b(s) {
  s.neighbor.map(x => x.step());
}