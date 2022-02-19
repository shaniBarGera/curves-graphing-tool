function setCell(cell1, i, j){
    cell1.id = "t_" + i + "_" + j;
    var div = document.createElement("div");
    div.id = "td_" + i + "_" + j;
    div.className = "td_content";
    div.setAttribute("ondragover","allowDrop(event)");
    div.setAttribute("ondrop","drop(event)");
    cell1.appendChild(div);
}

function addCol(){;
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
      div = cell1.firstElementChild;
      div.width = col_w;
      div.height = `${row_h}vh`;

      var title = div.getAttribute("curvename");
      if(title){
        clearWindow(div.id);
        createWindow(div, title);
      }
    }
  }
}

function fixTableWrapper(){
  var table = document.getElementById("myTable");
  fixTable(table);
}

/*function outputsize() {
  width.value = textbox.offsetWidth
  height.value = textbox.offsetHeight
}

outputsize()
new ResizeObserver(outputsize).observe(textbox)*/
