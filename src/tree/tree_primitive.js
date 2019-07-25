class T_Primitive extends T_ChildTip {
    constructor(x, y, a, l, w, growRate = 0.5, count = 10) {
        super(x, y, a, l, w, {}, {
            COUNT: count
        }, growRate);
        this.root.behaviours.splice(1, 0, this.checkLength);
        this.root.renders.push(this.plotVertex);
    }
    render() {
        beginShape();
        super.render();
        endShape();
    }
    checkLength(node) {
        if (node.LV.GROW_STATE == 1 && node.SV.COUNT == 0) node.LV.GROW_STATE = 2;
    }
    branch(node) {
        if (super.branch(node)) {
            node.SV.COUNT--;
        }
    }

    plotVertex(node) {
        vertex(node.C.lw.x, node.C.lw.y);
        if (node.LV.N.length > 0) {
            node.LV.N.map((n) => n.render());
        } else {
            vertex(node.C.t.x, node.C.t.y);
        }
        vertex(node.C.rw.x, node.C.rw.y);
        vertex(node.C.lw.x, node.C.lw.y);
        vertex(node.C.rw.x, node.C.rw.y);
    }
}