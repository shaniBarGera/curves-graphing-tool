/* global variables */
var apps = [];
var apps_num = -1;

var canvas_proportion = 0.55;
var canvas_top_elements_h = 181;
  


/****************************** Clear and Create Curve in Table Cell ******************************/

/**
* clear content from table cell
* @param td - a table cell
* @result clears all elements from table cell
*/
function clearTdContent(td) {
    if(td == null) return;
    
    // delete running app of current curve
    var i = td.getAttribute("app", apps_num);
    delete apps[i];

    // clear curve canvas
    var canvas = document.getElementById(td.id + "_canvas");   
    if(canvas != null){
        var ctx = canvas.getContext('2d');
        clearCanvas(ctx, canvas.width, canvas.height, 'rgba(30, 30, 30, 1.0)');
    }

    // clear parametrization canvas
    var param_canvas = document.getElementById(td.id + "_parambox_canvas");
    if(param_canvas != null){
        var param_ctx = param_canvas.getContext('2d');
        clearCanvas(param_ctx, param_canvas.width, param_canvas.height, 'rgba(30, 30, 30, 1.0)');
    }

    // remove all elements
    while (td.firstChild) {
        td.removeChild(td.firstChild);
    }
}


/**
 * Create content in table cell
 * @param td - a table cell
 * @param title - name of curve
 * @result creates the wanted curve with header, controls for the user control it and formula
*/
function createTdContent(td, title){
    
    td.setAttribute("curvename", title);

    // create table cell elements
    td.appendChild(createHeader(td.id, title));
    td.appendChild(createControls(td.id, title));
    td.appendChild(createFormula(td.id, title));
    td.appendChild(createCanvas(td.id, title));
    td.appendChild(createParamBox(td, title));
    
    // draw curve
    apps[++apps_num] = new App().run(this.window, td.id, title);
    td.setAttribute("app", apps_num);
}



/****************************** Curve Header ******************************/

/**
 * Create curve header
 * @param td_id - id of table cell
 * @param title - name of curve 
 * @return header with curve name
*/
function createHeader(td_id, title){
    var header = document.createElement("div");
    header.id = td_id + "_header";
    header.className = "td-header";
    var text = document.createElement('a');
    text.innerText = title;
    header.appendChild(text);
    return header;
}



/****************************** Curve Controls ******************************/

/**
 * Create curve controls
 * @param td_id - id of table cell
 * @param title - name of curve 
 * @return controls for curve
*/
function createControls(td_id, title){
    var controls = document.createElement("div");
    controls.id = td_id + "_controls";
    controls.className = "td-controls";

    if(title == "Monomial Basis" || title == "B-Spline"){
        controls.appendChild(createNumInput(td_id, "k", 3));
    }
    controls.appendChild(createNumInput(td_id, "n", 4));
    controls.appendChild(createNumInput(td_id, "steps", 50));
    controls.appendChild(createSlider(td_id));

    return controls;
}

/**
 * Create input num
 * @param td_id - id of table cell
 * @param title - name of number input
 * @param value - default value of input box
 * @return input num object
*/
function createNumInput(td_id, title, value){
    // create input wrapper
    var div = document.createElement("div");
    div.id = title + "_input_wrapper_" + td_id;
    div.className = "td-content-input-wrapper";

    // create input label
    var text = document.createTextNode(title + " ");
    div.appendChild(text);

    // create input box
    var input = document.createElement("input");
    input.type = "number";
    input.value = value;
    input.size = "1";
    input.min = "1";
    input.className ="td-content-input";
    input.id = title + "_input_" + td_id;

    div.appendChild(input);
    return div;
}

/**
 * Create slider input
 * @param td_id - id of table cell
 * @return slider input with changing label
*/
function createSlider(td_id){
    // create input wrapper
    var div = document.createElement("div");
    div.id = "sliderControl_" + td_id;
    div.className = "td-content-input-wrapper";

    // create input label
    var label = document.createElement("label");
    label.id = "tValue_" + td_id;
    label.style.width = "70px";
    label.style.height = "20px";
    label.style.display = "inline-block";
    label.style.overflow = "hidden";
    label.style.textAlign = "left";
    label.style.marginLeft = "2px";
    label.innerHTML = "t = 0.0";

    // create input
    var input = document.createElement("input");
    input.type = "range";
    input.id = "tSlider_" + td_id;
    input.min = "0";
    input.max = "100";
    input.value = "0";
    input.className = "slider";

    // change label value when slider value changes
    input.oninput = function(){
        label.innerHTML = "t = " + this.value;
    }

    div.appendChild(input);
    div.appendChild(label);
    return div;
}




/****************************** Curve Formula ******************************/

