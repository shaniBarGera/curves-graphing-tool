class Curve {
    /**
     * Creates a curve object for a specific point
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
        this.curve = null;

        this.xs = [];
        this.ys = [];

        this.tsdiff = [];
        this.base = [];
        this.t = 1;
        this.point = new Point(0,0);

    }

    build(){
        this.fillXY();
        this.calcDiff();
        this.calcT();
        this.calcBase();
        this.interpolateXY();
    }

    fillXY(){
        Matrix.fillXY(this.xs, this.ys, this.cp);
    }

    calcT(){
        this.t = (this.step / (this.num_steps -1))
    }

    interpolateXY(){
        var x = 0, y = 0;
        for(var i = 0; i < this.base.length; ++i){
            x += this.xs[i] * this.base[i];
            y += this.ys[i] * this.base[i];
        }
        this.point = new Point(x, y);
    }

    calcBase(){
        this.base.fill(1, 0, this.n)
    }

    calcDiff(){
        this.tsdiff.fill(0, 0, this.n)
    }
}

class LagrangeCurve1 extends Curve {
    /**
     * Creates a Lagrange curve object for a specific point
     * @param controlPoints - the set of control point
     * @param num_steps - number of total steps 
     * @param step - current step ("t") to calculate
     * @param ts - array of "t_i"s
     * @constructor
    */
    constructor(controlPoints, step, num_steps, ts) {
        super(controlPoints, num_steps, step, ts);
    }

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

class CSPL extends Curve{
    /**
     * Creates a C-Spline curve object for a specific point
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
}




class BSPL extends Curve {
    /**
     * Creates a B-Spline curve object for a specific point
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
        this.t = this.ts[this.k] + (this.ts[this.nk2] - this.ts[this.k]) * this.step / (this.num_steps -1);
    }

    calcBase(){
        for(var i = 0; i < this.nk2; ++i){
            this.base[i] = this.findN(this.ts, this.t, i, this.k);
            console.log(i, this.base[i]);
        }
    }

    findN(ts_ext,t, i, k){
        var self = this;
        
        if(t < ts_ext[i] || t >= ts_ext[i+k]) return 0;
        if(k == 1 ) return 1;

        var N1 = self.findN(ts_ext, t, i, k-1) * (t - ts_ext[i]) / (ts_ext[i+k-1] - ts_ext[i]);
        var N2 = self.findN(ts_ext, t, i+1, k-1) * (ts_ext[i+k] - t) / (ts_ext[i+k] - ts_ext[i+1]);
        var N = N1 + N2;
        return N;
    }
}
