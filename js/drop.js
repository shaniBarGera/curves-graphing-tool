function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}
  
function drop(ev) {
    ev.preventDefault();

    removeAllChildNodes(ev.target);
    var data = ev.dataTransfer.getData("text");
    var btn = document.getElementById(data);
    var title = btn.firstElementChild.innerHTML;
    var header = createHeader(title);
    ev.target.appendChild(header);
    ev.target.appendChild(createControls());
    var curve = drawCurve(title);
    ev.target.appendChild(curve);
}
