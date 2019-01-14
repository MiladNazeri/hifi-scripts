function vec(x, y, z) {
    var obj = {};
    obj.x = x;
    obj.y = y;
    obj.z = z;
    return obj;
}

function col(r, g, b) {
    var obj = {};
    obj.red = r;
    obj.green = g;
    obj.blue = b;
    return obj;
}

var CONTROL_HEIGHT = 3;
var CONTROL_WIDTH = 3;
var CONTROL_DEPTH = 3;

var position = vec(0, 0, 0);
var dimension = vec(CONTROL_WIDTH, CONTROL_HEIGHT, CONTROL_DEPTH);

var testPosition = vec(0, 0, 0);
var testPosition2 = vec(4, 4, 4);
var testDimensions = vec(1, 1, 1);
var testDimensions2 = vec(6, 6, 6);
var testDimensions3 = vec(1, 1, 1);
var testCurrentPosition = vec(2, 2, 2);
var testCurrentPosition2 = vec(18, 18, 18);
var testCurrentPosition3 = vec(0, 0, 0);

var control = new Control(testPosition, testDimensions);
var control2 = new Control(testPosition2, testDimensions2);
var control3 = new Control(testPosition, testDimensions3);

/*
function checkIfIn(currentPosition, control) {
    // console.log("currentPosition", currentPosition)
    // console.log("control", control)
    var xyzCheck = {
        x: false,
        y: false,
        z: false
    };
    for (var key in control.minMax) {
        var ident = key.slice(0, 1);
        var description = key.slice(1);
        var check = control.minMax[key];
        var checkResult;
        // console.log("key", key);
        // console.log("ident", ident);
        // console.log("description", description);
        // console.log("currentPosition[ident]", currentPosition[ident])
        // console.log("check", check)
        if (description === "Min") {
            // console.log("min")
            checkResult = currentPosition[ident] > check;
        } else {
            // console.log("max")            
            checkResult = currentPosition[ident] < check;
        }
        if (checkResult) {
            xyzCheck[ident] = true;
        } else {
            xyzCheck[ident] = false;
        }
        // console.log("checkResult", checkResult);
    }
    // console.log("xyzCheck", xyzCheck);
    return xyzCheck;
}
*/

function checkIfIn(currentPosition, control) {
    // console.log("currentPosition", currentPosition)
    // console.log("control", control)
    var box = control.minMax;
    return (currentPosition.x >= box.xMin && currentPosition.x <= box.xMax) &&
        (currentPosition.y >= box.yMin && currentPosition.y <= box.yMax) &&
        (currentPosition.z >= box.zMin && currentPosition.z <= box.zMax);
}

function lerp(InputLow, InputHigh, OutputLow, OutputHigh, Input) {
    return ((Input - InputLow) / (InputHigh - InputLow)) * (OutputHigh - OutputLow) + OutputLow;
}

function whereOnRange(currentPosition, control) {
    var whereOnRange = {
        x: 0,
        y: 0,
        z: 0
    };
    for (var key in whereOnRange) {
        var minKey = key + "Min";
        var maxKey = key + "Max";
        var min = control.minMax[minKey];
        var max = control.minMax[maxKey];
        var point = lerp(min, max, 0, 255, currentPosition[key]);
        // var point = lerp(min, max, 0, max - min, currentPosition[key]);

        whereOnRange[key] = point;
    }
    // console.log("whereOnRange", whereOnRange);

    return whereOnRange;
}

// console.log("testCurrentPosition")
// checkIfIn(testCurrentPosition, control);
// console.log("testCurrentPosition2")
// checkIfIn(testCurrentPosition2, control);
// console.log("control2")
// checkIfIn(testCurrentPosition, control2);
// console.log("control2")
// checkIfIn(testCurrentPosition2, control2);
// console.log("control3")
// checkIfIn(testCurrentPosition3, control3);
// whereOnRange(testCurrentPosition3, control3);


// Motion vars
var speed1, pitch1, yaw1, roll1;
// General Light vars
var red1, red2, red3, green1, green2, green3, blue1, blue2, blue3, intensity1, intensity2, falloffRadius1;
// Spotlight vars
var cutoff1, exponent1;
var emitRate;
// Array Vars
var lights = [];
var lightProps = {};
// Entity Vars
var light, light0, box1, sphere1, particle1;

