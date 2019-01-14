//  MidiSpotlight.js
//
//  Created by Bruce Brown on 1/9/2018
//
if (!Math.sign) {
  Math.sign = function(x) {
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

var novationMap = {
    knob_1: 21,
    knob_2: 22,
    knob_3: 23,
    knob_4: 24,
    knob_5: 25,
    knob_6: 26,
    knob_7: 27,
    knob_8: 28,
    pad_1: 40,
    pad_2: 41,
    pad_3: 42,
    pad_4: 43,
    pad_5: 48,
    pad_6: 49,
    pad_7: 50,
    pad_8: 51,
    pad_9: 36,
    pad_10: 37,
    pad_11: 38,
    pad_12: 39,
    pad_13: 44,
    pad_14: 45,
    pad_15: 46,
    pad_16: 47,
    circle_up: 108,
    circle_down: 109,
    up: 104,
    down: 105,
    track_left: 106,
    track_right: 107,
    c: 48,
    cS: 49,
    d: 50,
    dS: 51,
    e: 52,
    f: 53,
    fS: 54,
    g: 55,
    gS: 56,
    a: 57,
    aS: 58,
    b: 59,
    c2: 60,
    c2S: 61,
    d2: 62,
    d2S: 63,
    e2: 64,
    f2: 65,
    f2S: 66,
    g2: 67,
    g2S: 68,
    a2: 69,
    a2S: 70,
    b2: 71,
    c3: 72
}

function randomize(min,max){
    return Math.random() * (max - min) + min;
}

var novationKeys = Object.keys(novationMap);
function matchNoteToKey(note){
    var keyMatched;
    novationKeys.forEach(function(key){
        if (novationMap[key] === note) {
            keyMatched = key;
        }
    })
    return keyMatched;
}
function log(describer, obj) {
    obj = obj || '';
    print('&======');
    print(describer);
    print(JSON.stringify(obj));
    print('======&');
}

var circleValue = 0;
var directionValue = 0;
var trackValue = 0;
function circleValueEdit(amount, direction){
    if (direction === 'up'){
        circleValue += amount;
        if (circleValue >= 127) circleValue = 127
        if (circleValue <= 0) circleValue = 0
    } else {
        circleValue -= amount;
        if (circleValue >= 127) circleValue = 127
        if (circleValue <= 0) circleValue = 0
    }
}
function directionValueEdit(amount, direction){
    if (direction === 'up'){
        directionValue += amount;
        if (directionValue >= 127) directionValue = 127
        if (directionValue <= 0) directionValue = 0
    } else {
        directionValue -= amount;
        if (directionValue >= 127) directionValue = 127
        if (directionValue <= 0) directionValue = 0
    }
}
function trackValueEdit(amount, direction){
    if (direction === 'up'){
        trackValue += amount;
        if (trackValue >= 127) trackValue = 127
        if (trackValue <= 0) trackValue = 0
    } else {
        trackValue -= amount;
        if (trackValue >= 127) trackValue = 127
        if (trackValue <= 0) trackValue = 0
    }
}

// Misc
var wantDynamic = false;

// Midi
var midiInDevice = "Launchkey Mini"
var midiOutDevice = "Launchkey Mini"
var midiInDeviceId = -1;
var midiOutDeviceId = -1;
var midiChannel = 1; // set midi channel
var midiInDeviceList = [];
var midiOutDeviceList = [];
const INPUT = false;
const OUTPUT = true;
const ENABLE = true;
const DISABLE = false;

var defaultObj = {
    pos: {x: 0, y: 1, z: -2},
}

var posMap = {
    posFront: {x: 0, y: 1, z: -2},
    posBack: {x: 0, y: 1, z: 2},
    posLeft: {x: -2, y: 1, z: 0},
    posRight: {x: 2, y: 1, z: 0},
}
var posMap2 = {
    posFront: {x: 0, y: 1.5, z: -3},
    posBack: {x: 0, y: 2, z: 3},
    posLeft: {x: -3, y: 3, z: 0},
    posRight: {x: 3, y: 4, z: 0},
}
var posMap3 = {
    posFront: {x: 0, y: 2, z: -4},
    posBack: {x: 0, y: 2, z: 4},
    posLeft: {x: -4, y: 2, z: 0},
    posRight: {x: 4, y: 2, z: 0},
    // posup: {x: 0, y: 3, z: 0},
}
var posMap4 = {
    posFront: {x: -2, y: 2, z: -4},
    // posFront2: {x: 2, y: 3, z: -4},
    posBack: {x: -2, y: 2, z: 4},
    posBack2: {x: 2, y: 2, z: 4},
    // posLeft: {x: -4, y: 2, z: 0},
    posLeft2: {x: -4, y: 3, z: 0},
    posRight: {x: 4, y: 2, z: 0},
    // posRight2: {x: 4, y: 3, z: 0},
    posUp: {x: -2, y: 4, z: 0},
    // posU2: {x: 2, y: 4, z: 0},
}

var posMapArray = [posMap,posMap2,posMap3,posMap4]

var rotationMap = {
    x1: Quat.fromPitchYawRollDegrees(90,0,0),
    // x2: Quat.fromPitchYawRollDegrees(-90,0,0),
    x3: Quat.fromPitchYawRollDegrees(180,0,0),
    // y1: Quat.fromPitchYawRollDegrees(0,90,0),
    y2: Quat.fromPitchYawRollDegrees(0,-90,0),
    // z1: Quat.fromPitchYawRollDegrees(0,0,90),
    z2: Quat.fromPitchYawRollDegrees(0,0,90)
}

var rotationMap2 = {
    x1: Quat.fromPitchYawRollDegrees(90,0,0),
    // x2: Quat.fromPitchYawRollDegrees(-90,0,0),
    x3: Quat.fromPitchYawRollDegrees(180,0,0),
    y1: Quat.fromPitchYawRollDegrees(0,90,0),
    // y2: Quat.fromPitchYawRollDegrees(0,-90,0),
    y3: Quat.fromPitchYawRollDegrees(0,180,0),
    z1: Quat.fromPitchYawRollDegrees(0,0,90),
    // z2: Quat.fromPitchYawRollDegrees(0,0,90),
    z3: Quat.fromPitchYawRollDegrees(0,0,180)
}

var rotationMap3 = {
    x1: Quat.fromPitchYawRollDegrees(90,0,0),
    y1: Quat.fromPitchYawRollDegrees(0,90,0),
    z1: Quat.fromPitchYawRollDegrees(0,0,90),
}

var rotationMapArray = [rotationMap, rotationMap2, rotationMap3];

var sizeMap1 = {
    x: 1,
    y: 1,
    z: 1
}
var sizeMap2 = {
    x: 5,
    y: 5,
    z: 5
}
var sizeMap3 = {
    x: 10,
    y: 10,
    z: 10
}
var sizeMap4 = {
    x: 1,
    y: 5,
    z: 7
}

var sizeMapArray = [sizeMap1,sizeMap2,sizeMap3,sizeMap4];

var lightSouceMakerObj = {
    allLightSources: [],
    currentlyOn: false,
    addToLightSource: function(lightSource){
        this.allLightSources.push(lightSource);
    },
    deleteFromLightSource: function(index){
        var lightSource = this.allLightSources.splice(index,1);
        this.lightSource.tearDown;
    },
    resetAll: function(){
        this.allLightSources.forEach(function(ls){
            ls.tearDown();
        })
        this.allLightSources = [];
    },
    makeLight: function(posMap, rotMap){
        if (!this.currentlyOn) {
            this.currentlyOn = true;
        } else {
            this.resetAll();
        }
        var keys = Object.keys(posMap);
        // log("keys", keys)
        // log("rotMap", rotMap)

        keys.forEach(function(pos){
            var lightSource = new LightSourceMaker(posMap[pos], rotMap);
            this.allLightSources.push(lightSource);
        }, this)
        // log("this.allLightSources", this.allLightSources.length)
    }

}
var userData = {
    grabbableKey: {
        grabbable: false
    },
    ProceduralEntity: {
        version: 2,
        shaderUrl:
            "http://localhost:3001/shader.fs",
        channels: null,
        uniforms: {
            specular_intensity: 0.8,
            specular_hardness: 380,
            diffuse_color: [
                Math.sin(1 * (1 + 2) + 0),
                Math.sin(
                    2 * (2+ 3) + 2 * Math.PI / 3
                ),
                Math.sin(3 * (2 + 3) + 4 * Math.PI / 3)
            ],
            emit: -10,
            iSpeed: Math.random() / 4,
            hide: [0.0, 0.0, 0.0],
            specular_color: [
                Math.sin(4 * (2 + 3) + 0),
                Math.sin(
                    5 * (2 + 3) + 2 * Math.PI / 3
                ),
                Math.sin(6 * (2 + 3) + 4 * Math.PI / 3)
            ]
        }
    },
}

function makeColor(){
    var red = randomize(0,255);
    var green = randomize(0,255);
    var blue = randomize(0,255);
    var colorArray = [red,green,blue];
    var arrayToGet0 = Math.floor(randomize(0,3));
    colorArray[arrayToGet0] = 0;
    return {
        red: colorArray[0],
        green: colorArray[1],
        blue:colorArray[2]
    }
}

function LightSourceMaker(pos, rotMap){
    // print("in LIght source Maker")
    pos = pos || defaultObj.pos;
    var rotationMapKeys = Object.keys(rotMap);
    this.position = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, pos));
    this.box = Entities.addEntity({
        name: "The Spot Light",
        description: "",
        type: "Box",
        position: this.position,
        dimensions: {
            x: 0.35,
            y: 0.35,
            z: 0.35
        },
        visible: false,
        dynamic: wantDynamic,
        gravity: {x:0, y:-2, z:0},
        angularDamping: 0,
        friction: 0,
        color:{
            red: 100,
            blue: 0,
            green: 0
        },
    })
    this.sphere = Entities.addEntity({
        name: "Spot Light Sphere",
        description: "",
        type: "Sphere",
        position: this.position,
        dimensions: {
            x: 0.5,
            y: 0.5,
            z: 0.5
        },
        dynamic: wantDynamic,
        visible: false,
        gravity: {x:0, y:-2, z:0},
        angularDamping: 0,
        friction: 0,
        color:{
            red: 100,
            blue: 0,
            green: 0
        },
        collisionless: true,
        // userData: JSON.stringify(userData),
        parentID: this.box
    });
    var lightProps = {
        name: "Spot Light Emitter 1",
        description: "",
        type: "Light",
        position: this.position,
        dimensions: {
            x: 10,
            y: 10,
            z: 10
        },
        dynamic: wantDynamic,
        gravity: {x:0, y:-2, z:0},
        angularDamping: 0,
        angularVelocity: {x: randomize(1,3), y: randomize(1,3), z:randomize(1,3)},
        color: makeColor(),
        intensity: randomize(1,2), falloffRadius: randomize(1,300),
        isSpotlight: 0,
        exponent: randomize(.5,5),
        cutoff: randomize(10,100),
        collisionless: true,
        userData: "{ \"grabbableKey\": { \"grabbable\": false} }",
        parentID: this.box
    };
    this.light0 = Entities.addEntity(lightProps);
    this.lights = [];
    lightProps.isSpotlight = 1;
    rotationMapKeys.forEach(function(rotation){
        lightProps.rotation = rotMap[rotation];
        this.lights.push(Entities.addEntity(lightProps));
    }, this);
    this.speed = 2;
    this.pitch = 20;
    this.yaw = 20;
    this.roll = 20;
    this.fallOffRadius = 1;
    this.exponent = 1;
    this.cutoff = 50;
    this.red = 50;
    this.green = 75;
    this.blue = 100;
    this.visible = true;
    this.centerRed = 50;
    this.centerGreen = 75;
    this.centerBlue = 75;
    this.lightIntensity = 2.5;
    this.centerIntensity = 2.5;
    this.group = 0;
    this.enable = true;
    this.centerEnable = true;
    this.toggleEnable = function(){
        this.enable = !this.enable;
        print("enable " + this.enable);
    };
    this.toggleCenterEnable = function(){
        this.centerEnable = !this.centerEnable;
        print("centerEnable " + this.centerEnable);

    };
    this.changeSpeed = function(newSpeed){
        this.speed = newSpeed
    }
    this.changePitch = function(newPitch){
        this.pitch = lerp (0,127,0,this.speed,newPitch)-this.speed/2;
        Entities.editEntity(this.box,{
            angularVelocity: {x:this.pitch, y:this.yaw, z: this.roll}
        })
    }
    this.changeYaw = function(newYaw){
        this.yaw = lerp (0,127,0,this.speed,newYaw)-this.speed/2;
        Entities.editEntity(this.box,{
            angularVelocity: {x:this.pitch, y:this.yaw, z: this.roll}
        })
    }
    this.changeRoll = function(newRoll){
        this.roll = lerp (0,127,0,this.speed,newRoll)-this.speed/2;
        Entities.editEntity(this.box,{
            angularVelocity: {x:this.pitch, y:this.yaw, z: this.roll}
        })
    }
    this.changeFallOff = function(newRadius){
        this.fallOffRadius = lerp (0,127,0.001,100,newRadius);
        props = {falloffRadius: this.fallOffRadius};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
    }
    this.changeExponent = function(newExponent){
        this.exponent = lerp (0,127,0.5,20,newExponent);
        props = {exponent: this.exponent};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
    }
    this.changeCutoff = function(newCutoff){
        this.cutoff = lerp (0,127,0,90,newCutoff);
        props = {cutoff: this.cutoff};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
    }
    this.changeRed = function(newRed){
        this.red = lerp (0,127,0,255,newRed);
        props = {color: {red: this.red, green: this.green, blue: this.blue}};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
    };
    this.changeGreen = function(newGreen){
        this.green = lerp (0,127,0,255,newGreen);
        props = {color: {red: this.red, green: this.green, blue: this.blue}};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
    };
    this.changeBlue = function(newBlue){
        this.blue = lerp (0,127,0,255,newBlue);
        props = {color: {red: this.red, green: this.green, blue: this.blue}};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
    };
    this.changeCenterRed = function(newRed){
        this.centerRed = lerp (0,127,0,255,newRed);
        props = {color: {red: this.centerRed, green: this.centerGreen, blue: this.centerBlue}};
        Entities.editEntity(this.light0, props);
        Entities.editEntity(this.sphere, props);
    };
    this.changeCenterGreen = function(newGreen){
        this.centerGreen = lerp (0,127,0,255,newGreen);
        props = {color: {red: this.centerRed, green: this.centerGreen, blue: this.centerBlue}};
        Entities.editEntity(this.light0, props);
        Entities.editEntity(this.sphere, props);
    };
    this.changeCenterBlue = function(newBlue){
        this.centerBlue = lerp (0,127,0,255,newBlue);
        props = {color: {red: this.centerRed, green: this.centerGreen, blue: this.centerBlue}};
        Entities.editEntity(this.light0, props);
        Entities.editEntity(this.sphere, props);
    };
    this.changeIntensity = function(newIntensity){
        this.lightIntensity = lerp (0,127,0,10,newIntensity);
        props = {intensity: this.lightIntensity};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
        Entities.editEntity(this.box, props);
    };
    this.changeCenterIntensity = function(newCenterIntensity){
        this.centerIntensity = lerp (0,127,0,10,newCenterIntensity);
        props = {intensity: this.lightIntensity};
        Entities.editEntity(this.light0, props);
    };
    this.changeSize = function(newSize){
        props = {dimensions: newSize};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
    }
    this.turnOff = function(){
        props = {intensity: 0};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
        Entities.editEntity(this.light0, props);
    }
    this.turnOn = function(){
        props = {intensity: this.lightIntensity};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
        props = {intensity: this.centerIntensity};
        Entities.editEntity(this.light0, props);
    }
    this.toggleVisible = function(){
        // log("in toggle visible");
        this.visible = !this.visible;
        props = {visible: this.visible};
        Entities.editEntity(this.box, props);
        Entities.editEntity(this.sphere, props);

    }
    this.setup = function(){

    }
    this.tearDown = function(){
        print("running TearDown")
        Entities.deleteEntity(this.box);
    }
    this.move = function(amount){
        // this.position = Vec3.sum(Vec3.sum(MyAvatar.position,amount), Vec3.multiplyQbyV(MyAvatar.orientation, this.position));
        this.position.x = this.position.x + amount.x * Math.sign(this.position.x);
        // this.position.y = this.position.y + amount.y * Math.sign(this.position.y);
        this.position.z = this.position.z + amount.z * Math.sign(this.position.z);
        // log("this.position", this.position);
        Entities.editEntity(this.box,{
            position: this.position,
        })
    }
}
function changeSpeed(newSpeed){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeSpeed(newSpeed);
    })
}
function changePitch(newPitch){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changePitch(newPitch);
    })
}
function changeYaw(newYaw){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeYaw(newYaw);
    })
}
function changeRoll(newRoll){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeRoll(newRoll);
    })
}
function changeFallOff(newRadius){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeFallOff(newRadius);
    })
}
function changeExponent(newExponent){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeExponent(newExponent);
    })
}
function changeCutoff(newCutoff){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeCutoff(newCutoff);
    })
}
function changeRed(newRed){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeRed(newRed);
    })
}
function changeGreen(newGreen){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeGreen(newGreen);
    })
}
function changeBlue(newBlue){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeBlue(newBlue);
    })
}
function changeIntensity(newIntensity){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeIntensity(newIntensity);
    })
}
function changeCenterIntensity(newIntensity){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.centerEnable) return;
        source.changeCenterIntensity(newIntensity);
    })
}
function changeCenterRed(newRed){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.centerEnable) return;
        source.changeCenterRed(newRed);
    })
}
function changeCenterGreen(newGreen){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.centerEnable) return;
        source.changeCenterGreen(newGreen);
    })
}
function changeCenterBlue(newBlue){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.centerEnable) return;
        source.changeCenterBlue(newBlue);
    })
}
function changeSize(newSize){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.centerEnable) return;
        if (!source.enable) return;
        source.changeSize(newSize);
    })
}
function move(amount){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.centerEnable) return;
        if (!source.enable) return;
        source.move(amount);
    })
}
function turnOff(){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.centerEnable) return;
        if (!source.enable) return;
        source.turnOff();
    })
}
function turnOn(){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.centerEnable) return;
        if (!source.enable) return;
        source.turnOn();
    })
}
function toggleVisible(){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.centerEnable) return;
        if (!source.enable) return;
        source.toggleVisible();
    })
}

