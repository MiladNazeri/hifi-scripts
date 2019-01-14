
var stickCamModelURL = "https://hifi-content.s3.amazonaws.com/milad/ROLC/Organize/Projects/Domains/Rust/Selfie-Stick/stickcam.fbx";
var stickBaseModelURL = "https://hifi-content.s3.amazonaws.com/milad/ROLC/Organize/Projects/Domains/Rust/Selfie-Stick/stickbase.fbx";

var orientation = MyAvatar.orientation;
orientation = Quat.safeEulerAngles(orientation);
var selfieOrientation = Quat.fromVec3Degrees({
    x: orientation.x + 10,
    y: orientation.y - 90,
    z: orientation.z
})

var selfiePosition = Vec3.sum(MyAvatar.position, Vec3.multiply(3, Quat.getForward(MyAvatar.orientation)));

var SELFIE_STICK_SCRIPT_URL = Script.resolvePath("Selfie-Stick.js?v1" + Math.random());


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


var stickBase = Entities.addEntity(
    {
        "position": selfiePosition,
        "dimensions": {
            "x": 0.06832082569599152,
            "y": 0.7242909669876099,
            "z": 0.06832082569599152
        },
        "id": "{37e0be37-8866-4ebd-a6f3-d0046c0733e7}",
        "modelURL": stickBaseModelURL,
        "name": "_Stick-Base",
        "registrationPoint": {
            "x": 0.5,
            "y": 1,
            "z": 0.5
        },
        "rotation": {
            "w": 0.6567025184631348,
            "x": 0.7520713806152344,
            "y": -0.055619120597839355,
            "z": 0.005996823310852051
        },
        "shapeType": "simple-compound",
        "type": "Model",
        "userData": userData,
        "script": SELFIE_STICK_SCRIPT_URL,
    });

var stickCam = Entities.addEntity({
    "dimensions": {
        "x": 0.2091979682445526,
        "y": 0.07567035406827927,
        "z": 0.11184549331665039
    },
    "id": "{0fb96a73-aa2e-40fe-bc0d-8e507bc70d00}",
    "modelURL": stickCamModelURL,
    "name": "_Stick-Cam",
    "parentID": stickBase,
    "localPosition": {
        "x": -0.00811004638671875,
        "y": -0.00341796875,
        "z": -0.059706270694732666
    },
    "registrationPoint": {
        "x": 0.5,
        "y": 0,
        "z": 0.5
    },
    "rotation": {
        "w": 1,
        "x": -4.57763671875e-05,
        "y": -4.57763671875e-05,
        "z": -4.57763671875e-05
    },
    "shapeType": "simple-compound",
    "type": "Model"
})





// function createMarker(modelURL, markerPosition, markerColor) {

// }
