(function () {
    var entityID;

    var isFingerPainting = false,
        shouldPointFingers = false,
        leftHand = null,
        rightHand = null,
        CONTROLLER_MAPPING_NAME = "com.highfidelity.fingerPaint",
        HIFI_POINT_INDEX_MESSAGE_CHANNEL = "Hifi-Point-Index",
        HIFI_GRAB_DISABLE_MESSAGE_CHANNEL = "Hifi-Grab-Disable",
        HIFI_POINTER_DISABLE_MESSAGE_CHANNEL = "Hifi-Pointer-Disable";

    function onButtonClicked() {
        var wasFingerPainting = isFingerPainting;

        isFingerPainting = !isFingerPainting;

        print("FingerMOD painting: " + isFingerPainting ? "onMOD" : "off");

        if (wasFingerPainting) {
            oncancelLine();
        }

        if (isFingerPainting) {
            enableProcessing();
        }

        updateHandFunctions();

        if (!isFingerPainting) {
            disableProcessing();
        }
    }
    function handController(name) {
        // Translates controller data into application events.
        var handName = name,
    
            triggerPressedCallback,
            triggerPressingCallback,
            triggerReleasedCallback,
            gripPressedCallback,
    
            rawTriggerValue = 0.0,
            triggerValue = 0.0,
            isTriggerPressed = false,
            TRIGGER_SMOOTH_RATIO = 0.1,
            TRIGGER_OFF = 0.05,
            TRIGGER_ON = 0.1,
            TRIGGER_START_WIDTH_RAMP = 0.15,
            TRIGGER_FINISH_WIDTH_RAMP = 1.0,
            TRIGGER_RAMP_WIDTH = TRIGGER_FINISH_WIDTH_RAMP - TRIGGER_START_WIDTH_RAMP,
            MIN_LINE_WIDTH = 0.002,
            MAX_LINE_WIDTH = 0.013,
            RAMP_LINE_WIDTH = MAX_LINE_WIDTH - MIN_LINE_WIDTH,
    
            rawGripValue = 0.0,
            gripValue = 0.0,
            isGripPressed = false,
            GRIP_SMOOTH_RATIO = 0.1,
            GRIP_OFF = 0.05,
            GRIP_ON = 0.1;
    
        function onTriggerPress(value) {
            // Controller values are only updated when they change so store latest for use in update.
            rawTriggerValue = value;
        }
    
        function updateTriggerPress(value) {
            var wasTriggerPressed,
                fingerTipPosition,
                lineWidth;
    
            triggerValue = triggerValue * TRIGGER_SMOOTH_RATIO + rawTriggerValue * (1.0 - TRIGGER_SMOOTH_RATIO);
    
            wasTriggerPressed = isTriggerPressed;
            if (isTriggerPressed) {
                isTriggerPressed = triggerValue > TRIGGER_OFF;
            } else {
                isTriggerPressed = triggerValue > TRIGGER_ON;
            }
    
            if (wasTriggerPressed || isTriggerPressed) {
                fingerTipPosition = MyAvatar.getJointPosition(handName === "left" ? "LeftHandIndex4" : "RightHandIndex4");
                if (triggerValue < TRIGGER_START_WIDTH_RAMP) {
                    lineWidth = MIN_LINE_WIDTH;
                } else {
                    lineWidth = MIN_LINE_WIDTH
                        + (triggerValue - TRIGGER_START_WIDTH_RAMP) / TRIGGER_RAMP_WIDTH * RAMP_LINE_WIDTH;
                }
    
                if (!wasTriggerPressed && isTriggerPressed) {
                    triggerPressedCallback(fingerTipPosition, lineWidth, MyAvatar.sessionUUID);
                } else if (wasTriggerPressed && isTriggerPressed) {
                    triggerPressingCallback(fingerTipPosition, lineWidth);
                } else {
                    triggerReleasedCallback(fingerTipPosition, lineWidth);
                }
            }
        }
    
        function onGripPress(value) {
            // Controller values are only updated when they change so store latest for use in update.
            rawGripValue = value;
        }
    
        function updateGripPress() {
            var fingerTipPosition;
    
            gripValue = gripValue * GRIP_SMOOTH_RATIO + rawGripValue * (1.0 - GRIP_SMOOTH_RATIO);
    
            if (isGripPressed) {
                isGripPressed = gripValue > GRIP_OFF;
            } else {
                isGripPressed = gripValue > GRIP_ON;
                if (isGripPressed) {
                    fingerTipPosition = MyAvatar.getJointPosition(handName === "left" ? "LeftHandIndex4" : "RightHandIndex4");
                    gripPressedCallback(fingerTipPosition);
                }
            }
        }
    
        function onUpdate() {
            updateTriggerPress();
            updateGripPress();
        }
    
        function setUp(onTriggerPressed, onTriggerPressing, onTriggerReleased, onGripPressed) {
            triggerPressedCallback = onTriggerPressed;
            triggerPressingCallback = onTriggerPressing;
            triggerReleasedCallback = onTriggerReleased;
            gripPressedCallback = onGripPressed;
        }
    
        function tearDown() {
            // Nothing to do.
        }
    
        return {
            onTriggerPress: onTriggerPress,
            onGripPress: onGripPress,
            onUpdate: onUpdate,
            setUp: setUp,
            tearDown: tearDown
        };
    }

    function onStartLine(position, width, id){
        console.log("onStartline called")
        var position = JSON.stringify(position);
        var width = String(width);    
        var orientation = JSON.stringify(Camera.getOrientation());   
        Entities.callEntityServerMethod(entityID, "startLine", [position, width, orientation]);
    }
    function onDrawLine(position, width){
        console.log("onDrawLine called")
        
        var position = JSON.stringify(position);
        var width = String(width);
        Entities.callEntityServerMethod(entityID, "drawLine", [position, width]);
    }
    function onFinishLine(){
        console.log("onFinishLine called")
        
        var position = JSON.stringify(position);
        var width = String(width);
        Entities.callEntityServerMethod(entityID, "finishLine", [position, width]);
    }
    function onEraseClosestLine(position){
        console.log("onEraseClosestLine called")
        
        var position = JSON.stringify(position);
        Entities.callEntityServerMethod(entityID, "eraseClosestLine", [position]);
    }
    function oncancelLine(){
        console.log("oncancelLine called")
        
        Entities.callEntityServerMethod(entityID, "cancelLine");
    }
    function onTearDown(){
        console.log("on teardown called");
        
        Entities.callEntityServerMethod(entityID, "onTearDown");
    }

    function enableProcessing() {
        // Connect controller API to handController objects.
        leftHand = handController("left");
        rightHand = handController("right");
        var controllerMapping = Controller.newMapping(CONTROLLER_MAPPING_NAME);
        controllerMapping.from(Controller.Standard.LT).to(leftHand.onTriggerPress);
        controllerMapping.from(Controller.Standard.LeftGrip).to(leftHand.onGripPress);
        controllerMapping.from(Controller.Standard.RT).to(rightHand.onTriggerPress);
        controllerMapping.from(Controller.Standard.RightGrip).to(rightHand.onGripPress);
        controllerMapping.from(Controller.Standard.B).to(onButtonClicked);
        Controller.enableMapping(CONTROLLER_MAPPING_NAME);
    
        // Connect handController outputs to paintBrush objects.
        leftHand.setUp(onStartLine, onDrawLine, onFinishLine, onEraseClosestLine);
        rightHand.setUp(onStartLine, onDrawLine, onFinishLine, onEraseClosestLine);
    
        // Messages channels for enabling/disabling other scripts' functions.
        Messages.subscribe(HIFI_POINT_INDEX_MESSAGE_CHANNEL);
        Messages.subscribe(HIFI_GRAB_DISABLE_MESSAGE_CHANNEL);
        Messages.subscribe(HIFI_POINTER_DISABLE_MESSAGE_CHANNEL);
    
        // Update hand controls.
        Script.update.connect(leftHand.onUpdate);
        Script.update.connect(rightHand.onUpdate);
    }

    function disableProcessing() {
        Script.update.disconnect(leftHand.onUpdate);
        Script.update.disconnect(rightHand.onUpdate);
    
        Controller.disableMapping(CONTROLLER_MAPPING_NAME);
    
        onTearDown();
        leftHand.tearDown();
        rightHand.tearDown();
    
        Messages.unsubscribe(HIFI_POINT_INDEX_MESSAGE_CHANNEL);
        Messages.unsubscribe(HIFI_GRAB_DISABLE_MESSAGE_CHANNEL);
        Messages.unsubscribe(HIFI_POINTER_DISABLE_MESSAGE_CHANNEL);
    }

    function updateHandFunctions() {
        // Update other scripts' hand functions.
        var enabled = !isFingerPainting;
    
        Messages.sendMessage(HIFI_GRAB_DISABLE_MESSAGE_CHANNEL, JSON.stringify({
            holdEnabled: enabled,
            nearGrabEnabled: enabled,
            farGrabEnabled: enabled
        }), true);
        Messages.sendMessage(HIFI_POINTER_DISABLE_MESSAGE_CHANNEL, JSON.stringify({
            pointerEnabled: enabled
        }), true);
    
        var newShouldPointFingers = !enabled;
        if (newShouldPointFingers !== shouldPointFingers) {
            Messages.sendMessage(HIFI_POINT_INDEX_MESSAGE_CHANNEL, JSON.stringify({
                pointIndex: newShouldPointFingers
            }), true);
            shouldPointFingers = newShouldPointFingers;
        }
    }

    function BathroomMarkerClient() {

    }

    BathroomMarkerClient.prototype = {
        preload: function (id) {
            entityID = id;
        },
        startEquip: function () {
            onButtonClicked();

        },
        releaseEquip: function () {
            onButtonClicked();
        }

    };

    function tearDown() {
        if (isFingerPainting) {
            isFingerPainting = false;
            updateHandFunctions();
            disableProcessing();
        }
    }

    Script.scriptEnding.connect(tearDown);

    return new BathroomMarkerClient();
})
