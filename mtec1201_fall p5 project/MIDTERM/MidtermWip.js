// Eric White 
// press key 'b' to change the background color
// press space bar to make the mouth open
// I am just improving my smilie from the previous assignment

let bg = 20; // background color  
let mouthOpen = 0; // how much the mouth opens
let opening = false; // controls if mouth opens or closes

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(30);
}

function draw() {
  // background color slowly changes 
  bg = bg + 0.2;  
  background(bg % 255, 60, 180);

  // this is the defined functions that I made
  Eyes(); 
  Mouth();
}

// this function helps make both the eyes and pupils
function Eyes() {
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
  let maxMove = 30; 
  let d = constrain(mouseX - leftX, -maxMove, maxMove); 
  let y = constrain(mouseY - eyeY, -maxMove, maxMove);  
  let r = constrain(mouseX - rightX, -maxMove, maxMove); 
  let x = constrain(mouseY - eyeY, -maxMove, maxMove);   

  // pupil color changes based on mouse position if looking to the left eyes will be green if looking to the right it will be red
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

  // eyebrows 
  stroke(0);
  strokeWeight(6);              
  line(230, 150, 280, 130);     
  line(280, 130, 340, 130);     
  line(340, 130, 390, 150);     
  line(440, 150, 490, 130);     
  line(490, 130, 550, 130);     
  line(550, 130, 600, 150);     
}

 // my function that helps draw and open the mouth
function Mouth() {
  
  if (opening) {
    mouthOpen = lerp(mouthOpen, 30, 0.1);
  } else {
    mouthOpen = lerp(mouthOpen, 0, 0.1);
  }

  // two lines one is the bottom lip the other is the top lip
  stroke(255, 180, 160);
  strokeWeight(6);
  line(280, 370 - mouthOpen, 520, 370 - mouthOpen); // top lip
  line(280, 370 + mouthOpen, 520, 370 + mouthOpen); // bottom lip

  // text hello
  if (mouthOpen > 15) {
    noStroke();
    fill(255);
    text("HELLO", width / 2, 370);
  }
}

// press key b to change the background color
// press space bar to open or close the mouth
function keyPressed() {
  if (key === 'b' || key === 'B') {
    bg = random(255);
  }

  if (key === ' ') {
    opening = !opening;
  }
}
