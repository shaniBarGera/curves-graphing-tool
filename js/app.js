function App() {
    
}

App.prototype.constants = {
    colors: {
        CURVE: 'rgba(255, 255, 255, 1.0)',
        CURVE_POINTS: 'rgba(255, 255, 255, 0.35)',
        CURVE_POINTS_CURRENT: 'rgba(255, 255, 255, 1.0)',
        CURVE_POINTS_CURRENT_OUTLINE: 'rgba(102, 51, 153, 1.0)',
        PRIMARY_CONTROL_LINE: 'rgba(102, 51, 153, 1.0)',
        SECONDARY_CONTROL_LINES: 'rgba(0, 190, 196, 1.0)',
        BACKGROUND_COLOR: 'rgba(30, 30, 30, 1.0)',
        GRID: 'rgba(90, 90, 90, 1.0)',
        PARAM_CURVE: ['rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(255, 132, 0)', 
        'rgb(255, 0, 127)', 'rgb(7, 239, 255)', 'rgb(255, 255, 0)', 'rgb(255, 0, 255)']
    },
    CONTROL_POINT_WIDTH_HEIGHT: 10,
    CURVE_POINT_RADIUS: 5,
    RANDOM_POINT_PADDING: 20,
    RANDOM_POINT_SPACING: 50,
    LINE_WIDTH: 3,
    ORDERS: ['Linear', 'Quadratic', 'Cubic', 'Quartic']
    
};

/**
 * Sets the starting values for the app, both environmental references and starting curve data
 * @param window - the browser window object
 */
