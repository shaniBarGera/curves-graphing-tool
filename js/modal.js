// Get the modal
var modal = document.getElementById("gen_info_modal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function createModal(title){
  var modal = document.createElement("div");
  modal.className = "modal";
  modal.id = "myModal";

  var modal_content = document.createElement("div");
  modal_content.className = "modal-content";

  var close = document.createElement("span");
  close.className = "close";
  close.innerHTML = "&times;";
  modal_content.appendChild(close);

  var info_text = document.createElement("p");
  info_text.innerText = "hello world";
  modal_content.appendChild(info_text);

  modal.appendChild(modal_content);

  return modal;
}

function showGenInfo(){
  var modal = document.getElementById("gen_info_modal");
  modal.style.display = "block";
}
