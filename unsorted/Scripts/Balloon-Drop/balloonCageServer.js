
(function(){
    var _this = this;
    _this.remotelyCallable = ['balloonCageInteractedWith'];

    var balloonList = [];
    var BALLOON_CLICK_SOUND_URL = SoundCache.getSound(Script.resolvePath("audio/crate_click.wav"));
    var BALLOON_CAGE_OPEN_SOUND_URL = SoundCache.getSound(Script.resolvePath("audio/crate_open.wav"));
    var isCageOpen = false;
    var timerCount = 0;
    
    // Configurable variables
    // How many balloon to spawn before a drop
    var numBalloonsToDrop = 32;
    // How long before the cage resets after being opened (in seconds)
    var CAGE_RESET_DELAY = 1;
    // set to "Model" to use models, "Sphere" for sphere primitives, etc.
    var balloonType = "Model"; 
    // An list of models and an array of models to randomly pick from if baloonType is "Model"
    var BALLOON_01_URL = Script.resolvePath("models/balloongreen.FBX");
    // The first balloon should be the largest. It it used as a reference.
    var BALLOON_01_DIMENSIONS = {x: 0.25, y: 0.35, z: 0.25};
    var BALLOON_02_URL = Script.resolvePath("models/balloonblue.obj");
    var BALLOON_02_DIMENSIONS = {x: 0.2, y: 0.3, z: 0.2};
    var BALLOON_04_URL = Script.resolvePath("models/balloonmagenta.FBX");
    var BALLOON_04_DIMENSIONS = {x: 0.25, y: 0.3, z: 0.25};
    var BALLOON_05_URL = Script.resolvePath("models/balloonyellow.FBX");
    var BALLOON_05_DIMENSIONS = {x: 0.22, y: 0.32, z: 0.22};
    var balloonModels = [BALLOON_01_URL, BALLOON_02_URL, BALLOON_04_URL, BALLOON_05_URL];
    var balloonDimensions = [BALLOON_01_DIMENSIONS, BALLOON_02_DIMENSIONS, 
        BALLOON_04_DIMENSIONS, BALLOON_05_DIMENSIONS];

    if (balloonModels.length !== balloonDimensions.length){
        print("balloonDimensions and balloonModels arrays must be the same length");
    }
	
    _this.preload = function(entityID){
        this.entityID = entityID;
        print("balloonCageServer preload");
    };
	
    var pickRandomColor = function(){
        var randomRed = Math.floor(Math.random() * 255);
        var randomGreen = Math.floor(Math.random() * 255);
        var randomBlue = Math.floor(Math.random() * 255);
		
        return {red: randomRed, green: randomGreen, blue: randomBlue};
    };
	
    var pickRandomPosition = function(basePosition){
        var balloonPenDimensions = {x: 0.8 * Entities.getEntityProperties(_this.entityID).dimensions.x, 
            y: 0.2 * Entities.getEntityProperties(_this.entityID).dimensions.y,
            z: 0.6 * Entities.getEntityProperties(_this.entityID).dimensions.z};
        var finalPosition = {x: 0, y: 0, z: 0};
        var balloonPenOffset = {x: 0, y: -0.35, z: 0};
        // Multiply the offset by the scale then add the result to the base location
        finalPosition.x = (balloonPenOffset.x * Entities.getEntityProperties(_this.entityID).dimensions.x) + basePosition.x;
        finalPosition.y = (balloonPenOffset.y * Entities.getEntityProperties(_this.entityID).dimensions.x) + basePosition.y;
        finalPosition.z = (balloonPenOffset.z * Entities.getEntityProperties(_this.entityID).dimensions.x) + basePosition.z;	
        // Set up a buffer around the inside of the cage
        // Size is based on the size of the cage and the sized of the first balloon in the balloonDimensions array.
        var spawnInCageDimensions = balloonPenDimensions;
        // Buffer based on art
        spawnInCageDimensions.x -= 0.1;
        spawnInCageDimensions.z -= 0.1;
        // Buffer based on balloon size
        spawnInCageDimensions.x -= BALLOON_01_DIMENSIONS.x;
        spawnInCageDimensions.y -= BALLOON_01_DIMENSIONS.y;
        spawnInCageDimensions.z -= BALLOON_01_DIMENSIONS.z;
        // Pick a random point from within the safe area of the cage
        var xOffset = Math.random() * spawnInCageDimensions.x - spawnInCageDimensions.x * 0.5;
        var yOffset = Math.random() * spawnInCageDimensions.y - spawnInCageDimensions.y * 0.5;
        var zOffset = Math.random() * spawnInCageDimensions.z - spawnInCageDimensions.z * 0.5;
		
        return {x: finalPosition.x + xOffset, y: finalPosition.y + yOffset, z: finalPosition.z + zOffset};
    };
	
    var pickRandomRotation = function(){
        var randomRotX = 0; // Math.random();
        var randomRotY = 0; // Math.random();
        var randomRotZ = 0; // Math.random();
        var randomRotW = 0; Math.random() * 0.5;
        return ({x: randomRotX, y: randomRotY, z: randomRotZ, w: randomRotW});
    };
	
    var spawnBalloon = function(position, rotation, type){
        // Pick a random index for model and dimensions.
        // Primitive shapes can use random dimensions, but the array for model
        // and dimensions must be the same size.
        // The largest balloon should be the first listed in the balloonDimensions array
        var randomBalloonIndex = Math.floor(Math.random() * balloonModels.length);
        var id = Entities.addEntity({
            position: position,
            rotation: rotation,
            type: balloonType,
            shapeType: "sphere",
            modelURL: balloonModels[randomBalloonIndex],
            name: "Balloon",
            color: pickRandomColor(),
            dimensions: balloonDimensions[randomBalloonIndex],
            dynamic: false,
            collisionless: true,
            visible: true,
            lifetime: 300 // a failsafe to remove balloons that "stick around" for any reason
        });
        balloonList.push(id);
        // Brief delay before we drop for feel.
        timerCount++;
        Script.setTimeout(function(){
            timerCount--;	
            if (timerCount <= 0 ){
                checkForDrop();
            }
        }, 250);       
    };

    _this.balloonCageInteractedWith = function(){
        print("balloonCageInteractedWith has been called from the trigger");
        _this.balloonCageManageBalloons();
    };
	
    _this.balloonCageManageBalloons = function(){
        if (!isCageOpen){
            Audio.playSound(BALLOON_CLICK_SOUND_URL);
            if (balloonList.length < numBalloonsToDrop){
                spawnBalloon(pickRandomPosition(Entities.getEntityProperties(_this.entityID).position),
                    pickRandomRotation(), balloonType);
            }	
        }		
    };

    _this.deleteOwnedBalloons = function(passedEntityID){
        if (passedEntityID === _this.entityID){
            print("Balloon cage deleted");
            while (balloonList.length > 0){
                Entities.deleteEntity(balloonList.pop());
            }
            print(balloonList.lenght);
        }
    };

    function checkForDrop(){
        // print("there are " + balloonList.length + " balloons");		
        if (balloonList.length >= numBalloonsToDrop) {
            print("dropping balloons");
            isCageOpen = true;
            Audio.playSound(BALLOON_CAGE_OPEN_SOUND_URL);
            for (var i = balloonList.length - 1; i >= 0; i--){
                // Entities.callEntityClientMethod(balloonList[i], "drop", balloonList[i]);
                var currentBalloon = balloonList.pop();
				
                var newProperties = {
                    gravity: {x: 0, y: -2.5, z: 0},
                    velocity: {x: Math.random() - Math.random(), y: 0, z: Math.random() - Math.random()},
                    lifetime: 10
                };

                Entities.editEntity(currentBalloon, newProperties);
				
            }
            Script.setTimeout(function(){
                // Set isCageOpen to false so we can start filling it with balloons again.
                isCageOpen = false;
            }, CAGE_RESET_DELAY * 1000);
        }
    }
	
    Entities.deletingEntity.connect(function(ID){
        _this.deleteOwnedBalloons(ID);
    });
	
});