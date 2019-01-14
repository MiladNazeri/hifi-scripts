// Eslint
    /* eslint-disable indent */
// Polyfill
    if (typeof Object.assign !== 'function') {
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
// Init

    // Motion vars

    var speed1, pitch1, yaw1, roll1;

    // General Light vars

    var red1, red2, red3, green1, green2, green3, blue1, blue2, blue3, intensity1, intensity2, falloffRadius1; 

    // Spotlight vars

    var cutoff1, exponent1;

    // Particle Variables

    var emitRate;

    // Entity Vars

    var light, light0, box1, sphere1, particle1;

    // Settings

    var MSG_MIN; 
    var MSG_MAX;

    
    // Trackers

    var deltaTotal = 0;

    // Messaging 

    var messageChannel = "Avatar-Listener";
    Messages.subscribe(messageChannel)
    Messages.messageReceived.connect(onMessageReceived);

// Collections
    var colorArray = [
        "redControl1",
        "greenControl1",
        "blueControl1",
        "redControl2",
        "greenControl2",
        "blueControl2"
    ];
    var controlArray = [];
    var controlBoxes = {
        speedControl: 1,
        pitchControl: 1,
        yawControl: 1,
        rollControl: 1,
        fallOffRadiusControl: 1,
        exponentControl: 1,
        cutOffControl: 1,
        intensityControl1: 1,
        intensityControl2: 1,
        redControl1: 1,
        greenControl1: 1,
        blueControl1: 1,
        redControl2: 1,
        greenControl2: 1,
        blueControl2: 1
    };
    var controlBoxesKeys = Object.keys(controlBoxes);
    var eventData = {
        note: "",
        velocity: 0
    };
    var lights = [];
    var lightProps = {};
    var lightQualityArray = [
        "fallOffRadiusControl",
        "exponentControl",
        "cutOffControl",
        "intensityControl1",
        "intensityControl2"
    ];
    var speedArray = [
        "speedControl",
        "pitchControl",
        "yawControl",
        "rollControl"
    ];
    var minMax = [
        [0.0005, 0.002],
        [0.001, 0.002],
        [0.0002, 0.0005],
        [0.00002, 0.00005],
        [0.00002, 0.005],
        [0.00002, 0.010],
        [0.002, 0.010],
        [0.002, 0.0005]
    ]

// Helper Functions

    function col(r, g, b) {
        var obj = {};
        obj.red = r;
        obj.green = g;
        obj.blue = b;
        return obj;
    }

    function lerp(InputLow, InputHigh, OutputLow, OutputHigh, Input) {
        return ((Input - InputLow) / (InputHigh - InputLow)) * (OutputHigh - OutputLow) + OutputLow;
    }
    
    function makeAllOneArray(){
        var array = zeroArray(controlBoxesKeys);
        array.map(function(index){
            index = 1;
        });
        return array;
    }
    
    function makeOneArray(number){
        var array = zeroArray(controlBoxesKeys);
        array[number] = 1;
        return array;
    }

    function makeRandomArray(number){
        var array = zeroArray(controlBoxesKeys);
        array.map(function(index){
            var rand = Math.ceil(Math.random()); 
            if (rand) {
                index = 1;
            }
        });
        return array;
    }

    function vec(x, y, z) {
        var obj = {};
        obj.x = x;
        obj.y = y;
        obj.z = z;
        return obj;
    }

    function zeroArray(array){
        return array.map(function(ndex) {
            return 0;
        });
    }

// Procedural Functions

    function lightSource() {
        print("Creating Spotlight");
        var pos = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, { x: -1, y: 1.2, z: -2 }));

        box1 = Entities.addEntity({
            visible: false,
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
            visible: false,
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

    function replaceControlsWithBox(arrayOfControls, controlID) {
        arrayOfControls.forEach(function(control) {
            controlBoxes[control] = controlID;
        });
    }

    function updateControlBoxes(index){
        var array = [makeOneArray(index), makeAllOneArray(), makeRandomArray()];
        var rand = Math.ceil(Math.random() * array.length-1);
        array = array[rand];
        var currIndex = 0;
        // console.log(JSON.stringify(array));
        for (var key in controlBoxes){
            controlBoxes[key] = array[currIndex];
            currIndex++;
        }
    }

// Constructor Functions

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

// Message Handlers
    function onEvent() {
        // Light Speed
        if (eventData.note == controlBoxes.speedControl) {
            var lerped = lerp(MSG_MIN, MSG_MAX, 0, 0.005, eventData.velocity);
            speed1 = lerped / 2;
            emitRate = lerped;
            Entities.editEntity(particle1, {
                emitRate: emitRate
            })
        }

        // Light Pitch
        if (eventData.note == controlBoxes.pitchControl) {
            pitch1 = lerp(MSG_MIN, MSG_MAX, 0, speed1, eventData.velocity) - speed1 / 2;
            Entities.editEntity(box1, {
                angularVelocity: { x: pitch1, y: yaw1, z: roll1 }
            })
        }

        // Light Yaw
        if (eventData.note == controlBoxes.yawControl) {
            yaw1 = lerp(MSG_MIN, MSG_MAX, 0, speed1, eventData.velocity) - speed1 / 2;
            Entities.editEntity(box1, {
                angularVelocity: { x: pitch1, y: yaw1, z: roll1 }
            })
        }

        // Light Roll
        if (eventData.note == controlBoxes.rollControl) {
            roll1 = lerp(MSG_MIN, MSG_MAX, 0, speed1, eventData.velocity) - speed1 / 2;
            Entities.editEntity(box1, {
                angularVelocity: { x: pitch1, y: yaw1, z: roll1 }
            })
        }

        // Light Fall Off Radius
        if (eventData.note == controlBoxes.fallOffRadiusControl) {
            falloffRadius1 = lerp(MSG_MIN, MSG_MAX, 0.00001, 10, eventData.velocity);
            props = { falloffRadius: falloffRadius1 };
            lights.forEach(function(light) { Entities.editEntity(light, props) });
        }

        // Light exponent
        if (eventData.note == controlBoxes.exponentControl) {
            exponent1 = lerp(MSG_MIN, MSG_MAX, 0.0001, 10, eventData.velocity);
            props = { exponent: exponent1 };
            lights.forEach(function(light) { Entities.editEntity(light, props) });
        }

        // Light cutoff
        if (eventData.note == controlBoxes.cutOffControl) {
            cutoff1 = lerp(MSG_MIN, MSG_MAX, -10, 100, eventData.velocity);
            props = { cutoff: cutoff1 };
            lights.forEach(function(light) { Entities.editEntity(light, props) });
        }

        // Light Re d
        if (eventData.note == controlBoxes.redControl1) {
            red1 = lerp(MSG_MIN, MSG_MAX, 0, 255, eventData.velocity);
            props = { color: { red: red1, green: green1, blue: blue1 } };
            lights.forEach(function(light) { Entities.editEntity(light, props) });
        }

        // Light green
        if (eventData.note == controlBoxes.greenControl1) {
            green1 = lerp(MSG_MIN, MSG_MAX, 0, 255, eventData.velocity);
            props = { color: { red: red1, green: green1, blue: blue1 } };
            lights.forEach(function(light) { Entities.editEntity(light, props) });
        }

        // Lightblue
        if (eventData.note == controlBoxes.blueControl1) {
            blue1 = lerp(MSG_MIN, MSG_MAX, 0, 255, eventData.velocity);
            props = { color: { red: red1, green: green1, blue: blue1 } };
            lights.forEach(function(light) { Entities.editEntity(light, props) });
        }

        // Light Intensicty
        if (eventData.note == controlBoxes.intensityControl1) {
            intensity1 = lerp(MSG_MIN, MSG_MAX, -20, 10, eventData.velocity);
            props = { intensity: intensity1 };
            lights.forEach(function(light) { Entities.editEntity(light, props) });
            Entities.editEntity(box1, props);
        }

        // Center Light
        if (eventData.note == controlBoxes.intensityControl2) {
            intensity2 = lerp(MSG_MIN, MSG_MAX, -20, 10, eventData.velocity);
            props = { intensity: intensity2 };
            Entities.editEntity(light0, props);
        }

        // Center Light Red
        if (eventData.note == controlBoxes.redControl2) {
            red2 = lerp(MSG_MIN, MSG_MAX, 0, 255, eventData.velocity);
            props = { color: { red: red2, green: green2, blue: blue2 } };
            Entities.editEntity(light0, props);
            Entities.editEntity(sphere1, props);
        }

        // Center Light green
        if (eventData.note == controlBoxes.greenControl2) {
            green2 = lerp(MSG_MIN, MSG_MAX, 0, 255, eventData.velocity);
            props = { color: { red: red2, green: green2, blue: blue2 } };
            Entities.editEntity(light0, props);
            Entities.editEntity(sphere1, props);
        }


        // Center Light blue
        if (eventData.note == controlBoxes.blueControl2) {
            blue2 = lerp(MSG_MIN, MSG_MAX, 0, 255, eventData.velocity);
            props = { color: { red: red2, green: green2, blue: blue2 } };
            Entities.editEntity(light0, props);
            Entities.editEntity(sphere1, props);
        }
    }

    function onMessageReceived(chan, mesg){
        var message = Number(mesg);
        // console.log("message Received", message);
        eventData.velocity = message;
        eventData.note = 1;
        var currIndex = Math.floor(Math.random() * controlBoxesKeys.length-1);
        var currMMIndex = Math.floor(Math.random() * minMax.length-1);
        
        if(eventData.velocity > 0.0002){
            updateControlBoxes(currIndex);
            MSG_MIN = minMax[currMMIndex][0];
            MSG_MAX = minMax[currMMIndex][1];
        }
        onEvent();
    }

// Tablet
    var tablet = null;
    var buttonName = "Layout";
    var button = null;
    var APP_URL = Script.resolvePath('./Tablet/Auto-Lights.html');
    function onTabletButtonClicked() {
        tablet.gotoWebScreen(APP_URL);
    }
    tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");

    button = tablet.addButton({
        text: buttonName,
        icon: "icons/tablet-icons/raise-hand-i.svg",
        activeIcon: "icons/tablet-icons/raise-hand-a.svg"
    });

    button.clicked.connect(onTabletButtonClicked);

    function onWebEventReceived(data) {
        print("got message");
        print(data);
        var message;
        message = JSON.parse(data);
        switch (message.type) {
            case "update":
                // totalGridObjects = message.totalGridObjects;
                // numberOfRows = message.numberOfRows;
                // numberOfCol = message.numberOfCol;
                // depth = message.depth;
                // X_OFFSET = message.xoffset;
                // Y_OFFSET = message.yoffset;
                // Z_OFFSET = message.zoffset;
                // X_dimensions = message.dimx;
                // Y_dimensions = message.dimy;
                // Z_dimensions = message.dimz;
                // origin = inFrontOf(8);
                // deleteAll();
                // main();
                break;
            default:
        }
    }

    tablet.webEventReceived.connect(onWebEventReceived);

// Main

    lightSource();

// Cleanup
    function scriptEnding() {
        Entities.deleteEntity(box1);
        Messages.unsubscribe(messageChannel);
        
        button.clicked.disconnect(onTabletButtonClicked);
        tablet.removeButton(button);
        tablet.webEventReceived.disconnect(onWebEventReceived);
    }


    Script.scriptEnding.connect(scriptEnding);