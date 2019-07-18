class Node {
    /**
     * 
     * @param {Node_Core} c core object
     * @param {*} s state object
     * @param {*} b behaviour properties object
     */
    constructor(c,s,b) {
        this.N = [];
        this.C = c;

        this.S = Object.assign({}, s);
        // setup states
        this.B = Object.assign({}, b);
        // setup behaviour properties
        this.behaviours = [];
        // setup behaviours
    }
    step() {
        for(const f of this.behaviours) console.log(f)
    }
    render() {

    }
}

function createNode(x,y,a,l,w,s,b) {
    return new Node(
        new Node_Core(
            new Node_Vector(x,y),
            new Node_Vector(a,l,false),
            w),
        s,b);
}
// has core values                      DONE
//  has memoized values                 DONE
// has state(s)
// has behaviour properties
// has core functions;
//  step
//      calls behaviors
//      mutates branches
//      recurse step on children
//  render
// behavior functions
//  grow
//  branch