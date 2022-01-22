function setCell(cell1, i, j){
    cell1.setAttribute("ondrop","drop(event)");
    cell1.setAttribute("ondragover","allowDrop(event)");
    cell1.id = "t_" + i + "_" + j;
}



function addCol(){
  var table = document.getElementById("myTable");
  
  for(var i = 0; row = table.rows[i]; i++){
    var cell1 = row.insertCell(-1);
    setCell(cell1, i, row.cells.length -1);
  }

  fixCanvas(table);
}

function addRow() {
  var table = document.getElementById("myTable");
  var row = table.insertRow(-1);

  for(i = 0; i < table.rows[0].cells.length; i++){
    var cell1 = row.insertCell(i);
    setCell(cell1, table.rows.length-1, i);
  }

  fixCanvas(table);
}
  
function delRow() {
  var table = document.getElementById("myTable");
  if(table.rows.length > 1){
    table.deleteRow(-1);
    fixCanvas(table);
  }
}

function delCol(){
  var table = document.getElementById("myTable");

  for(i = 0; i < table.rows.length; i++){
    if(table.rows[i].cells.length > 1)
      table.rows[i].deleteCell(-1);
  } 
  fixCanvas(table);
}