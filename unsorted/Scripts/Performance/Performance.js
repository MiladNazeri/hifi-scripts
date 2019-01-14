function vec(x,y,z) {
    var obj = {};
    obj.x = x;
    obj.y = y;
    obj.z = z;
    return obj;
}

function col(r,g,b){
    var obj = {};
    obj.red = r;
    obj.green = g;
    obj.blue = b;
    return obj;
}

var CONTROL_HEIGHT = 3;
var CONTROL_WIDTH = 3;
var CONTROL_DEPTH = 3;

var position = vec(0,0,0);
var dimension = vec(CONTROL_WIDTH,CONTROL_HEIGHT,CONTROL_DEPTH);

function Control(position, dimensions, controlMin, controlMax) {
    this.position = position;
    this.dimensions = dimensions;
    this.minMax = {
        xMin: this.position.x - dimensions.x/2,
        xMax: this.position.x + dimensions.x/2,
        yMin: this.position.y - dimensions.y/2,
        yMax: this.position.y + dimensions.y/2,
        zMin: this.position.z - dimensions.z/2,
        zMax: this.position.z + dimensions.z/2
    }
}

var testPosition = vec(0,0,0);
var testPosition2 = vec(4,4,4);
var testDimensions  = vec(1,1,1);
var testDimensions2  = vec(6,6,6);
var testDimensions3  = vec(1,1,1);
var testCurrentPosition = vec(2,2,2);
var testCurrentPosition2= vec(18,18,18);
var testCurrentPosition3= vec(0,0,0); 

var control = new Control(testPosition, testDimensions);
var control2 = new Control(testPosition2, testDimensions2);
var control3 = new Control(testPosition, testDimensions3);

var eventData = {
    note: 0,
    velocity: 0
};

