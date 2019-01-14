     /*
        {
            "grabbableKey": {
                "grabbable": false
            },
            "points": [
                {
                    "point": {
                        "x": -73.8,
                        "y": -4989.3,
                        "z": -7.1
                    },
                    "moveToTime": 4,
                    "pauseTime": 2
                },
                {
                    "point": {
                        "x": -73.8,
                        "y": -4988.3,
                        "z": -7.1
                    },
                    "moveToTime": 4,
                    "pauseTime": 2
                }
            ]
        }
    */    

(function () {
    var currentProps;
    var _userdataProperties;
    var _entityID;

    var currentPosition = {x:0, y:0, z:0};
    var TWEEN = Script.require(Script.resolvePath('Tween.js'));  
    function updateTweens() {
        TWEEN.update();
    }

    var pointList = [];
    var currentIndex = 0;
    var nextIndex = 1;
    var totalIndex = 0;

    var elevatorInitiated = false;
    var currentlyMoving = false;

    var tween;
   
    function movePlatform(startOrStop) {
        currentProps = Entities.getEntityProperties(_entityID);
        currentPosition = currentProps.position;
        tween = new TWEEN.Tween(currentPosition);        
        var currentPositionToMoveTo = pointList[nextIndex].point;
        var currentMoveToTime = pointList[nextIndex].moveToTime * 1000;
        var currentPauseTime = pointList[currentIndex].pauseTime * 1000;
        
        // tween.easing(TWEEN.Easing.Quadratic.InOut);
        tween.to(currentPositionToMoveTo, currentMoveToTime)
            .onUpdate(function(obj){
                var props = {
                    position: obj
                };
                Entities.editEntity(_entityID,props);
            })
            .onComplete(function(){
                currentlyMoving = false;
                currentIndex = nextIndex;
                if (currentIndex === totalIndex-1){
                    nextIndex = 0;
                    currentIndex = 0;
                } else {
                    nextIndex++;
                }
                Script.update.disconnect(updateTweens);
                if (elevatorInitiated === true){
                    movePlatform();
                }
            });
        Script.setTimeout(function(){
            tween.start();
            currentlyMoving = true;
            Script.update.connect(updateTweens);
        },currentPauseTime);

    }

    function ElevatorServer() {
    }

    ElevatorServer.prototype = {
        remotelyCallable: [
            'moveElevator'
        ],
        preload: function (entityID) {
            _entityID = entityID;
            currentProps = Entities.getEntityProperties(entityID);
            var userData = currentProps.userData;
            _userdataProperties = JSON.parse(userData);
            // currentPosition = currentProps.position;
            
            pointList = _userdataProperties.points;
            Entities.editEntity(entityID, {position: pointList[0].point});
            totalIndex = pointList.length;

        },
        moveElevator: function () {
            console.log("###1 cur elevatorInitiated:", elevatorInitiated, " ###2 cur currentlyMoving: ", currentlyMoving);
            if (!elevatorInitiated && !currentlyMoving){
                movePlatform();
                elevatorInitiated = true;
                console.log("###3 new elevatorInitiated:", elevatorInitiated);
            } else {
                elevatorInitiated = false;
                console.log("###4 new elevatorInitiated:", elevatorInitiated);
            }      
        }    
    };

    function onScriptEnding() {
        Script.update.disconnect(updateTweens);
        tween.stop();
    }

    Script.scriptEnding.connect(onScriptEnding);

    return new ElevatorServer();

});

/* globals Script Entities Vec3 */