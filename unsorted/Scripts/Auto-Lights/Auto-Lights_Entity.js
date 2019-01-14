(function () {
    // Eslint
    /* eslint-disable indent */
    // Dependencies
    // /////////////////////////////////////////////////////////////////////////
    Script.require("../Utilities/Polyfills.js")();

    var 
        Helper = Script.require("../Utilities/Helper.js?" + Date.now()),
        lerp = Helper.Maths.lerp;

    // Log Setup
    // /////////////////////////////////////////////////////////////////////////
    var 
        LOG_CONFIG = {},
        LOG_ENTER = Helper.Debug.LOG_ENTER,
        LOG_UPDATE = Helper.Debug.LOG_UPDATE,
        LOG_ERROR = Helper.Debug.LOG_ERROR,
        LOG_VALUE = Helper.Debug.LOG_VALUE,
        LOG_ARCHIVE = Helper.Debug.LOG_ARCHIVE;

    LOG_CONFIG[LOG_ENTER] = true;
    LOG_CONFIG[LOG_UPDATE] = true;
    LOG_CONFIG[LOG_ERROR] = true;
    LOG_CONFIG[LOG_VALUE] = true;
    LOG_CONFIG[LOG_ARCHIVE] = false;
    var log = Helper.Debug.log(LOG_CONFIG);

    // Init
    // /////////////////////////////////////////////////////////////////////////
    var
        // Motion
        speed,
        pitch, 
        yaw, 
        roll,

        // Color
        red,
        green, 
        blue,

        // Spotlight
        intensity, 
        falloffRadius,
        cutoff, 
        exponent,

        // Light settings
        MSG_MIN,
        MSG_MAX,
        EVENT_MINIMUM,
        DAMPINING,
        COLOR_WASH,
        CHANGE_COUNT,
        IS_SPOT,
        SHOULD_ROTATE,
        SHOULD_INTENSITY,
        SHOULD_EXPONENT,
        SHOULD_FALLOFF,
        SHOULD_CUTTOFF,
        SHOULD_RED,
        SHOULD_GREEN,
        SHOULD_BLUE,
        SHOULD_RANDOM_CONTROL_CHANGE,
        FILTER_TYPE,

        SPEED_CONTROL_MIN,
        SPEED_CONTROL_MAX,
        FALLOFF_MIN,
        FALLOFF_MAX,
        EXPONENT_MIN,
        EXPONENT_MAX,
        CUTTOFF_MIN,
        CUTTOFF_MAX,
        RED_MIN,
        RED_MAX,
        GREEN_MIN,
        GREEN_MAX,
        BLUE_MIN,
        BLUE_MAX,
        LIGHT_INTENSITY_MIN,
        LIGHT_INTENSITY_MAX,

        // DIRECTION_BLACK_LIST

        deltaTotal = 0,
        changeCounter = 0,
        currentColorWash = "red",
        currentChangeCount = 0,

        entityID,
        currentProperties,
        userData,
        userdataProperties,
        messageChannel = "Avatar-Listener",
        
        yawControlFilter,
        rollControlFilter,
        pitchControlFilter,
        falloffRadiusFilter,
        exponentFilter,
        cutoffFilter,
        redFilter,
        greenFilter,
        blueFilter,
        intensityFilter
    ;
    
    // Consts
    // /////////////////////////////////////////////////////////////////////////
    var 
        RED = "red",
        GREEN = "green",
        BLUE = "blue",
        BUTTERWORTH = "butterworth",
        AVERAGE = "average",
        
        DEFAULT_EVENT_MINIMUM = 0.01,
        DEFAULT_DAMPINING = 20,
        DEFAULT_MSG_MIN = 0.005,
        DEFAULT_MSG_MAX = 0.125,
        DEFAULT_IS_SPOT = false,
        DEFAULT_FILTER_TYPE = AVERAGE,
        DEFAULT_COLOR_WASH = false,
        DEFAULT_CHANGE_COUNT = 0,
        DEFAULT_SHOULD_ROTATE = false,
        DEFAULT_SHOULD_INTENSITY = true,
        DEFAULT_SHOULD_EXPONENT = true,
        DEFAULT_SHOULD_FALLOFF = true,
        DEFAULT_SHOULD_CUTTOFF = true,
        DEFAULT_SHOULD_RED = true,
        DEFAULT_SHOULD_GREEN = true,
        DEFAULT_SHOULD_BLUE = true,
        DEFAULT_SHOULD_RANDOM_CONTROL_CHANGE = true,

        DEFAULT_SPEED_CONTROL_MIN = 0,
        DEFAULT_SPEED_CONTROL_MAX = 5,
        DEFAULT_FALLOFF_MIN = 0.01,
        DEFAULT_FALLOFF_MAX = 2,
        DEFAULT_EXPONENT_MIN = 0.0001,
        DEFAULT_EXPONENT_MAX = 10,
        DEFAULT_CUTTOFF_MIN = -10,
        DEFAULT_CUTTOFF_MAX = 100,
        DEFAULT_RED_MIN = 0,
        DEFAULT_RED_MAX = 255,
        DEFAULT_GREEN_MIN = 0,
        DEFAULT_GREEN_MAX = 255,
        DEFAULT_BLUE_MIN = 0,
        DEFAULT_BLUE_MAX = 255,
        DEFAULT_LIGHT_INTENSITY_MIN = 0,
        DEFAULT_LIGHT_INTENSITY_MAX = 75
    ;


    // Collections
    // /////////////////////////////////////////////////////////////////////////
    var 
        // Objects
        controlBoxes = {},
        controlBoxesSPOT = {
            speedControl: 1,
            pitchControl: 1,
            yawControl: 1,
            rollControl: 1,
            fallOffRadiusControl: 1,
            exponentControl: 1,
            cutOffControl: 1,
            intensityControl: 1,
            redControl: 1,
            greenControl: 1,
            blueControl: 1
        },
        controlBoxesPOINT = {
            fallOffRadiusControl: 1,
            cutOffControl: 1,
            intensityControl: 1,
            redControl: 1,
            greenControl: 1,
            blueControl: 1
        },
        eventData = {
            note: "",
            velocity: 0
        },
        lightProps = {},
        props = {},

        // Arrays
        colors = [
            RED,
            GREEN,
            BLUE
        ],
        tempColors = [].concat(colors),
        changeCount = [
            65,
            150,
            175,
            200,
            250,
            300,
            350,
            400,
            450,
            500,
            1000
        ],
        colorArray = [
            "redControl",
            "greenControl",
            "blueControl1"
        ],
        controlArray = [],
        controlBoxesKeys = Object.keys(controlBoxes),
        lights = [],
        lightQualityArray = [
            "fallOffRadiusControl",
            "exponentControl",
            "cutOffControl",
            "intensityControl"
        ],
        speedArray = [
            "speedControl",
            "pitchControl",
            "yawControl",
            "rollControl"
        ],
        minMax = [
            [0.001, 0.130],
            [0.001, 0.002],
            [0.0002, 0.0005],
            [0.00002, 0.00005],
            [0.00002, 0.005],
            [0.00002, 0.010],
            [0.002, 0.010],
            [0.002, 0.0005]
        ]
    ;

    // Helper Functions
    // /////////////////////////////////////////////////////////////////////////
    
    function ButterworthFilter() {
        // coefficients calculated at: http://www-users.cs.york.ac.uk/~fisher/mkfilter/trad.html
        this.gain = 104.9784742;
        this.coeffOne = -0.7436551950;
        this.coeffTwo = 1.7055521455;
    
        // initialise the arrays
        this.xv = [];
        this.yv = [];
        for (var i = 0; i < 3; i++) {
            this.xv.push(0);
            this.yv.push(0);
        }
    
        // process values
        this.process = function(nextInputValue) {
            this.xv[0] = this.xv[1];
            this.xv[1] = this.xv[2];
            this.xv[2] = nextInputValue / this.gain;
            this.yv[0] = this.yv[1];
            this.yv[1] = this.yv[2];
            this.yv[2] = (this.xv[0] + this.xv[2]) +
                          2 * this.xv[1] +
                         (this.coeffOne * this.yv[0]) +
                         (this.coeffTwo * this.yv[1]);
            return this.yv[2];
        };
    } // end Butterworth filter constructor

    function AveragingFilter(length) {
        // initialise the array of past values
        this.pastValues = [];
        for (var i = 0; i < length; i++) {
            this.pastValues.push(0);
        }
        // single arg is the nextInputValue
        this.process = function() {
            if (this.pastValues.length === 0 && arguments[0]) {
                return arguments[0];
            } else if (arguments[0] !== null) {
                // console.log(this.pastValues)
                this.pastValues.push(arguments[0]);
                // console.log(this.pastValues)
                this.pastValues.shift();
                // console.log(this.pastValues)
                var nextOutputValue = 0;
                for (var value in this.pastValues) nextOutputValue += this.pastValues[value];
                return nextOutputValue / this.pastValues.length;
            } else {
                return 0;
            }
        };
    };
    
    var filter = (function() {
        return {
            createAveragingFilter: function(length) {
                var newAveragingFilter = new AveragingFilter(length);
                return newAveragingFilter;
            },
            createButterworthFilter: function() {
                var newButterworthFilter = new ButterworthFilter();
                return newButterworthFilter;
            }
        };
    })();

    function makeAllOneArray() {
        var array = zeroArray(controlBoxesKeys);
        array = array.map(function (index) {
            return index = 1;
        });
        return array;
    }

    function makeOneArray(number) {
        var array = zeroArray(controlBoxesKeys);
        array[number] = 1;
        return array;
    }

    function makeRandomArray(number) {
        var array = zeroArray(controlBoxesKeys);
        array = array.map(function (index) {
            var rand = Math.round(Math.random());
            // console.log("rand " + rand);
            if (rand) {
                return index = 1;
            } else {
                return 0;
            }
        });
        return array;
    }

    function zeroArray(array) {
        return array.map(function (ndex) {
            return 0;
        });
    }

    function makeColor(colorObj) {
        var red = colorObj.red;
        var green = colorObj.green;
        var blue = colorObj.blue;
        var colorArray = [red,green,blue];
        var arrayToGet0 = Math.floor(Math.random() * colorArray.length);
        colorArray[arrayToGet0] = colorArray[arrayToGet0] * 0.90;
        var finalColorObject = {
            red: colorArray[0],
            green: colorArray[1],
            blue: colorArray[2]
        };
        finalColorObject[currentColorWash] = finalColorObject[currentColorWash] * 0.05;
        return finalColorObject;
    }

    // Procedural Functions
    // /////////////////////////////////////////////////////////////////////////
    function replaceControlsWithBox(arrayOfControls, controlID) {
        arrayOfControls.forEach(function (control) {
            controlBoxes[control] = controlID;
        });
    }

    function updateControlBoxes(index) {
        // var array = [makeRandomArray()];
        var array = [makeAllOneArray(), makeOneArray(index), makeAllOneArray(), makeRandomArray(), makeOneArray(index),makeAllOneArray()];
        // var array = [makeOneArray(index)];
        var rand = Math.ceil(Math.random() * array.length - 1);
        array = array[rand];
        var currIndex = 0;
        // console.log("ARRAY: " + JSON.stringify(array))
        for (var key in controlBoxes) {
            controlBoxes[key] = array[currIndex];
            currIndex++;
        }
    }

    // Message Handlers
    // /////////////////////////////////////////////////////////////////////////
    function onEvent(entity) {
        log(LOG_ARCHIVE, "eventData.note", eventData)
        log(LOG_ARCHIVE, "controlBoxes", controlBoxes)

        // Light Speed
        if (eventData.note == controlBoxes.speedControl && SHOULD_ROTATE) {
            // console.log("eventData.note == controlBoxes.speedControl");
            var lerped = lerp(MSG_MIN, MSG_MAX, SPEED_CONTROL_MIN, SPEED_CONTROL_MAX, eventData.velocity);
            speed = lerped / 2;
            // emitRate = lerped;
            // Entities.editEntity(entity, {
            //     emitRate: emitRate
            // })
        }

        // Light Pitch
        if (eventData.note == controlBoxes.pitchControl && SHOULD_ROTATE) {
            // console.log("eventData.note == controlBoxes.pitchControl")

            pitch = lerp(MSG_MIN, MSG_MAX, 0, speed, eventData.velocity) - speed / 2;
            pitch = pitchControlFilter.process(pitch);
            
            Entities.editEntity(entity, {
                angularVelocity: { x: pitch, y: yaw, z: roll }
            })
        }

        // Light Yaw
        if (eventData.note == controlBoxes.yawControl && SHOULD_ROTATE) {
            // console.log("eventData.note == controlBoxes.yawControl")

            yaw = lerp(MSG_MIN, MSG_MAX, 0, speed, eventData.velocity) - speed / 2;
            yaw = yawControlFilter.process(yaw);
            Entities.editEntity(entity, {
                angularVelocity: { x: pitch, y: yaw, z: roll }
            })
        }

        // Light Roll
        if (eventData.note == controlBoxes.rollControl && SHOULD_ROTATE) {
            // console.log("eventData.note == controlBoxes.rollControl")

            roll = lerp(MSG_MIN, MSG_MAX, 0, speed, eventData.velocity) - speed / 2;
            roll = rollControlFilter.process(roll);

            Entities.editEntity(entity, {
                angularVelocity: { x: pitch, y: yaw, z: roll }
            })
        }

        // Light Fall Off Radius
        if (eventData.note == controlBoxes.fallOffRadiusControl && SHOULD_FALLOFF) {
            // console.log("eventData.note == controlBoxes.fallOffRadiusControl")

            falloffRadius = lerp(MSG_MIN, MSG_MAX, FALLOFF_MIN, FALLOFF_MAX, eventData.velocity);
            falloffRadius = falloffRadiusFilter.process(falloffRadius);
            
            props = { falloffRadius: falloffRadius };
            Entities.editEntity(entity, props);
        }

        // Light exponent
        if (eventData.note == controlBoxes.exponentControl && SHOULD_EXPONENT) {
            // console.log("eventData.note == controlBoxes.exponentControl")

            exponent = lerp(MSG_MIN, MSG_MAX, EXPONENT_MIN, EXPONENT_MAX, eventData.velocity);
            exponent = exponentFilter.process(exponent);

            props = { exponent: exponent };
            Entities.editEntity(entity, props);
        }

        // Light cutoff
        if (eventData.note == controlBoxes.cutOffControl && SHOULD_CUTTOFF) {
            // console.log("eventData.note == controlBoxes.cutOffControl")

            cutoff = lerp(MSG_MIN, MSG_MAX, CUTTOFF_MIN, CUTTOFF_MAX, eventData.velocity);
            cutoff = cutoffFilter.process(cutoff);
            props = { cutoff: cutoff };
            Entities.editEntity(entity, props);
        }

        // Light Red
        if (eventData.note == controlBoxes.redControl && SHOULD_RED) {
            // console.log("eventData.note == controlBoxes.redControl1")

            red = lerp(MSG_MIN, MSG_MAX, RED_MIN, RED_MAX, eventData.velocity);
            red = redFilter.process(red);

            // console.log("red1: " + red1);

            props = { color: makeColor({ red: red, green: green, blue: blue }) };
            // props = { color: { red: red, green: green, blue: blue } };
            Entities.editEntity(entity, props);
        }

        // Light green
        if (eventData.note == controlBoxes.greenControl && SHOULD_GREEN) {
            // console.log("eventData.note == controlBoxes.greenControl1")

            green = lerp(MSG_MIN, MSG_MAX, GREEN_MIN, GREEN_MAX, eventData.velocity);
            green = greenFilter.process(green);
            props = { color: makeColor({ red: red, green: green, blue: blue }) };
            // props = { color: { red: red, green: green, blue: blue } };
            Entities.editEntity(entity, props);
        }

        // Lightblue
        if (eventData.note == controlBoxes.blueControl && SHOULD_BLUE) {
            // console.log("eventData.note == controlBoxes.blueControl1")

            blue = lerp(MSG_MIN, MSG_MAX, BLUE_MIN, BLUE_MAX, eventData.velocity);
            blue = blueFilter.process(blue);

            props = { color: makeColor({ red: red, green: green, blue: blue }) };
            // props = { color: { red: red, green: green, blue: blue } };
            Entities.editEntity(entity, props);
        }

        // Light Intensicty
        if (eventData.note == controlBoxes.intensityControl && SHOULD_INTENSITY) {

            // console.log("MSG_MIN", MSG_MIN)
            // console.log("MSG_MAX", MSG_MAX)
            // console.log("LIGHT_INTENSITY_MIN", LIGHT_INTENSITY_MIN)
            // console.log("LIGHT_INTENSITY_MAX", LIGHT_INTENSITY_MAX)
            intensity = lerp(MSG_MIN, MSG_MAX, LIGHT_INTENSITY_MIN, LIGHT_INTENSITY_MAX, eventData.velocity);
            // console.log("intensity1:" + intensity);
            intensity = intensityFilter.process(intensity);
            // console.log("intensity2:" + intensity);

            
            // console.log("eventData.velocity" + eventData.velocity);
            // console.log("entity:" + entity);
            props = { intensity: intensity };
            Entities.editEntity(entity, props);
        }
    }

    function uniHandler(audioLevel) {
        eventData.velocity = audioLevel;
        eventData.note = 1;
        var currIndex = Math.floor(Math.random() * controlBoxesKeys.length);
        var currMMIndex = Math.floor(Math.random() * minMax.length);


        if (eventData.velocity > EVENT_MINIMUM) {
            changeCounter++;
            if (changeCounter >= currentChangeCount && COLOR_WASH !== false) {
                log(LOG_ENTER, "CHANGING WASH");

                changeCounter = 0;
                var index;
                log(LOG_VALUE, "tempColors", tempColors);

                if (tempColors.length === 0) {
                    log(LOG_VALUE, "color before concat", colors);
                    tempColors = tempColors.concat(colors);
                    log(LOG_VALUE, "tempColors after concat", tempColors);
                }

                index = Math.floor(Math.random() * tempColors.length);
                currentChangeCount = changeCount[Math.floor(Math.random() * changeCount.length)];
                log(LOG_VALUE, "index", index);

                log(LOG_VALUE, "tempColors after splice", tempColors);
                currentColorWash = tempColors[index];
                tempColors.splice(index, 1);

                log(LOG_VALUE, "currentColorWash", currentColorWash);
                
            }
            log(LOG_ARCHIVE, "eventData.velocity", eventData.velocity);

            updateControlBoxes(currIndex);

            onEvent(entityID);
        }
    }
    

    function onMessageReceived(chan, mesg) {
        var message = Number(mesg);
        if (chan === messageChannel) {
            // console.log("message Received", message);
        } else {
            // console.log("returning")
            return;
        }
        uniHandler(message);
    }

    function AutoLights_Server() {

    };

    // UserData
    var exampleUserData = {
        "grabbableKey": {
            "grabbable": false
        },
        "EVENT_MINIMUM": 0.01,
        "DAMPINING": 20,
        "IS_SPOT": false,
        "MSG_MIN": 0.005,
        "MSG_MAX": 0.125,
        "FILTER_TYPE": "average",
        "COLOR_WASH": false,
        "CHANGE_COUNT": 0,
        "SHOULD_ROTATE": false,
        "SHOULD_INTENSITY": true,
        "SHOULD_EXPONENT": true,
        "SHOULD_FALLOFF": true,
        "SHOULD_CUTTOFF": true,
        "SHOULD_RED": true,
        "SHOULD_GREEN": true,
        "SHOULD_BLUE": true,
        "SHOULD_RANDOM_CONTROL_CHANGE": true,
        "SPEED_CONTROL_MIN": 0,
        "SPEED_CONTROL_MAX": 5,
        "FALLOFF_MIN": 0.01,
        "FALLOFF_MAX": 2,
        "EXPONENT_MIN": 0.0001,
        "EXPONENT_MAX": 10,
        "CUTTOFF_MIN": -10,
        "CUTTOFF_MAX": 100,
        "LIGHT_INTENSITY_MIN": 0,
        "LIGHT_INTENSITY_MAX": 75,
        "RED_MIN": 0,
        "RED_MAX": 255,
        "GREEN_MIN": 0,
        "GREEN_MAX": 255, 
        "BLUE_MIN": 0,
        "BLUE_MAX": 255
    }

    AutoLights_Server.prototype = {
        remotelyCallable: [
            "message"
        ],
        preload: function (id) {
            entityID = id;
            currentProperties = Entities.getEntityProperties(entityID);
            Messages.subscribe(messageChannel);
            Messages.messageReceived.connect(onMessageReceived);
            userData = currentProperties.userData;
            console.log("test");
            console.log("ud:" + userData)
            try {
                userdataProperties = JSON.parse(userData);
                EVENT_MINIMUM = userdataProperties.EVENT_MINIMUM;
                DAMPINING = userdataProperties.DAMPINING;
                IS_SPOT = userdataProperties.IS_SPOT;
                MSG_MIN = userdataProperties.MSG_MIN;
                MSG_MAX = userdataProperties.MSG_MAX;
                FILTER_TYPE = userdataProperties.FILTER_TYPE;
                COLOR_WASH = userdataProperties.COLOR_WASH;
                currentColorWash = COLOR_WASH ? COLOR_WASH : RED;
                CHANGE_COUNT = userdataProperties.CHANGE_COUNT;
                currentChangeCount = CHANGE_COUNT ? CHANGE_COUNT : DEFAULT_CHANGE_COUNT;
                SHOULD_RANDOM_CONTROL_CHANGE = userdataProperties.SHOULD_RANDOM_CONTROL_CHANGE;
                SHOULD_ROTATE = userdataProperties.SHOULD_ROTATE;
                SHOULD_INTENSITY = userdataProperties.SHOULD_INTENSITY;
                SHOULD_EXPONENT = userdataProperties.SHOULD_EXPONENT;
                SHOULD_FALLOFF = userdataProperties.SHOULD_FALLOFF;
                SHOULD_CUTTOFF = userdataProperties.SHOULD_CUTTOFF;
                SHOULD_RED = userdataProperties.SHOULD_RED;
                SHOULD_GREEN = userdataProperties.SHOULD_GREEN;
                SHOULD_BLUE = userdataProperties.SHOULD_BLUE;
                

                SPEED_CONTROL_MIN = userdataProperties.SPEED_CONTROL_MIN || DEFAULT_SPEED_CONTROL_MIN;
                SPEED_CONTROL_MAX = userdataProperties.SPEED_CONTROL_MAX || DEFAULT_SPEED_CONTROL_MAX;
                FALLOFF_MIN = userdataProperties.FALLOFF_MIN || DEFAULT_FALLOFF_MIN;
                FALLOFF_MAX = userdataProperties.FALLOFF_MAX || DEFAULT_FALLOFF_MAX;
                EXPONENT_MIN = userdataProperties.EXPONENT_MIN || DEFAULT_EXPONENT_MIN;
                EXPONENT_MAX = userdataProperties.EXPONENT_MAX || DEFAULT_EXPONENT_MAX;
                CUTTOFF_MIN = userdataProperties.CUTTOFF_MIN || DEFAULT_CUTTOFF_MIN;
                CUTTOFF_MAX = userdataProperties.CUTTOFF_MAX || DEFAULT_CUTTOFF_MAX;
                RED_MIN = userdataProperties.RED_MIN || DEFAULT_RED_MIN;
                RED_MAX = userdataProperties.RED_MAX || DEFAULT_RED_MAX;
                GREEN_MIN = userdataProperties.GREEN_MIN || DEFAULT_GREEN_MIN;
                GREEN_MAX = userdataProperties.GREEN_MAX || DEFAULT_GREEN_MAX;
                BLUE_MIN = userdataProperties.BLUE_MIN || DEFAULT_BLUE_MIN;
                BLUE_MAX = userdataProperties.BLUE_MAX || DEFAULT_BLUE_MAX;
                LIGHT_INTENSITY_MIN = userdataProperties.LIGHT_INTENSITY_MIN || DEFAULT_LIGHT_INTENSITY_MIN;
                LIGHT_INTENSITY_MAX = userdataProperties.LIGHT_INTENSITY_MAX || DEFAULT_LIGHT_INTENSITY_MAX;

                controlBoxes = IS_SPOT ? controlBoxesSPOT : controlBoxesPOINT;
                controlBoxesKeys = Object.keys(controlBoxes);

                if (FILTER_TYPE === BUTTERWORTH) {
                    yawControlFilter = filter.createButterworthFilter();
                    rollControlFilter = filter.createButterworthFilter();
                    pitchControlFilter = filter.createButterworthFilter();
                    falloffRadiusFilter = filter.createButterworthFilter();
                    exponentFilter = filter.createButterworthFilter();
                    cutoffFilter = filter.createButterworthFilter();
                    redFilter = filter.createButterworthFilter();
                    greenFilter = filter.createButterworthFilter();
                    blueFilter = filter.createButterworthFilter();
                    intensityFilter = filter.createButterworthFilter();
                } else {
                    yawControlFilter = filter.createAveragingFilter(DAMPINING);
                    rollControlFilter = filter.createAveragingFilter(DAMPINING);
                    pitchControlFilter = filter.createAveragingFilter(DAMPINING);
                    falloffRadiusFilter = filter.createAveragingFilter(DAMPINING);
                    exponentFilter = filter.createAveragingFilter(DAMPINING);
                    cutoffFilter = filter.createAveragingFilter(DAMPINING);
                    redFilter = filter.createAveragingFilter(DAMPINING);
                    greenFilter = filter.createAveragingFilter(DAMPINING);
                    blueFilter = filter.createAveragingFilter(DAMPINING);
                    intensityFilter = filter.createAveragingFilter(DAMPINING);
                }
            } catch (e) {
                //
            }
        },
        message: function (id, param) {
            var audioLevel = Number(param[0]);
            // log(LOG_VALUE, "audioLevel", audioLevel);
            uniHandler(audioLevel);
        },
        unload: function () {
            Messages.unsubscribe(messageChannel);
            Messages.messageReceived.disconnect(onMessageReceived);
        }
    };
    
    Script.scriptEnding.connect(function() {
        Messages.unsubscribe(messageChannel);
        Messages.messageReceived.disconnect(onMessageReceived);
    });

    return new AutoLights_Server;
});




