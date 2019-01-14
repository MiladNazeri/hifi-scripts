(function(){
    
    var stickBaseName = "_Stick-Base";
    var stickCamName = "_Stick-Cam";
    var stickBaseID = "";
    var stickCamID = "";
    var LENGTH_MULTIPLIER = 0.01;

    var spectatorCameraConfig = Render.getConfig("SecondaryCamera");
    var viewFinderOverlay;
    var overyLayDimensions = {
        x: 0.5,
        y: -0.5,
        z: 0
    }
    function updateOverlay(parentID, dimensions) {
        spectatorCameraConfig.resetSizeSpectatorCamera(Window.innerWidth, Window.innerHeight);        
        if (viewFinderOverlay) {
            Overlays.deleteOverlay(viewFinderOverlay);
        }
        var camOrientation = Quat.fromPitchYawRollDegrees(-3,0,0);
        viewFinderOverlay = Overlays.addOverlay("image3d", {
            url: "resource://spectatorCameraFrame",
            emissive: true,
            parentID: parentID,
            alpha: 1,
            localRotation: camOrientation,
            localPosition: { x: 0, y: 0.125, z: -0.005 },
            dimensions: overyLayDimensions
        });

    }
    
    spectatorCameraConfig.enableSecondaryCameraRenderConfigs(true);
    spectatorCameraConfig.resetSizeSpectatorCamera(Window.innerWidth, Window.innerHeight);

    var MAPPING_NAME = "Selfie-Stick-Mapping";

    var mapping = Controller.newMapping(MAPPING_NAME);

    mapping.from(Controller.Standard.RTClick).to(function(value){ print(value);
        if (value === 0) return;
        Window.takeSecondaryCameraSnapshot();
    });

    mapping.from(Controller.Standard.LY).to(function(value){ print(value);
        if (value === 0) return;
        var length = value * LENGTH_MULTIPLIER;
        var currentLength = Entities.getEntityProperties(stickBaseID).dimensions;
        var baseProps = {
            dimensions: {
                x: currentLength.x,
                y: currentLength.y - length,
                z: currentLength.z
            }
        };
        Entities.editEntity(stickBaseID, baseProps);
        var currentPosition = Entities.getEntityProperties(stickCamID).localPosition;
        var camProps = {
            localPosition: {
                x: currentPosition.x,
                y: currentPosition.y - length,
                z: currentPosition.z
            }
        };
        Entities.editEntity(stickCamID, camProps);
        
    });
    
    function SelfieStick(){

    }
    SelfieStick.prototype = {
        preload: function(id){
            stickBaseID = Entities.findEntitiesByName(stickBaseName, MyAvatar.position, 3)[0];
            stickCamID = Entities.findEntitiesByName(stickCamName, MyAvatar.position, 3)[0];
            
            // viewFinderOverlay = true;
            console.log("stickBaseID", stickBaseID);
            console.log("stickCamID", stickCamID);
            var currentLength = Entities.getEntityProperties(stickCamID).dimensions;          
            spectatorCameraConfig.attachedEntityId = stickCamID; 

        },
        startEquip: function(){
            updateOverlay(stickCamID);
            Controller.enableMapping(MAPPING_NAME);
        },
        releaseEquip: function(){
            console.log("###1 ReleaseEquipCalled");
            if (viewFinderOverlay) {
                console.log("###2 viewFinderOverlay");
                Overlays.deleteOverlay(viewFinderOverlay);
            }
            Controller.disableMapping(MAPPING_NAME);
        }
    };

    // Script.scriptEnding.connect(function(){
    //     if (viewFinderOverlay) {
    //         Overlays.deleteOverlay(viewFinderOverlay);
    //     }
    //     Controller.disableMapping(MAPPING_NAME);
    // });

    return new SelfieStick();

})

/*
var leftHandPosition = {
    "x": 0,//-0.0881,
    "y": 2.0559,
    "z": 0.0159
};

var leftHandRotation = Quat.fromPitchYawRollDegrees(90, -45, 0);
var rightHandPosition = Vec3.multiplyVbyV(leftHandPosition, { x: -1, y: 0, z: 0 });
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

var entityID = "{37e0be37-8866-4ebd-a6f3-d0046c0733e7}";
userData = JSON.stringify(userData);
Entities.editEntity(entityID, {userData: userData});
*/