function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
  
function drop(ev) {  
    
    
    //alert(title);
    
}



window.addEventListener("drop", function(event){
    var td_id = event.target.id;
    var td = document.getElementById(td_id);
    event.preventDefault();

    clearWindow(event.target);
    
    
    var data = event.dataTransfer.getData("text");
    var btn = document.getElementById(data);
    var title = btn.firstElementChild.innerHTML;
    
    td.appendChild(createHeader(td_id, title), td.firstChild);
    td.appendChild(createControls(td_id, title));
    td.appendChild(createFormula(td_id, title));
    td.appendChild(createCanvas(td));
    addApp(td, title);
});