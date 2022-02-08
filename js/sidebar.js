
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

function showGenInfo(){
  var modal = document.getElementById("gen_info_modal");
  modal.style.display = "block";
}