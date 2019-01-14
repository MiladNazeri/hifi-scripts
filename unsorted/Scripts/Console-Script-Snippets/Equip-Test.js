function createDebugSticks() {
    var name,
        entID,
        modelPosition,
        rotation,
        url,
        stringified,
        userData = {},
        DISTANCE_RIGHT = 0.52,
        MODEL_WIDTH = 0.0131,
        MODEL_HEIGHT = 0.4144,
        MODEL_DEPTH = 0.0131,
        leftHandPosition = {
            "x": -0.02,//-0.0881,
            "y": 0.135,
            "z": 0.02
        },
        leftHandRotation = Quat.fromPitchYawRollDegrees(90, -45, 0),
        rightHandPosition = Vec3.multiplyVbyV(leftHandPosition, { x: -1, y: 1, z: 1 }),
        rightHandRotation = Quat.fromPitchYawRollDegrees(90, 45, 0);

    modelPosition = Vec3.sum(
        Vec3.multiply(
            Quat.getRight(MyAvatar.avatarOrientation),
            DISTANCE_RIGHT
        ),
        MyAvatar.position
    );
    userData.equipHotspots = [{
        position: { x: 0, y: 0, z: 0 },
        radius: 0.25,
        joints: {
            RightHand: [
                rightHandPosition,
                rightHandRotation
            ],
            LeftHand: [
                leftHandPosition,
                leftHandRotation
            ]
        }
    }];

    rotation = Quat.fromPitchYawRollDegrees(0, 0, 0);
    userData.grabbableKey = { grabbable: true };
    stringified = JSON.stringify(userData);
    entID = createDebugstickEntity(
        name,
        modelPosition,
        { x: MODEL_WIDTH, y: MODEL_HEIGHT, z: MODEL_DEPTH },
        rotation,
        stringified
    );
};


function createDebugstickEntity(name, position, dimensions, rotation, userData, parentID) {
    name = name || "";
    userData = userData || {};
    var properties = {
        name: name,
        type: "Box",
        position: position,
        rotation: rotation,
        locked: false,
        dimensions: dimensions,
        collisionless: false,
        dynamic: true,
        parentID: parentID,
        userData: userData
    };
    var id = Entities.addEntity(properties);
    return id;
}

createDebugSticks();
