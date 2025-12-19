// Eric White
// press key 'b' to change the background color
// hold SPACE to open the mouth + play sound (all moods)
// press key 1-4 to change mood word
// press key 0 to reset to neutral
// when you click anywhere with the mouse it makes sparkles appear
// eyes wander after 10 seconds when mouse has not been moved
// eyelids blink every 5 seconds
// my friend helped me make some of the code so i give some credit to him

let bg = 20;
let mouthOpen = 0;
let opening = false;

let lastMouseX = 0;
let lastMouseY = 0;
let lastMoveTime = 0;
let autoEyes = false;

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

// blinking
let eyelidAmount = 0;
let isBlinking = false;
let blinkStartTime = 0;
let blinkInterval = 5000;
let blinkDuration = 250;

// sparkles
let sparkleX = [];
let sparkleY = [];
let sparkleLife = [];

// moods
let moodWords = ["NEUTRAL", "HAPPY", "CURIOUS", "CHILL", "SLEEPY"];
let fromMoodIndex = 0;
let toMoodIndex = 0;
let moodT = 1;

// audio (p5.sound)
let openSound = null;
let soundReady = false;

// shirt glow
let shirtGlow = 0;

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(30);

  lastMouseX = mouseX;
  lastMouseY = mouseY;
  lastMoveTime = millis();
  nextWanderChange = millis() + 1000;

  blinkStartTime = millis();

  if (typeof loadSound === "function") {
    openSound = loadSound(
      "audio/never.mp3",
      () => { soundReady = true; },
      () => { soundReady = false; openSound = null; }
    );
  }
}

function draw() {
  bg += 0.2;
  background(bg % 255, 60, 180);

  moodT = lerp(moodT, 1, 0.08);

  if (!autoEyes && millis() - lastMoveTime > 10000) {
    autoEyes = true;
    nextWanderChange = millis();
  }

  let playing = (soundReady && openSound && openSound.isPlaying());
  shirtGlow = lerp(shirtGlow, playing ? 1 : 0, 0.12);

  updateBlink();
  drawPatterns();
  drawSparkles();
  drawMoodWord();
  Eyes();
  Mouth();
}

// Background and shirt
function drawPatterns() {
  let tileSize = 50;
  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      let cx = x + tileSize / 2;
      let cy = y + tileSize / 2;
      let d = dist(mouseX, mouseY, cx, cy);
      let shade = map(d, 0, width, 255, 90);

      if (((x / tileSize) + (y / tileSize)) % 2 === 0)
        fill(shade, 220, 180, 80);
      else
        fill(40, 30, 60, 80);

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
    if (x < mouseX) fill(255, 240, 200);
    else fill(200, 230, 255);
    ellipse(x, frameY, 14, 14);
  }

  let stripeY = 440;
  let maxY = height - 40;
  let stripeWidth = 260;
  let centerX = width / 2;

  let shirtTop = 430;
  let shirtBottom = maxY + 6;

  while (stripeY < maxY) {
    let lerpAmt = map(stripeY, 440, maxY, 0, 1);
    fill(lerp(255,200,lerpAmt), lerp(210,180,lerpAmt), lerp(190,160,lerpAmt));
    noStroke();
    rectMode(CENTER);
    rect(centerX, stripeY, stripeWidth, 10, 5);
    stripeY += 16;
  }

  if (shirtGlow > 0.01) {
    push();
    rectMode(CENTER);
    noStroke();

    fill(255, 255, 0, 25 * shirtGlow);
    rect(centerX, (shirtTop + shirtBottom) / 2, stripeWidth + 90, (shirtBottom - shirtTop) + 70, 40);

    fill(255, 255, 0, 45 * shirtGlow);
    rect(centerX, (shirtTop + shirtBottom) / 2, stripeWidth + 30, (shirtBottom - shirtTop) + 20, 25);

    pop();
  }

  rectMode(CORNER);
}

//  Blink function
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
    } else if (t < 0.5) eyelidAmount = map(t, 0, 0.5, 0, 1);
    else eyelidAmount = map(t, 0.5, 1, 1, 0);
  } else eyelidAmount = 0;
}

