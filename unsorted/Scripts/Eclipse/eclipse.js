if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) { // .length of function is 2
            'use strict';
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}
(function(){
    // 500,0,500
    // {"x":2955.887451171875,"y":22.427629470825195,"z":2202.44775390625}

    var TWEEN = Script.require('./tween.js');
    // log(TWEEN, TWEEN);

    function log(describer, obj) {
        if (typeof obj !== "string" || typeof obj !== "number") {obj = JSON.stringify(obj);}
        print("### " + describer + " ::: " + obj );
    }

    var startEclipsePosition,
        midEclipsePosition,
        endEclipsePosition,
        entityIDs,
        myEntities,
        moonID,
        startEclipsePosition = {"x":200.63031005859375,"y":250.49392700195312,"z":-120.43001556396484},
        // midEclipsePosition = {"x":318.46319580078125,"y":151.7231903076172,"z":-121.93489074707031};
        endEclipsePosition = {"x":400.46319580078125,"y":250.7231903076172,"z":-121.93489074707031},
        currentPosition = Object.assign({},startEclipsePosition),
        moonName = "playa moon",
        startDate = Date.now(),
        dateToCheck,
        moonTween,
        MILISECONDS_IN_SECOND = 1000,
        MINUTE = MILISECONDS_IN_SECOND * 60,
        MINUTES_TO_PASS = 1,
        TOTAL_TIME_TO_PASS = MINUTES_TO_PASS * MINUTE;

    function enoughTimePassed(){
        if (!dateToCheck) {
            log("no date to check");
            dateToCheck = Date.now();
            return true;
        }
        dateToCheck = Date.now();
        log("TOTAL_TIME_TO_PASS", TOTAL_TIME_TO_PASS);
        log("dateToCheck - startDate", dateToCheck - startDate)
        if (dateToCheck - startDate < TOTAL_TIME_TO_PASS) {
            log("Not enough time has passed");

            return false;
        } else {
            log("EnoughTimeHasPassed");
            startDate = Date.now();
            return true;
        }
        }
    function runTween(){
        moonTween = new TWEEN.Tween(currentPosition)
            .to(endEclipsePosition, TOTAL_TIME_TO_PASS)
            .onUpdate(function(obj){
                log(obj,obj);
                var props = {
                    position: obj
                };
                Entities.editEntity(moonID, props);
            })
            .onComplete(tweenStep);
        moonTween.start();
    }
    function tweenStep(){
        currentPosition = Object.assign({},startEclipsePosition);
        log("done with tween");

    }
    function updateTweens() {
        //hook tween updates into our update loop
        TWEEN.update();
    }
    return {
        preload: function(id){
            moonID = id;
            Script.update.connect(updateTweens);
            Script.update.connect(onUpdate);
        },
        getProps: function(){
            return Entities.getEntityProperties(moonID);
        },
        unload: function(){
            Script.update.disconnect(onUpdate);
            Script.update.disconnect(updateTweens);
        }
    }
    function onUpdate(){
        if (enoughTimePassed()){
         runTween();
        }
    }

});
