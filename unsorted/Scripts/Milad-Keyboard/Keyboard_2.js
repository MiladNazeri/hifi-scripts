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
    var midiInDevice = "Digital Piano";
    var midiOutDevice = "Digital Piano";
    var midiInDeviceId = -1;
    var midiOutDeviceId = -1;
    var midiChannel = 1; // set midi channel
    var midiInDeviceList = [];
    var midiOutDeviceList = [];
    const INPUT = false;
    const OUTPUT = true;
    const ENABLE = true;
    const DISABLE = false;

    var lifetime = -1;
    var pos;
    var rot;

    var config = {
        size_factor: 0.09,
        offset_multiplier: 0.14,
        keys: 88,
        key_offset: 20,
        key_x_size_multiplier: 0.15 ,
        key_y_size_multiplier: 1.5 ,        
        key_z_size_multiplier: 0.1,        
        color_frequency: 0.3,
        x_size_multiplier: 1.25,
        y_size_divider: 3,
        y_size_multiplier: 2,
        octaves: 8
    }

    // console.log("config.offset_multiplier", config.offset_multiplier )
    // console.log("config.size_factor", config.size_factor )
    // console.log("config.key_x_size_multiplier", config.key_x_size_multiplier )
    // console.log("config.key_x_size_multiplier", config.size_factor )
    
    var offset = config.offset_multiplier * config.size_factor;
    var key_x_size = config.key_x_size_multiplier * config.size_factor;
    var key_y_size = config.key_y_size_multiplier * config.size_factor;
    var key_z_size = config.key_z_size_multiplier * config.size_factor;

//Tablet
    var tablet = null;
    var buttonName = "Keyboard";
    var button = null;
    var APP_URL = Script.resolvePath('./Tablet/Milad-Keyboard.html');
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
                deleteAll();
                // console.log("2 config", JSON.stringify(config));
                // console.log("3 message.config", JSON.stringify(message.config));
                // console.log("keys", config.keys)
                // console.log("keys2", message.config.keys)
                
                config = message.config;
                offset = config.offset_multiplier * config.size_factor;
                key_x_size = config.key_x_size_multiplier * config.size_factor;
                key_y_size = config.key_y_size_multiplier * config.size_factor;
                key_z_size = config.key_z_size_multiplier * config.size_factor;
                keyBaseXSize = offset * (config.keys + 1);
                keyBaseYSize = key_y_size + offset;
                keyBaseZSize = key_z_size + (0.1 * config.size_factor);
                // console.log("offset", offset);
                // console.log("config", config);
                // console.log("keyBaseXSize", keyBaseXSize)
                // console.log("config.offset_multiplier", config.offset_multiplier )
                // console.log("config.size_factor", config.size_factor )
                // console.log("config.key_x_size_multiplier", config.key_x_size_multiplier )
                // console.log("config.size_factor", config.size_factor )
                Keyboard();
                getMyEntities(myEntities);
                listMyEntities(myEntities);
                break;
            default:
        }
    }

    tablet.webEventReceived.connect(onWebEventReceived);

// Keyboard
    var keyMap = [];

// KeyBase
    // console.log("1", JSON.stringify(config));
    var keyBaseXSize = offset * (config.keys + 1);
    var keyBaseYSize = key_y_size + offset;
    var keyBaseZSize = key_z_size + (0.1 * config.size_factor);
    // console.log("offset", offset);
    // console.log("config.keys", config.keys);
    // console.log("keyBaseXSize", keyBaseXSize)
    // console.log("keyBaseYSize", keyBaseYSize)
    // console.log("keyBaseZSize", keyBaseZSize)

// Options **********************************************
    var wantLocal = false;
    var wantCollisionless = false;
    var wantDynamic = false;
    var wantThruMode = false;
    var wantScriptless = false;
    var swapAxis = false;//Incomplete
    var wantBase = true;
    var wantToggle = false;

// misc *************************************************
    var userData;
    var keyScriptURL = Script.resolvePath("midiKey.js");
    if(wantScriptless) {
        keyScriptURL = "";
    }

