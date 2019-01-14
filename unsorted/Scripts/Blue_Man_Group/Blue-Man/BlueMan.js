const INPUT = false;
const OUTPUT = true;
const ENABLE = true;
const DISABLE = false;

function log(describer, obj) {
    obj = obj || '';
    print('&======');
    print(describer + ":" + JSON.stringify(obj));
}

function midiEventReceived(event){
    log("event", event);
}


// Midi
    var config = config || {};
    var midiInDevice = config.midiInDevice;
    var midiOutDevice = config.midiOutDevice;
    var midiChannel = config.midiChannel;
    // var midiEventReceived = config.;
    var midiInDeviceId = -1;
    var midiOutDeviceId = -1;
    var midiInDeviceList = [];
    var midiOutDeviceList = [];

    function midiHardwareResetReceieved(){
        seedMidiInputsList();
        seedMidiOutputsList();
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

    function seedMidiInputsList(){
        var midiInDevices = Midi.listMidiDevices(INPUT);
        midiInDeviceList = midiInDevices;
    }
    
    function seedMidiOutputsList(){
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
    
    function getMidiInputs(){
        if (midiInDeviceList.length === 0) {
            seedMidiInputsList();
        }
        return midiInDeviceList;
    }

    function getMidiOutputs(){
        if (midiOutDeviceList.length === 0) {
            seedMidiOutputsList();
        }
        return midiOutDeviceList;
    }
    
    function registerMidiEventREceived(newMidiEventReceived){
        midi.midiMessage.disconnect(midiEventReceived);
        Midi.midiMessage.connect(newMidiEventReceived);
    }

    function registerNewConfig(newConfig){
        config = newConfig;
    }

    function setup (){
        midiConfig();
        Midi.midiReset.connect(midiHardwareResetReceieved);
        Midi.midiMessage.connect(midiEventReceived);
    }
    
    function tearDown (){
        Midi.midiReset.disconnect(midiHardwareResetReceived);
        Midi.midiMessage.disconnect(midiEventReceived);
    }

    setup();

//  https://brainstormer.ddns.net:651/Scripts/midi/Particle/Particle.js
// 
//  Created by Bruce Brown on 1/9/2018
//

// Controls
var controlMap =[
	// returns true if particles are being emitted.
	{control: 0, controlName: "isEmitting",controlCurrent:0 ,controlMin:0.01, ControlMax:1},//Button T/F
	// Depricated?  {control: 0, controlName: "additiveBlending",controlCurrent:0 ,controlMin:0.01, ControlMax:1},//Button T/F
	//
	{control: 0, controlName: "emitterShouldTrail",controlCurrent:0 ,controlMin:0.01, ControlMax:0},//Button T/F

	{control: 4, controlName: "lifespan",controlCurrent:0 ,controlMin:0.01, ControlMax:10},// 0-10
	{control: 8, controlName: "maxParticles",controlCurrent:0 ,controlMin:0.01, ControlMax:10000},//0-10000
	//	The emitRate specifies the number of particles spawned per second.
	{control: 12, controlName: "emitRate",controlCurrent:0 ,controlMin:0.01, ControlMax:500},//Not Mutch Effect
	{control: 16, controlName: "emitSpeed",controlCurrent:0 ,controlMin:0.01, ControlMax:100},
	{control: 20, controlName: "speedSpread",controlCurrent:0 ,controlMin:0.01, ControlMax:10},

	{control: 1, controlName: "colorStart.red",controlCurrent:0 ,controlMin:0.01, ControlMax:255},
	{control: 2, controlName: "colorStart.green",controlCurrent:0 ,controlMin:0.01, ControlMax:255},
	{control: 3, controlName: "colorStart.blue",controlCurrent:0 ,controlMin:0.01, ControlMax:255},

	{control: 5, controlName: "color.red",controlCurrent:0 ,controlMin:0.01, ControlMax:255},
	{control: 6, controlName: "color.green",controlCurrent:0 ,controlMin:0.01, ControlMax:255},
	{control: 7, controlName: "color.blue",controlCurrent:0 ,controlMin:0.01, ControlMax:255},

	{control: 9, controlName: "colorFinish.red",controlCurrent:0 ,controlMin:0.01, ControlMax:255},
	{control: 10, controlName: "colorFinish.green",controlCurrent:0 ,controlMin:0.01, ControlMax:255},
	{control: 11, controlName: "colorFinish.blue",controlCurrent:0 ,controlMin:0.01, ControlMax:255},

	{control: 13, controlName: "colorSpread.red",controlCurrent:0 ,controlMin:0.01, ControlMax:255},
	{control: 14, controlName: "colorSpread.green",controlCurrent:0 ,controlMin:0.01, ControlMax:255},
	{control: 15, controlName: "colorSpread.blue",controlCurrent:0 ,controlMin:0.01, ControlMax:255},

	{control: 17, controlName: "emitDimensions.x",controlCurrent:0 ,controlMin:-20, ControlMax:20},//Not Mutch Effect	
	{control: 17, controlName: "emitDimensions.y",controlCurrent:0 ,controlMin:-20, ControlMax:20},//Not Mutch Effect	
	{control: 17, controlName: "emitDimensions.z",controlCurrent:0 ,controlMin:-20, ControlMax:20},//Most effect

	{control: 0, controlName: "emitAcceleration.x",controlCurrent:0 ,controlMin:0.01, ControlMax:10},
	{control: 0, controlName: "emitAcceleration.y",controlCurrent:0 ,controlMin:0.01, ControlMax:10},
	{control: 0, controlName: "emitAcceleration.z",controlCurrent:0 ,controlMin:0.01, ControlMax:10},

	{control: 0, controlName: "accelerationSpread.x",controlCurrent:0 ,controlMin:0.01, ControlMax:10},
	{control: 0, controlName: "accelerationSpread.y",controlCurrent:0 ,controlMin:0.01, ControlMax:10},
	{control: 0, controlName: "accelerationSpread.z",controlCurrent:0 ,controlMin:0.01, ControlMax:10},

	{control: 24, controlName: "radiusStart",controlCurrent:0 ,controlMin:0.01, ControlMax:2},//Most Effect
	// radius of the particles in meters
	{control: 0, controlName: "particleRadius",controlCurrent:0 ,controlMin:0.01, ControlMax:2},//Not Mutch Effect	
	{control: 0, controlName: "radiusFinish",controlCurrent:0 ,controlMin:0.01, ControlMax:2},//Not Mutch Effect	
	{control: 0, controlName: "radiusSpread",controlCurrent:0 ,controlMin:0.01, ControlMax:2},//Not Mutch Effect	

	{control: 25, controlName: "alphaStart",controlCurrent:0 ,controlMin:0.01, ControlMax:1},
	{control: 26, controlName: "alpha",controlCurrent:0 ,controlMin:0.01, ControlMax:1},
	{control: 27, controlName: "alphaFinish",controlCurrent:0 ,controlMin:0.01, ControlMax:1},
	{control: 28, controlName: "alphaSpread",controlCurrent:0 ,controlMin:0.01, ControlMax:1},

	{control: 29, controlName: "emitOrientation.x",controlCurrent:0 ,controlMin:-180, ControlMax:180},	
	{control: 30, controlName: "emitOrientation.y",controlCurrent:0 ,controlMin:-180, ControlMax:180},
	{control: 31, controlName: "emitOrientation.z",controlCurrent:0 ,controlMin:-180, ControlMax:180},

	{control: 18, controlName: "polarStart",controlCurrent:0 ,controlMin:0.01, ControlMax:-Math.PI},
	{control: 21, controlName: "polarFinish",controlCurrent:0 ,controlMin:0.01, ControlMax:Math.PI},

	{control: 19, controlName: "azimuthStart",controlCurrent:0 ,controlMin:0.01, ControlMax:-Math.PI},
	{control: 22, controlName: "azimuthFinish",controlCurrent:0 ,controlMin:0.01, ControlMax:Math.PI},
	{control: 33, controlName: "textures",controlCurrent:"https://content.highfidelity.com/DomainContent/production/Particles/wispy-smoke.png" ,controlMin:0.01, ControlMax:0.01},
	{control: 34, controlName: "textures",controlCurrent:"https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/fire.jpg" ,controlMin:0.01, ControlMax:0.01},
	{control: 35, controlName: "textures",controlCurrent:"https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/rain.png" ,controlMin:0.01, ControlMax:0.01},
	{control: 36, controlName: "textures",controlCurrent:"https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/sand3.png" ,controlMin:0.01, ControlMax:0.01},
	{control: 37, controlName: "textures",controlCurrent:"https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/air.png" ,controlMin:0.01, ControlMax:0.01},
	{control: 38, controlName: "textures",controlCurrent:"https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/snow.jpg" ,controlMin:0.01, ControlMax:0.01},
	{control: 39, controlName: "textures",controlCurrent:"https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/rainbows.png" ,controlMin:0.01, ControlMax:0.01},
	{control: 40, controlName: "textures",controlCurrent:"https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/lightning.jpg" ,controlMin:0.01, ControlMax:0.01},
	{control: 41, controlName: "textures",controlCurrent:"https://hifi-content.s3.amazonaws.com/elisalj/music_visualizer/textures/hearts_v2.png" ,controlMin:0.01, ControlMax:0.01},
	{control: 42, controlName: "textures",controlCurrent:"http://hifi-content.s3.amazonaws.com/alan/dev/Particles/Bokeh-Particle.png" ,controlMin:0.01, ControlMax:0.01},
	{control: 43, controlName: "textures",controlCurrent:"https://brainstormer.keybase.pub/High%20Fidelity/Particles/phlash.png" ,controlMin:0.01, ControlMax:0.01},
	{control: 44, controlName: "textures",controlCurrent:"https://brainstormer.keybase.pub/High%20Fidelity/Particles/Media_Militia_Particles001.png" ,controlMin:0.01, ControlMax:0.01},
	{control: 45, controlName: "textures",controlCurrent:"https://brainstormer.keybase.pub/High%20Fidelity/Particles/Media_Militia_Particles002.png" ,controlMin:0.01, ControlMax:0.01},
	{control: 46, controlName: "textures",controlCurrent:"https://brainstormer.keybase.pub/High%20Fidelity/Particles/Media_Militia_Particles003.png" ,controlMin:0.01, ControlMax:0.01},
	{control: 47, controlName: "textures",controlCurrent:"https://brainstormer.keybase.pub/High%20Fidelity/Particles/Media_Militia_Particles004.png" ,controlMin:0.01, ControlMax:0.01},
	{control: 48, controlName: "textures",controlCurrent:"https://brainstormer.keybase.pub/High%20Fidelity/Particles/Media_Militia_Particles005.png" ,controlMin:0.01, ControlMax:0.01},
];
var particleID;
var emitOrientationX;
var emitOrientationY;
var emitOrientationZ;
var timeScale = .00001;
var frequency = 0.001;
var wantLocal = true;

// Functions
function buildParticle(){
    print("Creating Particle");
    var pos = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, {x: 0, y: 1, z: -2}));

    particleID = Entities.addEntity({
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
        emitRate: 200,
        lifespan: 2.5,
        maxParticles: 1000,
        particleRadius: 0.25,
        radiusFinish: 0.25,
        radiusStart: 0.25,
        rotation: {
            w: 0.7630274295806885,
            x: -1.52587890625e-05,
            y: -0.6463874578475952,
            z: -1.52587890625e-05
            }
    },wantLocal);
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

    console.log('Entities.editEntity :: ' + entityID, JSON.stringify(updated, 0, 2));
    Entities.editEntity(entityID, updated);
}