function lightSource() {
    print("Creating Spotlight");
    var pos = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, { x: -1, y: 1.2, z: -2 }));

    box1 = Entities.addEntity({
        name: "The Spot Light",
        description: "",
        type: "Box",
        position: pos,
        dimensions: {
            x: 0.35,
            y: 0.35,
            z: 0.35
        },
        gravity: { x: 0, y: -2, z: 0 },
        angularDamping: 0,
        friction: 0,
        color: {
            red: 100,
            blue: 0,
            green: 0
        }
    });

    particle1 = Entities.addEntity({
        "type": "ParticleEffect",
        "color": {
            "red": 200,
            "green": 200,
            "blue": 200
        },
        "isEmitting": true,
        "maxParticles": 3451,
        "lifespan": 1.6200000047683716,
        "emitRate": 705,
        "emitSpeed": 2.690000057220459,
        "speedSpread": 0,
        "emitOrientation": {
            "x": -0.7071220278739929,
            "y": -0.000015258869098033756,
            "z": -0.000015258869098033756,
            "w": 0.7070915699005127
        },
        "emitDimensions": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "emitRadiusStart": 1,
        "polarStart": 0,
        "polarFinish": 0,
        "azimuthStart": -3.1415927410125732,
        "azimuthFinish": 3.1415927410125732,
        "emitAcceleration": {
            "x": -0.5,
            "y": 2.5,
            "z": -0.5
        },
        "accelerationSpread": {
            "x": 0.5,
            "y": 1,
            "z": 0.5
        },
        "particleRadius": 0.47999998927116394,
        "radiusSpread": 2.180000066757202,
        "radiusStart": 0.03999999910593033,
        "radiusFinish": 0.10000000149011612,
        "colorSpread": {
            "red": 0,
            "green": 0,
            "blue": 0
        },
        "colorStart": {
            "red": 255,
            "green": 71,
            "blue": 255
        },
        "colorFinish": {
            "red": 0,
            "green": 0,
            "blue": 0
        },
        "alphaSpread": 0,
        "alphaStart": 1,
        "alphaFinish": 0,
        "emitterShouldTrail": true,
        "shapeType": "none",
        "textures": "https://content.highfidelity.com/DomainContent/production/Particles/wispy-smoke.png",
        "parentID": box1,
        "parentJointIndex": 65535,
    })
    sphere1 = Entities.addEntity({
        name: "Spot Light Sphere",
        description: "",
        type: "Sphere",
        position: pos,

        dimensions: {
            x: 0.5,
            y: 0.5,
            z: 0.5
        },
        gravity: { x: 0, y: -2, z: 0 },
        angularDamping: 0,
        friction: 0,
        color: {
            red: 100,
            blue: 0,
            green: 0
        },
        collisionless: true,
        userData: "{ \"grabbableKey\": { \"grabbable\": false} }",
        parentID: box1
    });

    var lightProps = {
        name: "Spot Light Emitter",
        description: "",
        type: "Light",
        position: pos,
        dimensions: {
            x: 60,
            y: 60,
            z: 60
        },
        gravity: { x: 0, y: -2, z: 0 },
        angularDamping: 0,
        color: {
            red: 255,
            blue: 255,
            green: 255
        },
        intensity: 1000,
        falloffRadius: 0,
        isSpotlight: 0,
        exponent: 1,
        cutoff: 10,
        collisionless: true,
        userData: "{ \"grabbableKey\": { \"grabbable\": false} }",
        parentID: box1
    };

    lightProps.isSpotlight = 0;
    light0 = Entities.addEntity(lightProps);

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(90, 0, 0)
    lights.push(Entities.addEntity(lightProps));

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(-90, 0, 0);
    lights.push(Entities.addEntity(lightProps));

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(0, 90, 0);
    lights.push(Entities.addEntity(lightProps));

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(0, -90, 0);
    lights.push(Entities.addEntity(lightProps));

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(0, 0, 0);
    lights.push(Entities.addEntity(lightProps));

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(180, 0, 0);
    lights.push(Entities.addEntity(lightProps));
}

var eventData = {
    note: "",
    velocity: 0
};

var pos = Vec3.sum(MyAvatar.position, Vec3.multiply(Quat.getForward(MyAvatar.orientation), 2));
var box1Pos = Vec3.sum(pos, Vec3.multiply(Quat.getRight(MyAvatar.orientation), 1.0));
var box2Pos = Vec3.sum(pos, Vec3.multiply(Quat.getRight(MyAvatar.orientation), -1.0));
var box3Pos = Vec3.sum(pos, Vec3.multiply(Quat.getRight(MyAvatar.orientation), 0));

