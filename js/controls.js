function createControls(td_id, title){
    // controls main box
    var controls = document.createElement("div");
    controls.id = td_id + "_controls";
    controls.className = "controls";

    if(title == "Monomial Basis" || title == "B-Spline"){
        controls.appendChild(createNumInput(td_id, "k", 3));
    }
    controls.appendChild(createNumInput(td_id, "n", 4));
    controls.appendChild(createNumInput(td_id, "steps", 50));
    controls.appendChild(createSlider(td_id));

    return controls;
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
    label.style.width = "70px";
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