App.prototype.init = function(window, td_id, title) {
    // Capture the window and canvas elements
    this.window = window;
    this.td_id = td_id;
    this.title = title;
    this.canvas = document.getElementById(this.td_id + '_canvas');
    this.ctx = this.canvas.getContext('2d');
    this.controlPointIndex = null;
    this.KControlPointIndex = null;
    this.paramControlPointIndex = null;
    

    this.param_canvas = document.getElementById(this.td_id + '_parambox_canvas');
    this.param_ctx = this.param_canvas.getContext('2d');
    this.ts = [];

    // Gather initial values from DOM controls
    this.gatherUserInput();

    // Generate the initial control points
    this.generateControlPoints();
    this.generateKControlPoints();
    this.generateParamControlPoints();

    // Calculate the t_i s of the current curve
    this.calcTs();


    /************************************* LISTEN TO MAIN CANVAS ***************************************/

    // Add event listener for handling mouse movement
    this.canvas.addEventListener('mousemove', function(evt) {
        this.mousePosition = this.getMousePos(this.canvas, evt);
        
        if(this.clickMainControlPoint){
            this.clickMainControlPoint = false;
        }

        // Handle dragging-and-dropping the control points
        if (this.dragging === true) {
            this.fixKControlPoints();
            this.hoveringPoint.x = this.mousePosition.x;
            this.hoveringPoint.y = this.mousePosition.y;
            this.update();
        }

        // Otherwise listen for hovering over the primary control points
        else {
            this.hovering = false;
            this.hoverMainControlPoint = false;
            for (var point in this.controlPoints) {
                if (this.checkPointHover(this.controlPoints[point], this.constants.CONTROL_POINT_WIDTH_HEIGHT)) {
                    this.hovering = true;
                    this.hoveringPoint = this.controlPoints[point];
                    this.KControlPointIndex = null;
                    this.controlPointIndex = point;
                    this.hoverMainControlPoint = true;
                }
            }
            for (var point in this.KControlPoints) {
                if (this.checkPointHover(this.KControlPoints[point], this.constants.CONTROL_POINT_WIDTH_HEIGHT)) {
                    this.hovering = true;
                    this.KControlPointIndex = point;
                    this.hoveringPoint = this.KControlPoints[point];
                }
            }
         
            if (this.hovering === true) {
                document.body.style.cursor = 'pointer';
            }
            else {
                document.body.style.cursor = 'auto';
                this.hovering = false;
                this.hoveringPoint = null;
                this.hoverMainControlPoint = false;
            }
        }
    }.bind(this), false);

    // Add event listener for clicking the mouse down
    this.canvas.addEventListener('mousedown', function(evt) {
        if(this.hoverMainControlPoint){
            this.clickMainControlPoint = true;
        }
        if (this.hovering === true) {
            this.dragging = true;
            document.body.classList.add('unselectable');
        } else {
            app.addControlPoint(this.mousePosition);
            var input = document.getElementById('n_input_' + this.td_id);
            input.value = parseInt(input.value) + 1;
           app.gatherUserInput();

            app.generateKControlPoints();
            app.generateParamControlPoints();
            app.calcTs();
            app.update();
        }
    }.bind(this));

    // Add event listener for unclicking the mouse
    this.canvas.addEventListener('mouseup', function(evt) {
        if(this.clickMainControlPoint){ // delete control point when clicked
            if(this.controlPoints.length <= 2){
                alert("Can't have less then 2 control points!");
            } else if((this.title == "Monomial Basis") &&
                        this.kValue == this.controlPoints.length){
                alert("Number of control points must be bigger or equal to k!");
            } else{
                this.controlPoints.splice(this.controlPointIndex, 1);
                var input = document.getElementById('n_input_' + this.td_id);
                input.value = parseInt(input.value) - 1;
                app.gatherUserInput();
                app.generateKControlPoints();
                app.generateParamControlPoints();
                app.calcTs();
                app.update();
            }
        } 
        this.dragging = false;
        document.body.classList.remove('unselectable')
    }.bind(this));


    /************************************* LISTEN TO PARAMETRIZATION CANVAS ***************************************/

    var last_point = this.paramControlPoints[this.paramControlPoints.length - 1];
    var first_point = this.paramControlPoints[0];

    // Add event listener for handling mouse movement
    this.param_canvas.addEventListener('mousemove', function(evt) {
            this.param_mousePosition = this.getMousePos(this.param_canvas, evt);
          
            // Handle dragging-and-dropping the control points
            if (this.param_dragging === true && 
                this.param_mousePosition.x > first_point.x && 
                this.param_mousePosition.x < last_point.x){
                    if(this.paramControlPointIndex){
                        var j = parseInt(this.paramControlPointIndex) + 1;
                        var next = this.paramControlPoints[j];
                        var prev = this.paramControlPoints[this.paramControlPointIndex - 1];
                        if(this.param_mousePosition.x > prev.x && this.param_mousePosition.x < next.x){
                            this.param_hoveringPoint.x = this.param_mousePosition.x;
                            this.calcTs();
                            this.update();
                        }
                    }
                        
            }
    
            // Otherwise listen for hovering over the primary control points
            else {
                this.param_hovering = false;
                for (var point in this.paramControlPoints) {
                    if(point == 0 || point == this.paramControlPoints.length - 1) continue;
                    if (this.checkParamPointHover(this.paramControlPoints[point], this.constants.CONTROL_POINT_WIDTH_HEIGHT)) {
                        this.param_hovering = true;
                        this.param_hoveringPoint = this.paramControlPoints[point];
                        this.paramControlPointIndex = point;
                        //this.next_param_point = this.paramControlPoints[point + 1];
                        //this.prev_param_point = this.paramControlPoints[point - 1];
                    }
                }
                if (this.param_hovering === true) {
                    document.body.style.cursor = 'pointer';
                }
                else {
                    document.body.style.cursor = 'auto';
                    this.param_hovering = false;
                    this.param_hoveringPoint = null;
                }
            }
        }.bind(this), false);


    // Add event listener for clicking the mouse down
    this.param_canvas.addEventListener('mousedown', function(evt) {
        if (this.param_hovering === true) {
            this.param_dragging = true;
            document.body.classList.add('unselectable');
        }
    }.bind(this));

    // Add event listener for unclicking the mouse
    this.param_canvas.addEventListener('mouseup', function(evt) {
        this.param_dragging = false;
        document.body.classList.remove('unselectable')
    }.bind(this));



    /************************************* LISTEN TO INPUTS ***************************************/

    // Add event listener to handle any of the control values changing
    var app = this;
    document.getElementById('steps_input_' + this.td_id).addEventListener('input', function(evt) {
        app.gatherUserInput();
        app.calcTs();
        app.update();
    }.bind(this));

    // Add an input listener to the custom curve order value input control
    document.getElementById('n_input_' + this.td_id).addEventListener('input', function(evt) {
        app.gatherUserInput("n");
        app.generateControlPoints();
        app.generateKControlPoints();
        app.generateParamControlPoints();
        app.calcTs();
        app.update();
    });

    // Add an input listener to the custom curve order value input control
    if(this.title == "Monomial Basis" || this.title == "B-Spline"){
        document.getElementById('k_input_' + this.td_id).addEventListener('input', function(evt) {
            app.gatherUserInput("k");  
            //if(this.title == "B-Spline"){
                app.generateParamControlPoints();
                app.calcTs();
            //}
            app.update();  
        });
    }

    // Add an input listener to the slider control
    document.getElementById('tSlider_' + this.td_id).addEventListener('input', function(evt) {
        app.gatherUserInput();
        app.update();
    });
};


