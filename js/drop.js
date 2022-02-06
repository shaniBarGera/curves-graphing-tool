function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev){
    
}

function findtd(td){
    var curr = td;
    while(curr.parentElement){
        if(curr.id.match('^t_[0-9]_[0-9]$')){
            return curr.id;
        }
        curr = curr.parentElement;
    }
}

window.addEventListener("drop", function(event){
    event.preventDefault();
    
    var td_id = findtd(event.target);
    var td = document.getElementById(td_id);
    clearWindow(td_id);
    
    var data = event.dataTransfer.getData("text");
    var btn = document.getElementById(data);
    var title = btn.firstElementChild.innerHTML;

    console.log(td);
    
    createWindow(td, title);
});

function test(){
    addCol();
    addCol();
    addRow();

    var td00 = document.getElementById("t_0_0");
    createWindow(td00, "Monomial Basis");
    var td01 = document.getElementById("t_0_1");
    createWindow(td01, "Lagrange");
    var td02 = document.getElementById("t_0_2");
    createWindow(td02, "Cubic Hermite Spline");
    var td10 = document.getElementById("t_1_0");
    createWindow(td10, "Cubic Spline");
    var td11 = document.getElementById("t_1_1");
    createWindow(td11, "Bezier");
    var td12 = document.getElementById("t_1_2");
    createWindow(td12, "B-Spline");
}

//test();