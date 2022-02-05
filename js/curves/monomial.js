/**
 * Creates a curve object
 * @param controlPoints - The set of control points for the bezier curve
 * @constructor
 */
 function MonomialCurve(controlPoints, step, num_steps) {
    var k = 5; // k <= n !!!
    this.cp = controlPoints;
    this.step_n = num_steps;
    this.cp_n = controlPoints.length;  
    this.step = step;

    this.Arr = MonomialCurve._gaussJ.zerosMat(this.cp_n, k);
    MonomialCurve.fillMatrix(this.Arr, this.cp_n, k);
    this.tArr = MonomialCurve._gaussJ.zerosMat(k, this.cp_n);
    transpose(this.Arr, this.cp_n, k, this.tArr);

    this.xs = [];
    this.ys = [];
    MonomialCurve.fillXY(this.xs, this.ys, controlPoints);

    this.x_RHS = [];
    this.y_RHS = [];
    multiplyByVec(this.tArr, this.xs, this.x_RHS);
    multiplyByVec(this.tArr, this.ys, this.y_RHS);
    
    this.AtA = MonomialCurve._gaussJ.zerosMat(k, k);
    multiply(this.tArr, this.Arr, this.AtA);

    
    this.Arr_temp = MonomialCurve._gaussJ.zerosMat(k, k + 1);
    MonomialCurve.copy_arr(this.AtA, this.Arr_temp, this.x_RHS, k);
    this.xbs= [];
    MonomialCurve._gaussJ.solve(this.Arr_temp, this.xbs);
    
    MonomialCurve.copy_arr(this.AtA, this.Arr_temp, this.y_RHS, k);
    this.ybs = [];
    MonomialCurve._gaussJ.solve(this.Arr_temp, this.ybs);


    var t = (step / (num_steps -1)) * (this.cp_n -1);
    var x = this.xbs[0], y = this.ybs[0];
    for(var i = 1; i < k; ++i){
        x += this.xbs[i] * Math.pow(t, i);
        y += this.ybs[i] * Math.pow(t, i);
    }
  
    this.point = new Point(x,y);
   
}

 function transpose(a, n, k, at){
    for(var i = 0; i < n; ++i){
        for(var j = 0; j < k; ++j){
            at[j][i] = a[i][j];
        }
    }
 }

function multiply(a, b, res) {
    var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length;  // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
      res[r] = new Array(bNumCols); // initialize the current row
      for (var c = 0; c < bNumCols; ++c) {
        res[r][c] = 0;             // initialize the current cell
        for (var i = 0; i < aNumCols; ++i) {
          res[r][c] += a[r][i] * b[i][c];
        }
      }
    }
}

function multiplyByVec(a, b, res) {
    var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = 1;  // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
        res[r] = 0;             // initialize the current cell
        for (var i = 0; i < aNumCols; ++i) {
            res[r] += a[r][i] * b[i];
        }
    }
}
	
MonomialCurve._gaussJ = {};
MonomialCurve._gaussJ.solve = function(A, x)	// in Matrix, out solutions
{
    var m = A.length;
    for(var k=0; k<m; k++)	// column
    {
        // pivot for column
        var i_max = 0; var vali = Number.NEGATIVE_INFINITY;
        for(var i=k; i<m; i++) if(Math.abs(A[i][k])>vali) { i_max = i; vali = Math.abs(A[i][k]);}
        MonomialCurve._gaussJ.swapRows(A, k, i_max);
        
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
MonomialCurve._gaussJ.zerosMat = function(r,c) {var A = []; for(var i=0; i<r; i++) {A.push([]); for(var j=0; j<c; j++) A[i].push(0);} return A;}
MonomialCurve._gaussJ.printMat = function(A){ for(var i=0; i<A.length; i++) console.log(A[i]); }
MonomialCurve._gaussJ.swapRows = function(m, k, l) {var p = m[k]; m[k] = m[l]; m[l] = p;}

MonomialCurve.copy_arr = function(arr, newArray, RHS, k){
    for (var i = 0; i < k; i++){
        for(var j = 0; j < k; ++j){
            newArray[i][j] = arr[i][j];
        }
        newArray[i][k] = RHS[i];
    }
        
}

MonomialCurve.fillXY = function(xs, ys, controlPoints){
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
 MonomialCurve.fillMatrix = function(Arr, n, k){
    var n = Arr.length;
    for(var i = 0; i < n; ++i){
        Arr[i][0] = 1;
        for(var j = 1; j < k; ++j){
            Arr[i][j] = Math.pow(i, j);
        }
    }
}
