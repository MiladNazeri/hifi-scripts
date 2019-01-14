var entities = Entities.findEntities(Vec3.ZERO, 1000000);
console.log(entities.length)
for (var entityIndex in entities) {
    var entity = Entities.getEntityProperties(entities[entityIndex]);
    
    Entities.editEntity(entity.id, {"locked":false});
    if (entity.userData) {
        try{
            var userData = JSON.parse(entity.userData);

            if(userData.grabbableKey && userData.grabbableKey.grabbable){
                console.log("Found a Grabbable Object", entity.locked);
            }
            
            userData["grabbableKey"] = { "grabbable": false };
            Entities.editEntity(entity.id, { "userData": JSON.stringify(userData) });
        } catch (e){
            print(e);
            print(entity.userData);
        }

    } else {
        
        Entities.editEntity(entity.id, { "userData": JSON.stringify({ "grabbableKey": { "grabbable": false } }) });
    }
    
    Entities.editEntity(entity.id, {"locked":entity.locked});
} 