import T_ChildTip from './tree_childtip';

export default class T_Block extends T_ChildTip {
  constructor(p, x, y, a, l, w, growRate = 0.5, bendAng = 45, clr = color(0, 125, 0), border = 100) {
    super(p, x, y, a, l, w, {}, {
      BRANCH_ANG: bendAng,
      BORDER: border
    }, growRate);
    this.p = p;
    this.root.behaviours.splice(1, 0, this.detectBounds);
    this.root.renders.push(this.plotVertex);
    this.COLOR = clr;
    this.ALPHA = 256
  }
  render() {
    if (this.root.SV.TREE_STATE == 1) this.ALPHA += -this.ALPHA * this.root.SV.GROW_RATE;
    this.COLOR.setAlpha(this.ALPHA)
    this.p.fill(this.COLOR);
    this.p.beginShape();
    this.p.noStroke();
    super.render();
    this.p.endShape();
  }
  detectBounds(node, p) {
    const b = node.SV.BORDER;
    if (node.LV.GROW_STATE == 1 && (node.C.t.x < b || node.C.t.x > p.width - b || node.C.t.y < b || node.C.t.y > p.height - b)) {
      node.LV.GROW_STATE = 2;
    }
  }
  branch(node, p) {
    if (super.branch(node, p)) {
      node.LV.N[node.LV.N.length - 1].C.d.a += p.radians((p.random() < 0.5 ? -1 : 1) * node.SV.BRANCH_ANG);
    }
  }
  plotVertex(node, p) {
    p.vertex(node.C.lw.x, node.C.lw.y);
    if (node.LV.N.length > 0) {
      node.LV.N.map((n) => n.render());
    } else {
      p.vertex(node.C.t.x, node.C.t.y);
      p.ellipse(node.C.t.x, node.C.t.y, 25);
    }
    p.vertex(node.C.rw.x, node.C.rw.y);
  }
}