function midiEventReceived(eventData) {
    if (eventData.device != midiInDeviceId || eventData.channel != midiChannel ){
        return;
    }
	controlMap.forEach(function(item) {
		if (eventData.note == item.control) {
			if (typeof item.controlCurrent == "string"){
				props = {textures: item.controlCurrent};
				Entities.editEntity(particleID, props);
				return;
			};
			item.controlCurrent = lerp (0,127,item.controlMin,item.ControlMax, eventData.velocity);
			if(item.controlName == "emitOrientation.x"
			||item.controlName == "emitOrientation.y"
			||item.controlName == "emitOrientation.z"){
				if (item.controlName == "emitOrientation.x"){emitOrientationX = item.controlCurrent};
				if (item.controlName == "emitOrientation.y"){emitOrientationY = item.controlCurrent};
				if (item.controlName == "emitOrientation.z"){emitOrientationZ = item.controlCurrent};
				//props = {angularVelocity:{x:emitOrientationX,y:emitOrientationY,z:emitOrientationZ}};
				props = {emitOrientation:Quat.fromPitchYawRollDegrees(emitOrientationX,emitOrientationY,emitOrientationZ)};
			    console.log('Entities.editEntity :: ' + particleID, JSON.stringify(props, 0, 2));
				Entities.editEntity(particleID, props);
				return;
			} else {
    			updateEntityProperty(particleID, item.controlName, item.controlCurrent);
    			return;
   			}
   		}
	});
}

function lerp(InputLow, InputHigh, OutputLow, OutputHigh, Input) {
    return ((Input - InputLow) / (InputHigh - InputLow)) * (OutputHigh - OutputLow) + OutputLow;
}
//lerp (0,127,0,360,eventData.velocity);

function scriptEnding() {
    Script.clearInterval(timer);
    Entities.deleteEntity(particleID);
}
buildParticle();

var timer = Script.setInterval(function() {
    //var props = {position: Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, {x: 0, y: 1, z: 0.0}))};
    var headPosition = MyAvatar.getHeadPosition();
	var props = {position: Vec3.sum(headPosition,{x: 0, y: 0, z: 0.0})};
	Entities.editEntity(particleID, props);
}, frequency * 1000);

Script.scriptEnding.connect(scriptEnding);
