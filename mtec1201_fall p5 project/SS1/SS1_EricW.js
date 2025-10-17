/* this is a muliti line comment


*/
//this is a comment use it to make your code more readable 
// Eric White
// I am currently coding on visual studio on my macbook pro
// titie smiling face 
// i am not the greatest at coding but i want to try to at least get better at it and understand it more.

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(20, 60, 180); 

  // this is for the eyes
  stroke(255);             
  strokeWeight(10);         
  fill(240, 120, 110);     
  ellipse(180, 180, 90, 90);   
  ellipse(320, 180, 90, 90);   

  // this is for the pupils
  stroke(0);
  strokeWeight(10);
  fill(30);                
  ellipse(180, 180, 28, 28);    
  ellipse(320, 180, 28, 28);    

  // this is for the smile
  stroke(255, 180, 160);
  strokeWeight(6);              
  line(150, 280, 220, 300);     
  line(220, 300, 280, 300);     
  line(280, 300, 350, 280);     

}





