var apps = [];
var apps_num = -1;
var canvas_proportion = 0.55;
var canvas_top_elements_h = 181;

function addApp(td, title){
    apps_num++;
    apps[apps_num] = new App().run(this.window, td.id, title);
    td.setAttribute("app", apps_num);
}
  
function clearWindow(td_id) {
    var td = document.getElementById(td_id);
    if(td == null) return;
    
    var i = td.getAttribute("app", apps_num);
    delete apps[i];

    var canvas = document.getElementById(td_id + "_canvas");
    var param_canvas = document.getElementById(td_id + "_parambox_canvas");
    if(canvas != null){
        var ctx = canvas.getContext('2d');
        clearCanvas(ctx, canvas.width, canvas.height, 'rgba(30, 30, 30, 1.0)');
    }
    if(param_canvas != null){
        var param_ctx = param_canvas.getContext('2d');
        clearCanvas(param_ctx, param_canvas.width, param_canvas.height, 'rgba(30, 30, 30, 1.0)');
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
    td.appendChild(createParamBox(td, title));

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
    
    img.height = "70";
    img.style.width = "100%";
    img.style.objectFit = "scale-down";
    return img;
}

function addParamImage(title){
    var img = document.createElement("img");
    
   
    if(title == "Cubic Hermite Spline" || title == "Cubic Spline"){
        img.src = "imgs/info/C-Spline-param-info.png";
    } else if(title == "Monomial Basis") {
        img.src="imgs/info/general-param-info.png";
    } else{
        img.src = "imgs/info/" + title + "-param-info.png";
    }
    
    img.style.width = "650px";
    return img;
}

function createFormula(td, title){
    var formula = document.createElement("div");
    formula.id = td.id + "_formula";
    formula.className = "formula";
    
    var info_tooltip = createToolTip(title, '\u{2148}',  "click to show/hide more info about equation");
    var info_img = getFormulaInfoImg(title);
    var popup = createPopUp(title, info_img);
    popup.appendChild(info_tooltip);
    var img = addFormualImg(title);
   
    formula.appendChild(img); 
    if(title == "Bezier" || title == "Lagrange"){
        return formula;
    }
    formula.appendChild(popup);

    return formula;
}

function createParamBox(td, title){
    var parambox = document.createElement("div");
    parambox.id = td.id + "_parambox";
    parambox.className = "param-box";

    var header = document.createElement("div");
    header.id = td.id + "_parambox_header";
    header.className = "parambox-header";
    var text = document.createElement('a');
    text.innerText = "Parametrization";
    header.appendChild(text);

    var info_tooltip = createToolTip(title,  '\u{2148}', "click to show/hide more info about parametrization");

    var info = addParamImage(title);
    var popup = createParamBoxPopUp(title, info);
    popup.appendChild(info_tooltip);
    header.appendChild(popup);
    
    var canvas = document.createElement("canvas");
    canvas.id = td.id + "_parambox_canvas";

    if(title == "Bezier"){
        parambox.style.display = "none";
        canvas.width = 0;
        canvas.height = 0;
    } else{
        parambox.appendChild(header);
        canvas.width = table_col_w;
        canvas.height = (table_row_h - canvas_top_elements_h) * (1-canvas_proportion) - 42;
    }
    
    parambox.appendChild(canvas);


    return parambox;
}



function drawZoneHeight(td){
    var td_controls = document.getElementById(td.id + "_controls");
    var td_header = document.getElementById(td.id + "_header");
    var td_formula = document.getElementById(td.id + "_formula");
    var header_height = td_header.offsetHeight;
    var controls_height = td_controls.offsetHeight;
    var formula_height = td_formula.offsetHeight;
    //var formula_height = 0;
    return header_height + controls_height + formula_height + 100;
}

function resizeCanvas(box, td){
    var bh = (table_row_h - canvas_top_elements_h);
    var title = td.getAttribute("curvename");
    if(title != "Bezier"){
        bh *= canvas_proportion;
    } 
    console.log(title, bh);
    box.width = table_col_w;
    box.height = bh;
}

function createCanvas(td){
    var box = document.createElement("canvas");
    box.id = td.id + "_canvas";
    resizeCanvas(box, td);
    return box;
}

function createEmptyCanvas(){
    var box = document.createElement("canvas");
    box.width = table_col_w;
    box.height = table_row_h;

    return box;
}