// Sparkles 
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

// Mood Word 
function drawMoodWord() {
  fill(255);
  textSize(22);
  text(moodWords[toMoodIndex], width / 2, 90);
}

//  Eyes
function Eyes() {
  let leftX = 300, rightX = 500, eyeY = 220, eyeSize = 120;

  stroke(255); strokeWeight(10);
  fill(240,120,110);
  ellipse(leftX, eyeY, eyeSize, eyeSize);
  ellipse(rightX, eyeY, eyeSize, eyeSize);

  let d, y, r, x;
  if (autoEyes) {
    if (millis() > nextWanderChange) {
      targetLX = random(-maxEyeMove, maxEyeMove);
      targetLY = random(-maxEyeMove/2, maxEyeMove/2);
      targetRX = targetLX + random(-5,5);
      targetRY = targetLY + random(-3,3);
      nextWanderChange = millis() + random(700,1500);
    }
    let s = 0.08;
    wanderLX = lerp(wanderLX,targetLX,s);
    wanderLY = lerp(wanderLY,targetLY,s);
    wanderRX = lerp(wanderRX,targetRX,s);
    wanderRY = lerp(wanderRY,targetRY,s);
    d = wanderLX; y = wanderLY; r = wanderRX; x = wanderRY;
  } else {
    d = constrain(mouseX-leftX, -maxEyeMove, maxEyeMove);
    y = constrain(mouseY-eyeY, -maxEyeMove, maxEyeMove);
    r = constrain(mouseX-rightX, -maxEyeMove, maxEyeMove);
    x = constrain(mouseY-eyeY, -maxEyeMove, maxEyeMove);
  }

  let dir = autoEyes ? d : mouseX - width/2;
  if (dir < -50) fill(0,255,0);
  else if (dir > 50) fill(255,0,0);
  else fill(30);

  stroke(0); strokeWeight(10);
  ellipse(leftX+d, eyeY+y, 34,34);
  ellipse(rightX+r, eyeY+x, 34,34);

  noStroke();
  fill(240,120,110);
  let openY = eyeY-eyeSize*0.45;
  let closedY = eyeY+eyeSize*0.25;
  let lidY = lerp(openY, closedY, eyelidAmount);

  let lidW = eyeSize+10, lidH = eyeSize*0.5;
  push(); translate(leftX,lidY); arc(0,0,lidW,lidH,PI,TWO_PI); pop();
  push(); translate(rightX,lidY); arc(0,0,lidW,lidH,PI,TWO_PI); pop();

  drawEyebrowsByMood();
}

//  Eyebrows
function browPointsForMood(m) {
  if (m===0) return { L:[[230,150],[280,130],[340,130],[390,150]], R:[[440,150],[490,130],[550,130],[600,150]] };

  // Happy brows slightly raised
  if (m===1) return { L:[[230,150],[280,138],[340,138],[390,150]], R:[[440,150],[490,138],[550,138],[600,150]] };

  // Curious  
  if (m===2) return { L:[[230,145],[280,115],[340,125],[390,145]], R:[[440,150],[490,138],[550,138],[600,150]] };

  if (m===3) return { L:[[230,140],[280,140],[340,140],[390,140]], R:[[440,140],[490,140],[550,140],[600,140]] };

  return { L:[[230,135],[280,145],[340,150],[390,145]], R:[[440,145],[490,150],[550,145],[600,135]] };
}

function drawBrowFromPoints(p) {
  stroke(0); strokeWeight(6);
  let L=p.L,R=p.R;
  for (let i=0;i<3;i++){
    line(L[i][0],L[i][1],L[i+1][0],L[i+1][1]);
    line(R[i][0],R[i][1],R[i+1][0],R[i+1][1]);
  }
}

