var table_cols_num = 1;
var table_rows_num = 1;
var table_col_w = 500;
var table_row_h = 500;

document.addEventListener('readystatechange', event => { 

  // When HTML/DOM elements are ready:
  if (event.target.readyState === "interactive") {   //does same as:  ..addEventListener("DOMContentLoaded"..
      
  }

  // When window loaded ( external resources are loaded too- `css`,`src`, etc...) 
  if (event.target.readyState === "complete") {
      
      createTable();
  }
});

document.getElementById('table_size_input_cols').addEventListener('input', function(evt) {
  table_cols_num = parseInt(document.getElementById('table_size_input_cols').value);
  resetTable();
});

document.getElementById('table_size_input_rows').addEventListener('input', function(evt) {
  table_rows_num = parseInt(document.getElementById('table_size_input_rows').value);
  resetTable();
});

function clearAllWindows(){
  document.getElementById('table_size_input_cols').value = 1;
  document.getElementById('table_size_input_rows').value = 1;
  table_cols_num = 1;
  table_rows_num = 1;
  resetTable();
}

function clearTable(){
  var table = document.getElementById("curves-table");
  for(var i=table.rows.length - 1;i >= 0;i--){
    table.deleteRow(i);
  }
}

function createTable(){
  console.log("here");
  var table = document.getElementById("curves-table");
  //var header = document.getElementById("main_header");
  var body = document.body,
    html = document.documentElement;

var body_height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
var body_width = Math.max( body.scrollWidth, body.offsetWidth, 
                        html.clientWidth, html.scrollWidth, html.offsetWidth );
  var table_h = body_height - 130;
  var table_w = body_width - 300;
  var row_h = Math.max(table_h / table_rows_num, 600);
  var col_w =  Math.max(table_w / table_cols_num, 510);
  table_col_w = col_w;
  table_row_h = row_h;
  console.log(row_h, col_w, table_w, table_h);
  for(var i=0;i < table_rows_num;i++){// first loop to create row
    var row = table.insertRow(i);
    for(var j=0;j < table_cols_num;j++){// nested loop to create column in all rows
      var cell1 = row.insertCell(j);
      setCell(cell1, i, j, row_h, col_w);
    }
  }
}

function resetTable(){
  console.log(table_cols_num, table_rows_num);
  clearTable();
  createTable();
}

function setCell(cell1, i, j, height, width){
    cell1.id = "t_" + i + "_" + j;
    var div = document.createElement("div");
    div.id = "td_" + i + "_" + j;
    div.className = "td_content";
    div.setAttribute("ondragover","allowDrop(event)");
    div.setAttribute("ondrop","drop(event)");
    div.height = height;
    div.width = width;

    var canvas = createEmptyCanvas();
    div.appendChild(canvas);

    cell1.appendChild(div);


}

/*function fixTable(table){
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
}*/


function fixTable(table){
  for(i = 0; i < table_rows_num; i++){
    for(var j=0; j < table_cols_num; j++){
      cell1 = table.rows[i].cells[j];
      div = cell1.firstElementChild;
      var td_canvas = document.getElementById(div.id + "_canvas");
      resizeCanvas(td_canvas ,div);
      
    }
  }
}
function fixTableWrapper1(){
  console.log("resize table");
  var table = document.getElementById("curves-table");
  //fixTable(table);
}

function fixTableWrapper(){}

/*function outputsize() {
  width.value = textbox.offsetWidth
  height.value = textbox.offsetHeight
}

outputsize()
new ResizeObserver(outputsize).observe(textbox)*/