/**
 *  Calculate the relative position of the  t_i s of the current curve
*/
App.prototype.calcTs = function(){
    var n = this.paramControlPoints.length;
    if(n < 2) return;
    var dist = this.paramControlPoints[n - 1].x - this.paramControlPoints[0].x;
    this.ts[0] = 0;
    this.ts[n-1] = 1;
    for(var i = 1; i < n - 1; i++){
        var dx = this.paramControlPoints[i].x - this.paramControlPoints[0].x;
        this.ts[i] = dx / dist;
    }
}

/**
 *  Add a new point to control points in nearest location on curve
*/
App.prototype.addControlPoint = function(p){

    // if p before curve
    if(p.x < this.controlPoints[0].x){
        this.controlPoints.unshift(p);
        return;
    }

    // if p between pi and pj
    for(var i = 1; i < this.controlPoints.length; i++){
        if(p.x < this.controlPoints[i].x && p.x >= this.controlPoints[i-1].x){
            this.controlPoints.splice(i, 0, p);
            return;
        }
    }

    // if p after curve
    this.controlPoints.push(p);
}

/**
 *  Make sure in Cubic Hermite that the secondary control lines stick to the main control point in the middle and remain symatrical
*/
App.prototype.fixKControlPoints = function(){
    if(this.title != "Cubic Hermite Spline") return;

    var dx = this.mousePosition.x - this.hoveringPoint.x;
    var dy = this.mousePosition.y - this.hoveringPoint.y;

    var curr_k_index = this.KControlPointIndex;
    var i = curr_k_index, j = curr_k_index;
    if(curr_k_index == null){
        i = this.controlPointIndex * 2;
        j = parseInt(i) + 1;
        this.KControlPoints[i].x += dx;
        this.KControlPoints[i].y += dy;
        this.KControlPoints[j].x += dx;
        this.KControlPoints[j].y += dy;
    } else if(curr_k_index % 2 == 0){
        i = parseInt(curr_k_index);
        j = i + 1;
        this.KControlPoints[j].x -= dx;
        this.KControlPoints[j].y -= dy;
    } else {
        i = curr_k_index - 1;
        j = parseInt(i) + 1;
        this.KControlPoints[i].x -= dx;
        this.KControlPoints[i].y -= dy;
    }
}

