
// Eric White 
// press any random key to chage the background color
// I am just improving my smilie from the previous assignment


let bg = 20;  // background color variable 

function setup() {
  createCanvas(800, 600);
}

function draw() {
  // background color slowly changes 
  bg = bg + 0.2;  
  background(bg % 255, 60, 180);

  // eye positions
  let leftX = 300;
  let rightX = 500;
  let eyeY = 220;

  // eyes
  stroke(255);
  strokeWeight(10);
  fill(240, 120, 110);
  ellipse(leftX, eyeY, 120, 120);
  ellipse(rightX, eyeY, 120, 120);

  // pupils follow mouse
  let maxMove = 30; // how far pupils can move
  let d = constrain(mouseX - leftX, -maxMove, maxMove); // left pupil horizontal move
  let y = constrain(mouseY - eyeY, -maxMove, maxMove);  // left pupil vertical move
  let r = constrain(mouseX - rightX, -maxMove, maxMove); // right pupil horizontal move
  let x = constrain(mouseY - eyeY, -maxMove, maxMove);   // right pupil vertical move

  // change pupil color depending on mouse position if mouse is too the left its green if to the right its red 
  if (mouseX < width / 2 - 50) {
    fill(0, 255, 0); 
  } else if (mouseX > width / 2 + 50) {
    fill(255, 0, 0); 
  } else {
    fill(30); 
  }

  stroke(0);
  strokeWeight(10);

  // draw pupils
  ellipse(leftX + d, eyeY + y, 34, 34);
  ellipse(rightX + r, eyeY + x, 34, 34);

  // smile
  stroke(255, 180, 160);
  strokeWeight(6);
  line(280, 360, 380, 380);
  line(380, 380, 420, 380);
  line(420, 380, 520, 360);
}

// any key press changes background color
function keyPressed() {
  bg = random(255);
}