// var box1Pos = Vec3.sum(pos, vec(-1, 0.3, 0));
// var box2Pos = Vec3.sum(pos, vec(-1, 0.5, 0));
// var box3Pos = Vec3.sum(pos, vec(-1, 0.7, 0));

function Control(position, dimensions, controlMin, controlMax, id, fwdVector) {
    this.position = position;
    this.dimensions = dimensions;
    this.minMax = {
        xMin: this.position.x - dimensions.x / 2,
        xMax: this.position.x + dimensions.x / 2,
        yMin: this.position.y - dimensions.y / 2,
        yMax: this.position.y + dimensions.y / 2,
        zMin: this.position.z - dimensions.z / 2,
        zMax: this.position.z + dimensions.z / 2
    };
    this.id = id;
    this.fwdVector = fwdVector;
    this.controlMin = controlMin;
    this.controlMax = controlMax;
}

var controlArray = [];

function makeBox(pos, name, dim, color) {
    var newPos = Vec3.sum(pos, vec(0, 0.25, 0))
    var props = {
        rotation: MyAvatar.orientation,
        name: name,
        type: "Box",
        position: newPos,
        dimensions: dim,
        color: color,
        collisionless: true
    }
    var id = Entities.addEntity(props);
    var fwdVector = Quat.getForward(MyAvatar.orientation);
    controlArray.push(new Control(newPos, dim, 0, 255, id, fwdVector));
    return id;
}

var controlBoxesIds = {
    control1: makeBox(box1Pos, "_control1", vec(1, 0.2, 0.5), col(255, 40, 50)),
    control2: makeBox(box2Pos, "_control2", vec(1, 0.2, 0.5), col(60, 255, 50)),
    control3: makeBox(box3Pos, "_control3", vec(1, 0.2, 0.5), col(20, 40, 255))
};

var deltaTotal = 0;

function onUpdate(delta) {
    // console.log("delta", delta);
    deltaTotal += delta;
    // console.log("deltaTotal", deltaTotal);

    if (deltaTotal > 0.05) {
        // console.log("deltaTotal", deltaTotal);

        var currentHandPosition = MyAvatar.getJointPosition("RightHand");
        controlArray.forEach(function(control) {
            var result = checkIfIn(currentHandPosition, control);
            if (result) {
                if (HMD.active) {
                    Controller.triggerHapticPulse(0.75, 100, 2);
                }
                // if (result.x === true && result.y === true && result.z === true) {
                console.log("in control:", control.id);
                var range = whereOnRange(currentHandPosition, control);
                console.log("range:", JSON.stringify(range));
                eventData = {
                    note: control.id,
                    velocity: range.x
                };
                onEvent();
            }
        });
        deltaTotal = 0;
    }
}

Script.update.connect(onUpdate);


// console.log()

var controlBoxes = {
    speedControl: "",
    pitchControl: "",
    yawControl: "",
    rollControl: "",
    fallOffRadiusControl: "",
    exponentControl: "",
    cutOffControl: "",
    intensityControl1: "",
    intensityControl2: "",
    redControl1: "",
    greenControl1: "",
    blueControl1: "",
    redControl2: "",
    greenControl2: "",
    blueControl2: ""
};

var speedArray = [
    "speedControl",
    "pitchControl",
    "yawControl",
    "rollControl"
];

var lightQualityArray = [
    "fallOffRadiusControl",
    "exponentControl",
    "cutOffControl",
    "intensityControl1",
    "intensityControl2"
];

var colorArray = [
    "redControl1",
    "greenControl1",
    "blueControl1",
    "redControl2",
    "greenControl2",
    "blueControl2"
];

function replaceControlsWithBox(arrayOfControls, controlID) {
    arrayOfControls.forEach(function(control) {
        controlBoxes[control] = controlID;
    });
}

replaceControlsWithBox(speedArray, controlBoxesIds["control1"]);
replaceControlsWithBox(lightQualityArray, controlBoxesIds["control2"]);
replaceControlsWithBox(colorArray, controlBoxesIds["control3"]);

var props;

