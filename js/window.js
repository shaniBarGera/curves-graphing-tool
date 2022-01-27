function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function createHeader(title){
    var header = document.createElement("div");
    header.id = title;
    header.className = "window-header";
    var text = document.createElement('a');
    text.innerText = title;
    header.appendChild(text);

    return header;
}

function createNumInput(title){
    var div = document.createElement("div");
    div.id = title + "_input";
    div.className = "control-input";

    var text = document.createTextNode(title + " ");
    div.appendChild(text);

    var input = document.createElement("input");
    input.type = "number";
    input.name = title;
    input.value = "3";
    input.size = "1";
    input.className ="input-num";
    div.appendChild(input);

    return div;
}

function createSlider(){
    var div = document.createElement("div");
    div.id = "slider";
    div.className = "control-input";

    var label = document.createElement("label");
    label.id = "tValue";
    label.innerHTML = "t = ";
    div.appendChild(label);
    var span = document.createElement("span");
    span.id = "demo";
    span.innerHTML = "0";
    div.appendChild(span);

    var input = document.createElement("input");
    input.id = "myRange";
    input.type = "range";
    input.name = "tSlider";
    input.min = "0";
    input.max = "100";
    input.value = "0";
    input.className = "slider";
    div.appendChild(input);
    return div;
}


function createControls(){
    // controls main box
    var controls = document.createElement("div");
    controls.id = "controls";
    controls.className = "controls";

    controls.appendChild(createNumInput("Order"));
    controls.appendChild(createNumInput("Steps"));
    controls.appendChild(createSlider());

    return controls;
}

function drawCurve(title){
    var c = createCanvas(t);
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "rgb(102, 51, 153)";
    ctx.lineWidth = "5px";

    switch(title){
        case "Bezier":
            drawBezier(c, ctx);
            break;
        case "Monomial":
            drawRect(c, ctx);
            break;
        default:
            drawLine(c, ctx);
            break;
    }
    return c;
}