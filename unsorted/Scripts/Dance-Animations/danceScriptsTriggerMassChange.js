var entities = Entities.findEntities(MyAvatar.position, 100);
var animationList = [];
for (var entityIndex in entities) {
    var entity = Entities.getEntityProperties(entities[entityIndex]);
    if (entity.name.indexOf("Dance Tile") > -1) {
        var userData = JSON.parse(entity.userData); 
        // userData.wantsTrigger = true; 
        
        Entities.editEntity(entity.id, {"locked": false});
       
        Entities.editEntity(entity.id, { script: "https://hifi-content.s3.amazonaws.com/milad/ROLC/Organize/Projects/Domains/Rust/Dance-Animations/danceScript_no-Right-Click.js?10"});

        Entities.editEntity(entity.id, { "userData": JSON.stringify(userData) });
        
        Entities.editEntity(entity.id, {"locked": true});
    }


}


