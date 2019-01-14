//
// .js
//
//  Created by Bruce Brown on 7/15/17.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

var midiInDevice = "CASIO USB-MIDI";
var midiOutDevice = "CASIO USB-MIDI";
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
var sizeFactor = 0.125;
var pos;
var rot;
// Keayboard ********************************************
    var offset = 0.15 * sizeFactor;//
    var keys = 88;
    var keyOffset = 20; // 1st midi note
    var keystartNote= "A"; // Incomplete
    var keyXSize = 0.1 * sizeFactor;
    var keyYSize = 1 * sizeFactor;
    var keyZSize = 0.1 * sizeFactor;
    var keyMap = [];
    var colorFrequency = 0.3;

// KeyBase *******************************************
    var keyBaseXSize = offset*(keys + 1);
    var keyBaseYSize = keyYSize+offset;
    var keyBaseZSize = keyZSize + (0.1* sizeFactor);

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
    var target = " Key";
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

//********************************************************************************

function Keyboard(){
    //var pos = Vec3.sum(MyAvatar.position, Vec3.multiply(Quat.getForward(MyAvatar.orientation), 1.0));
    var pos = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, {x:-offset*(keys + 1)/2, y: 0.0, z:-0.6}));
    var rot = Quat.cancelOutRollAndPitch(MyAvatar.orientation);
    var buttons = 0 + keyOffset;
    //var key0NodelURL = "";
    //var key1NodelURL = "";
    //var key2NodelURL = "";
    //var key3NodelURL = "";
    var key0Dimensions = {x:keyXSize ,y:keyYSize/3*2 ,z:keyZSize*2};
    var key1Dimensions = {x:keyXSize*1.25 ,y:keyYSize ,z:keyZSize};
    var key2Dimensions = {x:keyXSize*1.25 ,y:keyYSize ,z:keyZSize};
    var key3Dimensions = {x:keyXSize*1.25 ,y:keyYSize ,z:keyZSize};
    var keyColor;
    var keyDimension;
    var keySpace;
    var keyXPos;
    var keyYPos;
    var keyZPos;
    var octaves = 8;
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
            baseID = Entities.addEntity({
                name: " Key Base",
                type: "Box",
                color: { blue: 100, green: 0, red: 0 },
                dimensions: { x:keyBaseXSize, y:keyBaseYSize, z:keyBaseZSize},
                position: Vec3.sum(pos, Vec3.multiplyQbyV(MyAvatar.orientation,{x: (keyBaseXSize/2-offset), y: 0, z: -0.2 * sizeFactor })),
                rotation: rot,
                dynamic: wantDynamic,
                collisionless: wantCollisionless,
                gravity: { x: 0, y: 0, z: 0 },
                lifetime: lifetime,
                userData: "{ \"grabbableKey\": { \"grabbable\": true, \"kinematic\": false } }"
            },wantLocal);
        } 
    for (var j = 0; j < octaves; j++) {
    for (var i = 0; i < keyMap.length; i++) {
        buttons++
        if(keyMap[i].keyType === 0){
            keyColor = {red:0, green:0, blue:0};
            keyDimension = key0Dimensions;
            keySpace = 1;
            keyYPos = keyYSize/6;
            keyZPos = keyZSize/2;
        } else {
            keyColor = {red:255, green:255, blue:255};
            keyDimension = key1Dimensions;
            keySpace = 1;
            keyYPos = 0;
            keyZPos = 0;
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
            Entities.editEntity(baseID,{rotation: Quat.multiply(MyAvatar.orientation, Quat.fromVec3Degrees({x: -90.0, y: 0.0, z: 0.0}))});
            return;
        }
        newID = Entities.addEntity({
            name: " Key " + buttons,
            description: buttons + " " +keyMap[i].keyName,
            type: "Box",
            color: keyColor,
            dimensions: keyDimension,
            position: Vec3.sum(pos, Vec3.multiplyQbyV(MyAvatar.orientation,{x:(offset * (i*keySpace))+(j*offset*12) , y:keyYPos , z:+keyZPos})),
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
        if(myEntities[i].name.indexOf(" Key " + eventData.note) !== -1) {
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
    deleteMyEntities(myEntities);
	if(wantBase){Entities.deleteEntity(baseID)};
    if(wantLocal){MyAvatar.setAvatarEntityData({})};// Tims Barnicle Remover
}

midiConfig();
Keyboard();

getMyEntities(myEntities);
listMyEntities(myEntities);


// Events
Midi.midiReset.connect(midiHardwareResetReceieved);
Midi.midiMessage.connect(midiEventReceived);
Script.scriptEnding.connect(scriptEnding);