// Entity Manager *********************************************************
    var props;
    var myEntities = [];
    var entityIDs = [];
    var allUuidTargets = [];
    var target = "Key";
    var uuidTarget = Uuid.generate();
    var wantDebug = true;

    function printDebug(message) {
        if (wantDebug) {
            print(message);
        }
    }

    function getMyEntities(myEntities){
        entityIDs = Entities.findEntities(MyAvatar.position, 1000);
        for (var i = 0; i < entityIDs.length; i++){
            props = Entities.getEntityProperties(entityIDs[i]);
            if (props.name.indexOf(target) !== -1
                || props.name.indexOf(uuidTarget) !== -1) {
                myEntities.push({name:props.name, entityID:entityIDs[i]});
            };
        };
    }

    function listMyEntities(myEntities){
        print("Listing: " + myEntities.length);
        for (var i = 0; i < myEntities.length; i++) {
            print(myEntities[i].name + " " + myEntities[i].entityID);
        };
    }

    function deleteMyEntities(myEntities){
        printDebug("Deleting: " + myEntities.length);
        for (var i = 0; i < myEntities.length; i++) {
            printDebug(myEntities[i].name + " " + myEntities[i].entityID);
            Entities.deleteEntity(myEntities[i].entityID);
        };
    }

    function MyIdentifier(myEntity){
        return myEntity = myEntity+" "+uuidTarget;
    }

    function newUuidTarget(){
        allUuidTargets.push(uuidTarget);
        uuidTarget = Uuid.generate();
    }




function Keyboard(){
    //var pos = Vec3.sum(MyAvatar.position, Vec3.multiply(Quat.getForward(MyAvatar.orientation), 1.0));
    // console.log("#1 offset", offset);    
    var pos = Vec3.sum(
        MyAvatar.position, 
        Vec3.multiplyQbyV(
            MyAvatar.orientation, 
            { x: -offset * (config.keys) / 2, y: 0.10, z: -0.52 }));
    var rot = MyAvatar.orientation;   
    // var rot = Quat.cancelOutRollAndPitch(MyAvatar.orientation);
    var buttons = 0 + config.key_offset;
    // console.log("buttons",buttons);
    //var key0NodelURL = "";
    //var key1NodelURL = "";    
    //var key2NodelURL = "";
    //var key3NodelURL = "";
    var key0Dimensions = { x: key_x_size, y: key_y_size / config.y_size_divider * config.y_size_multiplier, z: key_z_size * 2 };
    var key1Dimensions = { x: key_x_size * config.x_size_multiplier, y: key_y_size, z: key_z_size };
    var key2Dimensions = { x: key_x_size * config.x_size_multiplier, y: key_y_size, z: key_z_size };
    var key3Dimensions = { x: key_x_size * config.x_size_multiplier, y: key_y_size, z: key_z_size };
    var ke
    var keyDimension;
    var keySpace;
    var keyXPos;
    var keyYPos;
    var keyZPos;
    var octaves = config.octaves;
    var keyMap = [
        {keyName: "A ",keyType: 2},
        {keyName: "A# ",keyType: 0},
        {keyName: "B ",keyType: 3},
        {keyName: "C ", keyType: 1},
        {keyName: "C# ",keyType: 0},
        {keyName: "D ",keyType: 2},
        {keyName: "D# ",keyType: 0},
        {keyName: "E ",keyType: 3},
        {keyName: "F ",keyType: 1},
        {keyName: "F# ",keyType: 0},
        {keyName: "G ",keyType: 2},
        {keyName: "G# ",keyType: 0}
        ];
    
    printDebug(keyMap.length);

    printDebug(keyMap[1].keyType);
    if (wantBase) {
        // console.log("$$$ keyBaseXSize", keyBaseXSize);
        // console.log("keyBaseYSize", keyBaseYSize);
        // console.log("keyBaseZSize", keyBaseZSize);
        // console.log("2 offset", offset);
        
        baseID = Entities.addEntity({
            name: " Key Base",
            type: "Box",
            color: { blue: 100, green: 0, red: 0 },
            dimensions: { x: keyBaseXSize, y: keyBaseYSize, z: keyBaseZSize },
            position: Vec3.sum(
                pos, 
                Vec3.multiplyQbyV(
                    MyAvatar.orientation,
                    { x: (keyBaseXSize / 2 - offset), y: 0, z: -0.2 * config.size_factor })),
            rotation: rot,
            dynamic: wantDynamic,
            collisionless: wantCollisionless,
            gravity: { x: 0, y: 0, z: 0 },
            lifetime: lifetime,
            userData: "{ \"grabbableKey\": { \"grabbable\": true, \"kinematic\": false } }"
        },wantLocal);
    }

    for (var j = 0; j < config.octaves; j++) {
        // console.log("j",j)
        for (var i = 0; i < keyMap.length; i++) {
            // console.log("i",i)
            // console.log("buttons", buttons);
            buttons++
            if(keyMap[i].keyType === 0){
                keyColor = {red:0, green:0, blue:0};
                keyDimension = key0Dimensions;
                keySpace = 1;
                keyYPos = key_y_size / 6; //##Magic
                keyZPos = key_z_size / 2; //##Magic
            } else {
                keyColor = {red:255, green:255, blue:255};
                keyDimension = key1Dimensions;
                keySpace = 1; //##Magic
                keyYPos = 0; //##Magic
                keyZPos = 0; //##Magic
            };

            userData = {
                midiEvent: {
                    type: 0,
                    note: buttons,
                    velocity: 0
                },
                color: keyColor,
                grabbableKey: {
                    grabbable: true,
                    kinematic: true,
                    cloneable: true
                }
            };
            if(buttons === 109){
                Entities.editEntity(
                    baseID,
                    {rotation: Quat.multiply(
                        MyAvatar.orientation, 
                        Quat.fromVec3Degrees({x: -90.0, y: 0.0, z: 0.0}))});
                return;
            }
            
            // console.log("keySpace", keySpace);
            // console.log("buttons:", buttons)
            // console.log("x", (offset * (i * keySpace)) + (j * offset * 12));
        //     console.log(JSON.stringify(                    
        //         Vec3.sum(
        //         pos, 
        //         Vec3.multiplyQbyV(
        //             MyAvatar.orientation,
        //             {
        //                 x: (offset * (i * keySpace)) + (j * offset * 12), 
        //                 y: keyYPos, 
        //                 z: +keyZPos 
        //             }
        //     ))))
        //     console.log("MultiplyQbyV", JSON.stringify(Vec3.multiplyQbyV(
        //         MyAvatar.orientation,
        //         {
        //             x: (offset * (i * keySpace)) + (j * offset * 12), 
        //             y: keyYPos, 
        //             z: +keyZPos 
        //         }
        // )))
        // console.log("4 offset", offset);
            
            newID = Entities.addEntity({
                name: " Key " + buttons,
                description: buttons + " " + keyMap[i].keyName,
                type: "Box",
                color: keyColor,
                dimensions: keyDimension,
                position: 
                    Vec3.sum(
                        pos, 
                        Vec3.multiplyQbyV(
                            MyAvatar.orientation,
                            {
                                x: (offset * (i * keySpace)) + (j * offset * 12), 
                                y: keyYPos, 
                                z: +keyZPos 
                            }
                    )
                ),
                rotation: rot,
                dynamic: wantDynamic,
                collisionless: wantCollisionless,
                gravity: { x: 0, y: -9, z: 0 },
                lifetime: lifetime,
                script: keyScriptURL,
                parentID: baseID,
                userData: JSON.stringify(userData)
            },wantLocal);
        }};
    
}

