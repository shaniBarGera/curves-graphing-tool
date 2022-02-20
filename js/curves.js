/**
 * Creates a new 2-D Point object
 * @param x - The value of the point in the first dimension
 * @param y - The value of the point in the second dimension
 * @constructor
 */
 function Point(x, y) {
    this.x = x;
    this.y = y;
}



/****************************** Base Curve ******************************/

class Curve {
    /**
     * Creates a curve object for a specific point
     * @param controlPoints - the set of control point
     * @param relativeStep - current step / number of total steps -1
     * @constructor
    */
    constructor(controlPoints, relativeStep, ts) {
        this.n = controlPoints.length; 
        this.cp = controlPoints.slice();
        if(ts) this.ts = ts.slice();

        this.relativeStep = relativeStep;

        this.draw = [true];
        this.curve = null;

        this.xs = [];
        this.ys = [];

        this.tsdiff = [];
        this.base = [];
        this.t = 0;
        this.point = new Point(0,0);

        this.Arr = Matrix.zerosMat(this.n, this.n);
    }

    build(){
        this.fillXY();
        this.calcDiff();
        this.setMatrixs();
        this.calcT();
        this.calcBase();
        this.interpolateXY();
    }

    fillXY(){
        for(var i = 0; i < this.n; ++i){
            this.xs[i] = this.cp[i].x;
            this.ys[i] = this.cp[i].y;
        }
    }

    calcT(){
        this.t = this.relativeStep;
    }

    interpolateXY(){
        var x = 0, y = 0;
        var n = this.base.length;
        for(var i = 0; i < n; ++i){
            x += this.xs[i] * this.base[i];
            y += this.ys[i] * this.base[i];
        }
        this.point = new Point(x, y);
    }

    calcBase(){
    }

    calcDiff(){
        for(var i = 0; i < this.n-1; ++i){
            this.tsdiff[i] = this.ts[i+1] - this.ts[i];
        }
    }

    setMatrixs(){
    }
}



/****************************** Lagrange Curve ******************************/

class LagrangeCurve extends Curve {
    /**
     * Creates a Lagrange curve object for a specific point
     * @param controlPoints - the set of control point
     * @param relativeStep - current step / number of total steps -1
     * @param ts - array of "t_i"s
     * @constructor
    */
    constructor(controlPoints, relativeStep, ts) {
        super(controlPoints, relativeStep, ts);
    }

    // Fill base function L_i(t) for each i
    calcBase(){
        for(var i = 0; i < this.n; ++i){
            var numerator = 1, denominator = 1;
            for(var j = 0; j < this.n; ++j){
                if(j == i) continue;
                numerator *= (this.t - this.ts[j]);
                denominator *= (this.ts[i] - this.ts[j]);
            }
            this.base[i] = numerator / denominator;
        }
    }
}



/****************************** B-Spline Curve ******************************/

class BSPL extends Curve {
    /**
     * Creates a B-Spline curve object for a specific point
     * @param controlPoints - the set of control point
     * @param relativeStep - current step / number of total steps -1
     * @param k - order of curve
     * @param ts - array of "t_i"s
     * @constructor
    */
    constructor(controlPoints, relativeStep, ts, k) {
        super(controlPoints, relativeStep, ts);
        this.k = k;
        this.nk2 = this.n + 2*k;
    }

    fillXY(){
        // extend first and last control point k times
        for(var i = 0; i < this.k; ++i){
            this.xs[i] = this.cp[0].x;
            this.ys[i] = this.cp[0].y;
    
            this.xs[this.nk2 - i - 1] = this.cp[this.n - 1].x;
            this.ys[this.nk2 - i -1] = this.cp[this.n - 1].y;
        }

        for(var i = 0; i < this.n; ++i){
            this.xs[i + this.k] = this.cp[i].x;
            this.ys[i + this.k] = this.cp[i].y;
        }
    }

    calcT(){
        var k = this.k;
        this.t = this.ts[k] + (this.ts[this.nk2] - this.ts[k]) * this.relativeStep;
    }

    calcBase(){
        for(var i = 0; i < this.nk2; ++i){
            this.base[i] = findN(this.ts, this.t, i, this.k);
        }
    }
}

function findN(ts_ext,t, i, k){
    if(t < ts_ext[i] || t >= ts_ext[i+k]) return 0;
    if(k == 1 ) return 1;

    var N1 = self.findN(ts_ext, t, i, k-1) * (t - ts_ext[i]) / (ts_ext[i+k-1] - ts_ext[i]);
    var N2 = self.findN(ts_ext, t, i+1, k-1) * (ts_ext[i+k] - t) / (ts_ext[i+k] - ts_ext[i+1]);
    var N = N1 + N2;
    return N;

}



/****************************** Cubic Spline Curve ******************************/

