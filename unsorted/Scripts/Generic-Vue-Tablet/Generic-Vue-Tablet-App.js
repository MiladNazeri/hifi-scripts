(function () {
    // Eslint
    /* eslint-disable indent */
    // Init
    var isAppActive = false,
        isTabletUIOpen = false,
        UPDATE_UI = "update_ui";

    // Collections

    // Polyfills
    Script.require(Script.resolvePath('./Polyfills.js'));
    
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

    // Constructor Functions

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

    function doUIUpdate() {
        tablet.emitScriptEvent(JSON.stringify({
            type: UPDATE_UI,
            value: {
            }
        }));
    }

    // Tablet
    var tablet = null,
        buttonName = "Generic",
        tabletButton = null,
        APP_URL = Script.resolvePath('./Tablet/Generic-Vue-Tablet.html'),
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