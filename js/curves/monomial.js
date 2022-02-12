/**
 * Creates a curve object
 * @param controlPoints - The set of control points for the bezier curve
 * @constructor
 */
 function MonomialCurve(controlPoints, step, num_steps, k, ts) {
    this.k = k;
    this.cp = controlPoints;
    this.step_n = num_steps;
    this.cp_n = controlPoints.length;  
    this.step = step;

    this.Arr = Matrix.zerosMat(this.cp_n, k);
    MonomialCurve.fillMatrix(this.Arr, this.cp_n, k, ts);
    this.tArr = Matrix.zerosMat(k, this.cp_n);
    Matrix.transpose(this.Arr, this.cp_n, k, this.tArr);

    this.xs = [];
    this.ys = [];
    Matrix.fillXY(this.xs, this.ys, controlPoints);

    this.x_RHS = [];
    this.y_RHS = [];
    Matrix.multiplyByVec(this.tArr, this.xs, this.x_RHS);
    Matrix.multiplyByVec(this.tArr, this.ys, this.y_RHS);
    
    this.AtA = Matrix.zerosMat(k, k);
    Matrix.multiply(this.tArr, this.Arr, this.AtA);

    this.Arr_temp = Matrix.zerosMat(k, k + 1);
    Matrix.copyArr(this.AtA, this.Arr_temp, this.x_RHS, k);
    this.xbs = [];
    Matrix.solve(this.Arr_temp, this.xbs);
    
    Matrix.copyArr(this.AtA, this.Arr_temp, this.y_RHS, k);
    this.ybs = [];
    Matrix.solve(this.Arr_temp, this.ybs);

    var t = (step / (num_steps -1));
    var x = this.xbs[0], y = this.ybs[0];
    this.base = [];
    this.base[0] = 1;
    for(var i = 1; i < k; ++i){
        this.base[i] = Math.pow(t, i);
        x += this.xbs[i] * this.base[i];
        y += this.ybs[i] * this.base[i];
    }
  
    this.point = new Point(x,y);
}

/**
 * Creates Matrix
 * @param n - control points num
 * @returns matrix the will calc the knots
 */
 MonomialCurve.fillMatrix = function(Arr, n, k, ts){
    var n = Arr.length;
    for(var i = 0; i < n; ++i){
        Arr[i][0] = 1;
        for(var j = 1; j < k; ++j){
            Arr[i][j] = Math.pow(ts[i], j);
        }
    }
}