/**
 *  Change title name to fit to order of current curve
*/
App.prototype.fixTitle = function(){
    var order_num = 0;
    
    if(this.title == "Lagrange" || this.title == "Bezier"){
        order_num = this.orderSelection;
    } else if(this.title == "Monomial Basis" || this.title == "B-Spline"){
        order_num = this.kValue;
    }
    
    var order = '';
    var new_title = this.title;
    if(order_num < 6 && order_num > 1){
        var order = this.constants.ORDERS[order_num - 2];
        new_title = order + ' ' + this.title;
    }
    else if(order_num >= 6){
        new_title = this.title + ' (Order ' + order_num + ')';
    }
    document.getElementById(this.td_id + '_header').firstChild.innerText = new_title;
}

/**
 *  Display the value of t near the slider
*/
App.prototype.displayStep = function(){
    t = 't = ' + (Math.round(this.tValue * 100) / 100).toFixed(2);
    document.getElementById('tValue_' + this.td_id).innerHTML = t;
}

/**
 * Recalculates the curve values and updates the slider based on the other UI values
 */
App.prototype.update = function() {

    this.fixTitle();
    this.displayStep();
    
    document.getElementById('tSlider_' + this.td_id).setAttribute('max', this.numSteps);

    this.curves = this.buildCurves();
    this.draw();
    this.drawParam();
};

/**
 * Method called to recalculate the curve data from the currently stored user-inputted values. This should be called
 * every time any curve-related value is changed
 * @returns {Array}
 */
App.prototype.buildCurves = function() {
    var controlPoints = this.controlPoints;
    var curves = [];

    // Generate point for each step
    for (var step = 0; step < this.numSteps; step++) {
        var relative_step = step/(this.numSteps - 1);
        var prev_relative_step = (step - 1)/(this.numSteps - 1);

        switch(this.title){
            case "Bezier":
                var point = new BezierCurve(controlPoints, relative_step);
                break;
            case "Cubic Spline":
                var point = new CSPL(controlPoints, relative_step, prev_relative_step, this.ts);
                point.build();
                break;
            case "Lagrange":
                var point = new LagrangeCurve(controlPoints, relative_step, this.ts);
                point.build();
                break;
            case "B-Spline":
                var point = new BSPL(controlPoints, relative_step, this.ts, this.kValue);
                point.build();
                break;
            case "Cubic Hermite Spline":
                var point = new CHSPL(controlPoints, relative_step, prev_relative_step, this.ts, this.KControlPoints);
                point.build();
                break;
            case "Monomial Basis":
                var point = new MonomialBasis(controlPoints, relative_step, this.ts, this.kValue);
                point.build();
                break;
            default:
                throw this.title + 'does not exist!';
        }
        curves.push(point);
    }
    
    return curves;
};

/**
 * Renders the curve and all curve-related graphical elements in the app
 */
App.prototype.draw = function() {

    // Clear the render area
    clearCanvas(this.ctx, this.canvas.width, this.canvas.height, this.constants.colors.BACKGROUND_COLOR);
   
    // Draw the curve and all of the control points
    var prevPoint = null;
    for (var step = 0, t = 0, point = null; step < this.numSteps; step++, t = step / (this.numSteps - 1)) {
        
        var curve = this.curves[step];
        
        if(this.title == "Bezier"){
            this.drawSubCurve(step);

            // Find the point for the current t
            for (var curveNum = 0; curveNum < this.orderSelection - 1; ++curveNum) {
                curve = curve.curve;
            }
        } 

        prevPoint = point;
        point = curve.point;

        // Draw the curve segments
        if (step > 0) {
            drawLine(this.ctx, prevPoint.x, prevPoint.y, point.x, point.y, this.constants.LINE_WIDTH, this.constants.colors.CURVE);
        }

        
        // Draw the curve points
        if (step === parseInt(this.tSliderValue)) {
            drawCircle(
                this.ctx,
                point.x,
                point.y,
                this.constants.CURVE_POINT_RADIUS * 1.7,
                this.constants.LINE_WIDTH,
                this.constants.colors.CURVE_POINTS_CURRENT,
                this.constants.colors.CURVE_POINTS_CURRENT
            );
        }
        else {
            drawCircle(
                this.ctx,
                point.x,
                point.y,
                this.constants.CURVE_POINT_RADIUS,
                this.constants.LINE_WIDTH,
                this.constants.colors.CURVE_POINTS,
                this.constants.colors.CURVE_POINTS
            )
        }
        
    }


    // Draw the secondary curve control points for hermite spline
    this.drawKControlPoints(this.KControlPoints, this.constants.colors.SECONDARY_CONTROL_LINES);

    // Draw the primary curve control points with connecting lines
    this.drawControlPoints(this.controlPoints, this.constants.colors.PRIMARY_CONTROL_LINE, true);
};

