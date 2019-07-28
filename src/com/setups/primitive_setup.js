import T_Primitive from '../tree/tree_primitive';

export default class PrimitiveSetup {
    constructor(p, border) {
        this.p = p;
        this.BORDER = border;
        this.t = new T_Primitive(p, p.width * 0.5, p.height - border * 2, p.radians(-90), 50, 25, 0.1, 10);
    }
    algo() {
        this.t.step();
        this.t.render();
    }
}