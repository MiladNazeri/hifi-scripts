(function(){

    var currentSelectedId;

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

    function getProps(id, arrayToGet){
        var props = {};
        if (arrayToGet.length > 0) {
            props = Entities.getEntityProperties(id, arrayToGet);
        } else {
            props = Entities.getEntityProperties(id);
        }
        return props;
    }

    function editGravity(id, gravityProps){
        log("in gravity Props", gravityProps)
        var gravityPropsObj = {
            x: gravityProps[0],
            y: gravityProps[1],
            z: gravityProps[2]
        };
        var props = {gravity: gravityPropsObj, dynamic: true};
        log("id", id)
        log("props", props)

        Entities.editEntity(id, props);
    }

    var pointer = Pointers.createPointer(PickType.Ray, {
        joint: "_CAMERA_RELATIVE_CONTROLLER_RIGHTHAND",
        filter: Picks.PICK_ENTITIES,
        distanceScaleEnd: true,
        hover: false,
        enabled: true
    });

    function bounceCheck(){
    var date = Date.now();
    return function(timeToPass){
        var dateTest = Date.now();
        var timePassed = dateTest-date;

        if (timePassed > timeToPass){
            date = Date.now();
            return true;
        }
        else {
            return false;
        }
    };
}
var bounceCheckStart = bounceCheck();

    var MAPPING_NAME = "Gravity Mapping";

    var mapping = Controller.newMapping(MAPPING_NAME);

    mapping.from(Controller.Standard.RTClick).to(function(value){ print(value);
        if (value === 0) return;
        var result = Pointers.getPrevPickResult(pointer);
        // log("result.objectID", result.objectID);
        // print("PRINT RESULT \n");
        if (typeof result.objectID == "string") {
            print(JSON.stringify(result));
            // log("result.objectID", result.objectID);
            currentSelectedId = result.objectID;
        }
    });

    mapping.from(Controller.Standard.LY).to(function(value){ print(value);
        print(value);
        // log("currentSelectedId", currentSelectedId);
        var gravityProps = getProps(currentSelectedId, ['gravity']).gravity;
        // log("gravityProps", gravityProps);
        var gravityPropsToPass;
        if (value < -0.900) {
            // CHANGE THIS 200 smaller for faster  updates, later for less updates
            if(!bounceCheckStart(200)) return
            // print("up");
            // CHANGE THIS 0.5 later for bigger changes each update
            gravityPropsToPass = gravityProps.y + 0.5;
            editGravity(currentSelectedId, [0, gravityPropsToPass, 0]);
        }
        if (value > 0.900) {
            if(!bounceCheckStart(200)) return
            // print("down");
            gravityPropsToPass = gravityProps.y - 0.52;
            editGravity(currentSelectedId, [0, gravityPropsToPass, 0]);
        }
        var gravityProps = getProps(currentSelectedId, ['gravity']).gravity;
        // log("gravityProps", gravityProps);
    });

    Controller.enableMapping(MAPPING_NAME);

    Script.scriptEnding.connect(function(){
        Controller.disableMapping(MAPPING_NAME);
    })
}());
