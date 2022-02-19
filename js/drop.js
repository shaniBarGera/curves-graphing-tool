/* function called on drag and drop */

function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev){}
window.addEventListener("drop", function(event){
    event.preventDefault();
    
    // get the box the curve was dropped to 
    var td = findtd(event.target);
    
    // get title of dropped curve
    var data = event.dataTransfer.getData("text");
    var title = document.getElementById(data).firstElementChild.innerHTML;
    
    // clear curve from td and create a new one
    clearTdContent(td);
    createTdContent(td, title);
});

/**
* Creates a curve object
* @param target - a given object 
* @returns the content-div of the td the given object is in
*/
function findtd(target){
    var curr = target;
    while(curr.parentElement){
        if(curr.id.match('^td_[0-9]_[0-9]$')){
            return curr;
        }
        curr = curr.parentElement;
    }
}


