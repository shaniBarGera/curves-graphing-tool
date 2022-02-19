var table_cols_num = 1;
var table_rows_num = 1;

document.getElementById('table_size_input_cols').addEventListener('input', function(evt) {
  table_cols_num = parseInt(document.getElementById('table_size_input_cols').value);
  resetTable();
});

document.getElementById('table_size_input_rows').addEventListener('input', function(evt) {
  table_rows_num = parseInt(document.getElementById('table_size_input_rows').value);
  resetTable();
});

function clearAllWindows(){
  /*var table = document.getElementById("myTable");
  for(i = 0; i < table.rows.length; i++){
      for(j = 0; j < table.rows[0].cells.length; j++){
          var td = table.rows[i].cells[j];
          var div = td.firstElementChild;
          clearWindow(div.id);
      }
  }*/
  document.getElementById('table_size_input_cols').value = 1;
  document.getElementById('table_size_input_rows').value = 1;
  table_cols_num = 1;
  table_rows_num = 1;
  resetTable();
}

function clearTable(){
  var table = document.getElementById("myTable");
  for(var i=table.rows.length - 1;i >= 0;i--){
    table.deleteRow(i);
  }
}

function createTable(){
  var table = document.getElementById("myTable");
  for(var i=0;i < table_rows_num;i++){// first loop to create row
    var row = table.insertRow(i);
    for(var j=0;j < table_cols_num;j++){// nested loop to create column in all rows
      var cell1 = row.insertCell(j);
      setCell(cell1, i, j);
    }
  }
}

function resetTable(){
  console.log(table_cols_num, table_rows_num);
  clearTable();
  createTable();
}

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
  //var table = document.getElementById("myTable");
  //fixTable(table);
}

/*function outputsize() {
  width.value = textbox.offsetWidth
  height.value = textbox.offsetHeight
}

outputsize()
new ResizeObserver(outputsize).observe(textbox)*/
