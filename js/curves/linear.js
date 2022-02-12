
/**
 * Creates a curve object
 * @param controlPoints - The set of control points for the bezier curve
 * @constructor
 */
 function LinearCurve(controlPoints, step, num_steps) {
    if (controlPoints.length < 1)
        throw "Too few control points provided";

    var t = step / (num_steps - 1);
    var s = controlPoints[0];
    var e = controlPoints[controlPoints.length - 1];
    this.point =  new Point(t * (e.x - s.x) + s.x, t * (e.y - s.y) + s.y);
}