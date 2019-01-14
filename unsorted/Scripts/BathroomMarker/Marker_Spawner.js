// createMarkers();

// function createMarkers() {
// var modelURLS = [
//     "https://s3-us-west-1.amazonaws.com/hifi-content/eric/models/marker-blue.fbx",
//     "https://s3-us-west-1.amazonaws.com/hifi-content/eric/models/marker-red.fbx",
// ];

//     var markerPosition = Vec3.sum(MyAvatar.position, Vec3.multiply(WHITEBOARD_RACK_DEPTH, Quat.getFront(orientation)));

//     createMarker(modelURLS[0], markerPosition, {
//         red: 10,
//         green: 10,
//         blue: 200
//     });

//     markerPosition = Vec3.sum(markerPosition, Vec3.multiply(-0.2, Quat.getFront(markerRotation)));
//     createMarker(modelURLS[1], markerPosition, {
//         red: 200,
//         green: 10,
//         blue: 10
//     });

//     markerPosition = Vec3.sum(markerPosition, Vec3.multiply(0.4, Quat.getFront(markerRotation)));
//     createMarker(modelURLS[2], markerPosition, {
//         red: 10,
//         green: 10,
//         blue: 10
//     });
// }

var modelURL = "https://s3-us-west-1.amazonaws.com/hifi-content/eric/models/marker-black.fbx"

var orientation = MyAvatar.orientation;
orientation = Quat.safeEulerAngles(orientation);
var markerRotation = Quat.fromVec3Degrees({
    x: orientation.x + 10,
    y: orientation.y - 90,
    z: orientation.z
})

var markerPosition = Vec3.sum(MyAvatar.position, Vec3.multiply(3, Quat.getForward(MyAvatar.orientation)));

var MARKER_CLIENT_SCRIPT_URL = Script.resolvePath("Marker_Client.js?v1" + Math.random());
var MARKER_SERVER_SCRIPT_URL = Script.resolvePath("Marker_Server.js?v1" + Math.random());


var leftHandPosition = {
    "x": -0.02,//-0.0881,
    "y": 0.135,
    "z": 0.02
};

var leftHandRotation = Quat.fromPitchYawRollDegrees(90, -45, 0);
var rightHandPosition = Vec3.multiplyVbyV(leftHandPosition, { x: -1, y: 1, z: 1 });
var rightHandRotation = Quat.fromPitchYawRollDegrees(90, 45, 0);

var userData = {
    "grabbableKey": {
        "grabbable": true
    },
    "wearable": {
        "joints": {
            "LeftHand": [
                leftHandPosition,
                leftHandRotation
            ],
            "RightHand": [
                rightHandPosition,
                rightHandRotation
            ]
        }
    }
}

userData = JSON.stringify(userData);

var marker = Entities.addEntity({
    type: "Model",
    modelURL: modelURL,
    rotation: markerRotation,
    shapeType: "box",
    name: "marker",
    dynamic: false,
    gravity: {
        x: 0,
        y: 0,
        z: 0
    },
    velocity: {
        x: 0,
        y: -0.1,
        z: 0
    },
    position: markerPosition,
    dimensions: {
        x: 0.027,
        y: 0.027,
        z: 0.164
    },
    script: MARKER_CLIENT_SCRIPT_URL,
    serverScripts: MARKER_SERVER_SCRIPT_URL,
    userData: userData
});


// function createMarker(modelURL, markerPosition, markerColor) {

// }
