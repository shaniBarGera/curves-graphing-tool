function drawLine(c, ctx){
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

function drawBezier(c){
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "rgb(102, 51, 153)";
    ctx.lineWidth = 5;
    ctx.moveTo(20, 20);
    ctx.bezierCurveTo(20, 100, 200, 100, 200, 20);
    ctx.stroke();
    //ctx.strokeRect(100, 100, c.width - 200, c.height -200);
    return false;
}

function resizeCanvas(t, canvas){
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
}

function fixCanvas(table){
    var rnum = table.rows.length;
    var cnum = table.rows[0].cells.length;
    for(i = 0; i < rnum; i++){
      for(var j=0; cell1 = table.rows[i].cells[j]; j++){
        cell1.style.width = `${100 / cnum}%`;
        cell1.style.height = `${89 / rnum}vh`;

        var canvas = document.getElementById("c" + cell1.id);
        if(canvas){
          resizeCanvas(cell1, canvas);
          drawCurve(cell1, canvas);
        }
      }
    }
}