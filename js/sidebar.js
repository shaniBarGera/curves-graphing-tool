
var clickCounter = 0;

function openNav() {
  if(clickCounter == 0){
    document.getElementById("left-nav").style.display = "block";
    clickCounter++;
  }
  else{
    document.getElementById("left-nav").style.display = "none";
    clickCounter--;
  }
}
