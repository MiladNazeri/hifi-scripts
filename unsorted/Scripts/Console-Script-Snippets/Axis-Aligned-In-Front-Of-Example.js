function inFrontOf(distance, position, orientation) {
    var axisAligned = axisAlignedOrientation(MyAvatar.orientatio);
    return Vec3.sum(position || MyAvatar.position,
        Vec3.multiply(distance, axisAligned[1])
    );
}

function returnDirection(axisOrientation) {
    if (axisOrientation.x === -1 ||  axisOrientation.x === 1) {
        return "front";
    }
    if (axisOrientation.z === -1 ||  axisOrientation.z === 1) {
        return "right";
    }
}