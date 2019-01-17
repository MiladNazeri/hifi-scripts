/*

    Individual Sound Player
    sound.js
    Created by Milad Nazeri on 2019-01-16
    Copyright 2019 High Fidelity, Inc.

    Distributed under the Apache License, Version 2.0.
    See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

    Used with the audio library to control individual sounds

*/

var url = url;
var name = name;
var sound = SoundCache.getSound(url);
var injector;
var SECS_TO_MS = 1000;
var fadeInTimer = null;
var fadeOutTimer = null;
var fadeInTime = 2000;
var fadeOutTime = 2000;
var percentChange = 0.01;
var fadeInDurationTimeStep = fadeInTime * percentChange;
var fadeOutDurationTimeStep = fadeOutTime * percentChange;
var fadeLevelStep = maxVolume * percentChange;
var fadeOutStarted = false;
var fadeOutStopped = false;
var fadeInStopped = false;
var shouldFadeIn = true;
var shouldFadeOut = true;
var maxVolume = 1.0;
var minVolume = 0.0;
var currentVolume = 1.0;
var position = null;
var orientation = null;
var pitch = 1;
var loop = false;
var secondOffset = null;
var localOnly = false;   

function changePosition(position) {
    // console.log("changing Position");
    position = position;
    if (injector) {
        injector.setOptions({ position: position});
    }
}


function changeOrientation(orientation) {
    // console.log("changing Orientation");
    orientation = orientation;
    if (injector) {
        injector.setOptions({ orientation: orientation });
    }
}


function changeSecondOffset(secondOffset) {
    // console.log("changing offset");

    secondOffset = secondOffset;
    if (injector) {
        injector.setOptions({ secondOffset: secondOffset });
    }
}


function changeLoop(shouldLoop) {
    //// console.log("changing loop");

    loop = shouldLoop;
    if (injector) {
        injector.setOptions({ loop: loop });
    }
}


function changePitch(pitch) {
    // console.log("changing pitch");

    pitch = pitch;
    if (injector) {
        injector.setOptions({ pitch: pitch });
    }
}


function changeFadeInTime(time) {
    // console.log("changing fadeintime");
    time = Math.max(time, 0);
    fadeInTime = time;
    fadeInDurationTimeStep = fadeInTime * percentChange;
}


function changeFadeOutTime(time){
    // console.log("changing fadeouttime");
    time = Math.max(time, 0);
    fadeOutTime = time;
    fadeOutDurationTimeStep = fadeOutTime * percentChange;
}


function changeMaxVolume(volume) {
    // console.log("changing maxvolume");
    volume = Math.max(volume, 0);
    maxVolume = Math.min(volume, 1.0);
    fadeLevelStep = maxVolume * percentChange;
}


function changeCurrentVolume(volume) {
    // console.log("changing currentvolume");
    // console.log("volume:", volume);
    currentVolume = volume;
    if (injector) {
        // console.log("setting options");
        // console.log("currentVolume", currentVolume);
        injector.setOptions({ volume: currentVolume });
    }
}


function changeShouldFadeIn(shouldFadeIn) {
    // console.log("changeShouldFadeIn");

    shouldFadeIn = shouldFadeIn;
}


function changeShouldFadeOut(shouldFadeOut) {
    // console.log("changeShouldFadeOut");

    shouldFadeOut = shouldFadeOut;
}


function fadeIn() {
    // console.log("fadeIn");
    
    var _this = this;
    fadeInStarted = true;
    if (injector && injector.isPlaying()){
        fadeInTimer = Script.setInterval(function(){
            // console.log("Starting fade in");
            // console.log("_currentVolume", _currentVolume);

            _currentVolume += _fadeLevelStep;
            _currentVolume = Math.min(_maxVolume, _currentVolume);
            if (_injector){
                // console.log("VOLUME: ", JSON.stringify(_injector.options));
                _injector.setOptions({ volume: _currentVolume });
                if (_currentVolume >= _maxVolume) {
                    _fadeInStarted = false;
                    Script.clearInterval(_fadeInTimer);
                }
            } else {
                Script.clearInterval(_fadeInTimer);
            }

        }, fadeInDurationTimeStep);
    }
}