/**
 * Draw Bezier sub curves
 * @param step - current step to draw sub curves to
 */
App.prototype.drawSubCurve = function(step) {   
    // If the current step matches the current slider value
    if (step === parseInt(this.tSliderValue)) {
        // Draw all of the control points for the control curve at the current point
        var subCurve = this.curves[step];
        while (subCurve.cp != null) {
            this.drawControlPoints(
                subCurve.cp,
                this.constants.colors.SECONDARY_CONTROL_LINES,
                false
            );
            subCurve = subCurve.curve;
        }
    }
}


/**
 * Draw Parametrization curves
 */
App.prototype.drawParam = function() {

    if(this.title == "Bezier") return; 

    clearCanvas(this.param_ctx, this.param_canvas.width, this.param_canvas.height, this.constants.colors.BACKGROUND_COLOR);
    
    // normalize points to canvas size
    var prevPoints = [];
    var points = [];
    var xmin = this.paramControlPoints[0].x;
    var xmax = this.paramControlPoints[this.paramControlPoints.length -1].x;
    var xdist = xmax - xmin;
    var yref = 3 * this.param_canvas.height / 5;
    var yrange = this.param_canvas.height / 3;

    // draw  lines of grid's y-axis for values y=0,1
    var p0 = new Point (xmin * 0.5 + 15, yref - yrange);
    var p1 = new Point(xmax + xmin * 0.5, yref - yrange);
    this.param_ctx.font = "20px Arial";
    this.param_ctx.fillStyle = this.constants.colors.GRID;
    this.param_ctx.textAlign = "center";
    this.param_ctx.fillText("y=1", p0.x - 20, p0.y + 6);
    drawLine(this.param_ctx, p0.x, p0.y, p1.x, p1.y, this.constants.LINE_WIDTH / 2, this.constants.colors.GRID);
    p0 = new Point (xmin * 0.5 + 15, yref);
    p1 = new Point(xmax + xmin * 0.5, yref);
    drawLine(this.param_ctx, p0.x, p0.y, p1.x, p1.y, this.constants.LINE_WIDTH / 2, this.constants.colors.GRID);
    this.param_ctx.fillText("y=0", p0.x - 20, p0.y + 6);
    
    // iterate over each step and draw parametrization points
    for (var step = 0, t = 0; step < this.numSteps; step++, t = step / (this.numSteps - 1)) {
        
        var curve = this.curves[step];
        
        // address b-spline extension
        if(this.title == "B-Spline"){
            var k = this.kValue;
            var nk2 = 2 * k + this.orderSelection;
            t = this.ts[k] + (this.ts[nk2] - this.ts[k]) * t;
        }
        
        // for each base curve draw point of current step
        var j = 0;
        for(var i = 0; i < curve.base.length; i++){
            prevPoints[i] = points[i];
            points[i] = new Point(xmin + t * xdist, yref - curve.base[i] * yrange);
            

            // set b-spline color of edge curves to be all the same because of the extension
            var color = this.constants.colors.PARAM_CURVE[i % 7];
            if(this.title == "B-Spline"){
                
                if( i < this.kValue){
                    j = 0;
                } else if(i > curve.base.length - this.kValue - 1){
                    j = this.orderSelection - 1;
                }else{
                    j = i - this.kValue;
                }
                
                color = this.constants.colors.PARAM_CURVE[j % 7];
            }

            // Draw the curve segments
            if (step > 0) {
                if(this.title == "Cubic Spline" || this.title == "Cubic Hermite Spline"){
                    if(curve.draw[0]){
                        drawLine(this.param_ctx, prevPoints[i].x, prevPoints[i].y, points[i].x, points[i].y, this.constants.LINE_WIDTH, color);
                    }
                } else{
                    drawLine(this.param_ctx, prevPoints[i].x, prevPoints[i].y, points[i].x, points[i].y, this.constants.LINE_WIDTH, color);
                }
            }

            // Draw the curve points
            if (step === parseInt(this.tSliderValue)) {
                drawCircle(
                    this.param_ctx,
                    points[i].x,
                    points[i].y,
                    this.constants.CURVE_POINT_RADIUS * 1.7,
                    this.constants.LINE_WIDTH,
                    color,
                    color
                );
            }
            else {
                drawCircle(
                    this.param_ctx,
                    points[i].x,
                    points[i].y,
                    this.constants.CURVE_POINT_RADIUS,
                    this.constants.LINE_WIDTH,
                    this.constants.colors.CURVE_POINTS,
                    this.constants.colors.CURVE_POINTS
                )
            }
            
        }
        
    }

    this.drawParamControlPoints(this.paramControlPoints, this.constants.colors.PRIMARY_CONTROL_LINE, true);
};

