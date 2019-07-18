
function setup() {
  createCanvas(windowWidth, windowHeight);
  let n = createNode(100,100,radians(45),100,50, {}, {});
  n.step();
}

function draw() {
  background(220);
}