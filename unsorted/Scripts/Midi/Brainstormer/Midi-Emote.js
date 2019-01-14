// midiEmote.js
//
//  Created by Bruce Brown on 9/15/17.
//  with help Debugging from Piper Peppercorn
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
//
var midiInDevice = "Launchpad Pro";
var midiOutDevice = "Launchpad Pro";
var midiInDeviceId = -1;
var midiOutDeviceId = -1;
var midiChannel = 1;
var midiInDeviceList = [];
var midiOutDeviceList = [];
var wantDebug = false;
const INPUT = false;
const OUTPUT = true;
const ENABLE = true;
const DISABLE = false;

// Animation
var wantAnimation = false;
// var animFolder = "https://brainstormer.keybase.pub/High%20Fidelity/Animations/";
var animFolder = "https://brainstormer.keybase.pub/High%20Fidelity/Animations/Old";
var animationData = [];
var animationMap = [

// Broken
	{keyNote: 88,keyColor: 72, animURL: animFolder + "Northern Soul Spin Combo.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 265},
	{keyNote: 87,keyColor: 72, animURL: animFolder + "Robot Hip Hop Dance.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 143},
	{keyNote: 86,keyColor: 72, animURL: animFolder + "Salsa Dancing.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 68},

// Dancing
	{keyNote: 81,keyColor: 40, animURL: animFolder + "Sitting.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 35},
	{keyNote: 78,keyColor: 40, animURL: animFolder + "Bellydancing.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 761},
	{keyNote: 77,keyColor: 40, animURL: animFolder + "Jazz Dancing.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 61},
	{keyNote: 76,keyColor: 40, animURL: animFolder + "Samba Dancing.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 323},
	{keyNote: 75,keyColor: 40, animURL: animFolder + "Wave Hip Hop Dance.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 479},
	{keyNote: 74,keyColor: 40, animURL: animFolder + "Gangnam Style.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 371},
	{keyNote: 72,keyColor: 40, animURL: animFolder + "Hip Hop Dancing1.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 473},
	{keyNote: 71,keyColor: 40, animURL: animFolder + "Chicken Dance.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 143},
	{keyNote: 68,keyColor: 40, animURL: animFolder + "Hip Hop Dancing2.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 190},
	{keyNote: 67,keyColor: 40, animURL: animFolder + "Excited.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 197},
	{keyNote: 65,keyColor: 40, animURL: animFolder + "House Dancing.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 594},
// Misc
	{keyNote: 64,keyColor: 50, animURL: animFolder + "Looking Around.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 190},
	{keyNote: 63,keyColor: 50, animURL: "https://s3-us-west-2.amazonaws.com/highfidelityvr/waving.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 84},
	{keyNote: 62,keyColor: 50, animURL: "https://hifi-public.s3.amazonaws.com/ozan/anim/kneel/kneel.fbx", playbackRate: 30, animLoop: false, startFrame: 0, endFrame: 82},
	{keyNote: 61,keyColor: 50, animURL: "https://s3.amazonaws.com/hifi-public/animations/ClapAnimations/ClapHands_Standing.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 53},
	{keyNote: 58,keyColor: 50, animURL: animFolder + "Defeated.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 203},
	{keyNote: 57,keyColor: 50, animURL: animFolder + "Jumping.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 97},
	{keyNote: 56,keyColor: 50, animURL: animFolder + "Standing Using Touchscreen Tablet.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 994},
	{keyNote: 55,keyColor: 50, animURL: animFolder + "Loser.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 98},
	{keyNote: 54,keyColor: 50, animURL: animFolder + "Searching Pockets.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 150},
	{keyNote: 53,keyColor: 50, animURL: animFolder + "Agony.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 82},
//Drunk
	{keyNote: 52,keyColor: 50, animURL: animFolder + "Drunk Idle Variation.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 119},
	{keyNote: 51,keyColor: 50, animURL: animFolder + "Tripping.fbx", playbackRate: 30, animLoop: false, startFrame: 0, endFrame: 63},
// Fighting
	{keyNote: 41,keyColor: 20, animURL: animFolder + "Taunt.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 85},
	{keyNote: 42,keyColor: 20, animURL: animFolder + "Sword And Shield Kick.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 36},
	{keyNote: 43,keyColor: 20, animURL: animFolder + "Boxing.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 65},
	{keyNote: 44,keyColor: 20, animURL: animFolder + "Punching.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 30},
	{keyNote: 45,keyColor: 20, animURL: animFolder + "Roundhouse Kick.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 568},
	{keyNote: 46,keyColor: 20, animURL: animFolder + "Lead Jab.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 54},
	{keyNote: 47,keyColor: 20, animURL: animFolder + "Taunt2.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 139},
	{keyNote: 48,keyColor: 20, animURL: animFolder + "Illegal Elbow Punch.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 68},
	{keyNote: 31,keyColor: 20, animURL: animFolder + "Body Jab Cross.fbx", playbackRate: 30, animLoop: true, startFrame: 0, endFrame: 66}
	];

// Sound
var wantSound = true;
var wantSingleInjector = false;
var soundFolder = "file:///H:/Sounds/";
var soundData = [];
var soundMap = [
	//{keyNote: 11,keyColor: 54, soundURL: "http://hifi-public.s3.amazonaws.com/birarda/baseball/crowd-boos.wav", soundLoop: false},
	//{keyNote: 12,keyColor: 54, soundURL: "http://hifi-public.s3.amazonaws.com/birarda/baseball/crowd-medium.wav", soundLoop: false},
	//{keyNote: 13,keyColor: 54, soundURL: "http://hifi-content.s3.amazonaws.com/DomainContent/production/audio/vegcrunch.wav", soundLoop: false},
	//{keyNote: 14,keyColor: 54, soundURL: "https://hifi-content.s3.amazonaws.com/jedon/Script_Combiner/sci-fi-float.wav", soundLoop: false},
	//{keyNote: 15,keyColor: 54, soundURL: "http://hifi-production.s3.amazonaws.com/DomainContent/Toybox/cat/cat_meow.wav", soundLoop: false},
	//{keyNote: 16,keyColor: 54, soundURL: "http://hifi-production.s3.amazonaws.com/DomainContent/Toybox/ping_pong_gun/Clay_Pigeon_02.L.wav", soundLoop: false},
	//	{keyNote: 13,keyColor: 54, soundURL: "http://hifi-content.s3.amazonaws.com/DomainContent/production/audio/wooshSound.wav", soundLoop: false, soundPitch: 1 + 2/12},

var soundMap = [
	{keyNote: 11,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.sqrt(1/12)},
	{keyNote: 12,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.sqrt(2/12)},
	{keyNote: 13,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.sqrt(3/12)},
	{keyNote: 14,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.sqrt(4/12)},
	{keyNote: 15,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.sqrt(5/12)},
	{keyNote: 16,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.sqrt(6/12)},
	{keyNote: 17,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.sqrt(7/12)},
	{keyNote: 18,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.sqrt(8/12)},
	{keyNote: 21,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.sqrt(9/12)},
	{keyNote: 22,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.sqrt(10/12)},
	{keyNote: 23,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.sqrt(11/12)},
	{keyNote: 24,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.sqrt(12/12)},

	{keyNote: 25,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.pow( 2.0, 0/12)},
	{keyNote: 26,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.pow( 2.0, 1/12)},
	{keyNote: 27,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.pow( 2.0, 2/12)},
	{keyNote: 28,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.pow( 2.0, 3/12)},
	{keyNote: 31,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.pow( 2.0, 4/12)},
	{keyNote: 32,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.pow( 2.0, 5/12)},
	{keyNote: 33,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.pow( 2.0, 6/12)},
	{keyNote: 34,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.pow( 2.0, 7/12)},
	{keyNote: 35,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.pow( 2.0, 8/12)},
	{keyNote: 36,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.pow( 2.0, 9/12)},
	{keyNote: 37,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.pow( 2.0, 10/12)},
	{keyNote: 38,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.pow( 2.0, 11/12)},
	{keyNote: 41,keyColor: 54, soundURL: "http://www.mediacollege.com/audio/tone/files/440Hz_44100Hz_16bit_05sec.wav", soundLoop: false, soundPitch: Math.pow( 2.0, 12/12)}
	];

//For the Math in case anyone wants to know.
//Math.sqrt(n/12)  //  Half notes down from 1.0f 
//Math.pow( 2.0, n/12 )  //  Half notes up from 1.0f

// Script
var wantScript = false;
var scriptFolder = "file:///H:/Scripts/";
var scriptData = [];
var scriptMap = [
	{keyNote: 81,keyColor: 48, scriptURL: "http://brainstormer.ddns.net:650/Entities/Launchpad/midiEmote.js", scriptRunning: true},
	{keyNote: 82,keyColor: 48, scriptURL: "http://brainstormer.ddns.net:650/Entities/Launchpad/Launchpad.js", scriptRunning: true}
	];

// Misc
var launchpadProgram = true; // Keys 11-18,21-28,31-38,41-48,51-58,61-69,71-78,81-88 //  88 Key keyboard Key 21-109
var scriptRunning;
var notFound = false;
var animSpeed = 0;

var wantTriggerBall = false;
var wantLocal = false;

function printDebug(message) {
    if (wantDebug) {
        print(message);
    }
}

function loadAll(){
	if(launchpadProgram){
		printDebug("Initializing Launchpad");
		for (var i = 0; i < 128; i++) {
			//Midi.playMidiNote(145, i-1, 0)
			Midi.sendMidiMessage(midiOutDeviceId,midiChannel,9,i-1,0);

		}
	};

	if(wantAnimation){
		printDebug("Loading Animations");
		animationMap.forEach(function(animationData) {
			//MyAvatar.prefetch.Animation(animationData.animURL);// On WIKI does not exist in code.....
			animationData.animation = AnimationCache.prefetch(animationData.animURL);
			if(launchpadProgram){Midi.sendMidiMessage(midiOutDeviceId, midiChannel, 9, animationData.keyNote, animationData.keyColor)};
		})
	};
	if(wantSound){
		printDebug("Loading Sounds");
		soundMap.forEach(function(soundData) {
       		soundData.sound = SoundCache.getSound(soundData.soundURL);
			if(launchpadProgram){Midi.sendMidiMessage(midiOutDeviceId, midiChannel, 9, animationData.keyNote, animationData.keyColor)};
    	})
	};
	if(wantScript){
		printDebug("Loading Scripts");
		scriptMap.forEach(function(scriptData) {
       		scriptData.script = scriptData.scriptURL;
			if(launchpadProgram){Midi.sendMidiMessage(midiOutDeviceId, midiChannel ,9 ,animationData.keyNote, animationData.keyColor)};
    	})
	};
}

function playAnimation(animationData, eventData) {
	animationData.animator = MyAvatar.overrideAnimation(animationData.animURL, animationData.playbackRate, animationData.animLoop, animationData.startFrame, animationData.endFrame);
	//animationData.animator = MyAvatar.overrideAnimation(animationData.animURL, eventData.velocity, animationData.animLoop, animationData.startFrame, animationData.endFrame);

	if (wantTriggerBall){
		if (eventData.velocity){
			var pos = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, {x: 0, y: -.9, z: -2}));
			userData = {
				ProceduralEntity: {
    				version: 2,
    				shaderUrl: "http://192.241.189.145:8083/hifi/mat_shiny.fs?1488780575304",
    				channels: null,
    				uniforms: {
    					specular_intensity: 0.8,
      					specular_hardness: 380,
      					diffuse_color: [Math.random(),Math.random(),Math.random()],
      					emit: -1,
      					iSpeed: Math.random(),
      					hide: [0.0,0.0,0.0],
      					specular_color: [-1,1,1]
    					}
    				},
				grabbableKey: {cloneable: false, grabbable: false}
			}

			newID = Entities.addEntity({
            	name: "Dance Box",
        	    type: "Shape",
            	shape: "Dodecahedron",  
        	    color: { blue: animationData.keyColor, green: animationData.keyColor, red: animationData.keyColor },
            	dimensions: { x: 0.5 , z: 0.5, y:0.5},
        	    position: Vec3.sum(pos, { x: 0, y: 1 , z: 0}),
            	dynamic: true,
        	    collisionless: false,
            	gravity: { x: 0, y: 0, z: 0 },
            	script: "(function () {  return { clickDownOnEntity: function() {  this.a=!this.a;if(this.a) MyAvatar.overrideAnimation(\"" + animationData.animURL + "\"," + animationData.playbackRate + "," + animationData.animLoop + "," + animationData.startFrame + "," + animationData.endFrame + "); else MyAvatar.restoreAnimation(); } };  })",
            	lifetime: 60,
            	userData: JSON.stringify(userData)
            	//userData: "{ \"grabbableKey\": { \"grabbable\": true, \"kinematic\": false } }"
            },wantLocal);
		};
	};
}

function playSound(soundData, eventData) {
	if (wantSingleInjector){
		if (soundData.injector) {
        	try {
            	soundData.injector.stop();
        	} catch (e) {}
    	}
    }
    soundData.injector = Audio.playSound(soundData.sound, {position: MyAvatar.position, volume: eventData.velocity*(1/127)/2, loop: soundData.soundLoop, pitch: soundData.soundPitch});
}

function runScript(scriptData, eventData){
	var runScriptNow = scriptData.script;
	Script.load(runScriptNow);
}

function midiEventReceived(eventData) {
	if (eventData.device != midiInDeviceId || eventData.channel != midiChannel ){
		return;
	}
	printDebug("Midi Status: " + eventData.status);
	printDebug("Midi Note: " + eventData.note);
	printDebug("Midi Velocity: " + eventData.velocity);
	if(wantAnimation){
		notFound = true;
		animationMap.forEach(function(animationData) {
			//printDebug("keynote = " + parseInt(animationData.keyNote) + " , note = " + parseInt(eventData.note));
			if(animationData.keyNote == eventData.note ){
				notFound = false;
				//printDebug(JSON.stringify(animationData) + "ME!!!!");
				//printDebug(typeof animationData.keyNote);
				//printDebug(typeof eventData.note);
				playAnimation(animationData, eventData);
				return;
			} 
		});
	}
	printDebug(notFound);
	if(wantSound){
		soundMap.forEach(function(soundData) {
			if(soundData.keyNote == eventData.note){
				notFound = false;
				playSound(soundData, eventData);
				return;
			}
		});
	}
	if(wantScript){
		scriptMap.forEach(function(scriptData) {
			if(scriptData.keyNote == eventData.note){
				notFound = false;
				runScript(scriptData, eventData);
				return;
			}
		});
	}
	if(notFound){
		MyAvatar.restoreAnimation();
		notFound = false; 
		};
}

	for (var i = 0; i < midiInDeviceList.Length; i++){
		if (midiInDeviceList[i] == midiDevice){
			midiInDeviceId = i;
		}
	}



function getMidiInputs(){
	var midiInDevices = Midi.listMidiDevices(INPUT);
	midiInDeviceList = midiInDevices;
}

function getMidiOutputs(){
	var midiOutDevices = Midi.listMidiDevices(OUTPUT);
	midiOutDevices.shift(); // Get rind of MS wavetable synth
	midiOutDeviceList = midiOutDevices;	
}


function getMidiDeviceId(){
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

function midiHardwareResetReceieved(){
	getMidiInputs();
	getMidiOutputs();
	getMidiDeviceId();
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
	Midi.typePitchBendEnable(ENABLE);
	Midi.typeSystemMessageEnable(DISABLE);
	getMidiInputs();
	getMidiOutputs();
	getMidiDeviceId();
	unblockMidiDevice();
}

function scriptEnding() {
	if(launchpadProgram){
		for (var i = 0; i < 127; i++) {
			Midi.sendMidiMessage(midiOutDeviceId, midiChannel, 9, i-1, 0);  //  Channel (1-16), Type (8-15), Note (0-127), Velocity (0-127), //  Add DEVICE INDEX?
		}
	};
	if(wantAnimation){
		animationMap.forEach(function(animationData) {
        	if (animationData.hasOwnProperty("animator")) {
            	MyAvatar.restoreAnimation();
        	};
    	});
	}
	if(wantSound){
		soundMap.forEach(function(soundData) {
        	if (soundData.hasOwnProperty("injector")) {
            	soundData.injector.stop();
        	};
    	});
	}
}

midiConfig();
loadAll();
print("In Device #" + midiInDeviceId + " Out Device #" + midiOutDeviceId);

Midi.midiMessage.connect(midiEventReceived);
Midi.midiReset.connect(midiHardwareResetReceieved);
Script.scriptEnding.connect(scriptEnding);