class CSPL extends Curve{
    /**
     * Creates a C-Spline curve object for a specific point
     * @param controlPoints - the set of control point
     * @param relativeStep - current step / number of total steps -1
     * @param prev_relativeStep - previouse step / number of total steps -1
     * @param ts - array of "t_i"s
     * @constructor
    */
    constructor(controlPoints, relativeStep, prev_relativeStep, ts) {
        super(controlPoints, relativeStep, ts);

        this.prev_relativeStep = prev_relativeStep;
        this.i = 0;

        this.xks = [];
        this.yks = [];
    }

    setMatrixs(){
        var n = this.n;
        for(var i = 0; i < n-1; ++i){
            this.Arr[i][i+1] = 2 /  this.tsdiff[i]; // fill upper diagonal
            this.Arr[i+1][i] = 2 /  this.tsdiff[i]; // fill lower diagonal
            this.Arr[i][i] = 8; // fill diagonal with 8s
        }
        for(var i = 1; i < n-1; ++i){
            this.Arr[i][i] = 2 * ( this.Arr[i][i-1] +  this.Arr[i][i+1]); // fill diagonal with 8s
        }
        this.Arr[0][0] = 2 *  this.Arr[0][1];
        this.Arr[n-1][n-1] = 2 *  this.Arr[n-1][n-2];
    }

    calcT(){
        if(this.relativeStep == 0) return;
        var i = 0;
        var n = this.n;
        for(;i < n-1, this.relativeStep > this.ts[i]; ++i){
            if(i >= n - 1) break;
            console.log(i, n-1, this.relativeStep, this.ts[i]);
        }
        
        i--;
        this.i = i;
        var diff_top = this.relativeStep - this.ts[i];
        var diff_bottom = this.ts[i+1] - this.ts[i];
        
        this.t = diff_top / diff_bottom;
        console.log(i, this.t, diff_bottom, diff_top);
        if(this.prev_relativeStep <= this.ts[i]) this.draw[0] = false;
    }

    calcBase(){
        var t = this.t;
        this.base[0] =  1-3*Math.pow(t,2)+2*Math.pow(t,3); // H00
        this.base[1] = 3*Math.pow(t,2)-2*Math.pow(t,3); //H01
        this.base[2] =  t*Math.pow(1-t,2); //H10
        this.base[3] = Math.pow(t,2)*(t-1); //H11
    }

    interpolateXY(){
        var x = this.interpolate(this.xs, this.xks);
        var y = this.interpolate(this.ys, this.yks);
        this.point = new Point(x,y);
    }

    /**** InterpolateXY helper functions ****/

    interpolate(cs, ks){
        this.calcKs(cs, ks);
        var i = this.i;
        return cs[i] * this.base[0] + cs[i+1] * this.base[1] +
                ( ks[i] * this.base[2] +  ks[i+1] * this.base[3]) * this.tsdiff[i];
    }

    // Calculate weights for base function
    calcKs(cs, ks){
        var RHS = [];
        this.buildKnotsRHS(cs, RHS);

        var Arr_temp = Matrix.zerosMat(this.n, this.n + 1);
        Matrix.copyArr(this.Arr, Arr_temp, RHS, this.n);

        Matrix.solve(Arr_temp, ks);
    }

    // Calculate right hand side of equations for xs or ys     
    buildKnotsRHS(cs, RHS){
        var n = this.n;
        for(var i; i < n; ++i){
            RHS[i] = 0;
        }
       
        var temp = [];
        for(var i = 0; i < n-1; ++i){
            var top =  6 * (cs[i+1] - cs[i]) ;
            var bottom = Math.pow(this.tsdiff[i],2);
            temp[i] = top / bottom ; 
        }

        RHS[0] = temp[0];
        RHS[n-1] = temp[n-2];

        for(var i = 1; i < n-1; ++i){
            RHS[i] = temp[i] + temp[i-1];
        }
    }
}


/****************************** Cubic Hermite Spline Curve ******************************/

class CHSPL1 extends Curve{
    /**
     * Creates a Cubic Hermite Basis curve object for a specific point
     * @param controlPoints - the set of control point
     * @param relativeStep - current step / number of total steps -1
     * @param prev_relativeStep - previouse step / number of total steps -1
     * @param k - order of curve
     * @param ts - array of "t_i"s
     * @param kControlPoints - array k's that match to contorl points
     * @constructor
    */
     constructor(controlPoints, relativeStep, prev_relativeStep, ts, kControlPoints) {
        super(controlPoints, relativeStep, ts);
        this.k_cp = kControlPoints.slice();

        this.prev_relativeStep = prev_relativeStep;
        this.i = 0;

        this.xks = [];
        this.yks = [];
    }


