/* global variables */
var table_cols_num = 1;
var table_rows_num = 1;
var table_col_w = 500;
var table_row_h = 500;


/****************************** Create Table ******************************/

// Create initial table
document.addEventListener('readystatechange', event => { 
  if (event.target.readyState === "complete") {
    createTable();
  }
});

/**
* Creates Table 
* @result A table with size: table_cols_num x table_rows_nun
*/
function createTable(){
  // get window size
  var table = document.getElementById("curves-table");
  var body = document.body,
  html = document.documentElement;
  var body_height = Math.max( body.scrollHeight, body.offsetHeight, 
                        html.clientHeight, html.scrollHeight, html.offsetHeight );
  var body_width = Math.max( body.scrollWidth, body.offsetWidth, 
                          html.clientWidth, html.scrollWidth, html.offsetWidth );
    
  // calc table size
  var table_h = body_height - 130;
  var table_w = body_width - 300;

  // calc cell size 
  var row_h = Math.max(table_h / table_rows_num, 600);
  var col_w =  Math.max(table_w / table_cols_num, 510);
  table_col_w = col_w;
  table_row_h = row_h;

  // create table
  for(var i=0;i < table_rows_num;i++){// first loop to create row
    var row = table.insertRow(i);
    for(var j=0;j < table_cols_num;j++){// nested loop to create column in all rows
      var cell1 = row.insertCell(j);
      setCell(cell1, i, j, row_h, col_w);
    }
  }
}

/**
* Sets initial table cell
* @param cell - cell to seet
* @param i - row number of cell in table
* @param j - column number of cell in table
* @param height - cell's wanted height
* @param width - cell's wanted width
* @result Cell is in wanted size with wanted attributes
*/
function setCell(cell, i, j, height, width){
  cell.id = "t_" + i + "_" + j;
  var div = document.createElement("div");
  div.id = "td_" + i + "_" + j;
  div.className = "td_content";
  div.setAttribute("ondragover","allowDrop(event)");
  div.setAttribute("ondrop","drop(event)");
  div.height = height;
  div.width = width;
  var canvas = createEmptyCanvas(); // set initial canvas to fix cell's size
  div.appendChild(canvas);
  cell.appendChild(div);
}

/**
 * Create an empty canvas
 * @returns an empty canvas in size of a table cell
 */
function createEmptyCanvas(){
  var box = document.createElement("canvas");
  box.width = table_col_w;
  box.height = table_row_h;
  return box;
}



/****************************** Update Table ******************************/

// Set number of columns of table
document.getElementById('table_size_input_cols').addEventListener('input', function(evt) {
  table_cols_num = parseInt(document.getElementById('table_size_input_cols').value);
  resetTable();
});

// Set number of rows of table
document.getElementById('table_size_input_rows').addEventListener('input', function(evt) {
  table_rows_num = parseInt(document.getElementById('table_size_input_rows').value);
  resetTable();
});

/**
* Remove all table cells and create new ones
*/
function resetTable(){
  clearTable();
  createTable();
}


/**
* Removes all table cells
*/
function clearTable(){
  var table = document.getElementById("curves-table");
  for(var i=table.rows.length - 1;i >= 0;i--){
    table.deleteRow(i);
  }
}

/**
* clear content from all table cell and retrn table to size 1x1
*/
function clearAllWindows(){
  document.getElementById('table_size_input_cols').value = 1;
  document.getElementById('table_size_input_rows').value = 1;
  table_cols_num = 1;
  table_rows_num = 1;
  resetTable();
}
