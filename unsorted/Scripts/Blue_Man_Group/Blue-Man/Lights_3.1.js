//  MidiSpotlight.js
// 
//  Created by Bruce Brown on 1/9/2018
//
// http://localhost:3001/Lights_3.1.js

// Controls
    var greenKnobA = 0;
    var greenFaderA = 8;
    var redKnobB = 1;
    var redFaderB = 9;
    var whiteKnobM = 26;
    var aquaKnobC = 2;
    var aquaFaderC = 10;
    var yellowKnobD = 3;
    var yellowFaderD = 11;
    var whiteFader1M = 12;
    var whiteFader2M = 13;
    var whiteFader3M = 14;
    var whiteFader4M = 15;
    var whiteHorizontalFader = 28;


    var speedControl = 99;
    var pitchControl = 99;
    var yawControl = 99;
    var rollControl = 99;
    var cutOffControl = 99;
    var exponentControl = 99;
    var fallOffRadiusControl = 99;
    var colorControl1 = 99;
    var redControl1 = 99;
    var greenControl1 = 99;
    var blueControl1 = 99;
    var intensityControl1 = 99;
    var redControl2 = 99;
    var greenControl2 = 99;
    var blueControl2 = 99;
    var intensityControl2 = 99;
    var want6 = true;
    var want8 = true;

// Color Cycle
    var frequency = 0.05;

// Misc
    var wantDynamic = false;

// Midi
    var midiInDevice = "TouchOSC Bridge";
    var midiOutDevice = "TouchOSC Bridge";
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


// Light source
    function lightSource(){
        print("Creating Spotlight");
        var pos = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, {x: 0, y: 3, z: 0}));

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
            },
            visible: false
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
            parentID: box1,
            visible: false
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
                lightProps.rotation = Quat.fromPitchYawRollDegrees(180,0,0);
                lights.push(Entities.addEntity(lightProps));

                lightProps.isSpotlight = 1;
                lightProps.rotation = Quat.fromPitchYawRollDegrees(0,90,0);
                lights.push(Entities.addEntity(lightProps));

                // lightProps.isSpotlight = 1;
                // lightProps.rotation = Quat.fromPitchYawRollDegrees(0,-90,0);
                // lights.push(Entities.addEntity(lightProps));

                lightProps.isSpotlight = 1;
                lightProps.rotation = Quat.fromPitchYawRollDegrees(0,0,0);
                lights.push(Entities.addEntity(lightProps));

                lightProps.isSpotlight = 1;
                lightProps.rotation = Quat.fromPitchYawRollDegrees(0,0,180);
                lights.push(Entities.addEntity(lightProps));
            }

            if(want8){
                lightProps.isSpotlight = 1;
                lightProps.rotation = Quat.fromPitchYawRollDegrees(45,45,0);
                lights.push(Entities.addEntity(lightProps));

                lightProps.isSpotlight = 1;
                lightProps.rotation = Quat.fromPitchYawRollDegrees(45,-45,0);
                lights.push(Entities.addEntity(lightProps));

                // lightProps.isSpotlight = 1;
                // lightProps.rotation = Quat.fromPitchYawRollDegrees(45,135,0);
                // lights.push(Entities.addEntity(lightProps));

                // lightProps.isSpotlight = 1;
                // lightProps.rotation = Quat.fromPitchYawRollDegrees(45,-135,0);
                // lights.push(Entities.addEntity(lightProps));

                // lightProps.isSpotlight = 1;
                // lightProps.rotation = Quat.fromPitchYawRollDegrees(-45,45,0);
                // lights.push(Entities.addEntity(lightProps));

                // lightProps.isSpotlight = 1;
                // lightProps.rotation = Quat.fromPitchYawRollDegrees(-45,-45,0);
                // lights.push(Entities.addEntity(lightProps));

                // lightProps.isSpotlight = 1;
                // lightProps.rotation = Quat.fromPitchYawRollDegrees(-45,135,0);
                // lights.push(Entities.addEntity(lightProps));

                // lightProps.isSpotlight = 1;
                // lightProps.rotation = Quat.fromPitchYawRollDegrees(-45,-135,0);
                // lights.push(Entities.addEntity(lightProps));
            };

    }

// Utils
    function log(describer, obj) {
        obj = obj || '';
        print('&======');
        print(describer + ":" + JSON.stringify(obj));
    }

    function lerp(InputLow, InputHigh, OutputLow, OutputHigh, Input) {
        return ((Input - InputLow) / (InputHigh - InputLow)) * (OutputHigh - OutputLow) + OutputLow;
    }

