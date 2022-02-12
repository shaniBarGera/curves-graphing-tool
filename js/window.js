var apps = [];
var apps_num = -1;

function addApp(td, title){
    apps_num++;
    apps[apps_num] = new App().run(this.window, td.id, title);
    td.setAttribute("app", apps_num);
    
}

function clearAllWindows(){
    var table = document.getElementById("myTable");
    for(i = 0; i < table.rows.length; i++){
        for(j = 0; j < table.rows[0].cells.length; j++){
            var td = table.rows[i].cells[j];
            clearWindow(td.id);
        }
    }
  }

  
function clearWindow(td_id) {
    var td = document.getElementById(td_id);
    if(td == null) return;
    var canvas = document.getElementById(td_id + "_canvas");
    if(canvas != null){
        var ctx = canvas.getContext('2d');
        clearCanvas(ctx, canvas.width, canvas.height, 'rgba(30, 30, 30, 1.0)');
    }
    while (td.firstChild) {
        td.removeChild(td.firstChild);
    }
}

function createWindow(td, title){
    td.setAttribute("curvename", title);
    td.appendChild(createHeader(td.id, title), td.firstChild);
    td.appendChild(createControls(td.id, title));
    td.appendChild(createFormula(td, title));
    td.appendChild(createCanvas(td));
    addApp(td, title);
}

function createHeader(td_id, title){
    var header = document.createElement("div");
    header.id = td_id + "_header";
    header.className = "window-header";
    var text = document.createElement('a');
    text.innerText = title;
    header.appendChild(text);

    return header;
}

function addFormualImg(title){
    var img = document.createElement("img");
    if(title == "Monomial Basis"){
        img.src = "imgs/formulas/Monomial-formula.png";
    } else if(title == "Cubic Spline" || title == "Cubic Hermite Spline"){
        img.src = "imgs/formulas/C-Spline-formula.png";
    } else{
        img.src="imgs/formulas/"+title+"-formula.png";
    }
    
    img.height = "60";
    img.style.width = "100%";
    img.style.objectFit = "scale-down";
    return img;
}

function createFormula(td, title){
    var formula = document.createElement("div");
    formula.id = td.id + "_formula";
    formula.className = "formula";
    
    var info_tooltip = createToolTip(title);
    var popup = createPopUp(title);
    popup.appendChild(info_tooltip);
    var img = addFormualImg(title);
   
    formula.appendChild(img); 
    if(title == "Bezier" || title == "Lagrange"){
        return formula;
    }
    formula.appendChild(popup);

    return formula;
}


