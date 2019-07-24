class Node_Vector {
    /**
     * This vector class memoizes its cartesian and polar values and updates
     * them only when necessary. It also has a flag 'changed' that is set to
     * true whenever a mutation has occured.
     * @param {*} a if cartesian 'x' else 'angle'
     * @param {*} b if cartesian 'y' else 'magnitude'
     * @param {Boolean} cartesian flag to determine arguments, defaults to true
     */
    constructor(a, b, cartesian = true) {
        this.changed = false;
        if(cartesian) {
            this._x = a;
            this._y = b;
            this._uA = true;
            this._uM = true;
        }else {
            this._a = a;
            this._m = b;
            this._uC = true;
        }
    }
    get x() {
        if(this._uC) this.updateCartesian();
        return this._x;
    }
    set x(v) {
        this.changed = true;
        this._uA = true;
        this._uM = true;
        this._x = v;
    }
    get y() {
        if(this._uC) this.updateCartesian();
        return this._y;
    }
    set y(v) {
        this.changed = true;
        this._uA = true;
        this._uM = true;
        this._y = v;
    }
    get a() {
        if(this._uA) this.updateAngle();
        return this._a;
    }
    set a(v) {
        this.changed = true;
        this._uC = true;
        this._a = v; //- (ceil((v + PI)/(TWO_PI)) - 1) * TWO_PI;
    }
    get m() {
        if(this._uM) this.updateMagnitude();
        return this._m;
    }
    set m(v) {
        this.changed = true;
        this._uC = true;
        this._m = v;
    }

    updateCartesian() {
        this._uC = false;
        this._x = Math.cos(this._a) * this._m;
        this._y = Math.sin(this._a) * this._m;
    }
    updateAngle() {
        this._uA = false;
        this._a = Math.atan2(this._y, this._x);
    }
    updateMagnitude() {
        this._uM = false;
        this._m = Math.sqrt(this._x * this._x + this._y * this._y);
    }

    /**
     * Creates a new vector object with the same values as argument
     * @param {*} v 
     */
    static clone(v) {
        return new Node_Vector(v.x, v.y);
    }
    /**
     * Given two vectors, create a new one of their sum
     * @param {Node_Vector} v1 
     * @param {Node_Vector} v2 
     */
    static add(v1, v2) {
        return new Node_Vector(v1.x + v2.x, v1.y + v2.y);
    }
    /**
     * Add the vector to this current object
     * @param {Node_Vector} v 
     */
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    static neg(v) {
        return new Node_Vector(v.x * -1, v.y * -1);
    }

    neg() {
        this.x *= -1;
        this.y *= -1;
    }

    static sub(v1,v2) {
        return new Node_Vector(v1.x - v2.x, v1.y - v2.y);
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
    }
}