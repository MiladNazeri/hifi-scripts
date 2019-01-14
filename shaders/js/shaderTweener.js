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
                _entityID = entityID;
                _userData = Entities.getEntityProperties(_entityID, 'userData').userData;
                try {
                    _userDataProperties = JSON.parse(_userData);
                    X_MULTIPLIER = _userDataProperties.X_MULTIPLIER;
                    Y_MULTIPLIER = _userDataProperties.Y_MULTIPLIER;
                    Z_MULTIPLIER = _userDataProperties.Z_MULTIPLIER;
                    STARTING_UNIFORMS = _userDataProperties.STARTING_UNIFORMS;
                    MIDDLE_UNIFORMS = _userDataProperties.MIDDLE_UNIFORMS;
                    ENDING_UNIFORMS = _userDataProperties.ENDING_UNIFORMS;
                    TIME_TO_MIDDLE_UNIFORMS = _userDataProperties.TIME_TO_MIDDLE_UNIFORMS;
                    TIME_TO_ENDING_UNIFORMS = _userDataProperties.TIME_TO_ENDING_UNIFORMS;
                    DELAY_BETWEEN_TIME = _userDataProperties.DELAY_BETWEEN_TIME;
                    DAMP_AMOUNT = _userDataProperties.DAMP_AMOUNT;
                    cycleTime = _userDataProperties.cycleTime;
                    amplitude = _userDataProperties.amplitude;
                    secondaryAnimateIntervalStep = _userDataProperties.secondaryAnimateIntervalStep;
                    MUSIC_URL = _userDataProperties.MUSIC_URL;
                    FX_URL = _userDataProperties.FX_URL;
                    musicVolume = _userDataProperties.musicVolume;
                    fxVolume = _userDataProperties.fxVolume;
                    musicObject = SoundCache.getSound(MUSIC_URL);
                    fxObject = SoundCache.getSound(FX_URL);
                } catch (error) {
                    log("error", error);
                }
                piPerCycle = (Math.PI * 2) / cycleTime;

                // Tweens
                positionStart = Object.assign({}, STARTING_UNIFORMS);
                positionMiddle = Object.assign({}, MIDDLE_UNIFORMS);

                    tweenStart = new TWEEN.Tween(positionStart)
                        .to(MIDDLE_UNIFORMS, TIME_TO_MIDDLE_UNIFORMS)
                        .onStart(function() {
                            startTime = Date.now();
                            // animateInterval = Script.setInterval(function() {
                            //     sin = Math.sin(piPerCycle * (Date.now() - startTime));
                            //     totalAmp = amplitude * sin;
                            //     var currentUserData = JSON.parse(Entities.getEntityProperties(_entityID, 'userData').userData)
                            //     var currentUniforms = currentUserData.ProceduralEntity.uniforms;
                            //     var uniformKeys = Object.keys(currentUniforms);
                            //     uniformKeys.forEach(function(uniform){
                            //         currentUniforms[uniform] = currentUniforms[uniform] * X_MULTIPLIER
                            //     })
                                
                            //     var properties = {
                            //         userData: JSON.stringify(currentUserData)
                            //     };

                            //     Entities.editEntity(_entityID,properties);
                            // }, secondaryAnimateIntervalStep);
                            var currentPosition = Entities.getEntityProperties(_entityID, 'position').position;
                            playSound(musicObject, musicInjector, currentPosition, musicVolume);
                            playSound(fxObject, musicInjector, currentPosition, musicVolume);
                        })
                        .easing(TWEEN.Easing.Quintic.InOut)
                        .onUpdate(function (object) {
                            var currentUserData = JSON.parse(Entities.getEntityProperties(_entityID, 'userData').userData)
                            var currentUniforms = currentUserData.ProceduralEntity.uniforms;
                            currentUniforms = object;
                            
                            var properties = {
                                userData: JSON.stringify(currentUserData)
                            };
                            Entities.editEntity(_entityID, properties);
                        })
                        .onComplete(function (object) {
                            this._object = Object.assign({}, STARTING_UNIFORMS);

                        });

                    tweenFinish = new TWEEN.Tween(positionMiddle)
                        .to(ENDING_UNIFORMS, TIME_TO_ENDING_UNIFORMS)
                        .delay(DELAY_BETWEEN_TIME)
                        .onStart(function () {
                            log("Starting Tween Finish");
                        })
                        .easing(TWEEN.Easing.Quintic.InOut)
                        .onComplete(function (object) {
                            this._object = Object.assign({}, MIDDLE_UNIFORMS);
                            // Script.clearInterval(animateInterval);
                        })
                        .onUpdate(function (object) {
                            var currentUserData = JSON.parse(Entities.getEntityProperties(_entityID, 'userData').userData)
                            var currentUniforms = currentUserData.ProceduralEntity.uniforms;
                            currentUniforms = object;
                            
                            var properties = {
                                userData: JSON.stringify(currentUserData)
                            };
                            Entities.editEntity(_entityID, properties);
                        });

                    tweenStart.chain(tweenFinish);

                    Script.update.connect(updateTweens);
            };
            this.unload = function () {
                Script.update.disconnect(updateTweens);
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
            Script.update.disconnect(updateTweens);
            // Script.clearInterval(animateInterval);
        });
});


