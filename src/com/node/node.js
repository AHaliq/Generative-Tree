import Node_Core from './node_core';
import Node_Vector from './node_vector';

export default class Node {
    constructor(p, c, lv = {}, sv = {}, bhvs = [], rnds = []) {
        this.p = p;
        this.C = c;
        this.SV = sv;
        this.LV = { ...lv };
        this.behaviours = bhvs;
        this.renders = rnds;
    }
    step() {
        for (const f of this.behaviours) f(this, this.p);
    }
    render() {
        for (const f of this.renders) f(this, this.p);
    }
}

export function createCore(x, y, a, l, w) {
    return new Node_Core(
        new Node_Vector(x, y),
        new Node_Vector(a, l, false),
        w
    )
}