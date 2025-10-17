let r = 255;
let g = 255;
let b = 255;


function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
  
  
  
  
}

function draw() 
{
  background(r, g, b);

    if (mouseX > width / 2)
  {
    fill(255, 0, 0);
  ellipse(width/2, height/2, 100, 100);
  print("test 1 is true");
  
  }
   else if(mouseY > height/2)
  {
     fill(0);
      rect(width/2 , height/2, 100, 100);
      print("test 2 is true");

  }

  else
  {
     fill(255);
     rect(width/2, height/2, 100, 100);
     print("test 1 and 2 are both working");
  }
}


function mousePressed() // runs once only when pressed once
{
  r = random(0, 255);
  g = random(50, 200);
  b = random(100, 155);
  print("RED = " + r);

    
      

}
  
  
  


  

  

