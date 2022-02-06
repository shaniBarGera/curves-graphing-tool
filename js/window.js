var apps = [];
var apps_num = -1;

function addApp(td, title){
    apps_num++;
    apps[apps_num] = new App().run(this.window, td.id, title);
    td.setAttribute("app", apps_num);
    
}

function findApp(td){
    for(var i = 0; i < apps_num; ++i){

    }
}

function removeApp(td){
    delete apps[apps_num];
    apps = [];
    apps_num--;
}

function clearWindow(parent) {
    removeApp(parent);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function createWindow(td, title){
    td.appendChild(createHeader(td.id, title));
    td.appendChild(createControls(td.id, title));
    td.appendChild(createCurve(td, title));
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

function createNumInput(td_id, title, value){
    var div = document.createElement("div");
    div.id = title + "_input_wrapper_" + td_id;
    div.className = "control-input";

    var text = document.createTextNode(title + " ");
    div.appendChild(text);

    var input = document.createElement("input");
    input.type = "number";
    input.value = value;
    input.size = "1";
    input.min = "1";
    input.className ="input-num";
    input.id = title + "_input_" + td_id;
    div.appendChild(input);

    return div;
}

function createSlider(td_id){
    var div = document.createElement("div");
    div.id = "sliderControl_" + td_id;
    div.className = "control-input";

    var label = document.createElement("label");
    label.id = "tValue_" + td_id;
    label.style.width = "60px";
    label.style.height = "20px";
    label.style.display = "inline-block";
    label.style.overflow = "hidden";
    label.style.textAlign = "left";
    label.style.marginLeft = "2px";
    label.innerHTML = "t = 0.0";
    

    var input = document.createElement("input");
    input.type = "range";
    input.id = "tSlider_" + td_id;
    input.min = "0";
    input.max = "100";
    input.value = "0";
    input.className = "slider";
    input.oninput = function(){
        label.innerHTML = "t = " + this.value;
    }
    div.appendChild(input);
    div.appendChild(label);
    return div;
}

function createControls(td_id, title){
    // controls main box
    var controls = document.createElement("div");
    controls.id = td_id + "_controls";
    controls.className = "controls";

    if(title == "Monomial Basis" || title == "B-Spline"){
        controls.appendChild(createNumInput(td_id, "k", 4));
    }
    controls.appendChild(createNumInput(td_id, "n", 4));
    controls.appendChild(createNumInput(td_id, "Steps", 11));
    controls.appendChild(createSlider(td_id));

    return controls;
}

function createFormula(td_id, title){
    var formula = document.createElement("div");
    formula.id = td_id + "_formula";
    formula.className = "formula";
    //var text = document.createElement('a');
    var img = document.createElement("img");
   
    img.src="imgs/bezier-formula.png";
    img.height = "60";
    formula.appendChild(img);
    /*img.src="https://wikimedia.org/api/rest_v1/media/math/render/svg/4aead49f2dc6a80c8f4018274355e8f48c38573a" 
    img.class="mwe-math-fallback-image-inline" 
    img.ariaHidden="true" ;
    img.style.verticalAlign = '-6.005ex'; 
    img.width = '96.275ex';     
    img.height = '13.176ex'; 
    img.alt="{\displaystyle {\begin{aligned}\mathbf {B} (t)&amp;=\sum _{i=0}^{n}{n \choose i}(1-t)^{n-i}t^{i}\mathbf {P} _{i}\\&amp;=(1-t)^{n}\mathbf {P} _{0}+{n \choose 1}(1-t)^{n-1}t\mathbf {P} _{1}+\cdots +{n \choose n-1}(1-t)t^{n-1}\mathbf {P} _{n-1}+t^{n}\mathbf {P} _{n},&amp;&amp;0\leqslant t\leqslant 1\end{aligned}}}";
    formula.appendChild(img);*/
    /*switch(title){
        case "Monomial":
            text.innerText = "B(t) = P0 + t(P1-P0)";
            break;
        case "Lagrange":
            text.innerText = "L(t) = t";
            break;
        case "Bezier":
            formula.innerHTML = '<img src="https://wikimedia.org/api/rest_v1/media/math/render/svg/4aead49f2dc6a80c8f4018274355e8f48c38573a" class="mwe-math-fallback-image-inline" aria-hidden="true" style="vertical-align: -6.005ex; width:96.275ex; height:13.176ex;" alt="{\displaystyle {\begin{aligned}\mathbf {B} (t)&amp;=\sum _{i=0}^{n}{n \choose i}(1-t)^{n-i}t^{i}\mathbf {P} _{i}\\&amp;=(1-t)^{n}\mathbf {P} _{0}+{n \choose 1}(1-t)^{n-1}t\mathbf {P} _{1}+\cdots +{n \choose n-1}(1-t)t^{n-1}\mathbf {P} _{n-1}+t^{n}\mathbf {P} _{n},&amp;&amp;0\leqslant t\leqslant 1\end{aligned}}}">';
            break;
        default:
            text.innerText = title;
            break;
    }
    formula.appendChild(text);*/
    return formula;

}

function drawZoneHeight(td){
    var td_controls = document.getElementById(td.id + "_controls");
    var td_header = document.getElementById(td.id + "_header");
    var td_formula = document.getElementById(td.id + "_formula");
    var header_height = td_header.offsetHeight;
    var controls_height = td_controls.offsetHeight;
    var formula_height = td_formula.offsetHeight;
    //var formula_height = 0;
    return header_height + controls_height + formula_height;
}

function resizeCanvas(box, td){
    var bw = (td.offsetWidth - 10);
    var bh = (td.offsetHeight - drawZoneHeight(td));
    box.width = bw;
    box.height = bh;
}

function createCanvas(td){
    var box = document.createElement("canvas");
    box.id = td.id + "_canvas";
    resizeCanvas(box, td);
    return box;
}


