// Agent Audio Listener by Milad Nazeri 2018
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
        }
    };
})();

var DAMPINING = 12;
var musicFilter = filter.createAveragingFilter(DAMPINING);
var currentCount = 0;

var invisibleAvatarURL = "http://hifi-content.s3.amazonaws.com/ozan/dev/avatars/invisible_avatar/invisible_avatar.fst";
var cameraAvatarURL = "https://hifi-content.s3.amazonaws.com/jimi/avatar/camera/fst/camera.fst";

var pos = { "x": -32.258304595947266, "y": -6.18212890625, "z": -19.342888641357422 };

function bounceCheck() {
    var date = Date.now();
    return function (timeToPass) {
        var dateTest = Date.now();
        var timePassed = dateTest - date;

        if (timePassed > timeToPass) {
            date = Date.now();
            return true;
        } else {
            return false;
        }
    };
}

var bounceCheckStart = bounceCheck();

var bounceCheck = false;

Agent.isAvatar = true;

Avatar.position = pos;

Avatar.skeletonModelURL = cameraAvatarURL;

Agent.isListeningToAudioStream = true;

var messageChannel = "Avatar-Listener";

var allLights;

var ENTITIY_POSITION = { x: -32, y: -9, z: -19.42 };
// ENTITIY_POSITION = { x: -16382, y: -16382, z: -16382 }

var entityName = "_AUTO_LIGHT";

var currentLevel = 0;

EntityViewer.setPosition(ENTITIY_POSITION);
EntityViewer.setCenterRadius(250);

EntityViewer.queryOctree();

Script.setInterval(function () {

    EntityViewer.queryOctree();

    // EntityViewer.setOrientation(Quat.lookAtSimple(entityViewerPosition, ENTITIY_POSITION));

    allLights = Entities.findEntitiesByName(entityName, ENTITIY_POSITION, 250, false);
    console.log("allLights: " + JSON.stringify(allLights));
}, 2000)

Script.update.connect(onUpdate);


var countObj = {
    _25a: [20, 5],
    _25b: [25, 10],
    _25c: [30, 5],
    _50a: [35, 10],
    _50b: [45, 5],
    _50c: [60, 10],
    _25a: [70, 5],
    _25b: [80, 10],
    _25c: [90, 5],
    _50a: [100, 10],
    _50b: [110, 5],
    _50c: [120, 10],
    _250a: [130, 5],
    _250b: [140, 10],
    _500a: [150, 10],
    _500b: [160, 5],
    _1000a: [170, 1],
    _1000b: [180, 2],
    _2000a: [190, 3],
    _5000a: [200, 1]
};

var currentCount = 0;

var countKeys = Object.keys(countObj);
var totalCount = countKeys.length;
var currIndex = 0;

function onUpdate() {
    var check = countObj[countKeys[currIndex]];
    // Messages.sendMessage(messageChannel, JSON.stringify(check[0]));
    currentLevel = musicFilter.process(Agent.lastReceivedAudioLoudness);

    if (bounceCheck && bounceCheckStart(check[0])) {
        currentCount++;
        // console.log("agent: " + JSON.stringify(Agent.lastReceivedAudioLoudness));
        allLights.forEach(function (light) {
            Entities.callEntityServerMethod(light, "method", [JSON.stringify(Agent.lastReceivedAudioLoudness)]);
        });
        // Messages.sendMessage(messageChannel, JSON.stringify(Agent.lastReceivedAudioLoudness));
        if (currentCount >= check[1]) {
            currentCount = 0;
            currIndex = Math.floor(Math.random() * totalCount);
        }
    } else {
        // console.log("agent: " + JSON.stringify(Agent.lastReceivedAudioLoudness));
        if (currentCount > 3) {
            Messages.sendMessage(messageChannel, JSON.stringify(currentLevel));
            currentCount = 0;
        } else {
            currentCount++;
        }

        // if(allLights && allLights.length > 0) {
        //     allLights.forEach(function (light) {
        //         Entities.callEntityServerMethod(light, "message", [JSON.stringify(Agent.lastReceivedAudioLoudness)]);
        //     });
        // }
       
    }
    // if (bounceCheckStart(250)) {
    //     Messages.sendMessage(messageChannel, JSON.stringify(Agent.lastReceivedAudioLoudness));
    // }
}

Script.scriptEnding.connect(function () {
    Script.update.disconnect(onUpdate);
});
