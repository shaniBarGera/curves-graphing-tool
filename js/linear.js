function LinearCurve(controlPoints, t) {
    if (controlPoints.length < 2)
        throw "Too few control points provided";

    var points = [];
    for(var i = 0; i < controlPoints.length-1; i++) {
        points.push(
            new Point(t * (controlPoints[i+1].x - controlPoints[i].x) + controlPoints[i].x, t * (controlPoints[i+1].y - controlPoints[i].y) + controlPoints[i].y)
        );
    }
    this.curve = points;
}