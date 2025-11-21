// Eric White 
// press key 'b' to change the background color
// press space bar to make the mouth open
// I am just improving my smilie from the previous assignment

let bg = 20;        // background color  
let mouthOpen = 0;  // how much the mouth opens
let opening = false; // controls if mouth opens or closes


let lastMouseX = 0;
let lastMouseY = 0;
let lastMoveTime = 0;
let autoEyes = false;      // when true, eyes wander on their own

// eye wandering idle variables
let maxEyeMove = 30;       
let wanderLX = 0;          
let wanderLY = 0;          
let wanderRX = 0;          
let wanderRY = 0;          

let targetLX = 0;          
let targetLY = 0;
let targetRX = 0;
let targetRY = 0;

let nextWanderChange = 0;  

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(30);

  lastMouseX = mouseX;
  lastMouseY = mouseY;
  lastMoveTime = millis();
  nextWanderChange = millis() + 1000;
}

function draw() {
  // background color slowly changes 
  bg = bg + 0.2;  
  background(bg % 255, 60, 180);

  // check how long the mouse has been still
  if (!autoEyes && millis() - lastMoveTime > 10000) { // 10 seconds
    autoEyes = true;
    nextWanderChange = millis();
  }

  // new pattern design
  drawPatterns();

  Eyes(); 
  Mouth();
}


function drawPatterns() {
  // checkerboard background 
  let tileSize = 50;

  for (let y = 0; y < height; y += tileSize) {          
    for (let x = 0; x < width; x += tileSize) {         
      // distance from mouse to center of tile
      let cx = x + tileSize / 2;
      let cy = y + tileSize / 2;
      let d = dist(mouseX, mouseY, cx, cy);

      // shade changes based on distance to mouse
      let shade = map(d, 0, width, 255, 90);
      
      // checker pattern 
      if (((x / tileSize) + (y / tileSize)) % 2 === 0) {
        fill(shade, 220, 180, 80); 
      } else {
        fill(40, 30, 60, 80);      
      }

      noStroke();
      rect(x, y, tileSize, tileSize);
    }
  }

  
  let frameY = 420;
  let startX = 180;
  let endX = width - 180;
  let dotCount = 9;

  stroke(255, 230);
  strokeWeight(2);

  for (let i = 0; i < dotCount; i++) {                
    let t = map(i, 0, dotCount - 1, 0, 1);
    let x = lerp(startX, endX, t);

    // left side vs right side of canvas
    if (x < mouseX) {
      fill(255, 240, 200, 200);
    } else {
      fill(200, 230, 255, 200);
    }

    ellipse(x, frameY, 14, 14);
  }

  // stacked stripes under smiley looks like a shirt
  let stripeY = 440;
  let maxY = height - 40;
  let stripeWidth = 260;
  let centerX = width / 2;

  while (stripeY < maxY) {                            
    // stripe color responds to mouse position
    let lerpAmt = map(stripeY, 440, maxY, 0, 1);
    let r = lerp(255, 200, lerpAmt);
    let g = lerp(210, 180, lerpAmt);
    let b = lerp(190, 160, lerpAmt);

    fill(r, g, b, 190);
    noStroke();
    rectMode(CENTER);
    rect(centerX, stripeY, stripeWidth, 10, 5);

    stripeY += 16; // 
  }

  // reset rectMode back to default just in case
  rectMode(CORNER);
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

  // pupils
  let d, y, r, x; 

  if (autoEyes) {
    
    if (millis() > nextWanderChange) {
      targetLX = random(-maxEyeMove, maxEyeMove);
      targetLY = random(-maxEyeMove / 2, maxEyeMove / 2);

      targetRX = targetLX + random(-5, 5);
      targetRY = targetLY + random(-3, 3);

      nextWanderChange = millis() + random(700, 1500);
    }

    let smooth = 0.08;
    wanderLX = lerp(wanderLX, targetLX, smooth);
    wanderLY = lerp(wanderLY, targetLY, smooth);
    wanderRX = lerp(wanderRX, targetRX, smooth);
    wanderRY = lerp(wanderRY, targetRY, smooth);

    d = wanderLX;
    y = wanderLY;
    r = wanderRX;
    x = wanderRY;

  } else {
    d = constrain(mouseX - leftX, -maxEyeMove, maxEyeMove); 
    y = constrain(mouseY - eyeY, -maxEyeMove, maxEyeMove);  
    r = constrain(mouseX - rightX, -maxEyeMove, maxEyeMove); 
    x = constrain(mouseY - eyeY, -maxEyeMove, maxEyeMove);   
  }

  //  pupil color changes based on where the eyes are looking 
  let directionValue;
  if (autoEyes) {
    directionValue = d; 
  } else {
    directionValue = mouseX - width / 2;
  }

  if (directionValue < -50) {
    fill(0, 255, 0);   // green when looking left
  } else if (directionValue > 50) {
    fill(255, 0, 0);   // red when looking right
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

  stroke(255, 180, 160);
  strokeWeight(6);
  line(280, 370 - mouthOpen, 520, 370 - mouthOpen); // top lip
  line(280, 370 + mouthOpen, 520, 370 + mouthOpen); // bottom lip

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

// this runs every time the mouse moves
function mouseMoved() {
  if (mouseX !== lastMouseX || mouseY !== lastMouseY) {
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    lastMoveTime = millis();
    autoEyes = false;

    
    wanderLX = 0;
    wanderLY = 0;
    wanderRX = 0;
    wanderRY = 0;
    targetLX = 0;
    targetLY = 0;
    targetRX = 0;
    targetRY = 0;
  }
}