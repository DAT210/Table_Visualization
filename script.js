



function draw()
  {
var canvas = document.getElementById('myTable');
// Add some CSS to the canvas element
canvas.style.border = '1px solid black';
canvas.style.width = '50%'




// Draw objects
if (canvas.getContext)
{
var ctx = canvas.getContext('2d');
ctx.beginPath();
ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Outer circle
ctx.moveTo(110, 75);
ctx.arc(75, 75, 35, 0, Math.PI, false);  // Mouth (clockwise)
ctx.moveTo(65, 65);
ctx.arc(60, 65, 5, 0, Math.PI * 2, true);  // Left eye
ctx.moveTo(95, 65);
ctx.arc(90, 65, 5, 0, Math.PI * 2, true);  // Right eye
ctx.stroke();
}
}

var x = 0;
function myFunction() {
  var canvas = document.getElementById('myTable');
    var txt = x += 1;
    document.getElementById('demo').innerHTML = txt;
    var w = window.innerWidth;
    console.log(w);
    if(w < 480){
      canvas.style.width = '95%'
    }
    else{
      canvas.style.width = '50%'
    }
}

window.addEventListener("resize", myFunction);