function toggleEnable(i){
    lightSouceMakerObj.allLightSources.forEach(function(source, index){
        if (i === index) source.toggleEnable();
    })
};
function toggleCenterEnable(i){
    lightSouceMakerObj.allLightSources.forEach(function(source, index){
        if (i === index) source.toggleCenterEnable();
    })
};
//knobs
// {"bend":0,"channel":1,"device":0,"note":21,"program":0,"raw":6297008,"status":176,"type":11,"velocity":96}
//buttons
// {"bend":0,"channel":10,"device":0,"note":40,"program":0,"raw":10377,"status":137,"type":8,"velocity":0}
//circle
// {"bend":0,"channel":1,"device":0,"note":108,"program":0,"raw":27824,"status":176,"type":11,"velocity":0}
// arrows
// {"bend":0,"channel":1,"device":0,"note":104,"program":0,"raw":26800,"status":176,"type":11,"velocity":0}
// track
// {"bend":0,"channel":1,"device":0,"note":107,"program":0,"raw":27568,"status":176,"type":11,"velocity":0}
// novationKeys
// {"bend":0,"channel":1,"device":0,"note":48,"program":0,"raw":12416,"status":128,"type":8,"velocity":0}
function midiEventReceived(eventData) {
    // if (eventData.device != midiInDeviceId || eventData.channel != midiChannel ){
    //     return;
    // }
    // log("eventData", eventData)
    // Light Speed
    if (eventData.note == novationMap.knob_1){
        var speed = eventData.velocity/2;
        changeSpeed(speed);
    }

    // Light Pitch
    if (eventData.note == novationMap.knob_2){
        changePitch(eventData.velocity);
    }

    // Light Yaw
    if (eventData.note == novationMap.knob_3){
        changeYaw(eventData.velocity);
    }

    // Light Roll
    if (eventData.note == novationMap.knob_4){
        changeRoll(eventData.velocity);
    }

    // Light Fall Off Radius
    if (eventData.note == novationMap.knob_5){
        changeFallOff(eventData.velocity);
    }

    // Light exponent
    if (eventData.note == novationMap.circle_up){
        circleValueEdit(5, 'up');
        changeExponent(circleValue);
    }

    if (eventData.note == novationMap.circle_down){
        circleValueEdit(5, 'down');
        changeExponent(circleValue);
    }

    // Light cutoff
    if (eventData.note == novationMap.up){
        directionValueEdit(5, 'up');
        changeCutoff(directionValue);
    }

    if (eventData.note == novationMap.down){
        directionValueEdit(5, 'down');
        changeCutoff(directionValue);
    }

    // Light Red
    if (eventData.note == novationMap.knob_6){
        changeRed(eventData.velocity);
    }

    // Light green
    if (eventData.note == novationMap.knob_7){
        changeGreen(eventData.velocity);
    }

    // Lightblue
    if (eventData.note == novationMap.knob_8){
        changeBlue(eventData.velocity);
    }

    // Light Intensicty
    if (eventData.note == novationMap.track_left){
        trackValueEdit(5, 'down');
        changeIntensity(trackValue);
    }
    if (eventData.note == novationMap.track_right){
        trackValueEdit(5, 'up');
        changeIntensity(trackValue);
    }

    // Center Light
    if (eventData.note == novationMap.track_left){
        trackValueEdit(5, 'down');
        changeCenterIntensity(trackValue);
    }
    if (eventData.note == novationMap.track_right){
        trackValueEdit(5, 'up');
        changeCenterIntensity(trackValue);
    }

    // Center Light Red
    if (eventData.note == novationMap.knob_6){
        changeCenterRed(eventData.velocity);
    }

    // Center Light green
    if (eventData.note == novationMap.knob_7){
        changeCenterGreen(eventData.velocity);
    }


    // Center Light blue
    if (eventData.note == novationMap.knob_8){
        changeCenterBlue(eventData.velocity);
    }

    if (eventData.note == novationMap.pad_1){
        toggleEnable(0);
    }
    if (eventData.note == novationMap.pad_2){
        toggleEnable(1);
    }
    if (eventData.note == novationMap.pad_3){
        toggleEnable(2);
    }
    if (eventData.note == novationMap.pad_4){
        toggleEnable(3);
    }
    if (eventData.note == novationMap.pad_5){
        toggleCenterEnable(0);
    }
    if (eventData.note == novationMap.pad_6){
        toggleCenterEnable(1);
    }
    if (eventData.note == novationMap.pad_7){
        toggleCenterEnable(2);
    }
    if (eventData.note == novationMap.pad_8){
        toggleCenterEnable(3);
    }
    if (eventData.note == novationMap.c && eventData.status == 144){
        lightSouceMakerObj.makeLight(posMapArray[0], rotationMapArray[0]);
    }
    if (eventData.note == novationMap.cS && eventData.status == 144){
        lightSouceMakerObj.makeLight(posMapArray[1], rotationMapArray[0]);
    }
    if (eventData.note == novationMap.d && eventData.status == 144){
        lightSouceMakerObj.makeLight(posMapArray[2], rotationMapArray[0]);
    }
    if (eventData.note == novationMap.dS && eventData.status == 144){
        lightSouceMakerObj.makeLight(posMapArray[3], rotationMapArray[0]);
    }
    if (eventData.note == novationMap.e && eventData.status == 144){
        lightSouceMakerObj.makeLight(posMapArray[0], rotationMapArray[2]);
    }
    if (eventData.note == novationMap.f && eventData.status == 144){
        lightSouceMakerObj.makeLight(posMapArray[1], rotationMapArray[2]);
    }
    if (eventData.note == novationMap.fS && eventData.status == 144){
        lightSouceMakerObj.makeLight(posMapArray[2], rotationMapArray[2]);
    }
    if (eventData.note == novationMap.g && eventData.status == 144){
        lightSouceMakerObj.makeLight(posMapArray[3], rotationMapArray[2]);
    }
    if (eventData.note == novationMap.a && eventData.status == 144){
        changeSize(sizeMapArray[0]);
    }
    if (eventData.note == novationMap.aS && eventData.status == 144){
        changeSize(sizeMapArray[1]);
    }
    if (eventData.note == novationMap.b && eventData.status == 144){
        changeSize(sizeMapArray[2]);
    }
    if (eventData.note == novationMap.c2 && eventData.status == 144){
        changeSize(sizeMapArray[3]);
    }
    if (eventData.note === novationMap.pad_9 && eventData.status == 153){
        turnOff();
    }
    if (eventData.note === novationMap.pad_9 && eventData.status == 137){
        turnOn();
    }
    if (eventData.note === novationMap.c3 && eventData.status == 144){
        toggleVisible();
    }
    if (eventData.note === novationMap.f2 && eventData.status == 144){
        dis = 1;
        var amount = {x: dis, y: dis, z: dis};
        move(amount);
    }
    if (eventData.note === novationMap.g2 && eventData.status == 144){
        dis = -1;
        var amount = {x: dis, y: dis, z: dis};
        move(amount);
    }
    if (eventData.note === novationMap.a2 && eventData.status == 144){
        dis = 2.5;
        var amount = {x: dis, y: dis, z: dis};
        move(amount);
    }
    if (eventData.note === novationMap.b2 && eventData.status == 144){
        dis = -2.5;
        var amount = {x: dis, y: dis, z: dis};
        move(amount);
    }
    if (eventData.note === novationMap.f2S && eventData.status == 144){
        dis = 2.5;
        var amount = {x: dis, y: dis, z: dis};
        move(amount);
    }
    if (eventData.note === novationMap.f2S && eventData.status == 128){
        dis = -2.5;
        var amount = {x: dis, y: dis, z: dis};
        move(amount);
    }
    if (eventData.note === novationMap.g2S && eventData.status == 144){
        dis = 5;
        var amount = {x: dis, y: dis, z: dis};
        move(amount);
    }
    if (eventData.note === novationMap.g2S && eventData.status == 128){
        dis = -5;
        var amount = {x: dis, y: dis, z: dis};
        move(amount);
    }
}