// function onMessageReceived(chan, mesg) {
//     var message = Number(mesg);
//     if (chan === messageChannel) {
//         // console.log("message Received", message);
//     } else {
//         // console.log("returning")
//         return;
//     }
//     eventData.velocity = message;
//     eventData.note = 1;
//     var currIndex = Math.floor(Math.random() * controlBoxesKeys.length);
//     var currMMIndex = Math.floor(Math.random() * minMax.length);


//     if (eventData.velocity > EVENT_MINIMUM) {
//         changeCounter++;
//         if (CHANGE_COUNT && changeCounter >= currentChangeCount) { 
//             log(LOG_ENTER, "CHANGING WASH");

//             changeCounter = 0;
//             var index;
//             log(LOG_VALUE, "tempColors", tempColors);

//             if (tempColors.length === 0) {
//                 log(LOG_VALUE, "color before concat", colors);
//                 tempColors = tempColors.concat(colors);
//                 log(LOG_VALUE, "tempColors after concat", tempColors);
//             }

//             index = Math.floor(Math.random() * tempColors.length);
//             currentChangeCount = changeCount[Math.floor(Math.random() * changeCount.length)];
//             log(LOG_VALUE, "index", index);

//             log(LOG_VALUE, "tempColors after splice", tempColors);
//             currentColorWash = tempColors[index];
//             tempColors.splice(index, 1);

//             log(LOG_VALUE, "currentColorWash", currentColorWash);
            
//         };
//         log(LOG_ARCHIVE, "eventData.velocity", eventData.velocity);

//         // console.log("minMax", JSON.stringify(minMax));
//         // console.log("currMMIndex", JSON.stringify(currMMIndex));
//         // console.log("currMMIndex", JSON.stringify(minMax[0]));
//         // console.log("currIndex", JSON.stringify(currIndex));
        
//         if (SHOULD_RANDOM_CONTROL_CHANGE) {
//             updateControlBoxes(currIndex);
//         }
//         // MSG_MIN = minMax[currMMIndex][0];
//         // MSG_MAX = minMax[currMMIndex][1];

//         onEvent(entityID);
//     }

// }