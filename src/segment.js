class Segment {
    constructor(x, y, a, w, l, T) {
        this.T = T;
        this.x = x;
        this.y = y;
        this.a = a;
        this.w = w;
        this.l = l;
        this.T.VOLUME_CUR += l;
        this.reset();
    }
    get x() {
        return this._x;
    }
    set x(v) {
        this._x = v;
        this.nupdate = true;
    }
    get y() {
        return this._y;
    }
    set y(v) {
        this._y = v;
        this.nupdate = true;
    }
    get a() {
        return this._a;
    }
    set a(v) {
        this._a = v;
        this.nupdate = true;
    }
    get c() {
        return this._c;
    }
    set c(v) {
        this._c = v;
        this.nupdate = true;
    }

    reset() {
        this.nupdate = true;
        this.peak;
        this.flower = undefined;
        this.c = 0;
        this.N = [];
        this.dead = false;
    }
    get peak() {
        if (this.nupdate) {
            this._oldpx = this.x - Math.cos(this.a - HALF_PI) * this.c;
            this._oldpy = this.y - Math.sin(this.a - HALF_PI) * this.c;
            this.nupdate = false;
        }
        return [this._oldpx, this._oldpy];
    }
    resize() {
        let lr = 1 + random(-this.T.LENGTH_RO_MAG, this.T.LENGTH_RO_MAG);
        this.T.VOLUME_CUR -= this.l;
        this.l *= lr;
        this.T.VOLUME_CUR += this.l;
        this.N.map((s) => s.resize());
    }
    /**
     * return   0 - wilted, 1 - wilting/growing, 2 - grown
     */
    grow() {
        const T = this.T;
        //this.l *= T.LENGTH_SCALE;
        //this.c *= T.LENGTH_SCALE;
        let res, anm = 0;
        const SRMQ = 2 * T.SPREAD_RATE_MAG / (this.N.length - 1),
            oldNL = this.N.length,
            [px, py] = this.peak;
        [this.N, res] = this.N.reduce(([nn, p], s, i) => {
            s.x = px;
            s.y = py;
            let acap = s.a;
            s.a += (this.a - s.a) * T.STRAIGHTEN_RATE;
            s.a += (this.a + (oldNL == 1 ? 0 : -T.SPREAD_RATE_MAG + SRMQ * i) - s.a) * T.SPREAD_RATE;
            let [j, banm] = s.grow();
            if (banm == 1 || round((s.a - acap) * T.ROUND_A_S) != 0) anm = 1;
            if (j == 0) T.VOLUME_CUR -= s.l;
            return [j == 0 ? nn : [...nn, s], p == 1 ? 1 : j];
        }, [
            [], 2
        ]);
        const stopWilt = oldNL > 0 && this.N.length == 0,
            growing = T.GROWTH_RATE >= 0,
            tooSmall =  this.l < T.GROWTH_CAP || this.w < T.GROWTH_CAP;
        let olddead = this.dead;

        if (this.flower && !growing) {
            if(this.flower.r < this.T.FLOWER_MIN) console.log("PUSHED DUST");
            petals.push(this.flower);
            this.flower = undefined;
        } else if (this.N.length == 0 && !growing) {
            if (!stopWilt && Math.random() < T.WILT_PROB) this.c += this.c * T.GROWTH_RATE;
        } else if ((px > RBND || px < BORDER || py > BBND || py < BORDER) && this.N.length == 0) {
            this.dead = true;
        } else if (this.c != this.l && !this.dead) {
            this.c += (this.l - this.c) * T.GROWTH_RATE;
            if (round((this.l - this.c) * T.ROUND_G_S) == 0) {
                this.c = this.l;
                this.dead = tooSmall || T.VOLUME_CUR >= T.VOLUME_TGT || (growing && random() < this.T.DEAD_PROB);
                if (!this.dead && this.N.length == 0) {
                    this.branch(px, py, random(-T.GROW_BEND_MAG, T.GROW_BEND_MAG));
                    while (random() < T.BRANCH_PROB)
                        this.branch(px, py, round(random(-T.BRANCH_BEND_MAG, T.BRANCH_BEND_MAG) / T.BRANCH_BEND_QR) * T.BRANCH_BEND_QR);
                    return [1, anm];
                }
            }
        }
        if(!olddead && this.dead) {
            if(random() < T.FLOWER_PROB) this.flower = T.makeFlower(px,py);
            olddead = this.dead;
        }
        if (this.flower) this.flower.grow();

        /*if (growing && !tooSmall && res == 2 && T.VOLUME_CUR < T.VOLUME_TGT) {
            while (random() < T.BRANCH_PROB * this.w * this.l) {
                if(this.flower) this.flower = undefined;
                this.branch(px, py, round(random(-T.BRANCH_BEND_MAG, T.BRANCH_BEND_MAG) / T.BRANCH_BEND_QR) * T.BRANCH_BEND_QR);
                res = 1;
            }
        }*/

        if (!growing && round(this.c * T.ROUND_G_S) == 0) return [0, anm];
        else if (growing && (this.c == this.l || this.dead)) return [res, anm];
        return [1, anm];
    }
    branch(x, y, na) {
        this.N.push(new Segment(x, y, this.a + na, this.w * this.T.WIDTH_DECAY, this.l * this.T.LENGTH_DECAY, this.T));
    }
    realign() {
        this.N.map((s) => {
            [s.x, s.y] = this.peak;
            s.realign();
        });
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

//TODO flowers are being pushed despite not yet trigger reverse growth due to flower creation on dead
    // DONE its due to one frame creation due to stopWilt mechanism
//TODO HANGS when collide ceiling and short due to matured branching code

// consider mature branch attempts start from root up
// can we do this from within grow
// or do we need another recursive function after grow?