/**
 * Renders a set of control points connected by a line that runs from each control point to the next control point
 * @param controlPoints - The control points to render
 * @param color - The color of the control points
 * @param primaryPoints - True if the given set of control points are the primary control points for the curve
 */
App.prototype.drawControlPoints = function(controlPoints, color, primaryPoints)
{
    
    // Iterate through every control point in the given set
    for (var ctrlPoint = 0; ctrlPoint < controlPoints.length; ctrlPoint++) {
        var pt = controlPoints[ctrlPoint];
        
        // Draw a line segment from the previous point to the current point
        if (ctrlPoint > 0) {
            var prevPt = controlPoints[ctrlPoint-1];
            drawLine(this.ctx, pt.x, pt.y, prevPt.x, prevPt.y, this.constants.LINE_WIDTH, color);
        }

        var outer_color = color;
        // Draw a circle representing the current control point
        var fillColor = primaryPoints ? color : this.constants.colors.BACKGROUND_COLOR;
        if(this.title == "Lagrange"){
            fillColor = this.constants.colors.PARAM_CURVE[ctrlPoint];
            outer_color = fillColor;
        } else if (this.title == "B-Spline" ){
        //&& ctrlPoint > 0 && ctrlPoint < controlPoints.length - 1){
            fillColor = this.constants.colors.PARAM_CURVE[ctrlPoint];
            outer_color = fillColor;
        }
        drawRectangle(
            this.ctx,
            pt.x,
            pt.y,
            this.constants.CONTROL_POINT_WIDTH_HEIGHT,
            this.constants.CONTROL_POINT_WIDTH_HEIGHT,
            this.constants.LINE_WIDTH,
            outer_color,
            fillColor
        );

        // draw labels for control points
        this.ctx.font="30px Arial";
        this.ctx.fillStyle = fillColor;
        this.ctx.textAlign = "center";
        this.ctx.fillText("P", pt.x, pt.y + 35);
        this.ctx.font="20px Arial";
        this.ctx.fillText(ctrlPoint, pt.x + 15, pt.y + 35);
    }
};

