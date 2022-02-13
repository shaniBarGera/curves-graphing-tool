
function createPopUp(title, info){
    var container = document.createElement("div");
    container.className = "popup";
    container.onclick = function(){
        var popup = document.getElementById(title + "_popup");
        popup.classList.toggle("show");
    };

    var content = document.createElement("span");
    content.className = "popuptext";
    content.id = title + "_popup";
    //var info_img = getFormulaInfoImg(title);
    //content.appendChild(info_img);
    content.appendChild(info);

    container.appendChild(content);
    return container;
}

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
    
    
    //img.style.width = "100%";
    //img.style.objectFit = "contain";
    return img;
}

function createToolTip(title, icon, content){
    var info_tooltip = document.createElement("div");
    info_tooltip.className = "tooltip-top";
    var info_btn = document.createElement("button");
    info_btn.className = "info-btn";
    info_btn.id = title + "_info";
    /*info_btn.onclick = function(){
        //modal.style.display = "block";
    };*/
    var text = document.createElement('a');
    //text.innerText = '\u{2148}';
    text.innerText = icon;
    info_btn.appendChild(text);
   
    var tooltip = document.createElement("span");
    tooltip.className = "tooltiptext-top";
    //tooltip.innerHTML = "click to show/hide more info";
    tooltip.innerHTML = content;
    
    info_tooltip.appendChild(info_btn);
    info_tooltip.appendChild(tooltip);

    return info_tooltip;
}