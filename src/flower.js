class Flower {
    constructor(x, y, gr, tr, col) {
        this.x = x;
        this.xvel = 0;
        this.y = y;
        this.col = col;
        this.tr = tr;
        this.gr = gr;
        this.alpha = 255;
        this.fade = random(0.002, 0.0025) * 255;
        this.grav = random(0.2, 1.5);
        this.wind = random(2, 4);
        this.reset();
    }
    reset() {
        this.r = 0;
    }
    grow() {
        this.r += (this.tr - this.r) * this.gr;
    }
    fall() {
        this.y += this.grav;
        this.xvel += (this.wind - this.xvel) * 0.01;
        this.x += this.xvel;
        this.t += 0.1;
        this.alpha -= this.fade;
        //if (this.x > RBND || this.y > BBND || this.x < BORDER || this.y < BORDER) this.alpha = 0;
        if (this.x > width || this.y > height) this.alpha = 0;
    }
    render() {
        noStroke();
        fill(...this.col, this.alpha);
        ellipse(this.x, this.y, this.r);
    }
}