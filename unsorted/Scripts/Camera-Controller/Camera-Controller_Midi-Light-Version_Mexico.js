(function() {

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

    red1 = 50;
    green1 = 50;
    blue1 = 50;

    // Entity Vars
    var light, light0, box1, sphere1;

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



    var handiness = 'both'; // left, right or both
    var particleFingers = ['HandPinky3', 'HandRing3', 'HandIndex3', 'HandThumb3', 'HandMiddle3'];

    var lights = [];
    var PARICLE_NAME_BASE = 'spawnedFingerParticle'

    var lights = [];

    // what the actual particles look like
    var lightProps = {
        parentID: MyAvatar.sessionUUID,
        name: "Spot Light Emitter",
        description: "",
        type: "Light",
        dimensions: {
            x: 10,
            y: 10,
            z: 10
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
    };

    function lerp(InputLow, InputHigh, OutputLow, OutputHigh, Input) {
        return ((Input - InputLow) / (InputHigh - InputLow)) * (OutputHigh - OutputLow) + OutputLow;
    }

    var particleOn = false;

    function createParticleAtFinger(jointName, handPrefix) {
        console.log("###addParticlesForHand");
        var position;
        var jointID = MyAvatar.jointNames.indexOf(jointName);
        console.log("jointID", jointID);
        lightProps.name = PARICLE_NAME_BASE + jointName;
        lightProps.parentJointIndex = jointID;
        position = MyAvatar.getJointPosition(jointName);
        lightProps.position = position;
        lightProps.isSpotlight = 1;
        if (handPrefix === "Left") {
            lightProps.rotation = Quat.fromPitchYawRollDegrees(180, 0, 0);
        } else {
            lightProps.rotation = Quat.fromPitchYawRollDegrees(180, 0, 0);
        }

        console.log("position", position);
        return Entities.addEntity(lightProps);
    }

    function addParticlesForHand(handPrefix) {
        console.log("###addParticlesForHand");
        for (var i = 0; i < particleFingers.length; i++) {
            lights.push(createParticleAtFinger(handPrefix + particleFingers[i], handPrefix));
            print(handPrefix + particleFingers[i]);
        }
    }

    function removeFingerParticles() {
        console.log("removing Finger Particles")
        for (var i = 0; i < lights.length; i++) {
            // Fixes a crash on shutdown:
            // Entities.editEntity(particleEntities[i], { parentID: '' });
            Entities.deleteEntity(lights[i]);
        }
    }

    Script.scriptEnding.connect(function() {
        removeFingerParticles();
    });

    var cameraNames = ["_Camera:1", "_Camera:2", "_Camera:3"];
    var cameraNameMap = {
        _Camera1: "",
        _Camera2: "",
        _Camera3: ""
    };

    var djLocationCenter = { x: 430.371, y: 501.844, z: 494.526 };
    var djLocationRight = { x: 430.037, y: 503.258, z: 497.882 };
    var djLocationLeft = { x: 431.236, y: 503.898, z: 490.797 };

    Entities.findEntities(MyAvatar.position, 1000).forEach(function(entity) {
        var props = getProps(entity);
        cameraNames.forEach(function(cameraName) {
            if (props.name === cameraName) {
                console.log("Found Camera");
                var newCamerName = cameraName.replace(":", "");
                cameraNameMap[newCamerName] = props.id;
            }
        })
    });

    function switchCamera(entityID) {
        console.log("entityID", entityID);
        Camera.mode = "entity";
        Camera.setCameraEntity(entityID);
    };

    function log(describer, text) {
        text = text || '';
        print('&======');
        print(describer + ": ");
        print(JSON.stringify(text));
        print('======&');
    }

    function randomize(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getProps(id) {
        var props = {};
        props = Entities.getEntityProperties(id);
        return props;
    }

    var MAPPING_NAME = "DJ_Helper";

    var mapping = Controller.newMapping(MAPPING_NAME);

    mapping.from(Controller.Hardware.Keyboard[4]).to(function(value) {
        print(value);
        console.log("pressed 4")
        switchCamera(cameraNameMap._Camera1);
    });

    mapping.from(Controller.Hardware.Keyboard[5]).to(function(value) {
        print(value);
        console.log("pressed 5")

        switchCamera(cameraNameMap._Camera2);
    });

    mapping.from(Controller.Hardware.Keyboard[6]).to(function(value) {
        print(value);
        console.log("pressed 6")

        switchCamera(cameraNameMap._Camera3);
    });

    mapping.from(Controller.Hardware.Keyboard[7]).to(function(value) {
        print(value);
        console.log("pressed 7")

        MyAvatar.position = djLocationLeft
    });

    mapping.from(Controller.Hardware.Keyboard[8]).to(function(value) {
        print(value);
        console.log("pressed 8")

        MyAvatar.position = djLocationCenter
    });

    mapping.from(Controller.Hardware.Keyboard[9]).to(function(value) {
        print(value);
        console.log("pressed 9")

        MyAvatar.position = djLocationRight
    });

    mapping.from(Controller.Hardware.Keyboard["U"]).to(function(value) {
        print(value);
        console.log("pressed u")

        if (particleOn) {
            if (handiness === "both" || handiness === "left") {
                addParticlesForHand("Left");
            }
            if (handiness === "both" || handiness === "right") {
                addParticlesForHand("Right");
            }
        } else {
            removeFingerParticles();
        }
        particleOn = !particleOn


    });

    mapping.from(Controller.Hardware.Keyboard[8]).to(function(value) {
        print(value);
        console.log("pressed 8")

    });

    mapping.from(Controller.Hardware.Keyboard[9]).to(function(value) {
        print(value);
        console.log("pressed 9")

    });

    Controller.enableMapping(MAPPING_NAME);


    // Midi Events
    function midiEventReceived(eventData) {
        // log("Event:", eventData);
        // Light Speed === greenKnobA
        // if (eventData.note == greenKnobA){
        //     speed1 = eventData.velocity/2;
        // }

        // Light Pitch === redKnobB
        // if (eventData.note == redKnobB){
        //     pitch1 = lerp (0,127,0,speed1,eventData.velocity)-speed1/2;
        //     Entities.editEntity(box1,{
        //         angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
        //     })
        // }

        // Light Yaw === aquaKnobC
        // if (eventData.note == aquaKnobC){
        //     yaw1 = lerp (0,127,0,speed1,eventData.velocity)-speed1/2;
        //     Entities.editEntity(box1,{
        //         angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
        //     })
        // }

        // Light Roll === yellowKnobD
        // if (eventData.note == yellowKnobD){
        //     roll1 = lerp (0,127,0,speed1,eventData.velocity) -speed1/2;
        //     Entities.editEntity(box1,{
        //         angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
        //     })
        // }

        // Light Fall Off Radius === whiteFader1M
        if (eventData.note == whiteFader1M) {
            console.log("WhiteFader one called")
            falloffRadius1 = lerp(0, 127, 0.001, 1, eventData.velocity);
            props = { falloffRadius: falloffRadius1 };
            lights.forEach(function(light) { Entities.editEntity(light, props) });
        }

        // Light exponent === whiteFader2M
        if (eventData.note == whiteFader2M) {
            exponent1 = lerp(0, 127, 0.001, 20, eventData.velocity);
            props = { exponent: exponent1 };
            lights.forEach(function(light) { Entities.editEntity(light, props) });
        }

        // Light cutoff === whiteFader3M
        if (eventData.note == whiteFader3M) {
            cutoff1 = lerp(0, 127, 0, 100, eventData.velocity);
            props = { cutoff: cutoff1 };
            lights.forEach(function(light) { Entities.editEntity(light, props) });
        }

        // Light Red === redFaderB
        if (eventData.note == redFaderB) {
            console.log("redFaderB one called")
            red1 = lerp(0, 127, 0, 255, eventData.velocity);
            props = { color: { red: red1, green: green1, blue: blue1 } };
            console.log("RED PROPS: ", JSON.stringify(props));
            lights.forEach(function(light) { Entities.editEntity(light, props) });
        }

        // Light green === greenFaderA
        if (eventData.note == greenFaderA) {
            green1 = lerp(0, 127, 0, 255, eventData.velocity);
            props = { color: { red: red1, green: green1, blue: blue1 } };
            lights.forEach(function(light) { Entities.editEntity(light, props) });
        }

        // Lightblue === aquaFaderC
        if (eventData.note == aquaFaderC) {
            blue1 = lerp(0, 127, 0, 255, eventData.velocity);
            props = { color: { red: red1, green: green1, blue: blue1 } };
            lights.forEach(function(light) { Entities.editEntity(light, props) });
        }

        // Light Intensity  === whiteFader4M
        if (eventData.note == whiteFader4M) {
            intensity1 = lerp(0, 127, -50, 500, eventData.velocity);
            props = { intensity: intensity1 };
            lights.forEach(function(light) { Entities.editEntity(light, props) });
            Entities.editEntity(box1, props);
        }

        // Center Light === whiteHorizontalFader
        // if (eventData.note == whiteHorizontalFader){
        //     intensity2 = lerp (0,127,-1000,1000,eventData.velocity);
        //     props = {intensity: intensity2};
        //     Entities.editEntity(light0, props);
        // }

        // Center Light Red === aquaFaderC
        if (eventData.note == aquaFaderC) {
            red2 = lerp(0, 127, 0, 255, eventData.velocity);
            props = { color: { red: red2, green: green2, blue: blue2 } };
            // Entities.editEntity(light0,props);
            // Entities.editEntity(sphere1, props);
        }

        // Center Light green === redFaderB
        if (eventData.note == redFaderB) {
            green2 = lerp(0, 127, 0, 255, eventData.velocity);
            props = { color: { red: red2, green: green2, blue: blue2 } };
            // Entities.editEntity(light0, props);
            // Entities.editEntity(sphere1, props);
        }


        // Center Light blue === greenFaderA
        if (eventData.note == greenFaderA) {
            blue2 = lerp(0, 127, 0, 255, eventData.velocity);
            props = { color: { red: red2, green: green2, blue: blue2 } };
            // Entities.editEntity(light0, props);
            // Entities.editEntity(sphere1, props);
        }

        // ColorControl1 === yellowFaderD
        if (eventData.note == yellowFaderD) {
            red3 = Math.sin(frequency * eventData.velocity + 0) * 127 + 128;
            green3 = Math.sin(frequency * eventData.velocity + 2 * Math.PI / 3) * 127 + 128;
            blue3 = Math.sin(frequency * eventData.velocity + 4 * Math.PI / 3) * 127 + 128;
            props = { color: { red: red3, green: green3, blue: blue3 } };
            lights.forEach(function(light) { Entities.editEntity(light, props) });
            // Entities.editEntity(box1, props);
        }
    }


    // Midi
    function getMidiInputs() {
        var midiInDevices = Midi.listMidiDevices(INPUT);
        midiInDeviceList = midiInDevices;
    }

    function getMidiOutputs() {
        var midiOutDevices = Midi.listMidiDevices(OUTPUT);
        midiOutDeviceList = midiOutDevices;
    }

    function getMidiDeviceIds() {
        for (var i = 0; i < midiInDeviceList.length; i++) {
            if (midiInDeviceList[i] == midiInDevice) {
                midiInDeviceId = i;
            }
        }
        for (var i = 0; i < midiOutDeviceList.length; i++) {
            if (midiOutDeviceList[i] == midiOutDevice) {
                midiOutDeviceId = i + 1;
            }
        }
    }

    // List Midi Input Devices
    function listMidiInputs() {
        print("Input Devices:");
        for (var i = 0; i < midiInDeviceList.length; i++) {
            print("(" + i + ") " + midiInDeviceList[i]);
        };
    }

    // List Midi ouput Devices
    function listMidiOutputs() {
        print("Output Devices:");
        for (var i = 0; i < midiOutDeviceList.length; i++) {
            print("(" + (i + 1) + ") " + midiOutDeviceList[i]); // Get rid of MS wavetable synth
        };
    }

    function midiHardwareResetReceieved() {
        getMidiInputs();
        getMidiOutputs();
        getMidiDeviceIds();
        unblockMidiDevice();
        listMidiInputs();
    }

    function unblockMidiDevice() {
        Midi.unblockMidiDevice(midiOutDevice, OUTPUT);
        Midi.unblockMidiDevice(midiInDevice, INPUT);
    }

    function midiConfig() {
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

    midiConfig();
    Midi.midiReset.connect(midiHardwareResetReceieved);
    Midi.midiMessage.connect(midiEventReceived);

    var messageChannel = "Avatar-Midi";
    Messages.subscribe(messageChannel);

    function onMessageReceived(channel, message, sender) {
        if (!channel === messageChannel) {
            return;
        }
        // console.log("message", message);     
        var message = JSON.parse(message);
        var eventData = message.event;
        switch (message.type) {
            case whiteFader1M:
                // console.log("whiteFader1M  one called")            
                // console.log("whiteFader1M  one called")           
                falloffRadius1 = lerp(0, 127, 0.001, 1, eventData.velocity);
                props = { falloffRadius: falloffRadius1 };
                lights.forEach(function(light) { Entities.editEntity(light, props) });
                break;
            case whiteFader2M:
                // console.log("whiteFader2M  one called")            

                exponent1 = lerp(0, 127, 0.001, 20, eventData.velocity);
                props = { exponent: exponent1 };
                lights.forEach(function(light) { Entities.editEntity(light, props) });
                break;
            case whiteFader3M:
                cutoff1 = lerp(0, 127, 0, 100, eventData.velocity);
                props = { cutoff: cutoff1 };
                lights.forEach(function(light) { Entities.editEntity(light, props) });
                break;
            case redFaderB:
                console.log("redFaderB one called")
                red1 = lerp(0, 127, 0, 255, eventData.velocity);
                props = { color: { red: red1, green: green1, blue: blue1 } };
                console.log("RED PROPS: ", JSON.stringify(props));
                lights.forEach(function(light) { Entities.editEntity(light, props) });
                break;
            case greenFaderA:
                blue1 = lerp(0, 127, 0, 255, eventData.velocity);

                props = { color: { red: red1, green: green1, blue: blue1 } };
                lights.forEach(function(light) { Entities.editEntity(light, props) });
                break;
            case aquaFaderC:
                green1 = lerp(0, 127, 0, 255, eventData.velocity);

                props = { color: { red: red1, green: green1, blue: blue1 } };
                lights.forEach(function(light) { Entities.editEntity(light, props) });
                break;
            case whiteFader4M:
                intensity1 = lerp(0, 127, -50, 500, eventData.velocity);
                props = { intensity: intensity1 };
                lights.forEach(function(light) { Entities.editEntity(light, props) });
                Entities.editEntity(box1, props);
                break;
            case aquaFaderC:
                green2 = lerp(0, 127, 0, 255, eventData.velocity);

                props = { color: { red: red2, green: green2, blue: blue2 } };
                break;
            case redFaderB:
                red2 = lerp(0, 127, 0, 255, eventData.velocity);

                props = { color: { red: red2, green: green2, blue: blue2 } };
                break;
            case greenFaderA:
                blue2 = lerp(0, 127, 0, 255, eventData.velocity);
                props = { color: { red: red2, green: green2, blue: blue2 } };
                break;
            case yellowFaderD:
                blue3 = Math.sin(frequency * eventData.velocity + 0) * 127 + 128;
                green3 = Math.sin(frequency * eventData.velocity + 2 * Math.PI / 3) * 127 + 128;
                red3 = Math.sin(frequency * eventData.velocity + 4 * Math.PI / 3) * 127 + 128;
                props = { color: { red: red3, green: green3, blue: blue3 } };
                lights.forEach(function(light) { Entities.editEntity(light, props) });
                break;
            default:
        }
    }

    Messages.messageReceived.connect(onMessageReceived);

    Script.scriptEnding.connect(function() {
        Controller.disableMapping(MAPPING_NAME);
        Messages.messageReceived.disconnect(onMessageReceived);
    })
}());