App.prototype.drawParamControlPoints = function(controlPoints, color, primaryPoints)
{
    var first = 0;
    var n = controlPoints.length;

    // Iterate through every control point in the given set
    for (var ctrlPoint = first; ctrlPoint < n; ctrlPoint++) {
        var pt = controlPoints[ctrlPoint];

        // Draw a line segment from the previous point to the current point
        if (ctrlPoint > first) {
            var prevPt = controlPoints[ctrlPoint-1];
            drawLine(this.param_ctx, pt.x, pt.y, prevPt.x, prevPt.y, this.constants.LINE_WIDTH, color);
        }

        // Draw a circle representing the current control point
        var fillColor = primaryPoints ? color : this.constants.colors.BACKGROUND_COLOR;
        drawRectangle(
            this.param_ctx,
            pt.x,
            pt.y,
            this.constants.CONTROL_POINT_WIDTH_HEIGHT * 1.7,
            this.constants.CONTROL_POINT_WIDTH_HEIGHT * 1.7,
            this.constants.LINE_WIDTH,
            color,
            fillColor
        );

        // draw labels for control points
        this.param_ctx.font="30px Arial";
        this.param_ctx.fillStyle = color;
        this.param_ctx.textAlign = "center";
        this.param_ctx.fillText("t", pt.x, pt.y + 35);
        this.param_ctx.font="20px Arial";
        this.param_ctx.fillText(ctrlPoint, pt.x + 15, pt.y + 35);

    }
};

/**
 * Renders a set of control points connected by a line that runs from each control point to the next control point
 * @param controlPoints - The control points to render
 * @param color - The color of the control points
 * @param primaryPoints - True if the given set of control points are the primary control points for the curve
 */
 App.prototype.drawKControlPoints = function(controlPoints, color, primaryPoints)
 {
     if(controlPoints.length <= 0) return;
     // Iterate through every control point in the given set
     for (var ctrlPoint = 0; ctrlPoint < controlPoints.length; ctrlPoint++) {
         var pt = controlPoints[ctrlPoint];
 
         // Draw a line segment from the previous point to the current point
         if (ctrlPoint % 2 == 1) {
             var prevPt = controlPoints[ctrlPoint-1];
             drawLine(this.ctx, pt.x, pt.y, prevPt.x, prevPt.y, this.constants.LINE_WIDTH, color);
         }
 
         // Draw a circle representing the current control point
         var fillColor = primaryPoints ? this.constants.colors.SECONDARY_CONTROL_LINES : this.constants.colors.BACKGROUND_COLOR;
         drawCircle(
             this.ctx,
             pt.x,
             pt.y,
             this.constants.CONTROL_POINT_WIDTH_HEIGHT * 0.4,
             this.constants.CONTROL_POINT_WIDTH_HEIGHT * 0.4,
             this.constants.LINE_WIDTH,
             this.constants.colors.SECONDARY_CONTROL_LINES,
             fillColor
         );
     }
 };

/**
 * Refreshes the stored user-inputted values to match what is currently in the UI
 */
App.prototype.gatherUserInput = function(input_type = "") {
    var n_input = document.getElementById('n_input_' + this.td_id);
    var k_input = document.getElementById('k_input_' + this.td_id);

    if(this.title == "Monomial Basis"){
        if(n_input.value < k_input.value){
            if(input_type == "n") n_input.value = parseInt(n_input.value) + 1; 
            else if(input_type == "k") k_input.value -= 1;
            alert("n must be larger or equal to k!");  
            return;
        }  
    }

    if(this.title == "Monomial Basis" || this.title == "B-Spline"){
        this.kValue = parseInt(k_input.value);
    }
    
    // Control points number
    this.orderSelection = parseInt(n_input.value);

    // Step control component
    this.numSteps = parseInt(document.getElementById('steps_input_' + this.td_id).value);

    // Order_input slider value
    this.tSliderValue = document.getElementById('tSlider_' + this.td_id).value;
    this.tValue = (this.tSliderValue / this.numSteps);
};

/**
 * Generate the primary control points for the curve based on the currently stored user-inputted values.
 */
