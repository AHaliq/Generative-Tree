class Segment {
    constructor(x, y, a, w, l, T) {
        this.T = T;
        this.x = x;
        this.y = y;
        this.a = a;
        this.w = w;
        this.l = l;
        this.reset();
    }
    reset() {
        this.flower = undefined;
        this.c = 0;
        this.N = [];
        this.matured = false;
    }
    get peak() {
        return [
            this.x - Math.cos(this.a - HALF_PI) * this.c,
            this.y - Math.sin(this.a - HALF_PI) * this.c
        ];
    }
    resize() {
        let lr = 1 + random(-this.T.LENGTH_RO_MAG, this.T.LENGTH_RO_MAG);
        this.l *= lr;
        this.N.map((s) => s.resize());
    }
    /**
     * return   0 - wilted, 1 - wilting/growing, 2 - grown
     */
    grow() {
        const T = this.T;
        this.l *= T.LENGTH_SCALE;
        this.c *= T.LENGTH_SCALE;
        let res,
            anm = 0,
            acap;
        const SRMQ = 2 * T.SPREAD_RATE_MAG / (this.N.length - 1),
            oldNL = this.N.length,
            [px,py] = this.peak;
        [this.N, res] = this.N.reduce(([nn, p], s, i) => {
            s.x = px;
            s.y = py;
            acap = s.a;
            s.a += (this.a - s.a) * T.STRAIGHTEN_RATE;
            s.a += (this.a + (oldNL == 1 ? 0 : -T.SPREAD_RATE_MAG + SRMQ * i) - s.a) * T.SPREAD_RATE;
            let [j, banm] = s.grow();
            if (banm == 1 || round((s.a - acap) * T.ROUND_A_S) != 0) anm = 1;
            return [j == 0 ? nn : [...nn, s], p == 1 ? 1 : j];
        }, [[], 2]);
        const stopWilt = oldNL > 0 && this.N.length == 0,
            growing = T.GROWTH_RATE >= 0;

        if (this.flower && !growing) {
            petals.push(this.flower);
            this.flower = undefined;
        } else if (this.N.length == 0 && !growing && !stopWilt) {
            if (Math.random() < T.WILT_PROB) this.c += this.c * T.GROWTH_RATE;
        } else if (this.x > RBND || this.x < BORDER || this.y > BBND || this.y < BORDER) {
            this.c = this.l
        } else if (this.c != this.l) {
            this.c += (this.l - this.c) * T.GROWTH_RATE;
            if (round((this.l - this.c) * T.ROUND_G_S) == 0) {
                this.c = this.l;
                if (!(this.l < T.GROWTH_CAP || this.w < T.GROWTH_CAP)) {
                    if(this.N.length == 0) {
                        this.branch(px,py,random(-T.GROW_BEND_MAG, T.GROW_BEND_MAG));
                        while (random() < T.BRANCH_PROB)
                            this.branch(px,py,round(random(-T.BRANCH_BEND_MAG, T.BRANCH_BEND_MAG) / T.BRANCH_BEND_QR) * T.BRANCH_BEND_QR);
                        return [1, anm];
                    }
                } else if (random() < T.FLOWER_PROB) {
                    this.flower = T.makeFlower(px, py);
                }
            }
        }
        if (this.flower) this.flower.grow();

        if (!growing && round(this.c * ROUND_G_S) == 0) return [0, anm];
        else if (growing && this.c == this.l) return [res, anm];
        return [1, anm];
    }
    branch(x,y,na) {
        this.N.push(new Segment(x, y, this.a + na, this.w * T.WIDTH_DECAY, this.l * T.LENGTH_DECAY, this.T));
    }
    realign() {
        this.N.map((s) => { [s.x, s.y] = this.peak; s.realign(); });
    }
    render() {
        const af = this.w * 0.5 * (this.c / this.l),
            dx = Math.cos(this.a) * af,
            dy = Math.sin(this.a) * af;

        vertex(this.x - dx, this.y - dy);
        if (this.N.length > 0) {
            this.N.map((s) => s.render());
        } else {
            let [px, py] = this.peak;
            vertex(px, py);
            if (this.flower) {
                this.flower.x = px;
                this.flower.y = py;
                this.flower.render();
            }
        }
        vertex(this.x + dx, this.y + dy);
    }
}