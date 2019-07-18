class Node_Core {
    /**
     * Node_Core contains the core variables that represent a Node.
     * With them it can memoize and calculate the following vectors as well
     * t; point of target; o + d
     * rw; right wing from origin
     * lw; left wing from origin
     * you cannot mutate directly t, dr, rw and lw
     * @param {Node_Vector} o point of origin
     * @param {Node_Vector} d displacement vector
     * @param {Number} w number > 0, base width
     */
    constructor(o, d, w) {
        this.o = o;
        this.d = d;
        this._t = Node_Vector.add(o,d);
        this._dr = new Node_Vector();
        this._rw = new Node_Vector();
        this._lw = new Node_Vector();
        this._w = w;
        this.wchanged = true;
    }
    get t() {
        if(this._o.changed || this._d.changed) {
            this._o.changed = false;
            if(this._d.changed) this.dr;
            this._t.x = this._o.x + this._d.x;
            this._t.y = this._o.y + this._d.y;
        }
        return this._t;
    }
    get dr() {
        if(this.d.changed || this.wchanged) {
            this.d.changed = false;
            this.wchanged = false;
            this._dr.a = this._d.a + HALF_PI;
            this._dr.m = this._w;
        }
        return this._dr;
    }
    updateWings() {
        this._dr.changed = false;
        this._lw.x = this.o.x - this._dr.x;
        this._lw.y = this.o.y - this._dr.y;
        this._rw.x = this.o.x + this._dr.x;
        this._rw.y = this.o.y + this._dr.y;
    }
    get lw() {
        if(this.dr.changed) this.updateWings();
        return this._lw;
    }
    get rw() {
        if(this.dr.changed) this.updateWings();
        return this._rw;
    }

    set t(v) { }
    set dr(v) { }
    set lw(v) { }
    set rw(v) { }

    get w() {
        return this._w;
    }
    set w(v) {
        this.wchanged = true;
        this._w = v;
    }
}