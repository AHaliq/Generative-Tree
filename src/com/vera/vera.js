// PRESETS
let original = [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0];
let pluses = [0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0];
let vbars = [0, 0.005, 0, 1, 0, 0, 0, 0, 0, 0, 0];
let crosses = [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0];
let test = [0.1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1];
let diagsp = [1.5, 1, 0.1, 1.5, 1, 0, 0, 0, 0, 0, 0];
let lines = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0];

export default function (p, b) {
  let weights = original;

  let ROWS, COLUMNS = 25;
  let WRAT = 0.2;
  let COLOR_PROB = 0//0.02;
  let MULTI_DRAW_PROB = 0;
  const NCOLOR = 150;
  const COLOR = [154, 183, 211];
  let WDT, HGT, GWDT, GHGT;

  let hWDT, hHGT;

  let drawFuncs, totWgt, sWgt;

  GWDT = b.width;
  WDT = GWDT / COLUMNS;
  HGT = WDT * 0.9;
  ROWS = p.floor(b.height / HGT);
  GHGT = ROWS * WDT;

  hWDT = WDT * 0.5;
  hHGT = HGT * 0.5;

  sWgt = WDT * WRAT;
  p.strokeWeight(sWgt);
  p.strokeCap(p.PROJECT);

  drawFuncs = [
    [0, () => {
    }],                                             // empty
    [1, (x, y) =>
      p.line(x, y + hHGT, x + WDT, y + hHGT)],        // hori
    [1, (x, y) =>
      p.line(x, y, x + WDT, y + HGT)],                // dsc
    [1, (x, y) =>
      p.line(x + hWDT, y, x + hWDT, y + HGT)],        // vert
    [1, (x, y) =>
      p.line(x, y + HGT, x + WDT, y)],                // asc
    [0, (x, y) => {
      p.line(x, y + hHGT, x + WDT, y + hHGT);        // plus
      p.line(x + hWDT, y, x + hWDT, y + HGT);
    }],
    [0, (x, y) => {
      p.line(x, y, x + WDT, y + HGT);                // cross
      p.line(x, y + HGT, x + WDT, y);
    }],
    [0, (x, y) => {
      p.noStroke();                                  // hound up
      p.beginShape();
      p.vertex(x, y);
      p.vertex(x, y + HGT);
      p.vertex(x + WDT, y + HGT);
      p.vertex(x + WDT, y);
      p.vertex(x + hWDT, y + hHGT);
      p.vertex(x, y);
      p.endShape();
      p.stroke(sWgt);
    }],
    [0, (x, y) => {
      p.noStroke();                                  // hound lft
      p.beginShape();
      p.vertex(x, y);
      p.vertex(x + hWDT, y + hHGT);
      p.vertex(x, y + HGT);
      p.vertex(x + WDT, y + HGT);
      p.vertex(x + WDT, y);
      p.vertex(x, y);
      p.endShape();
      p.stroke(sWgt);
    }],
    [0, (x, y) => {
      p.noStroke();                                  // hound btm
      p.beginShape();
      p.vertex(x, y);
      p.vertex(x, y + HGT);
      p.vertex(x + hWDT, y + hHGT);
      p.vertex(x + WDT, y + HGT);
      p.vertex(x + WDT, y);
      p.vertex(x, y);
      p.endShape();
      p.stroke(sWgt);
    }],
    [0, (x, y) => {
      p.noStroke();                                  // hound rgt
      p.beginShape();
      p.vertex(x, y);
      p.vertex(x, y + HGT);
      p.vertex(x + WDT, y + HGT);
      p.vertex(x + hWDT, y + hHGT);
      p.vertex(x + WDT, y);
      p.vertex(x, y);
      p.endShape();
      p.stroke(sWgt);
    }]
  ];

  drawFuncs = drawFuncs.map(([_, f], i) => [weights[i], f]);

  // ASSIGN WEIGHTS -----------------------

  [totWgt, drawFuncs] = drawFuncs.reduce(
    ([p, fs], [x, f]) => [p + x, [...fs, [p + x, f]]], [0, []]);
  // CALCULATE TOTAL WEIGHT AND PREP ADDITIVE SUM

  let drawnChoice = [];
  function setupRandom() {
    for (let x = 0; x < COLUMNS; ++x) {
      drawnChoice[x] = [];
      for (let y = 0; y < ROWS; ++y) {
        drawnChoice[x][y] = {
          col: p.random(),
          tile: p.random() * totWgt
        }
      }
    }
  }
  setupRandom();
  function drawOnce(choices) {
    for (let x = 0; x < COLUMNS; ++x) {
      for (let y = 0; y < ROWS; ++y) {
        let dx = b.o1.x + x * WDT;
        let dy = b.o1.y + y * HGT;
        const curCol = choices[x][y].col < COLOR_PROB ? COLOR : NCOLOR;
        p.stroke(curCol);
        p.fill(curCol);
        let choice = choices[x][y].tile;
        for (let i = 0; i < drawFuncs.length; i++) {
          if (choice < drawFuncs[i][0]) {
            drawFuncs[i][1](dx, dy);
            break;
          }
        }
      }
    }
  }

  return function () {
    drawOnce(drawnChoice);
  }
}