function fadeOut() {
    // console.log("fadeOut");

    var _this = this;
    fadeOutStarted = true;
    if (injector && injector.isPlaying()) {
        // console.log("_currentVolume", _currentVolume);
        fadeOutTimer = Script.setInterval(function () {
            // console.log("stopping fade out");
            _currentVolume -= _fadeLevelStep;
            // console.log(" _currentVolume After", _currentVolume);
            _currentVolume = Math.max(_minVolume, _currentVolume);
            if (_injector){
                // console.log("VOLUME: ",JSON.stringify(_injector.options));
                _injector.setOptions({ volume: _currentVolume });
                if (_currentVolume <= _minVolume) {
                    _fadeOutStarted = false;
                    _injector.stop();
                    _injector = null;
                    Script.clearInterval(_fadeOutTimer);
                }
            } else {
                Script.clearInterval(_fadeOutTimer);
            }

        }, fadeOutDurationTimeStep);
    }
}


function getURL() {
    return url;
}


function getDurationSeconds() {
    if (sound.downloaded) {
        return sound.duration;
    }
}


function getDurationMS() {
    if (sound.downloaded) {
        return sound.duration * SECS_TO_MS;
    }
}


function play(restart) {
    console.log("play");
    if (fadeInStarted || fadeOutStarted) {
        return;
    }

    if (injector && injector.isPlaying() && !restart) {
        // console.log("stop");

        stop();
        return;
    }
    if (injector && injector.isPlaying() && restart) {
        // console.log("restart");
        unload();
        play();
        return;
    }
    playSoundStaticPosition();
}


function playSoundStaticPosition(injectorOptions, bufferTime, onCompleteCallback, args) {
    console.log("playSoundStaticPosition");
    var _this = this;
    var presetInjectorOptions = {};
    position !== null && (presetInjectorOptions.position = position);
    orientation !== null && (presetInjectorOptions.orientation = orientation);
    volume !== null && (presetInjectorOptions.volume = maxVolume);
    loop !== null && (presetInjectorOptions.loop = loop);
    localOnly !== null && (presetInjectorOptions.localOnly = localOnly);
    pitch !== null && (presetInjectorOptions.pitch = pitch)


    injectorOptions = injectorOptions || presetInjectorOptions;
    if (sound.downloaded) {
        injectorOptions = { loop: true};
        shouldFadeIn && changeCurrentVolume(minVolume);
        injector = Audio.playSound(sound, injectorOptions);
        shouldFadeIn && fadeIn();
        var soundLength = getDurationMS();

        if (bufferTime && typeof bufferTime === "number") {
            soundLength = soundLength + bufferTime;
        }
        var injector = injector;

        if (!loop && shouldFadeOut && !fadeOutStarted) {
            console.log("STOPPING THE AUDIOING !loop")
            var startFadeOutTime = soundLength - fadeOutTime;
            Script.setTimeout(function(){
                _fadeOut();
            }, startFadeOutTime);
        }

        if (!loop) {
            Script.setTimeout(function () {
                console.log("STOPPING THE AUDIOING !loop")
                if (injector) {
                    injector.stop();
                    injector = null;
                }

                if (onCompleteCallback) {
                    onCompleteCallback(args);
                }

            }, soundLength);
        }
        console.log("LOOPING")
    }
}


function stop(){
    // console.log("stop");
    
    if (shouldFadeOut && !fadeOutStarted) {
        fadeOutStarted = true;
        fadeOut();
    } else {
        unload();
    }
}


function isLoaded() {
    // console.log("isLoaded");

    return sound.downloaded;
}


function setOptions(options){
    var finalObject = {};
    Object.keys(options).forEach(function(arg){
        if (typeof options[arg] !== "undefined") {
            finalObject[arg] = options[arg];
        }
    });
    injector && injector.setOptions(finalObject);
}


function unload() {
    // console.log("unload");

    if (injector) {
        injector.stop();
        injector = null;
    }
}

module.exports = {
    changePosition: changePosition,
    changeOrientation: changeOrientation,
    changeSecondOffset: changeSecondOffset,
    changeLoop: changeLoop,
    changePitch: changePitch,
    changeFadeInTime: changeFadeInTime,
    changeFadeOutTime: changeFadeOutTime,
    changeMaxVolume: changeMaxVolume,
    changeCurrentVolume: changeCurrentVolume,
    changeShouldFadeIn: changeShouldFadeIn,
    changeShouldFadeOut: changeShouldFadeOut,
    fadeIn: fadeIn,
    getURL: getURL,
    getDurationSeconds: getDurationSeconds,
    getDurationMS: getDurationMS,
    play: play,
    playSoundStaticPosition: playSoundStaticPosition,
    stop: stop,
    isLoaded: isLoaded,
    setOptions: setOptions,
    unload: unload
};