import T_ChildTip from './tree_childtip';

export default class T_Primitive extends T_ChildTip {
    constructor(p, x, y, a, l, w, growRate = 0.5, count = 10) {
        super(p, x, y, a, l, w, {}, {
            COUNT: count
        }, growRate);
        this.p = p;
        this.root.behaviours.splice(1, 0, this.checkLength);
        this.root.renders.push(this.plotVertex);
    }
    render() {
        this.p.beginShape();
        super.render();
        this.p.endShape();
    }
    checkLength(node) {
        if (node.LV.GROW_STATE == 1 && node.SV.COUNT == 0) node.LV.GROW_STATE = 2;
    }
    branch(node, p) {
        if (super.branch(node, p)) {
            node.SV.COUNT--;
        }
    }

    plotVertex(node, p) {
        p.vertex(node.C.lw.x, node.C.lw.y);
        if (node.LV.N.length > 0) {
            node.LV.N.map((n) => n.render());
        } else {
            p.vertex(node.C.t.x, node.C.t.y);
        }
        p.vertex(node.C.rw.x, node.C.rw.y);
        p.vertex(node.C.lw.x, node.C.lw.y);
        p.vertex(node.C.rw.x, node.C.rw.y);
    }
}