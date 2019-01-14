(function () {
    /* eslint-disable indent */

    // Dependencies
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

        var TWEEN = Script.require("./tween.js");


    // Helper Functions
        function log(label, value, isActive) {
            isActive = isActive || true;
            if (!isActive) {
                return;
            }
            print("\n" + label + "\n" + "***************************************\n", JSON.stringify(value));
        }
    
        function playSound(soundObject, injector, position, volume, localOnly) {
            log("playing position", position)
            if (injector) {
                injector.stop();
            }
            if (soundObject && soundObject.downloaded) {
                injector = Audio.playSound(soundObject, {
                    position: position,
                    volume: volume,
                    loop: false,
                    localOnly: localOnly
                });
            } else {
                print("soundURL not downloaded!");
                return;
            }
        }

    // Consts
        var STARTING_UNIFORMS = { x: -4.3863, y: -3.0280, z: -45.2343 };
        var MIDDLE_UNIFORMS = { x: -4.3862, y: -2.9678, z: -43.0472 };
        var ENDING_UNIFORMS = { x: -4.3863, y: 0.2596, z: -45.1784 };
        var TIME_TO_MIDDLE_UNIFORMS = 5000;
        var TIME_TO_ENDING_UNIFORMS = 5000;
        var DELAY_BETWEEN_TIME = 1250;
        var X_MULTIPLIER = 0.05;
        var Y_MULTIPLIER = 0.05;
        var Z_MULTIPLIER = 0.05;
        var DAMP_AMOUNT = 10;


    // Init
        var _entityID = null;
        var _userData = null;
        var _userDataProperties = null;

        var positionStart = Object.assign({}, STARTING_UNIFORMS);
        var positionMiddle = Object.assign({}, MIDDLE_UNIFORMS);
        var cycleTime = 100;
        var piPerCycle = (Math.PI * 2) / cycleTime;
        var amplitude = 0.25;
        var secondaryAnimateIntervalStep = 20;
        var animateInterval = null;

        var startTime = Date.now();
        var sin = Math.sin(piPerCycle * (Date.now() - startTime));
        var totalAmp = amplitude * sin;

        var tweenStart = null;
        var tweenFinish = null;       

        var MUSIC_URL = "";
        var FX_URL = "";
        var musicObject = null;
        var fxObject = null;
        var musicVolume = 1.0; 
        var fxVolume = 1.0;
        var musicInjector = null;
        var fxInjector = null;

    // Procedural
        function updateTweens() {
            TWEEN.update();
        }
    
    // Entity Object
        // Defined
            this.remotelyCallable = [
                "reset",
                "start"
            ];
            this.preload = function (entityID) {

            };
            this.unload = function () {
                // Script.update.disconnect(updateTweens);
                // Script.clearInterval(animateInterval);
            };
        // Custom
            this.reset = function () {
                var currentUserData = JSON.parse(Entities.getEntityProperties(_entityID, 'userData').userData)
                var currentUniforms = currentUserData.ProceduralEntity.uniforms;
                currentUniforms = Object.assign({}, STARTING_UNIFORMS);
                
                var properties = {
                    userData: JSON.stringify(currentUserData)
                };
                
                Entities.editEntity(_entityID, properties);
                // Script.clearInterval(animateInterval);

            };
            this.start = function () {
                log("start being triggered");
                tweenStart.start();
            };


    // Cleanup
        Script.scriptEnding.connect(function () {
            // Script.update.disconnect(updateTweens);
            // Script.clearInterval(animateInterval);
        });
});


