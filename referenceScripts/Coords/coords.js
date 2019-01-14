(function(){
    var APP_NAME = "BOUNDS";
    var APP_URL = Script.resolvePath("app.html?" + Date.now());
    var APP_ICON;

    var prevID = 0;
    var listName = "contextOverlayHighlightList";
    var listType = "entity";

    var entityIDToExport = "";

    var tablet = Tablet.getTablet('com.highfidelity.interface.tablet.system');    

    function handleMousePress(entityID) {
        print("Clicked: " + entityID);
        if (prevID !== entityID) {
            Selection.addToSelectedItemsList(listName, listType, entityID);
            prevID = entityID;
        }

        var props = Entities.getEntityProperties(entityID, ['position', 'dimensions']);
        print("props.position \n", JSON.stringify(props.position));
        print("props.dimensions \n", JSON.stringify(props.dimensions));

        var startx = props.position.x - props.dimensions.x / 2;
        var endX = props.position.x + props.dimensions.x / 2;

        var starty = props.position.y - props.dimensions.y / 2;
        var endy = props.position.y + props.dimensions.y / 2;

        var startz = props.position.z - props.dimensions.z / 2;
        var endz = props.position.z + props.dimensions.z / 2;
        print("props.position.z", props.position.z);
        print("props.dimensions.z", props.dimensions.z);
        print("props.dimensions.z / 2", props.dimensions.z /2);       
               
        print("startz", startz);
        print("endz", endz);
        

        tablet.emitScriptEvent({
            entityID : entityID,
            startx: startx,
            endX : endX,
            starty: starty,
            endy: endy,
            startz: startz,
            endz: endz
        });
    }

    function handleMouseLeave(entityID) {
        if (prevID !== 0) {
            Selection.removeFromSelectedItemsList("contextOverlayHighlightList", listType, prevID);
            prevID = 0;
        }
    }

    var button = tablet.addButton({
        text: APP_NAME
    });

    
    function maybeExited() {
        print("Exited app page");
        Entities.clickReleaseOnEntity.disconnect(handleMousePress);
        Entities.hoverLeaveEntity.disconnect(handleMouseLeave);
        tablet.screenChanged.disconnect(maybeExited);
    }

    function clicked(){
        tablet.gotoWebScreen(APP_URL);
        Entities.clickReleaseOnEntity.connect(handleMousePress);
        Entities.hoverLeaveEntity.connect(handleMouseLeave);
        Script.setTimeout(function(){
            tablet.screenChanged.connect(maybeExited); 
        }, 2000);
    }
    button.clicked.connect(clicked);

    function cleanup(){
        tablet.removeButton(button);
    }

    Script.scriptEnding.connect(cleanup);
}());