import Node, { createCore } from '../node/node';

export default class Tree {
    constructor(p, x, y, a, l, w, lv = {}, sv = {}) {
        this.p = p;
        this.root = new Node(this.p,
            createCore(x, y, a, l, w),
            { ...lv },
            { ...sv },
            [],
            []
        );
    }
    step() {
        this.root.step();
    }
    render() {
        this.root.render();
    }
}