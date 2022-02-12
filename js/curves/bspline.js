/**
 * Creates a curve object
 * @param controlPoints - The set of control points for the bezier curve
 * @constructor
 */
 function BSpline(controlPoints, step, num_steps, k) {
    var n = controlPoints.length;

    this.nk = n + k;
    this.nk2 = n + 2*k;
    this.nk3 = n + 3*k;

    this.ts = [];
    for(var i=0; i < this.nk3; ++i){
        this.ts[i] = i;
    }

    this.xs = new Array(this.nk2);
    this.ys = new Array(this.nk2);
    BSpline.fillXY(this.xs, this.ys, controlPoints, k, n, this.nk2);
    
    this.N = [];

    var t = k + (step / (num_steps -1)) * (this.nk -1);
    this.sumN = 0;
    var x = 0, y = 0;
    for(var i = 0; i < this.nk2; ++i){
        this.N[i] = BSpline.findN(this.ts,t, i, k);
        this.sumN += this.N[i];
        x += this.xs[i] * this.N[i];
        y += this.ys[i] * this.N[i];
        
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

BSpline.findN = function(ts,t, i, k){
    if(t < ts[i] || t >= ts[i+k]) return 0;
    if(k == 1 ) return 1;

    var N1 = BSpline.findN(ts, t, i, k-1) * (t - ts[i]) / (ts[i+k-1] - ts[i]);
    var N2 = BSpline.findN(ts, t, i+1, k-1) * (ts[i+k] - t) / (ts[i+k] - ts[i+1]);
    var N = N1 + N2;
    return N;

}