App.prototype.generateControlPoints = function() {
    var spacePerPoint = (this.canvas.width / this.orderSelection);
    this.controlPoints = [];

    for (var i = 0; i < this.orderSelection; i++) {
        y = this.randomInt(this.constants.RANDOM_POINT_PADDING, this.canvas.height - this.constants.RANDOM_POINT_PADDING)
        if(this.title == "Cubic Hermite Spline"){
            y = this.canvas.height / 2;
        }
        this.controlPoints.push(
            new Point(
                i * spacePerPoint + (spacePerPoint / 2),
                y
            )
        );
    }
};

/**
 * Generate the primary control points for the curve based on the currently stored user-inputted values.
 */
App.prototype.generateParamControlPoints = function() {
    
    this.paramControlPoints = [];

    y = 3* this.param_canvas.height / 5;
    var n = this.orderSelection;
    if(this.title == "B-Spline")
        n = parseInt(n) + 3 * this.kValue;

    var spacePerPoint = (this.param_canvas.width / n);
    for (var i = 0; i < n; i++) {
        this.paramControlPoints.push(
            new Point(
                i * spacePerPoint + (spacePerPoint / 2),
                y
            )
        );
    }
};

/**
 * Generate the secondary control points for the hermite curve based on the currently stored user-inputted values.
 */
App.prototype.generateKControlPoints = function() {
    this.KControlPoints = [];
    this.KControlLines = [];
    if(this.title != "Cubic Hermite Spline") return;
    var spacePerPoint = (this.canvas.width / this.orderSelection);
    var const_num = 8;
    var dir = -1;
    for (var i = 0; i < this.orderSelection; i++) {
        this.KControlPoints.push(
            new Point(
                this.controlPoints[i].x - (spacePerPoint / const_num),
                this.controlPoints[i].y - (dir * spacePerPoint / const_num)
            )
        );
            this.KControlPoints.push(
                new Point(
                    this.controlPoints[i].x + (spacePerPoint / const_num),
                    this.controlPoints[i].y + (dir * spacePerPoint / const_num)
                )
            );
            dir *= -1;
    }
}


/**
 * Utility method that returns a random int between min (inclusive) and max (exclusive)
 * @param min - The inclusive lower bound for the random int range
 * @param max - The exclusive upper bound for the random int range
 * @returns {number}
 */
App.prototype.randomInt = function(min, max) {
    return Math.floor(Math.random()*(max-min) + min);
};

/**
 * Return the current mouse position as a Point object
 * @param canvas - The HTML5 canvas element
 * @param evt - The 'mousemove' event
 * @returns {{x: number, y: number}}
 */
App.prototype.getMousePos = function(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.floor(evt.clientX - rect.left),
        y: Math.floor(evt.clientY - rect.top)
    };
};

/**
 * Check if the current mouse position collides with the given point (with padding)
 * @param point - The point to check the mouse position against
 * @param padding - The padding to use when checking for collision
 * @returns {boolean}
 */
App.prototype.checkPointHover = function(point, padding) {
    if (!point)
        return false;

    return point.x >= this.mousePosition.x - padding && point.x <= this.mousePosition.x + padding &&
        point.y >= this.mousePosition.y - padding && point.y <= this.mousePosition.y + padding;
};

App.prototype.checkParamPointHover = function(point, padding) {
    if (!point)
        return false;

    return point.x >= this.param_mousePosition.x - padding && point.x <= this.param_mousePosition.x + padding &&
        point.y >= this.param_mousePosition.y - padding && point.y <= this.param_mousePosition.y + padding;
};

/**
 * Executes the application by initializing all of the app values and event listeners and performing the
 * initial 'update'. Subsequent updates will be performed in response to user-driven events
 * @param window - The browser window object
 */
App.prototype.run = function(window, td_id, title) {
    this.init(window, td_id, title);
    this.update();
};