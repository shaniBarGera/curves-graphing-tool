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

    this.xs = new Array(this.nk2);
    this.ys = new Array(this.nk2);
    BSpline.fillXY(this.xs, this.ys, controlPoints, k, n, this.nk2);
    
    this.base = [];
    var t = ts[k] + (ts[this.nk2] - ts[k]) * step / (num_steps -1);
    
    this.point = BSpline.interpolateXY(this.nk2, this.base, ts, t, k, this.xs, this.ys);
}

BSpline.interpolateXY = function(nk2, base, ts, t, k, xs, ys){
    var x = 0, y = 0;
    for(var i = 0; i < nk2; ++i){
        base[i] = BSpline.findN(ts, t, i, k);
        x += xs[i] * base[i];
        y += ys[i] * base[i];
        
    }
    return new Point(x, y);
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