function onEvent() {
    // Light Speed
    if (eventData.note == controlBoxes.speedControl) {
        speed1 = eventData.velocity / 2;
        emitRate = eventData.velocity;
        Entities.editEntity(particle1, {
            emitRate: emitRate
        })
    }

    // Light Pitch
    if (eventData.note == controlBoxes.pitchControl) {
        pitch1 = lerp(0, 127, 0, speed1, eventData.velocity) - speed1 / 2;
        Entities.editEntity(box1, {
            angularVelocity: { x: pitch1, y: yaw1, z: roll1 }
        })
    }

    // Light Yaw
    if (eventData.note == controlBoxes.yawControl) {
        yaw1 = lerp(0, 127, 0, speed1, eventData.velocity) - speed1 / 2;
        Entities.editEntity(box1, {
            angularVelocity: { x: pitch1, y: yaw1, z: roll1 }
        })
    }

    // Light Roll
    if (eventData.note == controlBoxes.rollControl) {
        roll1 = lerp(0, 127, 0, speed1, eventData.velocity) - speed1 / 2;
        Entities.editEntity(box1, {
            angularVelocity: { x: pitch1, y: yaw1, z: roll1 }
        })
    }

    // Light Fall Off Radius
    if (eventData.note == controlBoxes.fallOffRadiusControl) {
        falloffRadius1 = lerp(0, 127, 0.001, 1, eventData.velocity);
        props = { falloffRadius: falloffRadius1 };
        lights.forEach(function(light) { Entities.editEntity(light, props) });
    }

    // Light exponent
    if (eventData.note == controlBoxes.exponentControl) {
        exponent1 = lerp(0, 127, 0.001, 20, eventData.velocity);
        props = { exponent: exponent1 };
        lights.forEach(function(light) { Entities.editEntity(light, props) });
    }

    // Light cutoff
    if (eventData.note == controlBoxes.cutOffControl) {
        cutoff1 = lerp(0, 127, 0, 100, eventData.velocity);
        props = { cutoff: cutoff1 };
        lights.forEach(function(light) { Entities.editEntity(light, props) });
    }

    // Light Re d
    if (eventData.note == controlBoxes.redControl1) {
        red1 = lerp(0, 127, 0, 255, eventData.velocity);
        props = { color: { red: red1, green: green1, blue: blue1 } };
        lights.forEach(function(light) { Entities.editEntity(light, props) });
    }

    // Light green
    if (eventData.note == controlBoxes.greenControl1) {
        green1 = lerp(0, 127, 0, 255, eventData.velocity);
        props = { color: { red: red1, green: green1, blue: blue1 } };
        lights.forEach(function(light) { Entities.editEntity(light, props) });
    }

    // Lightblue
    if (eventData.note == controlBoxes.blueControl1) {
        blue1 = lerp(0, 127, 0, 255, eventData.velocity);
        props = { color: { red: red1, green: green1, blue: blue1 } };
        lights.forEach(function(light) { Entities.editEntity(light, props) });
    }

    // Light Intensicty
    if (eventData.note == controlBoxes.intensityControl1) {
        intensity1 = lerp(0, 127, -500, 500, eventData.velocity);
        props = { intensity: intensity1 };
        lights.forEach(function(light) { Entities.editEntity(light, props) });
        Entities.editEntity(box1, props);
    }

    // Center Light
    if (eventData.note == controlBoxes.intensityControl2) {
        intensity2 = lerp(0, 127, -1000, 1000, eventData.velocity);
        props = { intensity: intensity2 };
        Entities.editEntity(light0, props);
    }

    // Center Light Red
    if (eventData.note == controlBoxes.redControl2) {
        red2 = lerp(0, 127, 0, 255, eventData.velocity);
        props = { color: { red: red2, green: green2, blue: blue2 } };
        Entities.editEntity(light0, props);
        Entities.editEntity(sphere1, props);
    }

    // Center Light green
    if (eventData.note == controlBoxes.greenControl2) {
        green2 = lerp(0, 127, 0, 255, eventData.velocity);
        props = { color: { red: red2, green: green2, blue: blue2 } };
        Entities.editEntity(light0, props);
        Entities.editEntity(sphere1, props);
    }


    // Center Light blue
    if (eventData.note == controlBoxes.blueControl2) {
        blue2 = lerp(0, 127, 0, 255, eventData.velocity);
        props = { color: { red: red2, green: green2, blue: blue2 } };
        Entities.editEntity(light0, props);
        Entities.editEntity(sphere1, props);
    }
}

lightSource();

function scriptEnding() {
    Entities.deleteEntity(box1);
    for (var key in controlBoxesIds) {
        Entities.deleteEntity(controlBoxesIds[key]);
    }
    Script.update.disconnect(onUpdate);
}

Script.scriptEnding.connect(scriptEnding);