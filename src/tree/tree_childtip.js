class T_ChildTip extends T {
    constructor(x, y, a, l, w, lv = {}, sv = {}, growRate = 0.5) {
        super(x, y, a, 0, 0, Object.assign({
            N: [],
            c: 0,
            FULL_LENGTH: l,
            FULL_WIDTH: w,
            GROW_STATE: 0
        }, lv), Object.assign({
            GROW_RATE: growRate,
            TREE_STATE: 1
        }, sv));
        this.root.behaviours.push(this.grow, this.branch, this.stepChildren);
    }
    step() {
        this.root.SV.TREE_STATE = 1;
        super.step();
    }
    grow(node) {
        if (node.LV.GROW_STATE == 0) {
            node.SV.TREE_STATE = 0;
            node.LV.c += (1 - node.LV.c) * node.SV.GROW_RATE;
            node.C.d.m = node.LV.c * node.LV.FULL_LENGTH;
            node.C.w = node.LV.c * node.LV.FULL_WIDTH;
            if (round(node.LV.c * 100) / 100 == 1) {
                node.LV.GROW_STATE = 1;
                node.LV.c = 1;
            }
        }
    }
    branch(node) {
        if (node.LV.GROW_STATE == 1) {
            let n = new Node(
                createCore(node.C.t.x, node.C.t.y, node.C.d.a, 0, node.C.w),
                node.LV, node.SV, node.behaviours, node.renders);
            n.LV.N = [];
            n.LV.c = 0;
            n.LV.GROW_STATE = 0;
            node.LV.N.push(n);
            node.LV.GROW_STATE = 2;
            return true;
        }
        return false;
    }
    stepChildren(node) {
        for (const c of node.LV.N) c.step();
    }
}