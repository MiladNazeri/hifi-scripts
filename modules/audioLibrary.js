/*

    Audio Library Module
    audioLibrary.js
    Created by Milad Nazeri on 2019-01-16
    Copyright 2019 High Fidelity, Inc.

    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

    Module that helps manage a playlist of sounds

*/

var Sound = Script.require("./sound.js");

var audioStore = {};
var audioObjects = {};

function saveNewSound(name, audioObject) {
    if (audioStore[name]){
        audioStore[name].unload();
    }
    audioStore[name] = new Sound(audioObject.url, name);
    audioStore[name].key = audioObject.key;
    audioStore[name].changeLoop(audioObject.loop);
    audioObject.fadeInTime > 0 && audioStore[name].changeShouldFadeIn(true);
    audioObject.fadeOutTime > 0 && audioStore[name].changeShouldFadeOut(true);
    audioObject.fadeInTime && audioStore[name].changeFadeInTime(parseInt(audioObject.fadeInTime));
    audioObject.fadeOutTime && audioStore[name].changeFadeOutTime(parseInt((audioObject.fadeOutTime)));
    audioObject.maxVolume !== 'undefined' && audioStore[name].changeMaxVolume(audioObject.maxVolume);
    audioObject.position !== 'undefined' && audioStore[name].changePosition(audioObject.position);
    audioObject.orientation !== 'undefined' && audioStore[name].changeOrientation(audioObject.orientation);
    audioObject.pitch !== 'undefined' && audioStore[name].changePitch(audioObject.pitch || 1);
}


function saveSoundEdit(name, audioObject){
    audioStore[name].changeLoop(audioObject.loop);
    audioObject.fadeInTime > 0 && audioStore[name].changeShouldFadeIn(true);
    audioObject.fadeOutTime > 0 && audioStore[name].changeShouldFadeOut(true);
    audioObject.fadeInTime && audioStore[name].changeFadeInTime(parseInt(audioObject.fadeInTime));
    audioObject.fadeOutTime && audioStore[name].changeFadeOutTime(parseInt((audioObject.fadeOutTime)));
    audioObject.maxVolume !== 'undefined' && audioStore[name].changeMaxVolume(audioObject.maxVolume);
    audioObject.position !== 'undefined' && audioStore[name].changePosition(audioObject.position);
    audioObject.orientation !== 'undefined' && audioStore[name].changeOrientation(audioObject.orientation);
    audioObject.pitch !== 'undefined' && audioStore[name].changePitch(audioObject.pitch || 1);
}


function renameAudio(oldName, newName) {
    audioStore[newName] = audioStore[oldName];
    audioStore[newName].name = newName;
    delete audioStore[oldName];
}


function removeAudio(name) {
    if (audioStore[name]) {
        audioStore[name].unload();
    }
    delete dataStore.mapping[audioStore[name].key];
    delete audioStore[name];
    delete this.audioObjects[name];
}


function assignAudioToKey(name, key) {
    audioStore[name].key = key;
}


function playAudio(name) {
    audioStore[name].play();
}


function stopAudio(name) {
    audioStore[name].stop();
}


function changeFadeOptions(name, fadeOptions) {
    audioStore[name].changeShouldFadeIn(fadeOptions.fadeInTime > 0);
    audioStore[name].changeShouldFadeOut(fadeOptions.fadeOutTime > 0);
    audioStore[name].changeFadeInTime(fadeOptions.fadeInTime);
    audioStore[name].changeFadeOutTime(fadeOptions.fadeOutTime);
    audioStore[name].changeLoop(fadeOptions.loop);
}


function changeVolumeOptions(name, volumeOptions) {
    audioStore[name].minVolume = volumeOptions.minVolume;
    audioStore[name].maxVolume = volumeOptions.maxVolume;
}


function changePose(name, pose){
    pose.position && audioStore[name].changePosition(pose.position);
    pose.orientation && audioStore[name].changePosition(pose.orientation);
}


module.exports = {
    saveNewSound: saveNewSound,
    saveSoundEdit: saveSoundEdit,
    renameAudio: renameAudio,
    removeAudio: removeAudio,
    assignAudioToKey: assignAudioToKey,
    playAudio: playAudio,
    stopAudio: stopAudio,
    changeFadeOptions: changeFadeOptions,
    changeVolumeOptions: changeVolumeOptions,
    changePose: changePose
}
