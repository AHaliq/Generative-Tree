class Tree {
    constructor() {
        /** rounding accuracy for animation angle in radians */
        this.ROUND_A_S = 1000;
        /** rounding accuracy for growth/wilt in pixels */
        this.ROUND_G_S = 10;

        this.FLOWER_COLOR = [255, 100, 100];
        this.SEGMENT_COLOR = [80, 20, 10];

        this.VOLUME_TGT = 40000;
        this.VOLUME_CUR = 0;
        // volume

        /** minimum width length for segment to branch */
        this.GROWTH_CAP = 0.5//25;
        /** first segment's width */
        this.INITIAL_W = 12;
        /** first segment's length */
        this.INITIAL_L = 25;
        // initial conditions

        this.FLOWER_MIN = 5;
        this.FLOWER_MAX = 10;
        /** [0,1] probability a segment has flowers */
        this.FLOWER_PROB = 1//0.2;
        /** [0,1] ease factor for flower to bloom fully */
        this.FLOWER_GROW = 0.2;
        // flower consts

        /** (0,1] probability wilting will occur on -ve GROWTH_RATE */
        this.WILT_PROB = 0.5;
        /** [0,1] probability segment turns to stub and stops growing */
        this.DEAD_PROB = 0//0.01;
        /** [-1,1] negative wilts, positive grows */
        this.GROWTH_RATE = 1; //0.8;
        /** [0,1] factor of PI each branch randomly deviates */
        this.GROW_BEND = 0.5;
        /** [0,1] branch width is current times this factor */
        this.WIDTH_DECAY = 0.95;
        /** [0,1] branch length is current times this factor */
        this.LENGTH_DECAY = 0.97 //99;
        // grow/wilt constants

        /** [0,1] factor of PI each branch if >= 2 randomly deviates */
        this.BRANCH_BEND = 1 //0.25;
        /** [0,90*BEND] quantized steps of branch random deviation */
        this.BRANCH_BEND_QUAN = 1 //60;
        /** [0,1) probability > 1 branch sprouts when a segment fully grown */
        this.BRANCH_PROB = 0.09;
        // branch consts

        /** [0,1] ease factor to spread out maximally */
        this.SPREAD_RATE = 0 //0.1;
        /** [0,1] ease factor to parent segment's angle */
        this.STRAIGHTEN_RATE = 0 //0.02;
        /** [0,1] scale by random factor */
        this.LENGTH_RANDOMOFF = 0.5;
        /** [0,1] scale factor */
        this.LENGTH_SCALE = 1;//0.999;
        // animation consts
    }

    get GROW_BEND() {
        return this._GROW_BEND;
    }
    set GROW_BEND(v) {
        this._GROW_BEND = v;
        this.GROW_BEND_MAG = HALF_PI * v;
    }

    get BRANCH_BEND() {
        return this._BRANCH_BEND;
    }
    set BRANCH_BEND(v) {
        this._BRANCH_BEND = v;
        this.BRANCH_BEND_MAG = HALF_PI * v;
    }

    get BRANCH_BEND_QUAN() {
        return this._BRANCH_BEND_QUAN;
    }
    set BRANCH_BEND_QUAN(v) {
        this._BRANCH_BEND_QUAN = v;
        this.BRANCH_BEND_QR = PI / 180 * v;
    }

    get SPREAD_RATE() {
        return this._SPREAD_RATE;
    }
    set SPREAD_RATE(v) {
        this._SPREAD_RATE = v;
        this.SPREAD_RATE_MAG = HALF_PI * v;
    }

    get LENGTH_RANDOMOFF() {
        return this._LENGTH_RANDOMOFF;
    }
    set LENGTH_RANDOMOFF(v) {
        this._LENGTH_RANDOMOFF = v;
        this.LENGTH_RO_MAG = v * 0.5;
    }

    init(x, y) {
        this.root = new Segment(x, y, PI, this.INITIAL_W, this.INITIAL_L, this);
    }

    get x() {
        return this.root.x;
    }
    get y() {
        return this.root.y;
    }
    reposition(x, y) {
        this.root.x = x;
        this.root.y = y;
        this.root.realign();
    }

    grow() {
        let [s,a] = this.root.grow();
        while(s == 2 && this.VOLUME_CUR < this.VOLUME_TGT) s = this.root.forcegrow();
        return [s,a];
    }

    render() {
        noStroke();
        beginShape();
        this.root.render();
        fill(...this.SEGMENT_COLOR);
        endShape();
    }

    makeFlower(x, y) {
        return new Flower(x, y, this.FLOWER_GROW, random(this.FLOWER_MIN, this.FLOWER_MAX), this.FLOWER_COLOR);
    }
}

class ScaryFruitTree extends Tree {
    constructor() {
        super();
        this.tmr = 120;
    }

    grow() {
        let [i,j] = super.grow();
        if (i == 2 && j == 0 && this.SPREAD_RATE == 0) {
            if (this.tmr == 0) {
                //this.SPREAD_RATE = 0.25;
                this.GROWTH_RATE *= -1;
                console.log(this.VOLUME_CUR);
                this.tmr = 120;
            } else this.tmr--;
        } else if (i == 2 && j == 0 && this.SPREAD_RATE > 0) {
            this.GROWTH_RATE *= -1;
            this.SPREAD_RATE = 0;
        } else if (i == 0 && this.GROWTH_RATE < 0) {
            this.VOLUME_CUR = 0;
            this.root.reset();
            this.root.w = this.INITIAL_W;
            this.root.l = this.INITIAL_L;
            this.GROWTH_RATE *= -1;
        }
        return [i,j];
    }

    makeFlower(x,y) {
        let f = super.makeFlower(x,y);
        f.col = f.col.map((v) => v * (0.5 + random()));
        return f;
    }

}