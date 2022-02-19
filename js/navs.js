
var clickCounter = 0;

function openNav() {
  if(clickCounter == 0){
    document.getElementById("left-nav").style.display = "block";
    clickCounter++;
  }
  else{
    document.getElementById("left-nav").style.display = "none";
    clickCounter--;
  }
}

function clearAllWindows(){
  var table = document.getElementById("myTable");
  for(i = 0; i < table.rows.length; i++){
      for(j = 0; j < table.rows[0].cells.length; j++){
          var td = table.rows[i].cells[j];
          var div = td.firstElementChild;
          clearWindow(div.id);
      }
  }
}


function openAllCurves(){
  clearAllWindows();

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

