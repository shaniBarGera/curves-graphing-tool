/**
 * Creates a curve object
 * @param controlPoints - The set of control points for the bezier curve
 * @constructor
 */
 function LagrangeCurve(controlPoints, step, num_steps) {
    this.cp = controlPoints;
    this.step_n = num_steps;
    this.cp_n = controlPoints.length;  
    this.step = step;

    this.ts = [];
    for(var i=0; i < this.cp_n; ++i){
        this.ts[i] = i;
    }

    this.xs = [];
    this.ys = [];
    LagrangeCurve.fillXY(this.xs, this.ys, controlPoints);
    
    this.L = [];

    var t = (step / (num_steps -1)) * (this.cp_n-1);
    var x = 0, y = 0;
    for(var i = 0; i < this.cp_n; ++i){
        var numerator = 1, denominator = 1;
        for(var j = 0; j < this.cp_n; ++j){
            if(j == i) continue;
            numerator *= (t - this.ts[j]);
            denominator *= (this.ts[i] - this.ts[j]);
        }
        this.L[i]= numerator / denominator;
        x += this.xs[i] * this.L[i];
        y += this.ys[i] * this.L[i];
        console.log(i, numerator, denominator, x, y);
    }
    

    //this.point = new Point(100+step, 200-100*this.L[1]);
    this.point = new Point(x, y);
   
    //this.point = new Point(0,0);
    console.log(this);
}

LagrangeCurve.fillXY = function(xs, ys, controlPoints){
    for(var i = 0; i < controlPoints.length; ++i){
        xs[i] = controlPoints[i].x;
        ys[i] = controlPoints[i].y;
    }
}