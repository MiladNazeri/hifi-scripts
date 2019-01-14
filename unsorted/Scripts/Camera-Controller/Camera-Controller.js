(function(){
    

var handiness = 'both'; // left, right or both
var particleFingers = ['HandPinky4', 'HandRing4', 'HandIndex4', 'HandThumb4', 'HandMiddle4'];

var particleEntities = [];
var PARICLE_NAME_BASE = 'spawnedFingerParticle'

// what the actual particles look like
var particleProperties = {
    type: 'ParticleEffect',
    parentID: MyAvatar.sessionUUID,
    color: {
        red: 125,
        green: 125,
        blue: 125
    },
    isEmitting: 1,
    maxParticles: 1000,
    lifespan: 1,
    emitRate: 100,
    emitSpeed: 0,
    speedSpread: 0,
    emitOrientation: {
        x: -0.7035577893257141,
        y: -0.000015259007341228426,
        z: -0.000015259007341228426,
        w: 0.7106381058692932
    },
    emitRadiusStart: 1,
    polarStart: 0,
    polarFinish: 0,
    azimuthFinish: 3.1415927410125732,
    emitAcceleration: {
        x: 0,
        y: 0,
        z: 0
    },
    accelerationSpread: {
        x: 0,
        y: 0,
        z: 0
    },
    particleRadius: 0.004999999888241291,
    radiusSpread: 0,
    radiusStart: 0.0010000000474974513,
    radiusFinish: 0.0010000000474974513,
    colorSpread: {
        red: 125,
        green: 125,
        blue: 125
    },
    colorStart: {
        red: 125,
        green: 125,
        blue: 125
    },
    colorFinish: {
        red: 125,
        green: 125,
        blue: 125
    },
    alpha: 1,
    alphaSpread: 0,
    alphaStart: 1,
    alphaFinish: 0,
    emitterShouldTrail: true,
    textures: 'http://hifi-production.s3.amazonaws.com/tutorials/particleFingers/smoke.png',
    lifetime: 3600
};

var particleOn = true;

function createParticleAtFinger(jointName) {
    console.log("###addParticlesForHand");
    var position;
    var jointID = MyAvatar.jointNames.indexOf(jointName);
    particleProperties.name = PARICLE_NAME_BASE + jointName; 
    particleProperties.parentJointIndex = jointID;
    position =  MyAvatar.getJointPosition(jointName);
    return Entities.addEntity(particleProperties);
}

function addParticlesForHand(handPrefix) {
    console.log("###addParticlesForHand");
    for (var i = 0; i < particleFingers.length; i++) {
        particleEntities.push(createParticleAtFinger(handPrefix + particleFingers[i]));
        print(handPrefix + particleFingers[i]);
    }
}

function removeFingerParticles(){
    console.log("removing Finger Particles")
    for (var i = 0; i < particleEntities.length; i++) {
        // Fixes a crash on shutdown:
        // Entities.editEntity(particleEntities[i], { parentID: '' });
        Entities.deleteEntity(particleEntities[i]);
    }
}

Script.scriptEnding.connect(function() {
    removeFingerParticles();
});

    var cameraNames = ["_Camera:1", "_Camera:2", "_Camera:3"];
    var cameraNameMap = {
        _Camera1: "",
        _Camera2: "",
        _Camera3: ""
    };

    var djLocationCenter = {x:-31.6, y:4991.0, z:-26.63};
    var djLocationRight = {x:-35.2, y:4992.2, z:-27.63};
    var djLocationLeft = {x:-28, y:4993.0, z:-26.63};
    
    Entities.findEntities(MyAvatar.position, 1000).forEach(function(entity){
        var props = getProps(entity);
        cameraNames.forEach(function(cameraName){
            if (props.name === cameraName) {
                console.log("Found Camera");
                var newCamerName = cameraName.replace(":", "");
                cameraNameMap[newCamerName] = props.id;
            }
        })
    });

    function switchCamera(entityID){
        console.log("entityID", entityID);
        Camera.mode = "entity";
        Camera.setCameraEntity(entityID);
    };

    function log(describer, text){
        text = text || '';
        print('&======');
        print(describer + ": ");
        print(JSON.stringify(text));
        print('======&');
    }

    function randomize(min,max){
        return Math.random() * (max - min) + min;
    }

    function getProps(id){
        var props = {};
        props = Entities.getEntityProperties(id);
        return props;
    }

    var MAPPING_NAME = "DJ_Helper";

    var mapping = Controller.newMapping(MAPPING_NAME);

    mapping.from(Controller.Hardware.Keyboard[1]).to(function(value){ print(value);
        console.log("pressed 1")
        switchCamera(cameraNameMap._Camera1);
    });

    mapping.from(Controller.Hardware.Keyboard[2]).to(function(value){ print(value);
        console.log("pressed 2")
        
        switchCamera(cameraNameMap._Camera2);
    });

    mapping.from(Controller.Hardware.Keyboard[3]).to(function(value){ print(value);
        console.log("pressed 3")
        
        switchCamera(cameraNameMap._Camera3);
    });

    mapping.from(Controller.Hardware.Keyboard[4]).to(function(value){ print(value);
        console.log("pressed 4")
        
        MyAvatar.position = djLocationCenter
    });

    mapping.from(Controller.Hardware.Keyboard[5]).to(function(value){ print(value);
        console.log("pressed 5")
        
        MyAvatar.position = djLocationLeft
    });

    mapping.from(Controller.Hardware.Keyboard[6]).to(function(value){ print(value);
        console.log("pressed 6")
        
        MyAvatar.position = djLocationRight
    });

    mapping.from(Controller.Hardware.Keyboard[7]).to(function(value){ print(value);
        console.log("pressed 7")
        particleOn = !particleOn
        if (particleOn){
            if (handiness === "both" || handiness === "left") {
                addParticlesForHand("Left");
            }
            if (handiness === "both" || handiness === "right") {
                addParticlesForHand("Right");
            }
        } else {
            removeFingerParticles();
        }

        
    });

    mapping.from(Controller.Hardware.Keyboard[8]).to(function(value){ print(value);
        console.log("pressed 8")
        
    });

    mapping.from(Controller.Hardware.Keyboard[9]).to(function(value){ print(value);
        console.log("pressed 9")
        
    });

    Controller.enableMapping(MAPPING_NAME);

    Script.scriptEnding.connect(function(){
        Controller.disableMapping(MAPPING_NAME);
    })
}());


