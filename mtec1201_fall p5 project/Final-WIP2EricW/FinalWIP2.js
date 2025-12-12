// Eric White 
// press key 'b' to change the background color
// press space bar to make the mouth open
// I am just improving my smilie from the previous assignment
// press key 1-4 to change mood word
// press key 0 to reset to neutral
// when you click anywhere with the mouse it makes sparkles appear
// eyes wander after 10 seconds when mouse has not been moved 
// eyelids blink every 5 seconds
// my friend helped me make some of the code so i give some credit to him

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

// blinking variables
let eyelidAmount = 0;      // 0 = fully open, 1 = fully closed
let isBlinking = false;
let blinkStartTime = 0;
let blinkInterval = 5000;  // blink every 5 seconds
let blinkDuration = 250;   

let sparkleX = [];   
let sparkleY = [];   
let sparkleLife = []; 

// array of mood words 0 = neutral
let moodWords = ["NEUTRAL", "HAPPY", "CURIOUS", "CHILL", "SLEEPY"];
let currentMoodIndex = 0; 

//  AUDIO 
let openSound;
let soundReady = false;

function preload() {
  
  openSound = loadSound("audio/never.mp3", () => {
    soundReady = true;
  });
}

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
  // background color slowly changes 
  bg = bg + 0.2;  
  background(bg % 255, 60, 180);

  // check how long the mouse has been still
  if (!autoEyes && millis() - lastMoveTime > 10000) { // 10 seconds
    autoEyes = true;
    nextWanderChange = millis();
  }

  updateBlink();

  drawPatterns();
  drawSparkles(); 
  drawMoodWord(); 

  Eyes(); 
  Mouth();
}

