(function () {
    var overlay = null,
        OVERLAY_BASE_TEXT = "Current threshold:  ",
        currentThreshhold = 0,
        currentAudioLoudness = 0,
        thresholdStep = 0.05,
        THRESHOLD_MAX = 1,
        THRESHOLD_MIN = 0,
        FONT_SZE = 10,
        WINDOW_X = Window.x,
        WINDOW_Y = Window.y,
        TIMEOUT_DELETE = 1000;

    function clamp(min, max, num) {
        return Math.min(Math.max(num, min), max);
    }

    function keyPressHandler(event) {
        print(event.text);
        if (event.text === "[") {
            print("in [")
            currentThreshhold -= thresholdStep;
        }
        if (event.text === "]") {
            currentThreshhold += thresholdStep;
        }
        currentThreshhold = clamp(THRESHOLD_MIN, THRESHOLD_MAX, currentThreshhold);
        makeOverlay();
    }

    function onUpdate() {
        currentAudioLoudness = MyAvatar.audioLoudness;
        if (currentAudioLoudness > currentThreshhold) {
            // Audio.muted = false;

        } else {
            // Audio.muted = true;
        }
    }

    function makeOverlay() {
        print("in making overlay");
        var overlayProps = {
            x: 500,
            y: -500,
            text: OVERLAY_BASE_TEXT + currentThreshhold 
        };
        overlay = Overlays.addOverlay("text", overlayProps);
        Script.setTimeout(deleteOverlay, TIMEOUT_DELETE);
    }

    function deleteOverlay() {
        Overlays.deleteOverlay(overlay);
        overlay = null;
    }
    
    Script.update.connect(onUpdate);

    Controller.keyPressEvent.connect(keyPressHandler);

    Script.scriptEnding.connect(function() {
        if (overlay) {
            Overlays.deleteOverlay(overlay);
        }
        Controller.keyPressEvent.disconnect(keyPressHandler);

        Script.update.disconnect(onUpdate);
    });
})();