function lerp(InputLow, InputHigh, OutputLow, OutputHigh, Input) {
    return ((Input - InputLow) / (InputHigh - InputLow)) * (OutputHigh - OutputLow) + OutputLow;
}
//lerp (0,127,0,360,eventData.velocity);

function getMidiInputs(){
    var midiInDevices = Midi.listMidiDevices(INPUT);
    midiInDeviceList = midiInDevices;
}

function getMidiOutputs(){
    var midiOutDevices = Midi.listMidiDevices(OUTPUT);
    midiOutDevices.shift(); // Get rind of MS wavetable synth
    midiOutDeviceList = midiOutDevices;
}

function getMidiDeviceIds(){
    for (var i = 0; i < midiInDeviceList.length; i++){
        if (midiInDeviceList[i] == midiInDevice){
            midiInDeviceId = i;
        }
    }
    for (var i = 0; i < midiOutDeviceList.length; i++){
        if (midiOutDeviceList[i] == midiOutDevice){
            midiOutDeviceId = i + 1;
        }
    }
}

// List Midi Input Devices
function listMidiInputs(){
    print("Input Devices:");
    for(var i = 0; i < midiInDeviceList.length; i++) {
        print("(" + i + ") " + midiInDeviceList[i]);
    };
}

// List Midi ouput Devices
function listMidiOutputs(){
    print("Output Devices:");
    for(var i = 0; i < midiOutDeviceList.length; i++) {
        print("(" + (i+1) + ") " + midiOutDeviceList[i]); // Get rid of MS wavetable synth
    };
}

