class T_Block extends T {
    constructor(x,y,a,l,w, growRate = 0.5, bendAng = 45, clr = color(0,125,0), border = 100) {
        super(x,y,a,0,0,{
            N: [],
            c: 0,
            FULL_LENGTH: l,
            FULL_WIDTH: w,
            GROW_STATE: 0
        },{
            GROW_RATE: growRate,
            BRANCH_ANG: bendAng,
            DEAD: false,
            BORDER: border,
            ALIVE: false
        });
        this.root.behaviours.push(this.grow, this.branch, this.stepChildren);
        this.root.renders.push(this.plotVertex);

        this.COLOR = clr;
        this.ALPHA = 256
    }
    step() {
        this.root.SV.ALIVE = false;
        super.step();
    }
    render() {
        if(!this.root.SV.ALIVE) this.ALPHA += -this.ALPHA * this.root.SV.GROW_RATE;
        this.COLOR.setAlpha(this.ALPHA)
        fill(this.COLOR);
        beginShape();
        noStroke();
        super.render();
        endShape();
    }
    stepChildren(node) {
        for(const c of node.LV.N) c.step();
    }
    branch(node) {
        if(node.LV.GROW_STATE == 1) {
            const b = node.SV.BORDER;
            if(node.C.t.x < b || node.C.t.x > width - b || node.C.t.y < b || node.C.t.y > height - b) {
                node.SV.DEAD = true;
            }else {
                let n = new Node(
                    createCore(node.C.t.x, node.C.t.y, node.C.d.a, 0, node.C.w),
                    node.LV, node.SV, node.behaviours, node.renders);
                n.LV.N = [];
                n.LV.c = 0;
                n.LV.GROW_STATE = 0;
                n.C.d.a += radians((random() < 0.5 ? -1 : 1) * node.SV.BRANCH_ANG);
                node.LV.N.push(n);
            }
            node.LV.GROW_STATE = 2;
        }
    }
    grow(node) {
        if(node.LV.GROW_STATE == 0) {
            node.SV.ALIVE = true;
            node.LV.c += (1-node.LV.c) * node.SV.GROW_RATE;
            node.C.d.m = node.LV.c * node.LV.FULL_LENGTH;
            node.C.w = node.LV.c * node.LV.FULL_WIDTH;
            if (round(node.LV.c*100)/100 == 1) {
                node.LV.GROW_STATE = 1;
                node.LV.c = 1;
            }
        }
    }
    plotVertex(node) {
        vertex(node.C.lw.x, node.C.lw.y);
        if(node.LV.N.length > 0) {
            node.LV.N.map((n) => n.render());
        }else {
            vertex(node.C.t.x, node.C.t.y);
            ellipse(node.C.t.x, node.C.t.y, 25);
        }
        vertex(node.C.rw.x, node.C.rw.y);
    }
}