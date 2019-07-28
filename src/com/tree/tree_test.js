import Tree from './tree';
import Node, { createCore } from '../node/node';

export class T_Basic extends Tree {
    constructor(p, x, y, a, l, w, lv = {}, sv = {}) {
        super(p, x, y, a, 0, 0,
            {
                ...{
                    N: [],
                    c: 0,
                    fulllength: l,
                    fullwidth: w,
                    GROW_STATE: 0
                }, ...lv
            },
            {
                ...{
                    GROW_RATE: 0.1,
                    COUNT: 10
                }, ...sv
            }
        );
        this.p = p;
        this.root.behaviours.push(this.grow, this.branch(p), this.stepChildren);
        this.root.renders.push(this.drawSegment, this.renderChildren);
    }
    render() {
        this.p.noStroke();
        super.render();
    }
    stepChildren(node) {
        for (const c of node.LV.N) c.step();
    }
    renderChildren(node) {
        for (const c of node.LV.N) c.render();
    }
    grow(node) {
        if (node.LV.GROW_STATE == 0) {
            node.LV.c += (1 - node.LV.c) * node.SV.GROW_RATE;
            node.C.d.m = node.LV.c * node.LV.fulllength;
            node.C.w = node.LV.c * node.LV.fullwidth;
            if (this.p.round(node.LV.c * 100) / 100 == 1) {
                node.LV.GROW_STATE = 1;
                node.LV.c = 1;
            }
        }
    }
    branch_makeNode(node, p) {
        let n = new Node(p,
            createCore(node.C.t.x, node.C.t.y, node.C.d.a, 0, node.C.w),
            node.LV, node.SV, node.behaviours, node.renders);
        n.LV.N = [];
        n.LV.c = 0;
        n.LV.GROW_STATE = 0;
        return n;
    }
    branch_activation(node) {
        return node.LV.GROW_STATE == 1 && node.SV.COUNT > 0;
    }
    branch() {
        return (node) => {
            if (this.branch_activation(node)) {
                node.LV.N.push(this.branch_makeNode(node));
                node.LV.GROW_STATE = 2;
                node.SV.COUNT--;
            }
        }
    }
    drawSegment(node, p) {
        p.beginShape();
        p.vertex(node.C.rw.x, node.C.rw.y);
        p.vertex(node.C.lw.x, node.C.lw.y);
        if (node.LV.N.length > 0) {
            let [_, nnC] = node.LV.N.reduce(([m, v], c) => {
                let nm = Node_Vector.sub(c.C.lw, node.C.lw).m;
                if (nm < m) return [nm, c.C.lw];
                return [m, v]
            }, [Infinity, null]);
            p.vertex(nnC.x, nnC.y);
            p.vertex(node.C.t.x, node.C.t.y);
            [_, nnC] = node.LV.N.reduce(([m, v], c) => {
                let nm = Node_Vector.sub(c.C.rw, node.C.rw).m;
                if (nm < m) return [nm, c.C.rw];
                return [m, v]
            }, [Infinity, null]);
            p.vertex(nnC.x, nnC.y);
        } else {
            p.vertex(node.C.t.x, node.C.t.y);
        }
        p.endShape();
    }
}

export default class T_Test extends T_Basic {
    constructor(p, x, y, a, l, w, lv = {}, sv = {}) {
        this.p = p;
        super(p, x, y, a, l, w,
            {
                ...{
                    SEGMENT_COLOR: this.p.color(255, 255, 255)
                }, ...lv
            },
            {
                ...{
                    GROW_RATE: 0.1
                }, ...sv
            });
        this.root.renders.push((node) => {
            this.p.noStroke();
            this.p.fill(node.LV.SEGMENT_COLOR);
        });
    }
    branch_makeNode(node, p) {
        let n = super.branch_makeNode(node, p);
        n.LV.fullwidth *= 0.95;
        n.LV.SEGMENT_COLOR = p.lerpColor(node.LV.SEGMENT_COLOR, p.color(0, 255, 0), 0.1);
        //n.C.d.a += radians(3);
        return n;
    }
    branch(p) {
        return (node) => {
            if (this.branch_activation(node)) {
                let n = this.branch_makeNode(node, p);
                n.C.d.a -= p.radians(45);
                node.LV.N.push(n);
                n = this.branch_makeNode(node, p);
                n.C.d.a += p.radians(45);
                node.LV.N.push(n);
                node.LV.GROW_STATE = 2;
                node.SV.COUNT -= 2;
            }
        }
    }
}