function drawEyebrowsByMood() {
  let A=browPointsForMood(fromMoodIndex);
  let B=browPointsForMood(toMoodIndex);
  let M={L:[],R:[]};
  for(let i=0;i<4;i++){
    M.L.push([lerp(A.L[i][0],B.L[i][0],moodT), lerp(A.L[i][1],B.L[i][1],moodT)]);
    M.R.push([lerp(A.R[i][0],B.R[i][0],moodT), lerp(A.R[i][1],B.R[i][1],moodT)]);
  }
  drawBrowFromPoints(M);
}

// Mouth
function Mouth() {
  let cx = width/2;
  let seamY = 370;

  if (opening) mouthOpen = lerp(mouthOpen,30,0.12);
  else mouthOpen = lerp(mouthOpen,0,0.12);

  let m = toMoodIndex;

  // default
  let w = 240, lipH = 26, notch = 48, cornerLift = 0;
  let baseGap = 0;

  // Happy clearer smile
  if (m === 1) {
    w = 280;
    lipH = 20;
    notch = 26;
    cornerLift = -14;
  }

  // Curious
  if (m===2){
    cornerLift = -2;
    w = 210;
    lipH = 22;
    notch = 46;
    baseGap = 6;
  }

  if (m===3){ cornerLift=2; notch=45; lipH=22; }
  if (m===4){ cornerLift=6; notch=30; lipH=20; }

  let open = mouthOpen*0.85 + baseGap;

  let L=[-w/2,seamY+cornerLift];
  let LT=[-w/4,seamY-lipH];
  let MT=[0,seamY-notch];
  let RT=[w/4,seamY-lipH];
  let R=[w/2,seamY+cornerLift];

  let LB=[-w/4,seamY+lipH+open];
  let MB=[0,seamY+(notch*0.75)+open];
  let RB=[w/4,seamY+lipH+open];

  stroke(255,180,160);
  strokeWeight(5);
  fill(255,190,175);

  beginShape();
  vertex(cx+L[0],L[1]);
  vertex(cx+LT[0],LT[1]);
  vertex(cx+MT[0],MT[1]);
  vertex(cx+RT[0],RT[1]);
  vertex(cx+R[0],R[1]);
  vertex(cx+L[0],L[1]);
  endShape(CLOSE);

  beginShape();
  vertex(cx+L[0],L[1]+open);
  vertex(cx+LB[0],LB[1]);
  vertex(cx+MB[0],MB[1]);
  vertex(cx+RB[0],RB[1]);
  vertex(cx+R[0],R[1]+open);
  vertex(cx+L[0],L[1]+open);
  endShape(CLOSE);

  stroke(255,170,155);
  strokeWeight(4);
  line(cx-w/2+8, seamY+cornerLift+open*0.5, cx+w/2-8, seamY+cornerLift+open*0.5);

  if (toMoodIndex===0 && mouthOpen>15){
    noStroke();
    fill(255);
    text("HELLO", cx, seamY);
  }
}

// Keypresses 
function keyPressed() {
  if (typeof userStartAudio==="function") userStartAudio();

  if (key==='b'||key==='B') bg=random(255);

  if (key===' '){
    opening=true;
    if (soundReady && openSound && !openSound.isPlaying()) openSound.loop();
  }

  let n=int(key);
  if (n===0) setMoodSmooth(0);
  if (n>=1 && n<=4) setMoodSmooth(n);
}

function keyReleased() {
  if (key===' '){
    opening=false;
    if (soundReady && openSound && openSound.isPlaying()) openSound.stop();
  }
}

function setMoodSmooth(n){
  if(n===toMoodIndex)return;
  fromMoodIndex=toMoodIndex;
  toMoodIndex=n;
  moodT=0;
}

function mouseMoved(){
  if(mouseX!==lastMouseX||mouseY!==lastMouseY){
    lastMouseX=mouseX;
    lastMouseY=mouseY;
    lastMoveTime=millis();
    autoEyes=false;
    wanderLX=wanderLY=wanderRX=wanderRY=0;
    targetLX=targetLY=targetRX=targetRY=0;
  }
}

function mousePressed(){
  sparkleX.push(mouseX);
  sparkleY.push(mouseY);
  sparkleLife.push(255);
}