function drawPatterns() {
  // checkerboard background 
  let tileSize = 50;

  for (let y = 0; y < height; y += tileSize) {          
    for (let x = 0; x < width; x += tileSize) {         
      let cx = x + tileSize / 2;
      let cy = y + tileSize / 2;
      let d = dist(mouseX, mouseY, cx, cy);

      let shade = map(d, 0, width, 255, 90);
      
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
    let lerpAmt = map(stripeY, 440, maxY, 0, 1);
    let r = lerp(255, 200, lerpAmt);
    let g = lerp(210, 180, lerpAmt);
    let b = lerp(190, 160, lerpAmt);

    fill(r, g, b, 190);
    noStroke();
    rectMode(CENTER);
    rect(centerX, stripeY, stripeWidth, 10, 5);

    stripeY += 16; 
  }

  rectMode(CORNER);
}

// blink function
function updateBlink() {
  let now = millis();

  if (!isBlinking && now - blinkStartTime > blinkInterval) {
    isBlinking = true;
    blinkStartTime = now;
  }

  if (isBlinking) {
    let t = (now - blinkStartTime) / blinkDuration;

    if (t >= 1) {
      isBlinking = false;
      eyelidAmount = 0;
      blinkStartTime = now;
    } else {
      if (t < 0.5) {
        eyelidAmount = map(t, 0, 0.5, 0, 1);
      } else {
        eyelidAmount = map(t, 0.5, 1, 1, 0);
      }
    }
  } else {
    eyelidAmount = 0;
  }
}

// makes sparkles and fades them out
function drawSparkles() {
  noStroke();
  for (let i = sparkleX.length - 1; i >= 0; i--) {
    fill(255, 255, 200, sparkleLife[i]); 
    ellipse(sparkleX[i], sparkleY[i], 10, 10);

    sparkleLife[i] -= 3;

    if (sparkleLife[i] <= 0) {
      sparkleX.splice(i, 1);
      sparkleY.splice(i, 1);
      sparkleLife.splice(i, 1);
    }
  }
}

// mood word above the head
function drawMoodWord() {
  fill(255);
  textSize(22);
  text(moodWords[currentMoodIndex], width / 2, 90);
}

// eyes + pupils
function Eyes() {
  let leftX = 300;
  let rightX = 500;
  let eyeY = 220;
  let eyeSize = 120;

  // eyes
  stroke(255);
  strokeWeight(10);
  fill(240, 120, 110);
  ellipse(leftX, eyeY, eyeSize, eyeSize);
  ellipse(rightX, eyeY, eyeSize, eyeSize);

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

  // pupil color changes based on where the eyes are looking 
  let directionValue = autoEyes ? d : mouseX - width / 2;

  if (directionValue < -50) {
    fill(0, 255, 0);  
  } else if (directionValue > 50) {
    fill(255, 0, 0);  
  } else {
    fill(30);         
  }

  stroke(0);
  strokeWeight(10);
  ellipse(leftX + d, eyeY + y, 34, 34);
  ellipse(rightX + r, eyeY + x, 34, 34);

  // eyelids
  noStroke();
  fill(240, 120, 110);

  let openY = eyeY - eyeSize * 0.45;  
  let closedY = eyeY + eyeSize * 0.25;  
  let lidY = lerp(openY, closedY, eyelidAmount);

  let lidWidth = eyeSize + 10;
  let lidHeight = eyeSize * 0.5;  

  push();
  translate(leftX, lidY);
  arc(0, 0, lidWidth, lidHeight, PI, TWO_PI); 
  pop();

  push();
  translate(rightX, lidY);
  arc(0, 0, lidWidth, lidHeight, PI, TWO_PI);
  pop();

  // eyebrows change with mood
  drawEyebrowsByMood();
}

// eyebrows for each mood 
function drawEyebrowsByMood() {
  stroke(0);
  strokeWeight(6);

  if (currentMoodIndex === 0) {
    // NEUTRAL brows
    line(230, 150, 280, 130);
    line(280, 130, 340, 130);
    line(340, 130, 390, 150);

    line(440, 150, 490, 130);
    line(490, 130, 550, 130);
    line(550, 130, 600, 150);

  } else if (currentMoodIndex === 1) {
    // HAPPY brows
    line(230, 150, 280, 132);
    line(280, 132, 340, 132);
    line(340, 132, 390, 150);

    line(440, 150, 490, 132);
    line(490, 132, 550, 132);
    line(550, 132, 600, 150);

  } else if (currentMoodIndex === 2) {
    // CURIOUS brows
    line(230, 150, 280, 125);
    line(280, 125, 340, 132);
    line(340, 132, 390, 150);

    line(440, 150, 490, 138);
    line(490, 138, 550, 138);
    line(550, 138, 600, 150);

  } else if (currentMoodIndex === 3) {
    // CHILL brows
    line(230, 140, 390, 140);
    line(440, 140, 600, 140);

  } else if (currentMoodIndex === 4) {
    // SLEEPY brows
    line(230, 135, 280, 145);
    line(280, 145, 340, 150);
    line(340, 150, 390, 145);

    line(440, 145, 490, 150);
    line(490, 150, 550, 145);
    line(550, 145, 600, 135);
  }
}

// mouth changes with mood 
function Mouth() {
  let cx = width / 2;
  let baseY = 370;

  if (opening) {
    mouthOpen = lerp(mouthOpen, 30, 0.1);
  } else {
    mouthOpen = lerp(mouthOpen, 0, 0.1);
  }

  stroke(255, 180, 160);
  strokeWeight(6);
  noFill();

  if (currentMoodIndex === 0) {
    // NEUTRAL mouth 
    line(280, baseY - mouthOpen, 520, baseY - mouthOpen);
    line(280, baseY + mouthOpen, 520, baseY + mouthOpen);

    if (mouthOpen > 15) {
      noStroke();
      fill(255);
      text("HELLO", width / 2, baseY);
    }

  } else if (currentMoodIndex === 1) {
    // HAPPY
    arc(cx, baseY, 260, 160, 0, PI);

  } else if (currentMoodIndex === 2) {
    // CURIOUS
    ellipse(cx, baseY, 70 + mouthOpen, 55 + mouthOpen);

  } else if (currentMoodIndex === 3) {
    // CHILL
    line(280, baseY, 520, baseY);

  } else if (currentMoodIndex === 4) {
    // SLEEPY
    arc(cx, baseY + 30, 240, 140, PI, TWO_PI);
  }
}

// key controls
function keyPressed() {
  if (key === 'b' || key === 'B') {
    bg = random(255);
  }

  // SPACE toggles mouth opening and music
  if (key === ' ') {
    userStartAudio(); // 

    opening = !opening;

    if (soundReady && openSound) {
      if (opening) {
        openSound.stop(); // restart from beginning each time you open
        openSound.play();
      } else {
        openSound.stop();
      }
    }
  }

  let moodNumber = int(key);

  // 0 resets to neutral
  if (moodNumber === 0) {
    currentMoodIndex = 0;
    mouthOpen = 0;
    opening = false;

    // stop music on reset 
    if (soundReady && openSound) openSound.stop();
  }

  // 1-4 set moods
  if (moodNumber >= 1 && moodNumber <= 4) {
    currentMoodIndex = moodNumber;
    mouthOpen = 0;
    opening = false;

    // stop music when switching moods 
    if (soundReady && openSound) openSound.stop();
  }
}

// reset idle timer on mouse move
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

// mouse press adds sparkles
function mousePressed() {
  sparkleX.push(mouseX);  
  sparkleY.push(mouseY);  
  sparkleLife.push(255);  
}
