var entitiesWithServerScripts = 0

function callbackForScript () {
    var entityID = entity;
    var serverScripts = props.serverScripts;
    return function(success, isRunning, status, errorInfo) {
        if (!success || !isRunning) {
            console.log("Script not running:", entityID, success, isRunning, status, errorInfo, JSON.stringify(serverScripts));
            // Entities.reloadServerScripts(entityID);
        }
        entitiesWithServerScripts--
    }
}

var whiteList = [];
var blackList = [];

var interval = Script.setInterval(function() {
    console.log("Checks pending:", entitiesWithServerScripts)
    
    var entities = Entities.findEntities(Vec3.ZERO, 100000);
    for (var i in entities) {
        var entity = entities[i];
        var props = Entities.getEntityProperties(entity, ["serverScripts"]);
        if (props.serverScripts != "" || blackList.indexOf(props.serverScripts) !== -1) {
            Entities.getServerScriptStatus(entity, callbackForScript);
            entitiesWithServerScripts++;
        }
    }

    console.log("Num entities to check:", entitiesWithServerScripts)
}, 5000);