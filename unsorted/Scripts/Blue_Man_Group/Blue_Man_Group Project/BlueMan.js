// Util

    if (typeof Object.assign != 'function') {
        // Must be writable: true, enumerable: false, configurable: true
        Object.defineProperty(Object, "assign", {
            value: function assign(target, varArgs) { // .length of function is 2
                'use strict';
                if (target == null) { // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) { // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            },
            writable: true,
            configurable: true
        });
    }

    function log(describer, obj) {
        obj = obj || '';
        print('&======');
        print(describer + ":" + JSON.stringify(obj));
    }

    function randomize(min, max) {
        return Math.random() * (max - min) + min;
    }

    function lerp(InputLow, InputHigh, OutputLow, OutputHigh, Input) {
        return ((Input - InputLow) / (InputHigh - InputLow)) * (OutputHigh - OutputLow) + OutputLow;
    }

// Controls

    var midiStarted = false;
    var interval = 5000;
    var numberOfDifferent = 58;
    var changeTimer;

    var particleID;
    var emitOrientationX;
    var emitOrientationY;
    var emitOrientationZ;
    var timeScale = .00001;
    var frequency = 0.001;
    var wantLocal = true;

    var pos = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, { x: 0, y: 1, z: 0 }));

    var controlMap = [
        // returns true if particles are being emitted.
        { control: 01, controlName: "isEmitting", controlCurrent: 0, controlMin: 0.01, ControlMax: 1 },//Button T/F
        { control: 02, controlName: "emitterShouldTrail", controlCurrent: 0, controlMin: 0.01, ControlMax: 0 },//Button T/F
        { control: 03, controlName: "lifespan", controlCurrent: 0, controlMin: 0.01, ControlMax: 10 },// 0-10
        { control: 04, controlName: "maxParticles", controlCurrent: 0, controlMin: 0.01, ControlMax: 10000 },//0-10000
        { control: 05, controlName: "emitRate", controlCurrent: 0, controlMin: 0.01, ControlMax: 500 },//Not Mutch Effect
        { control: 01, controlName: "emitSpeed", controlCurrent: 0, controlMin: 0.01, ControlMax: 100 },
        { control: 02, controlName: "speedSpread", controlCurrent: 0, controlMin: 0.01, ControlMax: 10 },
        { control: 03, controlName: "colorStart.red", controlCurrent: 0, controlMin: 0.01, ControlMax: 255 },
        { control: 04, controlName: "colorStart.green", controlCurrent: 0, controlMin: 0.01, ControlMax: 255 },
        { control: 05, controlName: "colorStart.blue", controlCurrent: 0, controlMin: 0.01, ControlMax: 255 },
        { control: 01, controlName: "color.red", controlCurrent: 0, controlMin: 0.01, ControlMax: 255 },
        { control: 02, controlName: "color.green", controlCurrent: 0, controlMin: 0.01, ControlMax: 255 },
        { control: 03, controlName: "color.blue", controlCurrent: 0, controlMin: 0.01, ControlMax: 255 },
        { control: 04, controlName: "colorFinish.red", controlCurrent: 0, controlMin: 0.01, ControlMax: 255 },
        { control: 05, controlName: "colorFinish.green", controlCurrent: 0, controlMin: 0.01, ControlMax: 255 },
        { control: 01, controlName: "colorFinish.blue", controlCurrent: 0, controlMin: 0.01, ControlMax: 255 },
        { control: 02, controlName: "colorSpread.red", controlCurrent: 0, controlMin: 0.01, ControlMax: 255 },
        { control: 03, controlName: "colorSpread.green", controlCurrent: 0, controlMin: 0.01, ControlMax: 255 },
        { control: 04, controlName: "colorSpread.blue", controlCurrent: 0, controlMin: 0.01, ControlMax: 255 },
        { control: 05, controlName: "emitDimensions.x", controlCurrent: 0, controlMin: -20, ControlMax: 20 },//Not Mutch Effect	
        { control: 01, controlName: "emitDimensions.y", controlCurrent: 0, controlMin: -20, ControlMax: 20 },//Not Mutch Effect	
        { control: 02, controlName: "emitDimensions.z", controlCurrent: 0, controlMin: -20, ControlMax: 20 },//Most effect
        { control: 03, controlName: "emitAcceleration.x", controlCurrent: 0, controlMin: 0.01, ControlMax: 10 },
        { control: 04, controlName: "emitAcceleration.y", controlCurrent: 0, controlMin: 0.01, ControlMax: 10 },
        { control: 05, controlName: "emitAcceleration.z", controlCurrent: 0, controlMin: 0.01, ControlMax: 10 },
        { control: 01, controlName: "accelerationSpread.x", controlCurrent: 0, controlMin: 0.01, ControlMax: 10 },
        { control: 02, controlName: "accelerationSpread.y", controlCurrent: 0, controlMin: 0.01, ControlMax: 10 },
        { control: 03, controlName: "accelerationSpread.z", controlCurrent: 0, controlMin: 0.01, ControlMax: 10 },
        { control: 04, controlName: "radiusStart", controlCurrent: 0, controlMin: 0.01, ControlMax: 2 },//Most Effect
        { control: 05, controlName: "particleRadius", controlCurrent: 0, controlMin: 0.01, ControlMax: 2 },//Not Mutch Effect	
        { control: 01, controlName: "radiusFinish", controlCurrent: 0, controlMin: 0.01, ControlMax: 2 },//Not Mutch Effect	
        { control: 02, controlName: "radiusSpread", controlCurrent: 0, controlMin: 0.01, ControlMax: 2 },//Not Mutch Effect	
        { control: 03, controlName: "alphaStart", controlCurrent: 0, controlMin: 0.01, ControlMax: 1 },
        { control: 04, controlName: "alpha", controlCurrent: 0, controlMin: 0.01, ControlMax: 1 },
        { control: 05, controlName: "alphaFinish", controlCurrent: 0, controlMin: 0.01, ControlMax: 1 },
        { control: 01, controlName: "alphaSpread", controlCurrent: 0, controlMin: 0.01, ControlMax: 1 },
        { control: 02, controlName: "emitOrientation.x", controlCurrent: 0, controlMin: -180, ControlMax: 180 },
        { control: 03, controlName: "emitOrientation.y", controlCurrent: 0, controlMin: -180, ControlMax: 180 },
        { control: 04, controlName: "emitOrientation.z", controlCurrent: 0, controlMin: -180, ControlMax: 180 },
        { control: 05, controlName: "polarStart", controlCurrent: 0, controlMin: 0.01, ControlMax: -Math.PI },
        { control: 01, controlName: "polarFinish", controlCurrent: 0, controlMin: 0.01, ControlMax: Math.PI },
        { control: 02, controlName: "azimuthStart", controlCurrent: 0, controlMin: 0.01, ControlMax: -Math.PI },
        { control: 03, controlName: "azimuthFinish", controlCurrent: 0, controlMin: 0.01, ControlMax: Math.PI },
        { control: 04, controlName: "textures", controlCurrent: "https://content.highfidelity.com/DomainContent/production/Particles/wispy-smoke.png", controlMin: 0.01, ControlMax: 0.01 },
        { control: 45, controlName: "textures", controlCurrent: "https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/fire.jpg", controlMin: 0.01, ControlMax: 0.01 },
        { control: 46, controlName: "textures", controlCurrent: "https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/rain.png", controlMin: 0.01, ControlMax: 0.01 },
        { control: 50, controlName: "textures", controlCurrent: "https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/sand3.png", controlMin: 0.01, ControlMax: 0.01 },
        { control: 50, controlName: "textures", controlCurrent: "https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/air.png", controlMin: 0.01, ControlMax: 0.01 },
        { control: 50, controlName: "textures", controlCurrent: "https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/snow.jpg", controlMin: 0.01, ControlMax: 0.01 },
        { control: 50, controlName: "textures", controlCurrent: "https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/rainbows.png", controlMin: 0.01, ControlMax: 0.01 },
        { control: 50, controlName: "textures", controlCurrent: "https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/lightning.jpg", controlMin: 0.01, ControlMax: 0.01 },
        { control: 50, controlName: "textures", controlCurrent: "https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/hearts_v2.png", controlMin: 0.01, ControlMax: 0.01 },
        { control: 50, controlName: "textures", controlCurrent: "http://hifi-content.s3.amazonaws.com/alan/dev/Particles/Bokeh-Particle.png", controlMin: 0.01, ControlMax: 0.01 },
        { control: 50, controlName: "textures", controlCurrent: "https://brainstormer.keybase.pub/High%20Fidelity/Particles/phlash.png", controlMin: 0.01, ControlMax: 0.01 },
        { control: 50, controlName: "textures", controlCurrent: "https://brainstormer.keybase.pub/High%20Fidelity/Particles/Media_Militia_Particles001.png", controlMin: 0.01, ControlMax: 0.01 },
        { control: 50, controlName: "textures", controlCurrent: "https://brainstormer.keybase.pub/High%20Fidelity/Particles/Media_Militia_Particles002.png", controlMin: 0.01, ControlMax: 0.01 },
        { control: 50, controlName: "textures", controlCurrent: "https://brainstormer.keybase.pub/High%20Fidelity/Particles/Media_Militia_Particles003.png", controlMin: 0.01, ControlMax: 0.01 },
        { control: 50, controlName: "textures", controlCurrent: "https://brainstormer.keybase.pub/High%20Fidelity/Particles/Media_Militia_Particles004.png", controlMin: 0.01, ControlMax: 0.01 },
        { control: 50, controlName: "textures", controlCurrent: "https://brainstormer.keybase.pub/High%20Fidelity/Particles/Media_Militia_Particles005.png", controlMin: 0.01, ControlMax: 0.01 },
    ];

    var posMap = {
        posFront: { x: -4, y: -2, z: 4 },
        posFront2: { x: -3, y: -1, z: 3 },
        posBack: { x: -2, y: 0, z: 2 },
        posBack2: { x: -1, y: 1, z: 1 },
        posLeft: { x: 0, y: 2, z: 0 },
        posLeft2: { x: 1, y: 3, z: 1 },
        posRight: { x: 2, y: 2, z: 2 },
        posRight2: { x: 3, y: 1, z: 3 },
        posUp: { x: 4, y: 0, z: 4 },
        posU2: { x: 5, y: 1, z: 5 },
    };

    var textureArray = [
        "https://content.highfidelity.com/DomainContent/production/Particles/wispy-smoke.png",
        "https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/fire.jpg",
        "https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/rain.png",
        "https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/sand3.png",
        "https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/air.png",
        "https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/snow.jpg",
        "https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/rainbows.png",
        "https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/lightning.jpg",
        "https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/hearts_v2.png",
        "http://hifi-content.s3.amazonaws.com/alan/dev/Particles/Bokeh-Particle.png",
        "https://brainstormer.keybase.pub/High%20Fidelity/Particles/phlash.png",
        "https://brainstormer.keybase.pub/High%20Fidelity/Particles/Media_Militia_Particles001.png",
        "https://brainstormer.keybase.pub/High%20Fidelity/Particles/Media_Militia_Particles002.png",
        "https://brainstormer.keybase.pub/High%20Fidelity/Particles/Media_Militia_Particles003.png",
        "https://brainstormer.keybase.pub/High%20Fidelity/Particles/Media_Militia_Particles004.png",
        "https://brainstormer.keybase.pub/High%20Fidelity/Particles/Media_Militia_Particles005.png",
    ]

    var particleArray = [];

    function changeTimerHandler(){
        if (numberOfDifferent > 1) {
            numberOfDifferent--;
        }
        newControlNumbers();
    }

    function newControlNumbers(){
        for (var i = 0, x = 0; i < controlMap.length; i++, x++){
            if ( x < numberOfDifferent ) {
                x = 1;
                
            }
            controlMap[i].control = x;
        }
        
    }

    var baseProps = {
        name: "The Particle",
        description: "",
        type: "ParticleEffect",
        textures: "https://content.highfidelity.com/DomainContent/production/Particles/wispy-smoke.png",
        position: pos,
        additiveBlending: true,
        dynamic: true,
        angularDamping: 0,
        friction: 0,
        collisionless: true,
        accelerationSpread: {
            x: 0.5,
            y: 2,
            z: 0.5
        },
        color: {
            blue: 0,
            green: 0,
            red: 0
        },
        colorFinish: {
            blue: 0,
            green: 0,
            red: 0
        },
        colorStart: {
            blue: 0,
            green: 0,
            red: 0
        },
        dimensions: {
            x: 2,
            y: 2,
            z: 2.
        },
        emitAcceleration: {
            x: -0.5,
            y: 2.5,
            z: -0.5
        },
        emitOrientation: {
            w: 0.7070915699005127,
            x: -0.7071220278739929,
            y: -1.5258869098033756e-05,
            z: -1.5258869098033756e-05
        },
        emitterShouldTrail: true,
        emitRate: 20,
        lifespan: 0.1,
        maxParticles: 20,
        particleRadius: 0.25,
        radiusFinish: 0.25,
        radiusStart: 0.25,
        rotation: {
            w: 0.7630274295806885,
            x: -1.52587890625e-05,
            y: -0.6463874578475952,
            z: -1.52587890625e-05
        }
    }

