class Curve {
    /**
     * Creates a curve object
     * @param controlPoints - the set of control point
     * @param num_steps - number of total steps 
     * @param step - current step ("t") to calculate
     * @constructor
    */
    constructor(controlPoints, num_steps, step, ts) {
        this.n = controlPoints.length; 
        this.cp = controlPoints.slice();
        this.ts = ts.slice();
        this.num_steps = num_steps;
        this.step = step;

        this.draw = [false];

        this.xs = [];
        this.ys = [];

        this.base = [];
        this.point = null;
    }

    build(){
        this.fillXY();
        this.interpolateXY();
    }

    fillXY(){
        Matrix.fillXY(this.xs, this.ys, this.cp);
    }

    interpolateXY(){
        this.point = new Point(0,0);
    }

    calcBase(){
        this.base = [1]
    }
}

class LagrangeCurve extends Curve {
    /**
     * Creates a curve object
     * @param controlPoints - the set of control point
     * @param num_steps - number of total steps 
     * @param step - current step ("t") to calculate
     * @param ts - array of "t_i"s
     * @constructor
    */
    constructor(controlPoints, step, num_steps, ts) {
        super(controlPoints, num_steps, step, ts);
    }

}
  
class MonomialCurve extends Curve {
    /**
     * Creates a curve object
     * @param controlPoints - the set of control point
     * @param num_steps - number of total steps 
     * @param step - current step ("t") to calculate
     * @param k - order of curve
     * @param ts - array of "t_i"s
     * @constructor
    */
    constructor(controlPoints, num_steps, step, ts, k) {
      super(controlPoints, num_steps, step, ts);
      this.k = k;
    }
}

class CSPL extends Curve{
    /**
     * Creates a curve object
     * @param controlPoints - the set of control point
     * @param num_steps - number of total steps 
     * @param step - current step ("t") to calculate
     * @param k - order of curve
     * @param ts - array of "t_i"s
     * @constructor
    */
    constructor(controlPoints, num_steps, step, ts) {
        super(controlPoints, num_steps, step, ts);
        this.draw = [true];
    }

    interpolateXY(){
        if(this.step >= this.num_steps -1){
            this.point = this.cp[n - 1];
            CSPL.calcBase(1, this.base);
            return;
        }
        this.point = new Point(0,0);
    }
}
function CSPL(controlPoints, step, num_steps, ts) {
   

   

    if(step >= num_steps -1){
        this.point = controlPoints[n - 1];
        CSPL.calcBase(1, this.base);
        return;
    }

    /*this.ts = [];
    for(var i = 0; i < n; ++i){
        this.ts[i] = i / (n-1);
    }*/

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

  