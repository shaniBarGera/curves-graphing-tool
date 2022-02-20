/**
* Creates a B-Spline curve object for a specific point
* @param controlPoints - the set of control point
* @param num_steps - number of total steps 
* @param step - current step ("t") to calculate
* @param k - order of curve
* @param ts - array of "t_i"s
* @constructor
*/
 function BSpline(controlPoints, step, num_steps, k, ts) {
    var n = controlPoints.length;
    this.nk2 = n + 2*k;
    this.ts = ts.slice();
    this.step = step;
    this.num_steps = num_steps;

    this.xs = [];
    this.ys = [];
    BSpline.fillXY(this.xs, this.ys, controlPoints, k, n, this.nk2);
    
    this.base = [];
    //this.t = ts[k] + (ts[this.nk2] - ts[k]) * step / (num_steps -1);
    this.t = BSpline.calcT(this.ts, k, this.nk2, step, num_steps);
    
    BSpline.calcBase(this.nk2, this.base, ts, this.t, k)
    this.point = Curves.interpolateXY(this.nk2, this.xs, this.ys, this.base);
    //this.point = BSpline.interpolateXY(this.nk2, this.base, ts, t, k, this.xs, this.ys);
}

BSpline.calcT = function(ts, k, nk2, step, num_steps){
    var t = ts[k] + (ts[nk2] - ts[k]) * step / (num_steps -1);
    return t;
}

BSpline.calcBase = function(nk2, base, ts, t, k){
    for(var i = 0; i < nk2; ++i){
        base[i] = BSpline.findN(ts, t, i, k);
    }
}

BSpline.fillXY = function(xs, ys, controlPoints, k, n, nk2){
     // extend first and last control point k times
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