function midiEventReceived(eventData) {
        printDebug("Triggered: " + eventData.note);
    if (eventData.device != midiInDeviceId || eventData.channel != midiChannel){
        return;
    };
    for (var i = 0; i < myEntities.length; i++) {
        if(myEntities[i].name.indexOf("Key " + eventData.note) !== -1) {
            printDebug("Entity Found: "+ myEntities[i].entityID);
            var properties = Entities.getEntityProperties(myEntities[i].entityID, ['userData']);
            var oldUserData = properties.userData && JSON.parse(properties.userData);

            userData = {
                midiEvent: {
                    type: eventData.type,
                    note: eventData.note,
                    velocity: eventData.velocity
                },
                color: oldUserData.color,
                grabbableKey: {
                    grabbable: true,
                    kinematic: true,
                    cloneable: true
                }
            };

            Entities.editEntity(myEntities[i].entityID, {
                userData: JSON.stringify(userData)
            });

            Entities.callEntityMethod(myEntities[i].entityID, "receivedMidiEvent", myEntities[i].entityID);
        }
    }
}

function clickEventReceived(entityID){
    printDebug(entityID);
}

function deleteAll(){
    deleteMyEntities(myEntities);
	if(wantBase){Entities.deleteEntity(baseID)};
}

// Midi___________________________________________________
    function getMidiInputs(){
        var midiInDevices = Midi.listMidiDevices(INPUT);
        midiInDeviceList = midiInDevices;
    }

    function getMidiOutputs(){
        var midiOutDevices = Midi.listMidiDevices(OUTPUT);
    -    midiOutDevices.shift(); // Get rind of MS wavetable synth
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
        listMidiInputs();
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
    //_____________________________________________________


function scriptEnding() {
    deleteAll();
    if(wantLocal){MyAvatar.setAvatarEntityData({})};// Tims Barnicle Remover

    button.clicked.disconnect(onTabletButtonClicked);
    tablet.removeButton(button);
    tablet.webEventReceived.disconnect(onWebEventReceived);
}

midiConfig();
Keyboard();

getMyEntities(myEntities);
listMyEntities(myEntities);


// Events
Midi.midiReset.connect(midiHardwareResetReceieved);
Midi.midiMessage.connect(midiEventReceived);
Script.scriptEnding.connect(scriptEnding);
