var entities = Entities.findEntities(MyAvatar.position, 100);
for (var entityIndex in entities) {
    var entity = Entities.getEntityProperties(entities[entityIndex]);
    if (entity.name.indexOf("__Light-Trigger_Light_") > -1) {
        console.log("found Box", entity.name)
        var userData;
        try {
            userData = JSON.parse(entity.userData); 
            userData = {
                "grabbableKey": {
                  "grabbable": false
                },
                "maxLightIntensity": 50,
                "lightOnTime": 100,
                "lightStayOnAfterTime": 2000,
                "lightOffTime": 100
              }
        } catch(e){

        }

        // Entities.editEntity(entity.id, {"locked": false});
       
        // Entities.editEntity(entity.id, { script: "https://hifi-content.s3.amazonaws.com/milad/ROLC/Organize/Projects/Domains/Rust/Dance-Animations/danceScript_no-Right-Click.js?10"});

        Entities.editEntity(entity.id, { 
            script: "",
            // serverScripts: ""
            serverScripts: "https://hifi-content.s3.amazonaws.com/milad/production/Zaru/Lights-Server.js"
            "userData": JSON.stringify(userData) 
        });
        
        // Entities.editEntity(entity.id, {"locked": true});
    }
}