// Functions

    function buildParticle() {
        print("Creating Particle");
        Object.keys(posMap).forEach(function (posItem) {
            var pos = posMap[posItem];
            //    print("texture array", JSON.stringify(textureArray));
            //    var randomTexturePosition =
            var newProps = {
                position: Vec3.sum(baseProps.position, pos),
                textures: textureArray[Math.floor(randomize(0, textureArray.length))],
                color: {
                    red: Math.floor(randomize(0, 255)),
                    green: Math.floor(randomize(0, 255)),
                    blue: Math.floor(randomize(0, 255)),
                }
            }
            print(JSON.stringify(newProps));
            var finalProps = Object.assign({}, baseProps, newProps);
            var newIdToPush = Entities.addEntity(finalProps);
            print("new Id", newIdToPush)
            particleArray.push(newIdToPush);
        })
    }

    function updateEntityProperty(entityID, path, value) {
        var source = Entities.getEntityProperties(entityID);
        //var source = DUMMY_PROPS;
        var kv = path.split('.'),
            property = kv[0],
            subProperty = kv[1];

        var updated = {};
        if (subProperty) { // if defined, we have a subproperty like color.red
            if (!(property in source)) {
                throw new Error('missing source property: ' + JSON.stringify({ path: path, property: property, subProperty: subProperty }));
            }
            updated[property] = source[property];
            updated[property][subProperty] = value;
        } else {
            updated[property] = value;
        }

        // console.log('Entities.editEntity :: ' + entityID, JSON.stringify(updated, 0, 2));
        Entities.editEntity(entityID, updated);
    }

    function controlMapUpdate(particleID, note, velocity) {
        controlMap.forEach(function (item) {
            var newNote = Math.floor(lerp(0, 127, 1, numberOfDifferent, Math.floor(randomize(1,note))));
            
            print("newNote", newNote);
            if (newNote == item.control) {
                if (typeof item.controlCurrent == "string") {
                    props = { textures: item.controlCurrent };
                    Entities.editEntity(particleID, props);
                    return;
                };
                item.controlCurrent = lerp(0, 127, item.controlMin, item.ControlMax, velocity);
                if (item.controlName == "emitOrientation.x"
                    || item.controlName == "emitOrientation.y"
                    || item.controlName == "emitOrientation.z") {
                    if (item.controlName == "emitOrientation.x") { emitOrientationX = item.controlCurrent };
                    if (item.controlName == "emitOrientation.y") { emitOrientationY = item.controlCurrent };
                    if (item.controlName == "emitOrientation.z") { emitOrientationZ = item.controlCurrent };
                    //props = {angularVelocity:{x:emitOrientationX,y:emitOrientationY,z:emitOrientationZ}};
                    props = { emitOrientation: Quat.fromPitchYawRollDegrees(emitOrientationX, emitOrientationY, emitOrientationZ) };
                    // console.log('Entities.editEntity :: ' + particleID, JSON.stringify(props, 0, 2));
                    Entities.editEntity(particleID, props);
                    return;
                } else {
                    updateEntityProperty(particleID, item.controlName, item.controlCurrent);
                    return;
                }
            }
        })
    };

    function midiEventReceived(eventData) {
        if (!midiStarted) {
            changeTimer = Script.setInterval(changeTimerHandler, interval);
            midiStarted = true;
        }
        // log("eventData", eventData);

        for (var x = 1; x <= Object.keys(posMap).length; x++) {
            if (eventData.channel === x) {
                controlMapUpdate(particleArray[x], eventData.note, eventData.velocity)
            }
        }
    }

