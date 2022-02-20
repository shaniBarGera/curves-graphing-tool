/**
 * Creates a curve object
 * @param controlPoints - The set of control points for the bezier curve
 * @constructor
 */
 function CSPL(controlPoints, step, num_steps, ts) {
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

    this.Arr = Matrix.zerosMat(n, n);
    CSPL.fillMatrix(this.Arr, this.tsdiff);

    this.xs = [];
    this.ys = [];
    Matrix.fillXY(this.xs, this.ys, controlPoints);

    this.x_RHS = [];
    CSPL.buildKnotsRHS(n, this.xs, this.x_RHS, this.tsdiff);
    this.y_RHS = [];
    CSPL.buildKnotsRHS(n, this.ys, this.y_RHS, this.tsdiff);

    this.Arr_temp = Matrix.zerosMat(n, n + 1);
    Matrix.copyArr(this.Arr, this.Arr_temp, this.x_RHS, n);
    this.xks = [];
    Matrix.solve(this.Arr_temp, this.xks);
    
    Matrix.copyArr(this.Arr, this.Arr_temp, this.y_RHS, n);
    this.yks = [];
    Matrix.solve(this.Arr_temp, this.yks);
    
    this.base = [];
    
    
    this.point = CSPL.interpolateXY(n, num_steps, step, ts, this.xs, this.ys, this.xks, this.yks, this.tsdiff, this.base, this.draw);
    
}

CSPL.calcDiff = function(ts, n, tsdiff){
    for(var i = 0; i < n-1; ++i){
        tsdiff[i] = ts[i+1] - ts[i];
    }
}

CSPL.calcKWeights = function(t){
    var prev_k_w = t*Math.pow(1-t,2); //H10
    var next_k_w = Math.pow(t,2)*(t-1); //H11
    return new Matrix.Pair(prev_k_w, next_k_w);
}

CSPL.calcCWeights = function(t){
    var prev_c_w = 1-3*Math.pow(t,2)+2*Math.pow(t,3); // H00
    var next_c_w = 3*Math.pow(t,2)-2*Math.pow(t,3); //H01
    return new Matrix.Pair(prev_c_w, next_c_w);
}

CSPL.calcBase = function(t, base){
    base[0] =  1-3*Math.pow(t,2)+2*Math.pow(t,3); // H00
    base[1] = 3*Math.pow(t,2)-2*Math.pow(t,3); //H01
    base[2] =  t*Math.pow(1-t,2); //H10
    base[3] = Math.pow(t,2)*(t-1); //H11
}

CSPL.interpolate = function(cs, ks, base, tsdiff, i){
    //var c_w = CSPL.calcCWeights(t);
    //var k_w = CSPL.calcKWeights(t);

    var c = new Matrix.Pair(cs[i] * base[0], cs[i+1] * base[1]);
    var k = new Matrix.Pair(ks[i] * base[2], ks[i+1] * base[3]);
    return c.prev + c.next + (k.prev + k.next) * tsdiff[i];
}

CSPL.interpolateXY = function(n, num_steps, step, ts,  xs, ys, xks, yks, tsdiff, base, draw){
    var relative_pos = CSPL.findRelativePos(n, num_steps, step, ts, draw);
    var i = relative_pos[0];
    var t = relative_pos[1];

    CSPL.calcBase(t, base);

    var x = CSPL.interpolate(xs, xks, base, tsdiff, i);
    var y = CSPL.interpolate(ys, yks, base, tsdiff, i);
    return new Point(x,y);
}

/**
 * Find relative position of step
 * @param n - control points num
 * @param step
 * @param num_steps
 * @returns interval index, position in interval
 */
CSPL.findRelativePos = function(n, num_steps, step, ts, draw){
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


/**
 * Calculate right hand side of equations for xs or ys
 * @param n - size of cs vector
 * @param cs - vector of control points cooridnates (xs or ys)
 * @returns vector of right hand side of equations
 */
CSPL.buildKnotsRHS = function(n, cs, RHS, tsdiff){
    for(var i; i < n; ++i){
        RHS[i] = 0;
    }
    var cn = 6;
    var temp = [];
    for(var i = 0; i < n-1; ++i){
        var top =  cn * (cs[i+1] - cs[i]) ;
        var bottom = Math.pow(tsdiff[i],2);
        temp[i] = top / bottom ; 
    }

    RHS[0] = temp[0];
    RHS[n-1] = temp[n-2];

    for(var i = 1; i < n-1; ++i){
        RHS[i] = temp[i] + temp[i-1];
    }
    
}
    
CSPL.getNaturalKs = function(xs, ys, ks)	// in x values, in y values, out k values
{
    var n = xs.length-1;
    var A = Matrix.zerosMat(n+1, n+2);
        
    for(var i=1; i<n; i++)	// rows
    {
        A[i][i-1] = 1/(xs[i] - xs[i-1]);
        
        A[i][i  ] = 2 * (1/(xs[i] - xs[i-1]) + 1/(xs[i+1] - xs[i])) ;
        
        A[i][i+1] = 1/(xs[i+1] - xs[i]);
        
        A[i][n+1] = 3*( (ys[i]-ys[i-1])/((xs[i] - xs[i-1])*(xs[i] - xs[i-1]))  +  (ys[i+1]-ys[i])/ ((xs[i+1] - xs[i])*(xs[i+1] - xs[i])) );
    }
    
    A[0][0  ] = 2/(xs[1] - xs[0]);
    A[0][1  ] = 1/(xs[1] - xs[0]);
    A[0][n+1] = 3 * (ys[1] - ys[0]) / ((xs[1]-xs[0])*(xs[1]-xs[0]));
    
    A[n][n-1] = 1/(xs[n] - xs[n-1]);
    A[n][n  ] = 2/(xs[n] - xs[n-1]);
    A[n][n+1] = 3 * (ys[n] - ys[n-1]) / ((xs[n]-xs[n-1])*(xs[n]-xs[n-1]));
        
    Matrix.solve(A, ks);		
}

/**
 * Creates Matrix
 * @param n - control points num
 * @returns matrix the will calc the knots
 */
 CSPL.fillMatrix = function(Arr, tsdiff){
    var n = Arr.length;
    for(var i = 0; i < n-1; ++i){
        Arr[i][i+1] = 2 / tsdiff[i]; // fill upper diagonal
        Arr[i+1][i] = 2 / tsdiff[i]; // fill lower diagonal
        Arr[i][i] = 8; // fill diagonal with 8s
    }
    for(var i = 1; i < n-1; ++i){
        Arr[i][i] = 2 * (Arr[i][i-1] + Arr[i][i+1]); // fill diagonal with 8s
    }
    Arr[0][0] = 2 * Arr[0][1];
    Arr[n-1][n-1] = 2 * Arr[n-1][n-2];
}