// Midi Events
    function midiEventReceived(eventData) {
        // log("Event:", eventData);
        // Light Speed === greenKnobA
            if (eventData.note == greenKnobA){
                speed1 = eventData.velocity/2;
            }

        // Light Pitch === redKnobB
            if (eventData.note == redKnobB){
                pitch1 = lerp (0,127,0,speed1,eventData.velocity)-speed1/2;
                Entities.editEntity(box1,{
                    angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
                })
            }

        // Light Yaw === aquaKnobC
            if (eventData.note == aquaKnobC){
                yaw1 = lerp (0,127,0,speed1,eventData.velocity)-speed1/2;
                Entities.editEntity(box1,{
                    angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
                })
            }

        // Light Roll === yellowKnobD
            if (eventData.note == yellowKnobD){
                roll1 = lerp (0,127,0,speed1,eventData.velocity) -speed1/2;
                Entities.editEntity(box1,{
                    angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
                })
            }

        // Light Fall Off Radius === whiteFader1M
            if (eventData.note == whiteFader1M){
                falloffRadius1 = lerp (0,127,0.001,1,eventData.velocity);
                props = {falloffRadius: falloffRadius1};
                lights.forEach(function(light) {Entities.editEntity(light, props)});
            }

        // Light exponent === whiteFader2M
            if (eventData.note == whiteFader2M){
                exponent1 = lerp (0,127,0.001,20,eventData.velocity);
                props = {exponent: exponent1};
                lights.forEach(function(light) {Entities.editEntity(light, props)});
            }

        // Light cutoff === whiteFader3M
            if (eventData.note == whiteFader3M){
                cutoff1 = lerp (0,127,0,100,eventData.velocity);
                props = {cutoff: cutoff1};
                lights.forEach(function(light) {Entities.editEntity(light, props)});
            }

        // Light Red === redFaderB
            if (eventData.note == redFaderB){
                red1 = lerp (0,127,0,255,eventData.velocity);
                props = {color: {red: red1, green: green1, blue: blue1}};
                lights.forEach(function(light) {Entities.editEntity(light, props)});
            }

        // Light green === greenFaderA
            if (eventData.note == greenFaderA){
                green1 = lerp (0,127,0,255,eventData.velocity);
                props = {color: {red: red1, green: green1, blue: blue1}};
                lights.forEach(function(light) {Entities.editEntity(light, props)});
            }

        // Lightblue === aquaFaderC
            if (eventData.note == aquaFaderC){
                blue1 = lerp (0,127,0,255,eventData.velocity);
                props = {color: {red: red1, green: green1, blue: blue1}};
                lights.forEach(function(light) {Entities.editEntity(light, props)});
            }

        // Light Intensity  === whiteFader4M
            if (eventData.note == whiteFader4M){
                intensity1 = lerp (0,127,-50,500,eventData.velocity);
                props = {intensity: intensity1};
                lights.forEach(function(light) {Entities.editEntity(light, props)});
                Entities.editEntity(box1, props);
            }

        // Center Light === whiteHorizontalFader
            if (eventData.note == whiteHorizontalFader){
                intensity2 = lerp (0,127,-1000,1000,eventData.velocity);
                props = {intensity: intensity2};
                Entities.editEntity(light0, props);
            }

        // Center Light Red === aquaFaderC
            if (eventData.note == aquaFaderC){
                red2 = lerp (0,127,0,255,eventData.velocity);
                props = {color: {red: red2, green: green2, blue: blue2}};
                Entities.editEntity(light0,props);
                Entities.editEntity(sphere1, props);
            }

        // Center Light green === redFaderB
            if (eventData.note == redFaderB){
                green2 = lerp (0,127,0,255,eventData.velocity);
                props = {color: {red: red2, green: green2, blue: blue2}};
                Entities.editEntity(light0, props);
                Entities.editEntity(sphere1, props);
            }


        // Center Light blue === greenFaderA
            if (eventData.note == greenFaderA){
                blue2 = lerp (0,127,0,255,eventData.velocity);
                props = {color: {red: red2, green: green2, blue: blue2}};
                Entities.editEntity(light0, props);
                Entities.editEntity(sphere1, props);
            }

        // ColorControl1 === yellowFaderD
            if (eventData.note == yellowFaderD){
                red3   = Math.sin(frequency*eventData.velocity + 0) * 127 + 128;
                green3 = Math.sin(frequency*eventData.velocity + 2*Math.PI/3) * 127 + 128;
                blue3  = Math.sin(frequency*eventData.velocity + 4*Math.PI/3) * 127 + 128;
                props = {color: {red: red3, green: green3, blue: blue3}};
                lights.forEach(function(light) {Entities.editEntity(light, props)});
                Entities.editEntity(box1, props);
            }
    }


// Midi
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
        listMidiInputs();
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
// Misc Setup
    midiConfig();
    lightSource();

    Midi.midiReset.connect(midiHardwareResetReceieved);
    Midi.midiMessage.connect(midiEventReceived);
    Script.scriptEnding.connect(scriptEnding);
