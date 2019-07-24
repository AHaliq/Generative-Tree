class T {
    constructor(x,y,a,l,w,lv={},sv={}) {
        this.root = new Node(
            createCore(x,y,a,l,w),
            Object.assign({},lv),
            Object.assign({},sv),
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