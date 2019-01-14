//  MidiSpotlight.js
// 
//  Created by Bruce Brown on 1/9/2018
//

// Controls
var speedControl = 77;
var pitchControl = 49;
var yawControl = 29;
var rollControl = 13;
var cutOffControl = 14;
var exponentControl = 30;
var fallOffRadiusControl = 50;
var colorControl1 = 78;
var redControl1 = 51;
var greenControl1 = 31;
var blueControl1 = 15;
var intensityControl1 = 79;
var redControl2 = 52;
var greenControl2 = 32;
var blueControl2 = 16;
var intensityControl2 = 80;
var want6 = true;
var want8 = true;

// Color Cycle
var frequency = 0.05;

// Misc
var wantDynamic = false;

// Midi
var midiInDevice = "Launch Control XL";
var midiOutDevice = "Launch Control XL";
var midiInDeviceId = -1;
var midiOutDeviceId = -1;
var midiChannel = 1; // set midi channel
var midiInDeviceList = [];
var midiOutDeviceList = [];
const INPUT = false;
const OUTPUT = true;
const ENABLE = true;
const DISABLE = false;

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

    // Iluminator

    if(want6){
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

    if(want8){
    	lightProps.isSpotlight = 1;
    	lightProps.rotation = Quat.fromPitchYawRollDegrees(45,45,0);
    	lights.push(Entities.addEntity(lightProps));

    	lightProps.isSpotlight = 1;
    	lightProps.rotation = Quat.fromPitchYawRollDegrees(45,-45,0);
    	lights.push(Entities.addEntity(lightProps));

    	lightProps.isSpotlight = 1;
    	lightProps.rotation = Quat.fromPitchYawRollDegrees(45,135,0);
    	lights.push(Entities.addEntity(lightProps));

    	lightProps.isSpotlight = 1;
    	lightProps.rotation = Quat.fromPitchYawRollDegrees(45,-135,0);
    	lights.push(Entities.addEntity(lightProps));

    	lightProps.isSpotlight = 1;
    	lightProps.rotation = Quat.fromPitchYawRollDegrees(-45,45,0);
    	lights.push(Entities.addEntity(lightProps));

    	lightProps.isSpotlight = 1;
    	lightProps.rotation = Quat.fromPitchYawRollDegrees(-45,-45,0);
    	lights.push(Entities.addEntity(lightProps));

    	lightProps.isSpotlight = 1;
    	lightProps.rotation = Quat.fromPitchYawRollDegrees(-45,135,0);
    	lights.push(Entities.addEntity(lightProps));

    	lightProps.isSpotlight = 1;
    	lightProps.rotation = Quat.fromPitchYawRollDegrees(-45,-135,0);
    	lights.push(Entities.addEntity(lightProps));
    };

}

function midiEventReceived(eventData) {
    if (eventData.device != midiInDeviceId || eventData.channel != midiChannel ){
        return;
    }

// Light Speed
    if (eventData.note == speedControl){
        speed1 = eventData.velocity/2;
    }

// Light Pitch
    if (eventData.note == pitchControl){
        pitch1 = lerp (0,127,0,speed1,eventData.velocity)-speed1/2;
        Entities.editEntity(box1,{
            angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
        })
    }

// Light Yaw
    if (eventData.note == yawControl){
        yaw1 = lerp (0,127,0,speed1,eventData.velocity)-speed1/2;
        Entities.editEntity(box1,{
            angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
        })
    }

// Light Roll
    if (eventData.note == rollControl){
        roll1 = lerp (0,127,0,speed1,eventData.velocity) -speed1/2;
        Entities.editEntity(box1,{
            angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
        })
    }

// Light Fall Off Radius
    if (eventData.note == fallOffRadiusControl){
        falloffRadius1 = lerp (0,127,0.001,1,eventData.velocity);
        props = {falloffRadius: falloffRadius1};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
    }

// Light exponent
    if (eventData.note == exponentControl){
        exponent1 = lerp (0,127,0.001,20,eventData.velocity);
        props = {exponent: exponent1};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
    }

// Light cutoff
    if (eventData.note == cutOffControl){
        cutoff1 = lerp (0,127,0,100,eventData.velocity);
        props = {cutoff: cutoff1};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
    }

// Light Re d
    if (eventData.note == redControl1){
        red1 = lerp (0,127,0,255,eventData.velocity);
        props = {color: {red: red1, green: green1, blue: blue1}};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
    }

// Light green
    if (eventData.note == greenControl1){
        green1 = lerp (0,127,0,255,eventData.velocity);
        props = {color: {red: red1, green: green1, blue: blue1}};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
    }

// Lightblue
    if (eventData.note == blueControl1){
        blue1 = lerp (0,127,0,255,eventData.velocity);
        props = {color: {red: red1, green: green1, blue: blue1}};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
    }

// Light Intensicty
    if (eventData.note == intensityControl1){
        intensity1 = lerp (0,127,-500,500,eventData.velocity);
        props = {intensity: intensity1};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
        Entities.editEntity(box1, props);
    }

// Center Light
    if (eventData.note == intensityControl2){
        intensity2 = lerp (0,127,-1000,1000,eventData.velocity);
        props = {intensity: intensity2};
        Entities.editEntity(light0, props);
    }

// Center Light Red
    if (eventData.note == redControl2){
        red2 = lerp (0,127,0,255,eventData.velocity);
        props = {color: {red: red2, green: green2, blue: blue2}};
        Entities.editEntity(light0,props);
        Entities.editEntity(sphere1, props);
    }

// Center Light green
    if (eventData.note == greenControl2){
        green2 = lerp (0,127,0,255,eventData.velocity);
        props = {color: {red: red2, green: green2, blue: blue2}};
        Entities.editEntity(light0, props);
        Entities.editEntity(sphere1, props);
    }


// Center Light blue
    if (eventData.note == blueControl2){
        blue2 = lerp (0,127,0,255,eventData.velocity);
        props = {color: {red: red2, green: green2, blue: blue2}};
        Entities.editEntity(light0, props);
        Entities.editEntity(sphere1, props);
    }

// ColorControl1
    if (eventData.note == colorControl1){
    	red3   = Math.sin(frequency*eventData.velocity + 0) * 127 + 128;
    	green3 = Math.sin(frequency*eventData.velocity + 2*Math.PI/3) * 127 + 128;
    	blue3  = Math.sin(frequency*eventData.velocity + 4*Math.PI/3) * 127 + 128;
        props = {color: {red: red3, green: green3, blue: blue3}};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
        Entities.editEntity(box1, props);
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
    Entities.deleteEntity(box1);
}

midiConfig();
lightSource();

Midi.midiReset.connect(midiHardwareResetReceieved);
Midi.midiMessage.connect(midiEventReceived);
Script.scriptEnding.connect(scriptEnding);