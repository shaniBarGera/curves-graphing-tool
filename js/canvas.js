function myDrawLine(c, ctx){
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(c.width, c.height);
    ctx.stroke();

    return false;
}

function drawRect(c, ctx){
    ctx.beginPath();
    ctx.strokeRect(100, 100, c.width - 200, c.height -200);
    return false;
}

function drawBezier(c, ctx){
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.bezierCurveTo(20, 100, 200, 100, 200, 20);
    ctx.stroke();
    return false;
}

function drawBezierInteractive(box){
    
    box.className = "centered";
    //box.width = "800";
    //box.height = "600";
    box.id = "curves";
    var a = new App();
    a.run(this.window);
    /*
    window.onload = function () {
        new App().run(this.window);
    };*/
}


/*function resizeCanvas(t, canvas){
    canvas.width = t.offsetWidth - 20;
    canvas.height = t.offsetHeight;
}

function createCanvas(t){
    var canvas = document.createElement('canvas');
    canvas.id = "c" + t.id;
    canvas.className = "canvas";    
    canvas.style.border = "1px solid blue";
    canvas.style.display = "inline-block";
    resizeCanvas(t, canvas);
    return canvas;
}*/
