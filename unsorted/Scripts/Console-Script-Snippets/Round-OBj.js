function roundPos(position) {
    var roundObj = {};
    roundObj.x = +position.x.toFixed(2);
    roundObj.y = +position.y.toFixed(2);
    roundObj.z = +position.z.toFixed(2);
    return roundObj;
}