    calcT(){
            if(this.relativeStep == 0) return;
            var i = 0;
            var n = this.n;
            for(;i < n-1, this.relativeStep > this.ts[i]; ++i){
                if(i >= n - 1) break;
                console.log(i, n-1, this.relativeStep, this.ts[i]);
            }
            
            i--;
            this.i = i;
            var diff_top = this.relativeStep - this.ts[i];
            var diff_bottom = this.ts[i+1] - this.ts[i];
            
            this.t = diff_top / diff_bottom;
            console.log(i, this.t, diff_bottom, diff_top);
            if(this.prev_relativeStep <= this.ts[i]) this.draw[0] = false;
    }

    calcBase(){
            var t = this.t;
            this.base[0] =  1-3*Math.pow(t,2)+2*Math.pow(t,3); // H00
            this.base[1] = 3*Math.pow(t,2)-2*Math.pow(t,3); //H01
            this.base[2] =  t*Math.pow(1-t,2); //H10
            this.base[3] = Math.pow(t,2)*(t-1); //H11
    }

    interpolateXY(){
            var x = this.interpolate(this.xs, this.xks);
            var y = this.interpolate(this.ys, this.yks);
            this.point = new Point(x,y);
    }

    /**** InterpolateXY helper functions ****/

    interpolate(cs, ks){
            this.calcKs(cs, ks);
            var i = this.i;
            return cs[i] * this.base[0] + cs[i+1] * this.base[1] +
                    ( ks[i] * this.base[2] +  ks[i+1] * this.base[3]) * this.tsdiff[i];
    }

    calcKs(){
        var const_num = 12;
        for(var i = 0; i < this.n; i++){
            var j = i * 2;
            this.xks[i] = const_num * (this.k_cp[j + 1].x - this.k_cp[j].x);
            this.yks[i] = const_num * (this.k_cp[j + 1].y - this.k_cp[j].y);
        }
    }
}



/****************************** Monomial Basis Curve ******************************/

class MonomialBasis extends Curve {
    /**
     * Creates a monomial basis curve object for a specific point
     * @param controlPoints - the set of control point
     * @param relativeStep - current step / number of total steps -1
     * @param k - order of curve
     * @param ts - array of "t_i"s
     * @constructor
    */
    constructor(controlPoints, relativeStep, ts, k) {
      super(controlPoints, relativeStep, ts);
      this.k = k;
    }


    setMatrixs(){
        var k = this.k;
        
        this.Arr = Matrix.zerosMat(this.n, this.k);
        for(var i = 0; i < this.n; ++i){
            this.Arr[i][0] = 1;
            for(var j = 1; j < this.k; ++j){
                this.Arr[i][j] = Math.pow(this.ts[i], j);
            }
        }

        this.tArr = Matrix.zerosMat(k, this.n);
        Matrix.transpose(this.Arr, this.n, this.k, this.tArr);

        this.AtA = Matrix.zerosMat(k, k);
        Matrix.multiply(this.tArr, this.Arr, this.AtA);

        this.xs = this.calcCoefficients(this.xs);
        this.ys = this.calcCoefficients(this.ys);
    }

    calcCoefficients(cs){
        var k = this.k;
        
        var RHS = [];
        Matrix.multiplyByVec(this.tArr, cs, RHS);
        
        var Arr_temp = Matrix.zerosMat(k, k + 1);
        Matrix.copyArr(this.AtA, Arr_temp, RHS, k);
        var bs = [];
        Matrix.solve(Arr_temp, bs);

        return bs.slice();
    }

    calcBase(){
        this.base[0] = 1;
        for(var i = 1; i < this.k; ++i){
            this.base[i] = Math.pow(this.t, i);
        }
    }
}



/****************************** Bezier Curve ******************************/

/**
 * Creates a curve object
 * @param controlPoints - The set of control points for the bezier curve
 * @constructor
 */
 function BezierCurve(controlPoints, t) {
    if (controlPoints.length === 1) {
        this.point = controlPoints[0];
        this.cp = null;
        this.curve = null;
    }
    else {
        this.point = null;
        this.cp = controlPoints;
        this.curve = new BezierCurve(bezier(controlPoints, t), t);
    }
}

/**
 * A bezier function that evaluates a set of control points at a value t and returns the resulting point or set of control points
 * @param controlPoints - The control points the evaluate
 * @param t - The value at which to evaluate the control points
 * @returns {Array}
 */
function bezier(controlPoints, t) {
    if (controlPoints.length < 2)
        throw "Too few control points provided";

    var points = [];
    for(var i = 0; i < controlPoints.length-1; i++) {
        points.push(
            new Point(t * (controlPoints[i+1].x - controlPoints[i].x) + controlPoints[i].x, t * (controlPoints[i+1].y - controlPoints[i].y) + controlPoints[i].y)
        );
    }
    return points;
}