function midiHardwareResetReceieved(){
    getMidiInputs();
    getMidiOutputs();
    getMidiDeviceIds();
    //blockAllDevices();
    unblockMidiDevice();
}

function unblockMidiDevice(){
    Midi.unblockMidiDevice(midiOutDevice, OUTPUT);
    Midi.unblockMidiDevice(midiInDevice, INPUT);
}

function midiConfig(){
    Midi.thruModeEnable(DISABLE);
    Midi.broadcastEnable(DISABLE);
    Midi.typeNoteOffEnable(ENABLE);
    Midi.typeNoteOnEnable(ENABLE);
    Midi.typePolyKeyPressureEnable(DISABLE);
    Midi.typeControlChangeEnable(ENABLE);
    Midi.typeProgramChangeEnable(ENABLE);
    Midi.typeChanPressureEnable(DISABLE);
    Midi.typePitchBendEnable(DISABLE);
    Midi.typeSystemMessageEnable(DISABLE);
    midiHardwareResetReceieved();
}

function scriptEnding() {
    lightSouceMakerObj.resetAll();
}

midiConfig();
function makeLight(){

}
makeLight();

Midi.midiReset.connect(midiHardwareResetReceieved);
Midi.midiMessage.connect(midiEventReceived);
Script.scriptEnding.connect(scriptEnding);
