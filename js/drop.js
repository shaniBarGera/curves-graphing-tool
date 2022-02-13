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
    console.log(td);
    clearWindow(td_id);
    
    var data = event.dataTransfer.getData("text");
    var btn = document.getElementById(data);
    var title = btn.firstElementChild.innerHTML;
    
    createWindow(td, title);

    fixTableWrapper();
});

