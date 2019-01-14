if (!Math.sign) {
    Math.sign = function (x) {
        // If x is NaN, the result is NaN.
        // If x is -0, the result is -0.
        // If x is +0, the result is +0.
        // If x is negative and not -0, the result is -1.
        // If x is positive and not +0, the result is +1.
        return ((x > 0) - (x < 0)) || +x;
        // A more aesthetical persuado-representation is shown below
        //
        // ( (x > 0) ? 0 : 1 )  // if x is negative then negative one
        //          +           // else (because you cant be both - and +)
        // ( (x < 0) ? 0 : -1 ) // if x is positive then positive one
        //         ||           // if x is 0, -0, or NaN, or not a number,
        //         +x           // Then the result will be x, (or) if x is
        //                      // not a number, then x converts to number
    };
}

var rotation = MyAvatar.orientation;
var getForward = Quat.getForward(rotation);
var sign = {
    x: Math.sign(getForward.x),
    y: Math.sign(getForward.y),
    z: Math.sign(getForward.z)
};
var newObj = {
    x: Math.abs(getForward.x),
    y: Math.abs(getForward.y),
    z: Math.abs(getForward.z)
};
var keys = Object.keys(newObj);
function getLargest(obj) {
    var largestKey = "x";
    keys.forEach(function (key) {
        if (newObj[largestKey] < newObj[key]) {
            largestKey = key;
        }
    });
    return largestKey;
}
var largestKey = getLargest(newObj);
keys.splice(keys.indexOf(largestKey), 1);
var finalObj = {};
finalObj[largestKey] = sign[largestKey];
keys.forEach(function (key) {
    finalObj[key] = 0;
});
var finalRotation = Quat.fromVec3Degrees(finalObj);