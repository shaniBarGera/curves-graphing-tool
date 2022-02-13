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
        CSPL.calcBase(1, this.base);
        return;
    }

    this.tsdiff = [];
    CSPL.calcDiff(ts, n, this.tsdiff);

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
    this.point = CSPL.interpolateXY(n, num_steps, step, ts, this.xs, this.ys, this.xks, this.yks, this.tsdiff, this.base, this.draw);

}

