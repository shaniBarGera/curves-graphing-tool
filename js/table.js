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
  var row_h = 85 / rnum;
  var col_w =  `${100 / cnum}%`;
  for(i = 0; i < rnum; i++){
    for(var j=0; j < cnum; j++){
      cell1 = table.rows[i].cells[j];
      cell1.style.width = col_w;
      cell1.style.height = `${row_h}vh`
      ;

      var box = document.getElementById(cell1.id + "_draw");
      if(box){
        box.style.height = (row_h - drawZoneHeight(td)) + "vh";;
      }
      /*var canvas = document.getElementById("c" + cell1.id);
      if(canvas){
        resizeCanvas(cell1, canvas);
        drawCurve(cell1, canvas);
      }*/
    }
  }
}
