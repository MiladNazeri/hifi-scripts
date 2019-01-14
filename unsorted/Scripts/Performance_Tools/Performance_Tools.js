(function () {
    // Eslint
    /* eslint-disable indent */
    // Polyfills
    if (!Array.prototype.findIndex) {
        Object.defineProperty(Array.prototype, 'findIndex', {
            value: function (predicate) {
                // 1. Let O be ? ToObject(this value).
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }

                var o = Object(this);

                // 2. Let len be ? ToLength(? Get(O, "length")).
                var len = o.length >>> 0;

                // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                if (typeof predicate !== 'function') {
                    throw new TypeError('predicate must be a function');
                }

                // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                var thisArg = arguments[1];

                // 5. Let k be 0.
                var k = 0;

                // 6. Repeat, while k < len
                while (k < len) {
                    // a. Let Pk be ! ToString(k).
                    // b. Let kValue be ? Get(O, Pk).
                    // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                    // d. If testResult is true, return k.
                    var kValue = o[k];
                    if (predicate.call(thisArg, kValue, k, o)) {
                        return k;
                    }
                    // e. Increase k by 1.
                    k++;
                }

                // 7. Return -1.
                return -1;
            },
            configurable: true,
            writable: true
        });
    }
    // Init
    var isAppActive = false,
        isTabletUIOpen = false,
        CREATE_NEW_CONTROL = "createNewControl",
        DELETE_CONTROL = "deleteControl",
        CREATE_NEW_INPUT = "createInput",
        DELETE_INPUT = "deleteInput",
        CREATE_NEW_FILTER = "createNewFilter",
        DELETE_FILTER = "deleteFilter",
        CREATE_NEW_ENDPOINT = "createNewEndpoint",
        DELETE_ENDPOINT = "deleteEndpoint",
        CREATE_NEW_INPUT_TYPE = "createNewInputType",
        DELETE_INPUT_TYPE = "deleteInputType",            
        CONTROL_PREFIX = "ctrl_",
        INPUT_PREFIX = "input_",
        FILTER_PREFIX = "filter_",
        ENDPOINT_PREFIX = "endpoint_",
        UPDATE_UI = "update_ui",
        BUTTON = "Button",
        SLIDEBOX = "SlideBox",
        GENERATOR = "Generator",
        AUDIO_LISTENER = "Audio-Listener",
        MIDI_INPUT = "Midi-Input";

    // Collections
    var allInputs = [],
        allFilters = [],
        allEndpoints = [],
        allControls = [],
        currentIDs = {
            control: 0,
            input: 0,
            filter: 0,
            endpoint: 0
        },
        eventData = {
            note: 0,
            velocity: 0
        },
        inputTypes = [
            BUTTON
            // "SlideBox",
            // "Generator",
            // "Audio-Listener",
            // "Midi-Input"
        ];

    // Helper Functions
    function setAppActive(active) {
        // Start/stop application activity.
        if (active) {
            console.log("Start app");
            // TODO: Start app activity.
        } else {
            console.log("Stop app");
            // TODO: Stop app activity.
        }

        isAppActive = active;
    }

    function col(r, g, b) {
        var obj = {};
        obj.red = r;
        obj.green = g;
        obj.blue = b;
        return obj;
    }

    function vec(x, y, z) {
        var obj = {};
        obj.x = x;
        obj.y = y;
        obj.z = z;
        return obj;
    }

    function lerp(InputLow, InputHigh, OutputLow, OutputHigh, Input) {
        return ((Input - InputLow) / (InputHigh - InputLow)) * (OutputHigh - OutputLow) + OutputLow;
    }

    function checkIfIn(currentPosition, control) {
        // console.log("currentPosition", currentPosition)
        // console.log("control", control)
        var box = control.minMax;
        return (currentPosition.x >= box.xMin && currentPosition.x <= box.xMax) &&
            (currentPosition.y >= box.yMin && currentPosition.y <= box.yMax) &&
            (currentPosition.z >= box.zMin && currentPosition.z <= box.zMax);
    }

    function whereOnRange(currentPosition, control) {
        var whereOnRange = {
            x: 0,
            y: 0,
            z: 0
        };
        for (var key in whereOnRange) {
            var minKey = key + "Min";
            var maxKey = key + "Max";
            var min = control.minMax[minKey];
            var max = control.minMax[maxKey];
            var point = lerp(min, max, 0, 255, currentPosition[key]);
            // var point = lerp(min, max, 0, max - min, currentPosition[key]);

            whereOnRange[key] = point;
        }
        // console.log("whereOnRange", whereOnRange);

        return whereOnRange;
    }

    function makeBox(distanceInFront, name, dim, color, userData) {
        distanceInFront = distanceInFront || 1;
        name = name || 1;
        dim = dim || vec(1,1,1);
        color = color || col(1,1,1);
        userData = userData || {};

        var pos = Vec3.sum(
            MyAvatar.position,
            Vec3.multiply(Quat.getForward(MyAvatar.orientation), distanceInFront)
        );
        var entityScript = (function () {
            function onClick() {}
            this.preload = function (id) {
                var data = JSON.parse(Entities.getEntityProperties(id, ["userData"]).userData);
                console.log(JSON.stringify(data));
            }
            this.stopNearTrigger = function () {
                console.log("trigger");
                onClick();
            };
            this.stopFarTrigger = function () {
                console.log("trigger");
                onClick();
            };
            this.clickDownOnEntity = function (entityID, mouseEvent) {
                if (mouseEvent.isLeftButton) {
                    console.log("clicked");
                    onClick();
                }
            };
            this.enterEntity = function () {
                onClick();
            }
        });
        var newPos = Vec3.sum(pos, vec(0, 0.25, 0))
        var props = {
            rotation: MyAvatar.orientation,
            name: name,
            type: "Box",
            position: newPos,
            script: "(" + entityScript + ")",
            dimensions: dim,
            color: color,
            collisionless: true,
            userData: JSON.stringify(userData)
        }
        var id = Entities.addEntity(props);
        // var fwdVector = Quat.getForward(MyAvatar.orientation);
        // controlArray.push(new Control(newPos, dim, 0, 255, id, fwdVector));
        return id;
    }

    // Constructor Functions
    function Input(id, props) {
        this.id = entityID;
        this.currentProps = props;
    }
    Input.prototype = {
        updateProps: function() {
            var ent = Entities.getEntityProperties(this.id);
            this.currentProps = ent;
        },
        editProps: function() {

        }
    }

    function Filter() {

    }

    function EndPoint() {

    }

    function Control() {

    }


    // Procedural Functions
    function setup() {
        tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
        tabletButton = tablet.addButton({
            text: buttonName,
            icon: "icons/tablet-icons/raise-hand-i.svg",
            activeIcon: "icons/tablet-icons/raise-hand-a.svg",
            isActive: isAppActive
        });
        if (tabletButton) {
            tabletButton.clicked.connect(onTabletButtonClicked);
        } else {
            console.error("ERROR: Tablet button not created! App not started.");
            tablet = null;
            return;
        }
        tablet.screenChanged.connect(onTabletScreenChanged);
    }

    function handleInputTypeCreation(input, id) {
        switch (input.inputType) {
            case BUTTON:
                var boxId = makeBox(2, id + "_" + input.inputType, vec(0.5,0.5,0.5), col(20,20,20));
                var index = allInputs.findIndex(function(item) {
                    return item.id === id;
                });
                allInputs[index].input.entityID = boxId;
                break;
            default:
        }
        
        doUIUpdate();
    }

    function handleInputTypeDeletion(id) {
        console.log("in handleinput", JSON.stringify(id));
        var index = allInputs.findIndex(function(item) {
            return item.id === id;
        });
        console.log("allInputs", JSON.stringify(allInputs));
        var entity = allInputs[index];
        console.log("entity", JSON.stringify(entity));
        switch (entity.input.inputType) {
            case BUTTON:
                console.log("DELETEING ENTITY");
                Entities.deleteEntity(entity.input.entityID);
                break;
            default:
        }       
    }

    function doUIUpdate() {
        tablet.emitScriptEvent(JSON.stringify({
            type: UPDATE_UI,
            value: {
                currentIDs: currentIDs,
                allControls: allControls,
                allInputs: allInputs,
                allFilters: allFilters,
                allEndpoints: allEndpoints,
                inputTypes: inputTypes
            }
        }));
    }

    // Message Channels
    var messageChannel = "Performance";
    // Messages.subscribe(messageChannel);

    function onMessageReceived(chan, msg, sender) {
        console.log("MESSAGE FROM MESSAGE", msg);
        var data = JSON.parse(msg);
        if (data.type === "switch") {
            var event = {
                type: "changeMessage",
                value: data.data
            };
            tablet.emitScriptEvent(JSON.stringify(event));
        }
    }
    // Messages.messageReceived.connect(onMessageReceived);

    // Tablet
    var tablet = null,
        buttonName = "Performance_Tools",
        tabletButton = null,
        APP_URL = Script.resolvePath('./Tablet/Performance_Tools.html'),
        EVENT_BRIDGE_OPEN_MESSAGE = "eventBridgeOpen",
        SET_ACTIVE_MESSAGE = "setActive",
        CLOSE_DIALOG_MESSAGE = "closeDialog";


    function onTabletButtonClicked() {
        // Application tablet/toolbar button clicked.
        if (isTabletUIOpen) {
            tablet.gotoHomeScreen();
        } else {
            // Initial button active state is communicated via URL parameter so that active state is set immediately without 
            // waiting for the event bridge to be established.
            tablet.gotoWebScreen(APP_URL + "?active=" + isAppActive);
        }
    }

    function onTabletScreenChanged(type, url) {
        // Tablet screen changed / desktop dialog changed.
        var wasTabletUIOpen = isTabletUIOpen;

        isTabletUIOpen = url.substring(0, APP_URL.length) === APP_URL; // Ignore URL parameter.
        if (isTabletUIOpen === wasTabletUIOpen) {
            return;
        }

        if (isTabletUIOpen) {
            tablet.webEventReceived.connect(onTabletWebEventReceived);
        } else {
            // setUIUpdating(false);
            tablet.webEventReceived.disconnect(onTabletWebEventReceived);
        }
    }

    function onTabletWebEventReceived(data) {
        // EventBridge message from HTML script.
        var message;
        console.log("### tablet Data", data);
        try {
            message = JSON.parse(data);
        } catch (e) {
            return;
        }

        switch (message.type) {
            case EVENT_BRIDGE_OPEN_MESSAGE:
                // clearValues();
                doUIUpdate();
                break;
            case SET_ACTIVE_MESSAGE:
                if (isAppActive !== message.value) {
                    tabletButton.editProperties({
                        isActive: message.value
                    });
                    setAppActive(message.value);
                }
                tablet.gotoHomeScreen(); // Automatically close app.
                break;
            case CREATE_NEW_CONTROL:
                allControls.push(message.value);
                break;
            case DELETE_CONTROL:
                var index = allControls.findIndex(function(item) {
                    return item.id === message.value.id;
                });
                allControls.splice(index,1);
                break;
            case CREATE_NEW_INPUT:
                allInputs.push(message.value.input);
                currentIDs = message.value.currentIDs;
                break;
            case DELETE_INPUT:
                var index = allInputs.findIndex(function(item) {
                    return item.id === message.value.id;
                });
                allInputs.splice(index,1);
                doUIUpdate();
                break;
            case CREATE_NEW_FILTER:
                allFilters.push(message.value);
                break;
            case DELETE_FILTER:
                var index = allFilters.findIndex(function(item) {
                    return item.id === message.value.id;
                });
                allFilters.splice(index,1);
                break;
            case CREATE_NEW_ENDPOINT:
                allEndpoints.push(message.value);
                break;
            case DELETE_ENDPOINT:
                var index = allEndpoints.findIndex(function(item) {
                    return item.id === message.value.id;
                });
                allEndpoints.splice(index,1);
                break;
            case CREATE_NEW_INPUT_TYPE:
                console.log("!!!!! in create new input")
                var input = message.value.input;
                var id = message.value.id;
                var index = allInputs.findIndex(function(item) {
                    return item.id === id;
                });
                allInputs[index].input = input;
                handleInputTypeCreation(input, id);
                break;
            case DELETE_INPUT_TYPE:
                console.log("%%% IN DELETE INPUT TYPE")
                var id = message.value.id;
                var index = allInputs.findIndex(function(item) {
                    return item.id === id;
                });
                handleInputTypeDeletion(id);
                break;
            case CLOSE_DIALOG_MESSAGE:
                tablet.gotoHomeScreen();
                break;
        }
    }


    // Main
    setup();

    // Cleanup
    function scriptEnding() {
        console.log("### in script ending");
        console.log("INPUTS", JSON.stringify(allInputs));
        allInputs.forEach(function(input) {
            JSON.stringify(input);
            Entities.deleteEntity(input.input.entityID);
        });
        // 
        Messages.unsubscribe(messageChannel);
        if (isAppActive) {
            setAppActive(false);
        }
        if (isTabletUIOpen) {
            // setUIUpdating(false);
            tablet.webEventReceived.disconnect(onTabletWebEventReceived);
        }
        if (tabletButton) {
            tabletButton.clicked.disconnect(onTabletButtonClicked);
            tablet.removeButton(tabletButton);
            tabletButton = null;
        }
        tablet = null;
    }

    Script.scriptEnding.connect(scriptEnding);
}());

/*
NOTES:
Inputs

Filters
Bus
End-Points
    ID

#1
Button to Press
On-Off
Bus to 
End-Point is a light
*/