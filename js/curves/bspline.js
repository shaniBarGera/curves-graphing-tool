/**
 * Creates a curve object
 * @param controlPoints - The set of control points for the bezier curve
 * @constructor
 */
 function BSpline(controlPoints, step, num_steps, k, ts) {
    var n = controlPoints.length;

    this.nk = n + k;
    this.nk2 = n + 2*k;
    this.nk3 = n + 3*k;

    /*this.ts_ext = [];
    for(var i=0; i < k; ++i){
        this.ts_ext[i] = (i - k) / (n-1);  // if diffs between input ts are equal the sames diffs will be between new extended ts array
    }
    for(var i=k; i < this.nk; ++i){
        this.ts_ext[i] = ts[i-k];
    }
    for(var i=this.nk; i < this.nk3; ++i){
        this.ts_ext[i] = 1 + (1 + i - this.nk) / (n-1); // if diffs between input ts are equal the sames diffs will be between new extended ts array
    }

    for(var i=0; i < this.nk3; ++i){
        console.log(step, i , this.ts_ext[i]);
    }*/

    this.xs = new Array(this.nk2);
    this.ys = new Array(this.nk2);
    BSpline.fillXY(this.xs, this.ys, controlPoints, k, n, this.nk2);
    
    this.base = [];

    //var t = k + (step / (num_steps -1)) * (this.nk -1);
    var t = ts[k] + (ts[this.nk2] - ts[k]) * step / (num_steps -1);
    this.sumN = 0;
    var x = 0, y = 0;
    for(var i = 0; i < this.nk2; ++i){
        this.base[i] = BSpline.findN(ts, t, i, k);
        //this.sumN += this.N[i];
        x += this.xs[i] * this.base[i];
        y += this.ys[i] * this.base[i];
        
    }
  
    this.point = new Point(x, y);
}

BSpline.fillXY = function(xs, ys, controlPoints, k, n, nk2){
    for(var i = 0; i < k; ++i){
        xs[i] = controlPoints[0].x;
        ys[i] = controlPoints[0].y;

        xs[nk2 - i - 1] = controlPoints[n - 1].x;
        ys[nk2 - i -1] = controlPoints[n - 1].y;
    }
    for(var i = 0; i < n; ++i){
        xs[i + k] = controlPoints[i].x;
        ys[i + k] = controlPoints[i].y;
    }
}

BSpline.findN = function(ts_ext,t, i, k){
    if(t < ts_ext[i] || t >= ts_ext[i+k]) return 0;
    if(k == 1 ) return 1;

    var N1 = BSpline.findN(ts_ext, t, i, k-1) * (t - ts_ext[i]) / (ts_ext[i+k-1] - ts_ext[i]);
    var N2 = BSpline.findN(ts_ext, t, i+1, k-1) * (ts_ext[i+k] - t) / (ts_ext[i+k] - ts_ext[i+1]);
    var N = N1 + N2;
    return N;

}
