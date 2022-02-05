
/**
 * Creates a curve object
 * @param controlPoints - The set of control points for the bezier curve
 * @constructor
 */
 function LinearCurve(controlPoints, step, num_steps) {  
    this.point = linear(controlPoints, step, num_steps)[step];
}

/**
 * A bezier function that evaluates a set of control points at a value t and returns the resulting point or set of control points
 * @param controlPoints - The control points the evaluate
 * @param t - The value at which to evaluate the control points
 * @returns {Array}
 */
function linear(controlPoints, i, num_steps) {
    if (controlPoints.length < 1)
        throw "Too few control points provided";

    var t = i / (num_steps - 1);
    var s = controlPoints[0];
    var e = controlPoints[controlPoints.length -1];
    var points = [];
    for(var i = 0; i < num_steps; i++) {
        points.push(
            new Point(t * (e.x - s.x) + s.x, t * (e.y - s.y) + s.y)
        );
    }
    return points;
}