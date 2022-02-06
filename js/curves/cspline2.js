/**
 * Creates a curve object
 * @param controlPoints - The set of control points for the bezier curve
 * @constructor
 */
 function CSPL2(controlPoints, step, num_steps) {
    this.cp = controlPoints;
    this.step_n = num_steps;
    this.cp_n = controlPoints.length;  
    this.step = step;

    if(step >= num_steps -1){
        this.point = controlPoints[this.cp_n - 1];
 
        return;
    }

    var n = this.cp_n;
    this.ts = [];
    for(var i = 0; i < n; ++i){
        this.ts[i] = i / (n-1);
    }

    // let user change ts. for example:
    this.ts[1] = 0.1;
    this.ts[2] = 0.9;

    this.tsdiff = [];
    for(var i = 0; i < n-1; ++i){
        this.tsdiff[i] = this.ts[i+1] - this.ts[i];
    }

    this.Arr = CSPL2._gaussJ.zerosMat(this.cp_n, this.cp_n);
    CSPL2.fillMatrix(this.Arr, this.tsdiff);

    this.xs = [];
    this.ys = [];
    CSPL2.fillXY(this.xs, this.ys, controlPoints);

    this.x_RHS = [];
    CSPL2.buildKnotsRHS(this.cp_n, this.xs, this.x_RHS, this.tsdiff);
    this.y_RHS = [];
    CSPL2.buildKnotsRHS(this.cp_n, this.ys, this.y_RHS, this.tsdiff);

    this.Arr_temp = CSPL2._gaussJ.zerosMat(this.cp_n, this.cp_n + 1);
    copy_arr(this.Arr, this.Arr_temp, this.x_RHS, this.cp_n);
    this.xks = [];
    CSPL2._gaussJ.solve(this.Arr_temp, this.xks);
    
    copy_arr(this.Arr, this.Arr_temp, this.y_RHS, this.cp_n);
    this.yks = [];
    CSPL2._gaussJ.solve(this.Arr_temp, this.yks);


    var relative_pos = CSPL2.findRelativePos(this.cp_n, num_steps, step, this.ts);
    var i = relative_pos[0];
    var t = relative_pos[1];
    
    this.point = CSPL2.interpolateXY(i, t, this.xs, this.ys, this.xks, this.yks, this.tsdiff);
    console.log(this);
   
}

CSPL2.interpolateXY = function(i, t, xs, ys, xks, yks, tsdiff){
    var prev_x = xs[i];
    var next_x = xs[i + 1];
    var prev_xk = xks[i];
    var next_xk = xks[i + 1];
    var prev_c_w = 1-3*Math.pow(t,2)+2*Math.pow(t,3);
    var next_c_w = 3*Math.pow(t,2)-2*Math.pow(t,3);
    var prev_k_w = t*Math.pow(1-t,2);
    var next_k_w = Math.pow(t,2)*(t-1);

    var prev_y = ys[i];
    var next_y = ys[i + 1];
    var prev_yk = yks[i];
    var next_yk = yks[i + 1];

    var x = prev_x * prev_c_w + next_x * next_c_w + (prev_xk * prev_k_w + next_xk * next_k_w) * tsdiff[i];
    var y = prev_y * prev_c_w + next_y * next_c_w + (prev_yk * prev_k_w + next_yk * next_k_w) * tsdiff[i];
    return new Point(x,y);
}

/**
 * Find relative position of step
 * @param n - control points num
 * @param step
 * @param num_steps
 * @returns interval index, position in interval
 */
CSPL2.findRelativePos = function(n, num_steps, step, ts){
    if(step == 0) return [0,0];
    // console.log("begin");
    //console.log(n, num_steps, step);
    var global_relative_pos = step / (num_steps -1);
    var i = 0;
    for(;i < n-1, global_relative_pos > ts[i]; ++i);
    i--;
    var t = (global_relative_pos - ts[i])/(ts[i+1] - ts[i]);
    console.log(global_relative_pos, i, t);
    return [i, t];
 }


/**
 * Calculate right hand side of equations for xs or ys
 * @param n - size of cs vector
 * @param cs - vector of control points cooridnates (xs or ys)
 * @returns vector of right hand side of equations
 */
CSPL2.buildKnotsRHS = function(n, cs, RHS, tsdiff){
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
	
CSPL2._gaussJ = {};
CSPL2._gaussJ.solve = function(A, x)	// in Matrix, out solutions
{
    var m = A.length;
    for(var k=0; k<m; k++)	// column
    {
        // pivot for column
        var i_max = 0; var vali = Number.NEGATIVE_INFINITY;
        for(var i=k; i<m; i++) if(Math.abs(A[i][k])>vali) { i_max = i; vali = Math.abs(A[i][k]);}
        CSPL2._gaussJ.swapRows(A, k, i_max);
        
        //if(A[k][k] == 0) console.log("matrix is singular!");
        
        // for all rows below pivot
        for(var i=k+1; i<m; i++)
        {
            var cf = (A[i][k] / A[k][k]);
            for(var j=k; j<m+1; j++)  A[i][j] -= A[k][j] * cf;
        }
    }
    
    for(var i=m-1; i>=0; i--)	// rows = columns
    {
        var v = A[i][m] / A[i][i];
        x[i] = v;
        for(var j=i-1; j>=0; j--)	// rows
        {
            A[j][m] -= A[j][i] * v;
            A[j][i] = 0;
        }
    }
}
CSPL2._gaussJ.zerosMat = function(r,c) {var A = []; for(var i=0; i<r; i++) {A.push([]); for(var j=0; j<c; j++) A[i].push(0);} return A;}
CSPL2._gaussJ.printMat = function(A){ for(var i=0; i<A.length; i++) console.log(A[i]); }
CSPL2._gaussJ.swapRows = function(m, k, l) {var p = m[k]; m[k] = m[l]; m[l] = p;}
    
    
CSPL2.getNaturalKs = function(xs, ys, ks)	// in x values, in y values, out k values
{
    var n = xs.length-1;
    var A = CSPL2._gaussJ.zerosMat(n+1, n+2);
        
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
        
    CSPL2._gaussJ.solve(A, ks);		
}
   

/**
 * Creates a curve object
 * @param x the x of the point we want to calc y for
 * @param xs array of sorted
 * @returns y for a specific x
 */
CSPL2.evalSpline = function(x, xs, ys, ks)
{
    var i = 1;
    while(xs[i]<x) i++;
    
    var t = (x - xs[i-1]) / (xs[i] - xs[i-1]);
    
    var a =  ks[i-1]*(xs[i]-xs[i-1]) - (ys[i]-ys[i-1]);
    var b = -ks[i  ]*(xs[i]-xs[i-1]) + (ys[i]-ys[i-1]);
    
    var q = (1-t)*ys[i-1] + t*ys[i] + t*(1-t)*(a*(1-t)+b*t);
    return q;
}

function copy_arr(arr, newArray, RHS, n){
    for (var i = 0; i < n; i++){
        for(var j = 0; j < n; ++j){
            newArray[i][j] = arr[i][j];
        }
        newArray[i][n] = RHS[i];
    }
        
}

CSPL2.fillXY = function(xs, ys, controlPoints){
    for(var i = 0; i < controlPoints.length; ++i){
        xs[i] = controlPoints[i].x;
        ys[i] = controlPoints[i].y;
    }
}

/**
 * Creates Matrix
 * @param n - control points num
 * @returns matrix the will calc the knots
 */
 CSPL2.fillMatrix = function(Arr, tsdiff){
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
