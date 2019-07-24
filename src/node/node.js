class Node {
    constructor(c, lv = {}, sv = {}, bhvs = [], rnds = []) {
        this.C = c;
        this.SV = sv;
        this.LV = Object.assign({}, lv);
        this.behaviours = bhvs;
        this.renders = rnds;
    }
    step() {
        for(const f of this.behaviours) f(this);
    }
    render() {
        for(const f of this.renders) f(this);
    }
}

function createCore(x,y,a,l,w) {
    return new Node_Core(
        new Node_Vector(x,y),
        new Node_Vector(a,l,false),
        w
    )
}