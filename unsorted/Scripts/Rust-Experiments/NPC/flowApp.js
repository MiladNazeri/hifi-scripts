(function(){
	Script.registerValue("FLOWAPP", true);
	Script.include("https://hifi-content.s3.amazonaws.com/luis/hairMoveLib6.js");
	
	ScriptDiscoveryService.scriptCountChanged.connect(function(evt){
		console.log("Script loaded "+evt);
	});
	
	var TABLET_BUTTON_NAME = "FLOW";
	var HTML_URL = "https://hifi-content.s3.amazonaws.com/luis/flowApp6.html";
	

	var MSG_DOCUMENT_LOADED = 0;
	var MSG_INPUT_DATA = 1;
	var MSG_GROUP_DATA = 2;
	var MSG_SETTINGS_DATA = 3;
	var MSG_CREATE = 4;
	
	var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
	var tabletButton = tablet.addButton({
		text: TABLET_BUTTON_NAME,
		icon: "https://hifi-content.s3.amazonaws.com/luis/bubble-i.svg",
		activeIcon: "https://hifi-content.s3.amazonaws.com/luis/bubble-a.svg"
	});
	
	var shown = false;
	
	tabletButton.clicked.connect(function () {
		if (shown) {
			tablet.gotoHomeScreen();
			GlobalDebugger.stop();
		} else {
			tablet.gotoWebScreen(HTML_URL);
		}
	});
	
	function onScreenChanged(type, url) {		
		if (type === "Web" && url === HTML_URL) {
			tabletButton.editProperties({isActive: true});
			if (!shown) {
				if (!GlobalDebugger.isActive()) {
					GlobalDebugger.init();
				}
				// hook up to event bridge
				tablet.webEventReceived.connect(onWebEventReceived);
			}
			shown = true;
		} else {
			tabletButton.editProperties({isActive: false});
			if (shown) {
				// GlobalDebugger.stop();
				// disconnect from event bridge
				tablet.webEventReceived.disconnect(onWebEventReceived);
			}
			shown = false;
		}

	}

	function onWebEventReceived(msg) {
		var message = JSON.parse(msg);
		if (message.type === MSG_INPUT_DATA) {
			console.log("Group: " + message.group + "  name: " + message.name + "  value: " + message.value);
			if (message.group !== "Settings") {
				GlobalDebugger.setValue(message.group, message.name, message.value);
			} else {
				switch (message.name) {
					case "collisions":
						GlobalDebugger.toggleCollisions();
						break;
					case "debug":
						GlobalDebugger.toggleDebugShapes();
						break;
					case "solid":
						GlobalDebugger.toggleSolidShapes();
						break;
					case "avatar":
						GlobalDebugger.toggleAvatarVisible();
						break;
				}
			}
		} else if (message.type === MSG_DOCUMENT_LOADED) {
			// tablet.emitScriptEvent(JSON.stringify({"type": MSG_SETTINGS_DATA, "data": GlobalDebugger.getSettingsData()}));
			// tablet.emitScriptEvent(JSON.stringify({"type": MSG_GROUP_DATA, "data": GlobalDebugger.getGroupData()}));
			// tablet.emitScriptEvent(JSON.stringify({"type": MSG_CREATE}));
			tablet.emitScriptEvent(JSON.stringify({"type": MSG_CREATE, "data": {"settings": GlobalDebugger.getSettingsData(), "group": GlobalDebugger.getGroupData(), "collisions": GlobalDebugger.getCollisionData()}}));
		}
	}

	tablet.screenChanged.connect(onScreenChanged);
	
	function shutdownTabletApp() {
		GlobalDebugger.stop();
		tablet.removeButton(tabletButton);
		if (shown) {
			tablet.webEventReceived.disconnect(onWebEventReceived);
			tablet.gotoHomeScreen();
		}
		tablet.screenChanged.disconnect(onScreenChanged);
	}
		
	Script.scriptEnding.connect(function () {
		shutdownTabletApp();
	});
}());