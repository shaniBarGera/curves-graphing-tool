
function drawZoneHeight(td){
    var td_controls = document.getElementById(td.id + "_controls");
    var td_header = document.getElementById(td.id + "_header");
    var header_height = td_header.offsetHeight;
    var controls_height = td_controls.offsetHeight;
    return header_height + controls_height;
}

function changeHeader(title){
    var header = document.getElementById("t_0_0_header");
    var text =  header.firstChild;
    text.innerText = title;
}

function runthis(){
    
    var td = document.getElementById("t_0_0");

    td.appendChild(createHeader("t_0_0", "Bezier"), td.firstChild);
    td.appendChild(createControls("t_0_0"));

        var box = document.createElement("canvas");
        //box.className = "centered";
        var bw = (td.offsetWidth - 30);
        var bh = (td.offsetHeight - drawZoneHeight(td));
        box.width = bw;
        box.height = bh
        box.id = "curves";
        box.style.borderColor = "blue";
        td.appendChild(box);
        window.onload = function () {
            
            new App().run(this.window);
        };
    }


runthis();