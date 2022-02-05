function Bspline(canvas1id, canvas2id, scale, n, k, ptX, ptY, pt){

    var canvas, canvas2, ctx, ctx2, w,h,h1, d,d2,  dragId = -1, dragId2 = -1;
    var n1 = n+1,  nti = n+k+1,  N;
    var iColor = ["#f00000","#00f000","#0000f0","#00f0f0","#f0f000","#f000f0","#090909"];
    var Px = new Float64Array(ptX),
        Py = new Float64Array(ptY),
        ti = new Float64Array(pt);
       canvas = document.getElementById(canvas1id);
       ctx = canvas.getContext("2d");
       canvas.addEventListener('mousemove', drag, false);
       canvas.addEventListener('touchmove', drag, false);
       canvas.addEventListener('mousedown', start_drag, false);
       canvas.addEventListener('mouseup', stop_drag, false);
       canvas.addEventListener('touchstart', start_drag, false);
       canvas.addEventListener('touchend', stop_drag, false);
       canvas2 = document.getElementById(canvas2id);
       ctx2 = canvas2.getContext("2d");
       canvas2.addEventListener('mousemove', drag2, false);
       canvas2.addEventListener('touchmove', drag2, false);
       canvas2.addEventListener('mousedown', start_drag2, false);
       canvas2.addEventListener('mouseup', stop_drag2, false);
       canvas2.addEventListener('touchstart', start_drag2, false);
       canvas2.addEventListener('touchend', stop_drag2, false);
       window.addEventListener('resize', resize, false);
       var to = ti[0], dt = ti[nti-1]-to;
       for (var i = 0; i < nti; i++) ti[i] = (ti[i]-to)/dt;
       resize();
    
    function drawFun(){
      ctx2.clearRect(0,0, w, h);
      ctx2.lineWidth = d;
      var step = (ti[nti-1]-ti[0])/w;
      for (var j = 0; j < nti*w; j++) N[j] = 0;
      var i1 = 0, t = ti[0];
      for (var l = 0; l < w; l++){
       while (t >= ti[i1] ) i1++;
       var i = i1-1, ntil = nti*l;
       N[i + ntil] = h;
       for (var m = 2; m <= k; m++){        //  basis functions calculation
        var jb = i-m+1;  if (jb < 0) jb = 0;
        for (var j = jb; j <= i; j++)
         N[j + ntil] = N[j + ntil]*(t - ti[j])/(ti[j+m-1] - ti[j]) +
          N[j+1 +ntil]*(ti[j+m] - t)/(ti[j+m] - ti[j+1]);}
       t += step;}
      for (var j = 0; j < n1; j++){
       t = ti[0];
       ctx2.strokeStyle = iColor[j % 7];
       ctx2.beginPath();  ctx2.moveTo(w*t, h - N[j]);
       for (var l = 1; l < w; l++){
        t += step;
        ctx2.lineTo(w*t, h - N[j + nti*l]);
       }
       ctx2.stroke();
      }
      for (var l = k; l <= n1; l++){
       ctx2.strokeStyle = iColor[(l-k) % 7];
       ctx2.beginPath();  ctx2.moveTo(w*ti[l-1], 1);  ctx2.lineTo(w*ti[l], 1);
       ctx2.stroke();
      }
      ctx2.strokeStyle = "black";
      for (var i = 0; i < nti; i++)
        ctx2.strokeRect(w*ti[i] - d, 0, d2, d2);
    }
    function drawSpline(){
      ctx.clearRect(0,0, w, h);
      ctx.lineWidth = d;
      ctx.strokeStyle = "#0000f0";
      ctx.beginPath();  ctx.moveTo(Px[0]*w, h - Py[0]*h);
      for (var i = 1; i < n1; i++)
       ctx.lineTo(Px[i]*w, h - Py[i]*h);
      ctx.stroke();
    
      ctx.lineWidth = d2;
      var step = (ti[nti-1]-ti[0])/w;
      var to = Math.floor(((ti[k-1] - ti[0])/step)) + 1;
      var sX = sY = 0, ntii = to*nti;
      for (var m = 0; m < n1; m++){
       sX += Px[m]*N[m + ntii];  sY += Py[m]*N[m + ntii];}
      for (var j = k-1; j < n1; j++){
       var t = Math.floor((ti[j+1] - ti[0])/step);
       ctx.strokeStyle = iColor[(j-k+1) % 7];
       ctx.beginPath();  ctx.moveTo(sX, h - sY);
       for (var i = to; i < t; i++){
        sX = sY = 0;
        ntii += nti;
        for (var m = 0; m < n1; m++){
         sX += Px[m]*N[m + ntii];  sY += Py[m]*N[m + ntii];}
        ctx.lineTo(sX, h1 - sY);
       }
       ctx.stroke();
       to = t;
      }
      ctx.lineWidth = d;
      ctx.strokeStyle = "#0000f0";
      for (var i = 0; i < n1; i++)
       ctx.strokeRect(Px[i]*w - d, h - Py[i]*h - d, d2, d2);
    }
    function resize(){
       h = w = Math.round(window.innerWidth * scale);
       h1 = h-1;
       d = Math.max(1, Math.round(w / 250));  d2 = d+d;
       canvas.width = w;  canvas.height = h;
       canvas2.width = w; canvas2.height = h;
       N = new Float64Array(nti*w);
       drawFun();
       drawSpline();
    }
    function drag(ev){
      if (dragId < 0) return;
      var c = getXY(ev, canvas);
      Px[dragId] = c[0];  Py[dragId] = c[1];
      drawSpline();
      ev.preventDefault();
    }
    function start_drag(ev){
      var c = getXY(ev, canvas);
      var Rmin = 2, r2,xi,yi;
      for (var i = 0; i < n1; i++){
       xi = (c[0] - Px[i]); yi = (c[1] - Py[i]);
       r2 = xi*xi + yi*yi;
       if ( r2 < Rmin ){ dragId = i; Rmin = r2;}}
      Px[dragId] = c[0];  Py[dragId] = c[1];
      drawSpline();
      ev.preventDefault();
    }
    function stop_drag(ev){
      dragId = -1;
      ev.preventDefault();
    }
    function drag2(ev){
      if (dragId2 < 0) return;
      var c = getXY(ev, canvas2);
      var Rmin = 2, r2;
      for (var i = 0; i < nti; i++)
        if ( (r2 = Math.abs(ti[i] - c[0]) ) < Rmin ){
          dragId2 = i; Rmin = r2;}
      ti[dragId2] = c[0];
      drawFun();
      drawSpline();
      ev.preventDefault();
    }
    function start_drag2(ev){
      var c = getXY(ev, canvas2);
      var Rmin = 2, r2;
      for (var i = 0; i < nti; i++)
        if ( (r2 = Math.abs(ti[i] - c[0]) ) < Rmin ){
          dragId2 = i; Rmin = r2;}
      ti[dragId2] = c[0];
      drawFun();
      drawSpline();
      ev.preventDefault();
    }
    function stop_drag2(ev){
      dragId2 = -1;
      ev.preventDefault();
    }
    function getXY(ev, cnv){
      if (!ev.clientX) ev = ev.touches[0];
      var rect = cnv.getBoundingClientRect();
      var x = (ev.clientX - rect.left) / w,
          y = (h1 - (ev.clientY - rect.top)) / h;
      return [x, y];
    }
    } // end