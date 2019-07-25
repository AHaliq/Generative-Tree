class PrimitiveSetup {
    constructor(border) {
        this.BORDER = border;
        this.t = new T_Primitive(width * 0.5, height - border * 2, radians(-90), 50, 25, 0.1, 10);
    }
    algo() {
        this.t.step();
        this.t.render();
    }
}