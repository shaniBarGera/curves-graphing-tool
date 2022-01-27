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

  fixTable(table);
}

function addRow() {
  var table = document.getElementById("myTable");
  var row = table.insertRow(-1);

  for(i = 0; i < table.rows[0].cells.length; i++){
    var cell1 = row.insertCell(i);
    setCell(cell1, table.rows.length-1, i);
  }

  fixTable(table);
}
  
function delRow() {
  var table = document.getElementById("myTable");
  if(table.rows.length > 1){
    table.deleteRow(-1);
    fixTable(table);
  }
}

function delCol(){
  var table = document.getElementById("myTable");

  for(i = 0; i < table.rows.length; i++){
    if(table.rows[i].cells.length > 1)
      table.rows[i].deleteCell(-1);
  } 
  fixTable(table);
}

function fixTable(table){
  var rnum = table.rows.length;
  var cnum = table.rows[0].cells.length;
  for(i = 0; i < rnum; i++){
    for(var j=0; cell1 = table.rows[i].cells[j]; j++){
      cell1.style.width = `${100 / cnum}%`;
      cell1.style.height = `${85 / rnum}vh`;

      var canvas = document.getElementById("c" + cell1.id);
      if(canvas){
        resizeCanvas(cell1, canvas);
        drawCurve(cell1, canvas);
      }
    }
  }
}