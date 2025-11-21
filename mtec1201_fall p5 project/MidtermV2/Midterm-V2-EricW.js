// Eric White 
// press key 'b' to change the background color
// press space bar to make the mouth open
// eyes wander after 10 seconds when mouse has not been moved 
// eyelids blink every 5 seconds

let bg = 20;        // background color  
let mouthOpen = 0;  // how much the mouth opens
let opening = false; // controls if mouth opens or closes


let lastMouseX = 0;
let lastMouseY = 0;
let lastMoveTime = 0;
let autoEyes = false;      // when true, eyes wander on their own

// eye wandering idle variables
let maxEyeMove = 30;       // how far pupils can move from center
let wanderLX = 0;          // current left eye X offset
let wanderLY = 0;          
let wanderRX = 0;          
let wanderRY = 0;          

let targetLX = 0;          // target offsets the eyes move toward
let targetLY = 0;
let targetRX = 0;
let targetRY = 0;

let nextWanderChange = 0;  

// blinking variables
let eyelidAmount = 0;      // 0 = fully open, 1 = fully closed
let isBlinking = false;
let blinkStartTime = 0;
let blinkInterval = 5000;  // blink every 5 seconds
let blinkDuration = 250;   

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(30);

  
  lastMouseX = mouseX;
  lastMouseY = mouseY;
  lastMoveTime = millis();
  nextWanderChange = millis() + 1000; 

  blinkStartTime = millis(); // start blink timer
}

function draw() {
  
  bg = bg + 0.2;  
  background(bg % 255, 60, 180);

  // check how long the mouse has not been moved 
  if (!autoEyes && millis() - lastMoveTime > 10000) { // 10 seconds
    autoEyes = true;
    nextWanderChange = millis(); // eyes starts wandering after 10 seconds 
  }

  // update eyelidAmount for blinking
  updateBlink();

  // main drawing
  Eyes(); 
  Mouth();
}

//  blink function
function updateBlink() {
  let now = millis();

  // bink every 5 seconds 
  if (!isBlinking && now - blinkStartTime > blinkInterval) {
    isBlinking = true;
    blinkStartTime = now;
  }

  if (isBlinking) {
    let t = (now - blinkStartTime) / blinkDuration; // 0 → 1

    if (t >= 1) {
      // blink when finished 
      isBlinking = false;
      eyelidAmount = 0;
      blinkStartTime = now; // restart the 5s timer
    } else {
      
      if (t < 0.5) {
        eyelidAmount = map(t, 0, 0.5, 0, 1);
      } else {
        eyelidAmount = map(t, 0.5, 1, 1, 0);
      }
    }
  } else {
    eyelidAmount = 0; // fully open between blinks
  }
}

// 
function Eyes() {
  let leftX = 300;
  let rightX = 500;
  let eyeY = 220;
  let eyeSize = 120;

  
  stroke(255);
  strokeWeight(10);
  fill(240, 120, 110);
  ellipse(leftX, eyeY, eyeSize, eyeSize);
  ellipse(rightX, eyeY, eyeSize, eyeSize);

  
  let d, y, r, x;

  if (autoEyes) {
    // eyes wandering
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
    // follow mouse
    d = constrain(mouseX - leftX, -maxEyeMove, maxEyeMove); 
    y = constrain(mouseY - eyeY, -maxEyeMove, maxEyeMove);  
    r = constrain(mouseX - rightX, -maxEyeMove, maxEyeMove); 
    x = constrain(mouseY - eyeY, -maxEyeMove, maxEyeMove);   
  }

  // pupil color based on where the eyes are looking based on the mouse
  let directionValue = autoEyes ? d : mouseX - width / 2;

  if (directionValue < -50) {
    fill(0, 255, 0);   // green when looking left
  } else if (directionValue > 50) {
    fill(255, 0, 0);   // red when looking right
  } else {
    fill(30);          
  }

  stroke(0);
  strokeWeight(10);
  ellipse(leftX + d, eyeY + y, 34, 34);
  ellipse(rightX + r, eyeY + x, 34, 34);

  //        Eyelids
  noStroke();
  fill(240, 120, 110);  // eyelid color = face color

  // eyelidAmount: 0 = open, 1 = closed
  let openY   = eyeY - eyeSize * 0.45;  // where the lid sits when open
  let closedY = eyeY + eyeSize * 0.25;  // comes down over most of eyeball when blinking
  let lidY = lerp(openY, closedY, eyelidAmount);

  let lidWidth  = eyeSize + 10;
  let lidHeight = eyeSize * 0.5;  

  // left eyelid
  push();
  translate(leftX, lidY);
  arc(0, 0, lidWidth, lidHeight, PI, TWO_PI); 
  pop();

  // right eyelid
  push();
  translate(rightX, lidY);
  arc(0, 0, lidWidth, lidHeight, PI, TWO_PI);
  pop();

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

//  MOUTH/lips 
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

//         button controls
function keyPressed() {
  if (key === 'b' || key === 'B') {
    bg = random(255);
  }

  if (key === ' ') {
    opening = !opening;
  }
}

//    mouse movement reset timer
function mouseMoved() {
  if (mouseX !== lastMouseX || mouseY !== lastMouseY) {
    lastMouseX = mouseX;
    lastMouseY = mouseY;
    lastMoveTime = millis(); // reset idle timer
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