// Midi

    var config = config || {};
    var midiInDevice = config.midiInDevice;
    var midiOutDevice = config.midiOutDevice;
    var midiChannel = config.midiChannel;
    // var midiEventReceived = config.midiEventReceived;
    var midiInDeviceId = -1;
    var midiOutDeviceId = -1;
    var midiInDeviceList = [];
    var midiOutDeviceList = [];
    const INPUT = false;
    const OUTPUT = true;
    const ENABLE = true;
    const DISABLE = false;

    function midiHardwareResetReceieved() {
        seedMidiInputsList();
        seedMidiOutputsList();
        getMidiDeviceIds();
        unblockMidiDevice();
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

    function seedMidiInputsList() {
        var midiInDevices = Midi.listMidiDevices(INPUT);
        midiInDeviceList = midiInDevices;
    }

    function seedMidiOutputsList() {
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

    function getMidiInputs() {
        if (midiInDeviceList.length === 0) {
            seedMidiInputsList();
        }
        return midiInDeviceList;
    }

    function getMidiOutputs() {
        if (midiOutDeviceList.length === 0) {
            seedMidiOutputsList();
        }
        return midiOutDeviceList;
    }

    function registerMidiEventREceived(newMidiEventReceived) {
        midi.midiMessage.disconnect(midiEventReceived);
        Midi.midiMessage.connect(newMidiEventReceived);
    }

    function registerNewConfig(newConfig) {
        config = newConfig;
    }

    function midiSetup() {
        midiConfig();
        Midi.midiReset.connect(midiHardwareResetReceieved);
        Midi.midiMessage.connect(midiEventReceived);
    }

    function tearDown() {
        Midi.midiReset.disconnect(midiHardwareResetReceived);
        Midi.midiMessage.disconnect(midiEventReceived);
    }

    midiSetup();

    changeTimerHandler();

    buildParticle();

    // var timer = Script.setInterval(function() {
    //     //var props = {position: Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, {x: 0, y: 1, z: 0.0}))};
    //     var headPosition = MyAvatar.getHeadPosition();
    // 	var props = {position: Vec3.sum(headPosition,{x: 0, y: 0, z: 0.0})};
    // 	Entities.editEntity(particleID, props);
    // }, frequency * 1000);

// Clean up
    
    function scriptEnding() {
        // Script.clearInterval(timer);

            particleArray.forEach(function (particleID) {
                Entities.deleteEntity(particleID);
            })
            Script.clearInterval(changeTimer);
            changetimer = null;
        }

    Script.scriptEnding.connect(scriptEnding);




/* Storage

if (eventData.channel === 1) {
            controlMapUpdate(particleArray[0], eventData.note, eventData.velocity);
        }
        if (eventData.channel === 2) {
            controlMapUpdate(particleArray[1], eventData.note, eventData.velocity);
        }
        if (eventData.channel === 3) {
            controlMapUpdate(particleArray[2], eventData.note, eventData.velocity);
        }
        if (eventData.channel === 4) {
            controlMapUpdate(particleArray[3], eventData.note, eventData.velocity);
        }
        if (eventData.channel === 5) {
            controlMapUpdate(particleArray[4], eventData.note, eventData.velocity);
        }
        if (eventData.channel === 6) {
            controlMapUpdate(particleArray[5], eventData.note, eventData.velocity);
        }
        if (eventData.channel === 7) {
            controlMapUpdate(particleArray[6], eventData.note, eventData.velocity);
        }
        if (eventData.channel === 8) {
            controlMapUpdate(particleArray[7], eventData.note, eventData.velocity);
        }
        if (eventData.channel === 9) {
            controlMapUpdate(particleArray[8], eventData.note, eventData.velocity);
        }
        if (eventData.channel === 10) {
            controlMapUpdate(particleArray[9], eventData.note, eventData.velocity);
        }
        
*/