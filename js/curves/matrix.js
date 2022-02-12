Matrix = {};
Matrix.solve = function(A, x)	// in Matrix, out solutions
{
    var m = A.length;
    for(var k=0; k<m; k++)	// column
    {
        // pivot for column
        var i_max = 0; var vali = Number.NEGATIVE_INFINITY;
        for(var i=k; i<m; i++) if(Math.abs(A[i][k])>vali) { i_max = i; vali = Math.abs(A[i][k]);}
        Matrix.swapRows(A, k, i_max);
        
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
Matrix.zerosMat = function(r,c) {var A = []; for(var i=0; i<r; i++) {A.push([]); for(var j=0; j<c; j++) A[i].push(0);} return A;}
Matrix.printMat = function(A){ for(var i=0; i<A.length; i++) console.log(A[i]); }
Matrix.swapRows = function(m, k, l) {var p = m[k]; m[k] = m[l]; m[l] = p;}

Matrix.transpose = function(a, n, k, at)
{
    for(var i = 0; i < n; ++i){
        for(var j = 0; j < k; ++j){
            at[j][i] = a[i][j];
        }
    }
}

Matrix.multiply = function(a, b, res) {
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

Matrix.multiplyByVec = function(a, b, res) {
    var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = 1;  // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
        res[r] = 0;             // initialize the current cell
        for (var i = 0; i < aNumCols; ++i) {
            res[r] += a[r][i] * b[i];
        }
    }
}

Matrix.copyArr = function(arr, newArray, RHS, k){
    for (var i = 0; i < k; i++){
        for(var j = 0; j < k; ++j){
            newArray[i][j] = arr[i][j];
        }
        newArray[i][k] = RHS[i];
    }       
}

Matrix.fillXY = function(xs, ys, controlPoints){
    for(var i = 0; i < controlPoints.length; ++i){
        xs[i] = controlPoints[i].x;
        ys[i] = controlPoints[i].y;
    }
}

Matrix.Pair = function(prev, next){
    this.prev = prev;
    this.next = next;
}