/*
Eric White
 "Eyes Follow You"
 A  responsive face where the pupils follow the mouse.
 you can move the mouse around and the eyes will follow it and if you press any key 
 it changes the colors.
 move 
 I took my first assignment and just improved off from there to be honest.
*/

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
  fill(30);
  stroke(0);
  strokeWeight(10);
  let maxMove = 30; // how far pupils can move

  // left pupil
  let d = constrain(mouseX - leftX, -maxMove, maxMove); // using the constrain function from p5.js website
  let y = constrain(mouseY - eyeY, -maxMove, maxMove);
  ellipse(leftX + d, eyeY + y, 34, 34);

  // right pupil
  let r = constrain(mouseX - rightX, -maxMove, maxMove); // using the constrain function from p5.js
  let x = constrain(mouseY - eyeY, -maxMove, maxMove);
  ellipse(rightX + r, eyeY + x, 34, 34);

  // smile
  stroke(255, 180, 160);
  strokeWeight(6);
  line(280, 360, 380, 380);
  line(380, 380, 420, 380);
  line(420, 380, 520, 360);
}

// event function: key press changes back
function keyPressed() {
  bg = random(255);
}