class BlockSetup {
    constructor(border) {
        this.BORDER = border;
        this.trees = [];
        this.setups = [{
            WEIGHT: 1,
            l: 50,
            w: 2,
            gr: 0.3,
            bd: 2.5,
            clr: [108, 192, 229]
        }, {
            WEIGHT: 2,
            l: 75,
            w: 25,
            gr: 0.1,
            bd: 4,
            clr: [251, 79, 79]
        }, {
            WEIGHT: 1,
            l: 25,
            w: 5,
            gr: 0.9,
            bd: 2,
            clr: [251, 201, 6]
        }];

        this.totWeight = this.setups.reduce((cw, c) => {
            let iw = c.WEIGHT;
            c.WEIGHT += cw;
            cw += iw;
            return cw;
        }, 0);
    }

    makeNew() {
        const choice = random(this.totWeight);
        let obj;
        for (const o of this.setups) {
            if (choice < o.WEIGHT) {
                obj = o;
                break;
            }
        }
        return new T_Block(width * 0.5, height * 0.5, radians(random([0, 90, 180, 270])), obj.l, obj.w, obj.gr, 180 / obj.bd, color(...obj.clr), this.BORDER);
    }

    algo() {
        while (this.trees.length < 15) {
            this.trees.push(this.makeNew());
        }
        this.trees.map((t) => t.step());
        this.trees.map((t) => t.render());
        this.trees = this.trees.filter((v) => v.ALPHA > 0.1);
    }
}