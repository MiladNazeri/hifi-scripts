(function () {

    var _entityID;
    var entProperties;
    var userProperties;
    var materialToReplace;
    var baseMaterialProps;
    var additionalMaterialProps;
    var completeMaterialProps;
    var NULL_PARENT = "{00000000-0000-0000-0000-000000000000}";
    var materialNames = [];
    var mesh;
    var materialEntitiesGroup = [];
    var replaceParentProps;
    var replaceNullParentProps = { parentID: NULL_PARENT };
    var avatarUrl;

    function assign(target, sources) {
        [].slice.call(arguments, 1).forEach(function(source) {
            Object.keys(source||{}).forEach(function(key) {
                target[key] = source[key];
            });
        });
        return target;
    }

    function replaceAvatar() {
        MyAvatar.useFullAvatarURL(avatarUrl);
    }

    function replaceAvatarByMouse(entityID, mouseEvent) {
        if (mouseEvent.isLeftButton) {
            replaceAvatar();
        }
    }

    function Highlight_And_Pick_Entity() {

    }

    /*
        userData: {
            "materialToReplace": url;
        }
    */

    baseMaterialProps = {
        type: "Material",
        priority: 1,
        visible: false,
        parentID: NULL_PARENT   
    } ;

    Highlight_And_Pick_Entity.prototype = {
        preload: function (id) {
            _entityID;
            entProperties = Entities.getEntityProperties(id);
            avatarUrl = entProperties.modelURL;
            replaceParentProps = {
                parentID: id
            };
            try {
                userProperties = JSON.parse(entProperties.userData);
                materialToReplace = userProperties.materialToReplace;
                mesh = Graphics.getModel(id);
                materialNames = mesh.materialNames;
                materialNames.forEach(function(materialName){
                    additionalMaterialProps = {
                        materialURL: materialToReplace,
                        name: entProperties.id + ": " + materialName,
                        parentMaterialName: "mat::" + materialName
                    };
                    completeMaterialProps = assign({}, baseMaterialProps, additionalMaterialProps);
                    materialEntitiesGroup.push(
                        Entities.addEntity(completeMaterialProps)
                    );
                });
            } catch (e) {
                print(e);
            }

        },
        clickDownOnEntity: replaceAvatarByMouse,
        startFarTrigger: replaceAvatar,
        startNearTrigger: replaceAvatar

    };

    function onScriptEnding(){
        materialEntitiesGroup.forEach(function(materiaId){
            Entities.deleteEntity(materiaId);
        });
    }
    Script.scriptEnding.connect(onScriptEnding);

    return new Highlight_And_Pick_Entity();
});