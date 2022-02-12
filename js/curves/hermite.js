/**
 * Creates a curve object
 * @param controlPoints - The set of control points for the bezier curve
 * @constructor
 */
 function CHSPL(controlPoints, step, num_steps, kControlPoints) {
    var n = controlPoints.length;  

    if(step >= num_steps -1){
        this.point = controlPoints[n - 1];
        return;
    }

    this.ts = [];
    for(var i = 0; i < n; ++i){
        this.ts[i] = i / (n-1);
    }

    this.tsdiff = [];
    for(var i = 0; i < n-1; ++i){
        this.tsdiff[i] = this.ts[i+1] - this.ts[i];
    }

    this.xs = [];
    this.ys = [];
    Matrix.fillXY(this.xs, this.ys, controlPoints);

    this.xks = [];
    this.yks = [];
    var const_num = 4;
    for(var i = 0; i < n; i++){
        var j = i * 2;
        this.xks[i] = const_num * (kControlPoints[j + 1].x - kControlPoints[j].x);
        this.yks[i] = const_num * (kControlPoints[j + 1].y - kControlPoints[j].y);
    }
    
    this.point = CSPL.interpolateXY(n, num_steps, step, this.ts, this.xs, this.ys, this.xks, this.yks, this.tsdiff);
}

