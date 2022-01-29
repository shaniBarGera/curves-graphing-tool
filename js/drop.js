function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
  
function drop(ev) {  
    ev.preventDefault();
    
    //clearWindow(ev.target);
    
    var data = ev.dataTransfer.getData("text");
    var btn = document.getElementById(data);
    var title = btn.firstElementChild.innerHTML;
    
    //createWindow(ev.target, title);
    changeHeader(title);
    //alert(title);
    
}