function checkIfIn(currentPosition, control){
    // console.log("currentPosition", currentPosition)
    // console.log("control", control)
    var xyzCheck = {
        x: false,
        y: false,
        z: false
    }
    for (var key in control.minMax){
        var ident = key.slice(0,1);
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
    console.log("xyzCheck", xyzCheck);
    
    return xyzCheck;
}

function lerp(InputLow, InputHigh, OutputLow, OutputHigh, Input) {
    return ((Input - InputLow) / (InputHigh - InputLow)) * (OutputHigh - OutputLow) + OutputLow;
}

function whereOnRange(currentPosition, control){
    var whereOnRange = {
        x: 0,
        y: 0,
        z: 0
    }
    for (var key in whereOnRange){
        var minKey = key + "Min";
        var maxKey = key + "Max";
        var min = control.minMax[minKey];
        var max = control.minMax[maxKey];
        var point = lerp(min, max, 0, 255, currentPosition[key]);
        // var point = lerp(min, max, 0, max - min, currentPosition[key]);
        
        whereOnRange[key] = point;
    }
    console.log("whereOnRange", whereOnRange);
    
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
// Array Vars
var lights = [];
var lightProps = {};
// Entity Vars
var light, light0, box1, sphere1;

function lightSource(){
    print("Creating Spotlight");
    var pos = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, {x: 0, y: 1, z: -2}));

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
        dynamic: wantDynamic,
        gravity: {x:0, y:-2, z:0},
        angularDamping: 0,
        friction: 0,
        color:{
            red: 100,
            blue: 0,
            green: 0
        }
    });

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
        dynamic: wantDynamic,
        gravity: {x:0, y:-2, z:0},
        angularDamping: 0,
        friction: 0,
        color:{
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
        dynamic: wantDynamic,
        gravity: {x:0, y:-2, z:0},
        angularDamping: 0,
        color:{red: 255,
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
    lightProps.rotation = Quat.fromPitchYawRollDegrees(90,0,0)
    lights.push(Entities.addEntity(lightProps));

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(-90,0,0);
    lights.push(Entities.addEntity(lightProps));

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(0,90,0);
    lights.push(Entities.addEntity(lightProps));

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(0,-90,0);
    lights.push(Entities.addEntity(lightProps));

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(0,0,0);
    lights.push(Entities.addEntity(lightProps));

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(180,0,0);
    lights.push(Entities.addEntity(lightProps));
}

var pos = Vec3.sum(MyAvatar.position, Vec3.multiply(Quat.getForward(MyAvatar.orientation), 1));

function boxMaker(pos, dim){
    var props = {
        type: "Box",
        position: pos,
        rotation: MyAvatar.orientation,
        dimensions: dim
    }
    return props;
}

var controlBoxes = {
    speedControl: "",
    pitchControl: "",
    yawControl: "",
    rollControl: "",
    fallOffRadiusControl: "",
    exponentControl: "",
    cutOffControl: "",
    intensityControl1: "",
    intensityControl12: "",
    redControl1: "",
    greenControl1: "",
    blueControl1: "",
    redControl2: "",
    greenControl2: "",
    blueControl2: "",
};

// Light Speed
if (eventData.note == controlBoxes.speedControl){
    speed1 = eventData.velocity/2;
}

// Light Pitch
if (eventData.note == controlBoxes.pitchControl){
    pitch1 = lerp (0,127,0,speed1,eventData.velocity)-speed1/2;
    Entities.editEntity(box1,{
        angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
    })
}

// Light Yaw
if (eventData.note == controlBoxes.yawControl){
    yaw1 = lerp (0,127,0,speed1,eventData.velocity)-speed1/2;
    Entities.editEntity(box1,{
        angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
    })
}

// Light Roll
if (eventData.note == controlBoxes.rollControl){
    roll1 = lerp (0,127,0,speed1,eventData.velocity) -speed1/2;
    Entities.editEntity(box1,{
        angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
    })
}

// Light Fall Off Radius
if (eventData.note == controlBoxes.fallOffRadiusControl){
    falloffRadius1 = lerp (0,127,0.001,1,eventData.velocity);
    props = {falloffRadius: falloffRadius1};
    lights.forEach(function(light) {Entities.editEntity(light, props)});
}

// Light exponent
if (eventData.note == controlBoxes.exponentControl){
    exponent1 = lerp (0,127,0.001,20,eventData.velocity);
    props = {exponent: exponent1};
    lights.forEach(function(light) {Entities.editEntity(light, props)});
}

// Light cutoff
if (eventData.note == controlBoxes.cutOffControl){
    cutoff1 = lerp (0,127,0,100,eventData.velocity);
    props = {cutoff: cutoff1};
    lights.forEach(function(light) {Entities.editEntity(light, props)});
}

// Light Re d
if (eventData.note == controlBoxes.redControl1){
    red1 = lerp (0,127,0,255,eventData.velocity);
    props = {color: {red: red1, green: green1, blue: blue1}};
    lights.forEach(function(light) {Entities.editEntity(light, props)});
}

// Light green
if (eventData.note == controlBoxes.greenControl1){
    green1 = lerp (0,127,0,255,eventData.velocity);
    props = {color: {red: red1, green: green1, blue: blue1}};
    lights.forEach(function(light) {Entities.editEntity(light, props)});
}

// Lightblue
if (eventData.note == controlBoxes.blueControl1){
    blue1 = lerp (0,127,0,255,eventData.velocity);
    props = {color: {red: red1, green: green1, blue: blue1}};
    lights.forEach(function(light) {Entities.editEntity(light, props)});
}

// Light Intensicty
if (eventData.note == controlBoxes.intensityControl1){
    intensity1 = lerp (0,127,-500,500,eventData.velocity);
    props = {intensity: intensity1};
    lights.forEach(function(light) {Entities.editEntity(light, props)});
    Entities.editEntity(box1, props);
}

// Center Light
if (eventData.note == controlBoxes.intensityControl2){
    intensity2 = lerp (0,127,-1000,1000,eventData.velocity);
    props = {intensity: intensity2};
    Entities.editEntity(light0, props);
}

// Center Light Red
if (eventData.note == controlBoxes.redControl2){
    red2 = lerp (0,127,0,255,eventData.velocity);
    props = {color: {red: red2, green: green2, blue: blue2}};
    Entities.editEntity(light0,props);
    Entities.editEntity(sphere1, props);
}

// Center Light green
if (eventData.note == controlBoxes.greenControl2){
    green2 = lerp (0,127,0,255,eventData.velocity);
    props = {color: {red: red2, green: green2, blue: blue2}};
    Entities.editEntity(light0, props);
    Entities.editEntity(sphere1, props);
}


// Center Light blue
if (eventData.note == controlBoxes.blueControl2){
    blue2 = lerp (0,127,0,255,eventData.velocity);
    props = {color: {red: red2, green: green2, blue: blue2}};
    Entities.editEntity(light0, props);
    Entities.editEntity(sphere1, props);
}

lightSource();

function scriptEnding() {
    Entities.deleteEntity(box1);
    for (var key in controlBoxes){
        Entities.deleteEntity(controlBoxes[key]);
    }
}

Script.scriptEnding.connect(scriptEnding);