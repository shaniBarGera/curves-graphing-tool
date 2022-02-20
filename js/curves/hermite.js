/**
 * Creates a curve object
 * @param controlPoints - The set of control points for the bezier curve
 * @constructor
 */
 function CHSPL(controlPoints, step, num_steps, kControlPoints, ts) {
    var n = controlPoints.length;  
    this.draw = [true];

    if(step >= num_steps -1){
        this.point = controlPoints[n - 1];
        this.base = [];
        CHSPL.calcBase(1, this.base);
        return;
    }

    this.tsdiff = [];
    CHSPL.calcDiff(ts, n, this.tsdiff);

    this.xs = [];
    this.ys = [];
    Matrix.fillXY(this.xs, this.ys, controlPoints);

    this.xks = [];
    this.yks = [];
    var const_num = 12;
    for(var i = 0; i < n; i++){
        var j = i * 2;
        this.xks[i] = const_num * (kControlPoints[j + 1].x - kControlPoints[j].x);
        this.yks[i] = const_num * (kControlPoints[j + 1].y - kControlPoints[j].y);
    }

    this.base = [];
    this.point = CHSPL.interpolateXY(n, num_steps, step, ts, this.xs, this.ys, this.xks, this.yks, this.tsdiff, this.base, this.draw);

}

CHSPL.calcDiff = function(ts, n, tsdiff){
    for(var i = 0; i < n-1; ++i){
        tsdiff[i] = ts[i+1] - ts[i];
    }
}

CHSPL.calcBase = function(t, base){
    base[0] =  1-3*Math.pow(t,2)+2*Math.pow(t,3); // H00
    base[1] = 3*Math.pow(t,2)-2*Math.pow(t,3); //H01
    base[2] =  t*Math.pow(1-t,2); //H10
    base[3] = Math.pow(t,2)*(t-1); //H11
}

CHSPL.interpolate = function(cs, ks, base, tsdiff, i){
    return cs[i] * base[0] + cs[i+1] * base[1] +
                ( ks[i] * base[2] +  ks[i+1] * base[3]) * tsdiff[i];
}

CHSPL.interpolateXY = function(n, num_steps, step, ts,  xs, ys, xks, yks, tsdiff, base, draw){
    var relative_pos = CHSPL.findRelativePos(n, num_steps, step, ts, draw);
    var i = relative_pos[0];
    var t = relative_pos[1];

    CHSPL.calcBase(t, base);

    var x = CHSPL.interpolate(xs, xks, base, tsdiff, i);
    var y = CHSPL.interpolate(ys, yks, base, tsdiff, i);
    return new Point(x,y);
}

/**
 * Find relative position of step
 * @param n - control points num
 * @param step
 * @param num_steps
 * @returns interval index, position in interval
 */
CHSPL.findRelativePos = function(n, num_steps, step, ts, draw){
    if(step == 0) return [0,0];
    var global_relative_pos = step / (num_steps -1);
    var i = 0;
    for(;i < n-1, global_relative_pos > ts[i]; ++i);
    i--;
    var t = (global_relative_pos - ts[i])/(ts[i+1] - ts[i]);

    var prev_global_relative_pos = (step -1) / (num_steps - 1);

    if(prev_global_relative_pos <= ts[i]) draw[0] = false;
        
    return [i, t];
 }


