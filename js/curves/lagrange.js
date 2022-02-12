/**
 * Creates a curve object
 * @param controlPoints - The set of control points for the bezier curve
 * @constructor
 */
 function LagrangeCurve(controlPoints, step, num_steps, ts) {
    var n = controlPoints.length;
    this.xs = [];
    this.ys = [];
    Matrix.fillXY(this.xs, this.ys, controlPoints);

    /*this.ts = [];
    for(var i=0; i < n; ++i){
        this.ts[i] = i;
    }*/
    var t = (step / (num_steps -1)) ;
    //var t = (step / (num_steps -1)) * (n-1);

    this.base = [];

    this.point = LagrangeCurve.interpolateXY(n, t, ts, this.xs, this.ys, this.base);
}

LagrangeCurve.interpolateXY = function(n, t, ts, xs, ys, L){
    var x = 0, y = 0;
    for(var i = 0; i < n; ++i){
        var numerator = 1, denominator = 1;
        for(var j = 0; j < n; ++j){
            if(j == i) continue;
            numerator *= (t - ts[j]);
            denominator *= (ts[i] - ts[j]);
        }
        L[i] = numerator / denominator;
        x += xs[i] * L[i];
        y += ys[i] * L[i];
    }
    return new Point(x, y); 
}