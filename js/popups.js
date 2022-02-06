function changeColors(){
    var main = document.getElementById("main");
    main.style.backgroundColor = "white"
}

function instruct(s){
    var popup = document.getElementById("myPopup");
    popup.innerText = s;
    popup.classList.toggle("show");
}