/**
 * Creates formula object
 * @param td_id - id of table cell
 * @param title - name of curve
 * @return formula of curve with info about it
*/
function createFormula(td_id, title){
    var formula = document.createElement("div");
    formula.id = td_id + "_formula";
    formula.className = "formula";
    
    // add information on formula
    var info_tooltip = createToolTip(title, '\u{2148}',  "click to show/hide more info about equation");
    var info_img = getFormulaInfoImg(title);
    var popup = createPopUp(title + "_popup", info_img);
    popup.appendChild(info_tooltip);
   
    // add formula
    var img = getFormualImg(title);
    formula.appendChild(img); 

    if(title == "Bezier" || title == "Lagrange"){ // don't need popup information
        return formula;
    }

    formula.appendChild(popup);
    return formula;
}

/**
 * Gets formula image
 * @param title - name of curve
 * @return img of curve's equation
*/
function getFormualImg(title){
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

/**
 * Gets formula image information
 * @param title - name of curve
 * @return img of curve's equation information
*/
function getFormulaInfoImg(title){
    var img = document.createElement("img");
    img.style.width = "650px";
    if(title == "Monomial Basis"){
        img.src = "imgs/info/Monomial-info.png";
    } else if(title == "Cubic Spline"){
        img.src = "imgs/info/C-Spline-info.png";
        img.style.width = "1000px";
     } else if(title == "Cubic Hermite Spline"){
        img.src = "imgs/info/Hermite-info.png";
    } else if (title == "B-Spline"){
        img.src="imgs/info/B-Spline-info.png";
    }
    return img;
}



/****************************** Curve Canvas ******************************/

/**
 * Creates curves canvas
 * @param td - id of table cell
 * @param title - name of curve
 * @return formula of curve with info about it
*/
function createCanvas(td_id, title){
    var box = document.createElement("canvas");
    box.id = td_id + "_canvas";
    var bh = (table_row_h - canvas_top_elements_h);
    if(title != "Bezier"){
        bh *= canvas_proportion;
    } 
    box.width = table_col_w;
    box.height = bh;
    return box;
}




/****************************** Curve Parametrization ******************************/

/**
 * Creates curve's parametrization graph
 * @param td_id - id of table cell
 * @param title - name of curve
 * @return an element with curve's parametrization curve, info about parametrization and header
*/
function createParamBox(td, title){
    var parambox = document.createElement("div");
    parambox.id = td.id + "_parambox";
    parambox.className = "param-box";

    // create header
    var header = document.createElement("div");
    header.id = td.id + "_parambox_header";
    header.className = "param-box-header";
    var text = document.createElement('a');
    text.innerText = "Parametrization";
    header.appendChild(text);

    // add info
    var info_tooltip = createToolTip(title,  '\u{2148}', "click to show/hide more info about parametrization");
    var info = getParamImage(title);
    var popup = createPopUp(title + "_parambox", info);
    popup.appendChild(info_tooltip);
    header.appendChild(popup);
    
    // create canvas
    var canvas = document.createElement("canvas");
    canvas.id = td.id + "_parambox_canvas";
    if(title == "Bezier"){ // no parametrization for Bezier
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

/**
 * Gets parametrization information image
 * @param title - name of curve
 * @return img of curve's parametrization information
*/
function getParamImage(title){
    var img = document.createElement("img");
    if(title == "Bezier"){
        return img;
    } else if(title == "Cubic Hermite Spline" || title == "Cubic Spline"){
        img.src = "imgs/info/C-Spline-param-info.png";
    } else if(title == "Monomial Basis") {
        img.src="imgs/info/general-param-info.png";
    } else{
        img.src = "imgs/info/" + title + "-param-info.png";
    }
    
    img.style.width = "650px";
    return img;
}




/****************************** Curve Information Functions ******************************/

/**
 * Creates a popup
 * @param title - name of curve
 * @param info - conent to show on popup
 * @return popup element with content
*/
function createPopUp(title, info){
    var container = document.createElement("div");
    container.className = "popup";
    container.onclick = function(){
        var popup = document.getElementById(title);
        popup.classList.toggle("show");
    };

    var content = document.createElement("span");
    content.className = "popuptext";
    content.id = title;
    content.appendChild(info);

    container.appendChild(content);
    return container;
}

/**
 * Creates a tooltip
 * @param title - name of curve
 * @param content - conent to show on tooltip
 * @param icon - element that calls the tooltip
 * @return popup element with content
*/
function createToolTip(title, icon, content){
    
    var info_tooltip = document.createElement("div");
    info_tooltip.className = "tooltip-top";

    // creat info button
    var info_btn = document.createElement("button");
    info_btn.className = "info-btn";
    info_btn.id = title + "_info";

    // add header
    var text = document.createElement('a');
    text.innerText = icon;
    info_btn.appendChild(text);
   
    // add content
    var tooltip = document.createElement("span");
    tooltip.className = "tooltiptext-top";
    tooltip.innerHTML = content;
    
    info_tooltip.appendChild(info_btn);
    info_tooltip.appendChild(tooltip);

    return info_tooltip;
}
