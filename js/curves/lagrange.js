/**
* Creates a Lagrange curve object for a specific point
* @param controlPoints - the set of control point
* @param num_steps - number of total steps 
* @param step - current step ("t") to calculate
* @param ts - array of "t_i"s
* @constructor
*/
 function LagrangeCurve(controlPoints, step, num_steps, ts) {
    var n = controlPoints.length;
    this.xs = [];
    this.ys = [];
    Matrix.fillXY(this.xs, this.ys, controlPoints);

    this.t = Curves.calcT(step, num_steps);

    this.base = [];
    LagrangeCurve.calcBase(this.base, n, ts, this.t);

    this.point = Curves.interpolateXY(n, this.xs, this.ys, this.base)
}

/**
* Fill base function L_i(t) for each i
* @param L - array to fill with the L_i's outputs
* @param n - number of control points 
* @param ts - array of "t_i"s 
* @param t - input point to calculate L_i(t)
* @constructor
*/
LagrangeCurve.calcBase = function(L, n, ts, t){
    for(var i = 0; i < n; ++i){
        var numerator = 1, denominator = 1;
        for(var j = 0; j < n; ++j){
            if(j == i) continue;
            numerator *= (t - ts[j]);
            denominator *= (ts[i] - ts[j]);
        }
        L[i] = numerator / denominator;
    }
}