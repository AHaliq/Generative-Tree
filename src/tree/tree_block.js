class T_Block extends T_ChildTip {
    constructor(x, y, a, l, w, growRate = 0.5, bendAng = 45, clr = color(0, 125, 0), border = 100) {
        super(x, y, a, l, w, {}, {
            BRANCH_ANG: bendAng,
            BORDER: border
        }, growRate);
        this.root.behaviours.splice(1, 0, this.detectBounds);
        this.root.renders.push(this.plotVertex);
        this.COLOR = clr;
        this.ALPHA = 256
    }
    render() {
        if (this.root.SV.TREE_STATE == 1) this.ALPHA += -this.ALPHA * this.root.SV.GROW_RATE;
        this.COLOR.setAlpha(this.ALPHA)
        fill(this.COLOR);
        beginShape();
        noStroke();
        super.render();
        endShape();
    }
    detectBounds(node) {
        const b = node.SV.BORDER;
        if (node.LV.GROW_STATE == 1 && (node.C.t.x < b || node.C.t.x > width - b || node.C.t.y < b || node.C.t.y > height - b)) {
            node.LV.GROW_STATE = 2;
        }
    }
    branch(node) {
        if (super.branch(node)) {
            node.LV.N[node.LV.N.length - 1].C.d.a += radians((random() < 0.5 ? -1 : 1) * node.SV.BRANCH_ANG);
        }
    }
    plotVertex(node) {
        vertex(node.C.lw.x, node.C.lw.y);
        if (node.LV.N.length > 0) {
            node.LV.N.map((n) => n.render());
        } else {
            vertex(node.C.t.x, node.C.t.y);
            ellipse(node.C.t.x, node.C.t.y, 25);
        }
        vertex(node.C.rw.x, node.C.rw.y);
    }
}