// Material_Painter.js
//
// Created by Milad Nazeri and Sammuel on 2018-07-16
//
// Copyright 2018 High Fidelity, Inc.
//
// Distributed under the Apache License, Version 2.0.
// See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html



(function () {
    // Dependencies
    // /////////////////////////////////////////////////////////////////////////
    Script.require("../Utilities/Polyfills.js")();

    var Helper = Script.require("../Utilities/Helper.js?" + Date.now()),
        vec = Helper.Maths.vec;

    // Log Setup
    var LOG_CONFIG = {},
        LOG_ENTER = Helper.Debug.LOG_ENTER,
        LOG_UPDATE = Helper.Debug.LOG_UPDATE,
        LOG_ERROR = Helper.Debug.LOG_ERROR,
        LOG_VALUE = Helper.Debug.LOG_VALUE,
        LOG_ARCHIVE = Helper.Debug.LOG_ARCHIVE;

    LOG_CONFIG[LOG_ENTER] = true;
    LOG_CONFIG[LOG_UPDATE] = true;
    LOG_CONFIG[LOG_ERROR] = true;
    LOG_CONFIG[LOG_VALUE] = true;
    LOG_CONFIG[LOG_ARCHIVE] = false;
    var log = Helper.Debug.log(LOG_CONFIG);

    // Init
    // /////////////////////////////////////////////////////////////////////////
    var isAppActive = false,
        isTabletUIOpen = false,
        overlay = null,
        pressedID,
        pressedMeshPart,
        material = null,
        currentMaterial = null
        animationSTateHandler = null;

    var image1 = "http://youthvote.org/wp-content/uploads/2017/10/youth-vote.png";
    var image2 = "https://www.goodtextures.com/cache/bd229a95/av9ba39985c4b3b8b4d99.png"; // rough map
    var image3 = "http://www.tripwiremagazine.com/wp-content/uploads/2014/02/ice-textures-featured.jpg";
    var image4 = "https://creativenerds.co.uk/wp-content/uploads/2018/05/Spray-paint-texture-set-01-680x420.jpg";
    var image5 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCy9xN2szFhXlNz7EZV078sHS5W8E2LW_MiunAjO1W-KuSyXTQ";
    var image6 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQlg6wFSalAdqhzFt2yKHnwl_o4rEirjvHzJ9iaP1r1F9D3fTi";

    var PI = Math.PI;
    var currentStep = 0;
    var timeAroundCircle = 2500;
    var quantizeLevel = 100;
    var step = PI / timeAroundCircle; // pi/ms
    var quantizePerMS = timeAroundCircle / quantizeLevel;
    var coatTimer = null;

    // Consts
    // /////////////////////////////////////////////////////////////////////////
    var MESSAGE_CHANNEL = "messages.material-painter",
        UPDATE_UI = "update_ui";

    // Constructor
    // /////////////////////////////////////////////////////////////////////////

    // Collections
    // /////////////////////////////////////////////////////////////////////////
    var materialURLS = Script.require("./Material_URLS.js?" + Date.now()),
        defaultSettings = {
            current: {},
            ui: {
                current: true
            }
        },
        settings = Object.assign({}, defaultSettings);

    // log(LOG_ARCHIVE, "danceUrls", danceUrls);

    // Helper Functions
    // /////////////////////////////////////////////////////////////////////////
    function setAppActive(active) {
        // Start/stop application activity.
        if (active) {
            console.log("Start app");
            // TODO: Start app activity.
        } else {
            console.log("Stop app");
            // TODO: Stop app activity.
        }
        isAppActive = active;
    }

    function getTopMaterial(multiMaterial) {
        // For non-models: multiMaterial[0] will be the top material
        // For models, multiMaterial[0] is the base material, and multiMaterial[1] is the highest priority applied material
        if (multiMaterial.length > 1) {
            if (multiMaterial[1].priority > multiMaterial[0].priority) {
                return multiMaterial[1];
            }
        }
        return multiMaterial[0];
    }

    function grabMaterial(id, meshPart) {
        if (material) {
            var mesh = Graphics.getModel(id);
            var meshPartString = meshPart.toString();
            settings.current.meshPartString = meshPartString;
            if (mesh) {
                var materials = mesh.materialLayers;
                settings.current.materials = materials;
                if (materials[meshPartString] && materials[meshPartString].length > 0) {
                    var topMaterial = getTopMaterial(materials[meshPartString]);
                    settings.current.topMaterial = topMaterial;
                    Entities.editEntity(material, {
                        materialData: JSON.stringify({
                            materialVersion: 1,
                            materials: topMaterial.material
                        })
                    });
                }
            }
            doUIUpdate();
        }
    }

    function applyMaterial(id, meshPart, intersection) {
        //print("material " + material);
        if (material) {
            var mesh = Graphics.getModel(id);
            var meshPartString = meshPart.toString();
            //print("mesh " + mesh);
            if (mesh) {
                var materials = mesh.materialLayers;
                //print("materials " + JSON.stringify(materials) + " " + meshPart + " " + meshPartString);
                //print(materials[meshPartString]);
                //print(materials[meshPartString].length);
                if (materials[meshPartString] && materials[meshPartString].length > 0) {
                    var topMaterial = getTopMaterial(materials[meshPartString]);
                    var materialCopy = Entities.cloneEntity(material);
                    currentMaterial = materialCopy;
                    Entities.editEntity(materialCopy, {
                        position: intersection,
                        parentID: id,
                        parentMaterialName: meshPartString,
                        priority: topMaterial.priority + 1,
                        lifetime: -1
                    });
                }
            }
        }
    }

    function returnSin(radians, offset, multiplier) {
        return Math.sin(radians * multiplier + offset);
    }
    
    function returnCos(radians, offset, multiplier) {
        return Math.cos(radians * multiplier + offset);
    }

    function clamp(min, max, num) {
        return Math.min(Math.max(num, min), max);
    }

    
    // Procedural Functions
    // /////////////////////////////////////////////////////////////////////////
    function setup() {
        tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
        tabletButton = tablet.addButton({
            text: buttonName,
            icon: "icons/tablet-icons/raise-hand-i.svg",
            activeIcon: "icons/tablet-icons/raise-hand-a.svg",
            isActive: isAppActive
        });
        if (tabletButton) {
            tabletButton.clicked.connect(onTabletButtonClicked);
        } else {
            console.error("ERROR: Tablet button not created! App not started.");
            tablet = null;
            return;
        }
        tablet.gotoHomeScreen();
        tablet.screenChanged.connect(onTabletScreenChanged);

        Controller.mousePressEvent.connect(mousePressEvent);

        Controller.mouseReleaseEvent.connect(mouseReleaseEvent);
        // Messages.subscribe(MESSAGE_CHANNEL);
        // Messages.messageReceived.connect(onMessageReceived);
    }

    function doUIUpdate(update) {
        tablet.emitScriptEvent(JSON.stringify({
            type: UPDATE_UI,
            value: settings,
            update: update || {}
        }));
    }

    function mouseReleaseEvent(event) {
        log(LOG_ENTER, "IN MOUSE RELEASE");
        if (isTabletUIOpen && (event.isLeftButton || event.isRightButton)) {
            log(LOG_ENTER, "activating mouse release");
            var pickRay = Camera.computePickRay(event.x, event.y);
            var closest;
            var id;
            var avatar = AvatarManager.findRayIntersection(pickRay);
            var entity = Entities.findRayIntersection(pickRay, true);
            var overlay = Overlays.findRayIntersection(pickRay, true);

            closest = entity;
            id = entity.entityID;

            if (avatar.intersects && avatar.distance < closest.distance) {
                closest = avatar;
                id = avatar.avatarID;
            } else if (overlay.intersects && overlay.distance < closest.distance) {
                closest = overlay;
                id = overlay.overlayID;
            }

            var meshPart = closest.extraInfo.shapeID ? closest.extraInfo.shapeID : 0;
            if (closest.intersects && id === pressedID && meshPart === pressedMeshPart) {
                if (event.isLeftButton) {
                    grabMaterial(id, meshPart);
   
                } else if (event.isRightButton) {
                    applyMaterial(id, meshPart, closest.intersection);
                }
            }
        }
    }

    function mousePressEvent(event) {
        log(LOG_ENTER, "IN MOUSE press");
        if (isTabletUIOpen && (event.isLeftButton || event.isRightButton)) {
            log(LOG_ENTER, "activating mouse press");

            var pickRay = Camera.computePickRay(event.x, event.y);
            var closest;
            var id;
            var avatar = AvatarManager.findRayIntersection(pickRay);
            var entity = Entities.findRayIntersection(pickRay, true);
            var overlay = Overlays.findRayIntersection(pickRay, true);

            closest = entity;
            id = entity.entityID;

            if (avatar.intersects && avatar.distance < closest.distance) {
                closest = avatar;
                id = avatar.avatarID;
            } else if (overlay.intersects && overlay.distance < closest.distance) {
                closest = overlay;
                id = overlay.overlayID;
            }

            if (closest.intersects) {
                pressedID = id;
                pressedMeshPart = closest.extraInfo.shapeID ? closest.extraInfo.shapeID : 0;
                settings.current.pressedID = id;
                settings.current.pressedMeshPart = id;
                settings.current.extraInfo = closest.extraInfo;
                doUIUpdate();
            }
        }
    }

    // function splitDanceUrls() {
        //     var regex = /(https:\/\/.*\/)([a-zA-Z0-9 ]+) (\d+)(.fbx)/;
        //     danceUrls.sort(function(a,b) { 
        //         if (a < b) return -1;
        //         else if (a > b) return 1;
        //         return 0; 
        //     }).forEach(function(dance) {
        //         var regMatch = regex.exec(dance);
        //         danceObjects.push(
        //             new DanceAnimation(
        //                 regMatch[2],
        //                 dance,
        //                 regMatch[3],
        //                 30
        //             )
        //         );
        //     });
        //     settings.danceObjects = danceObjects;
        // }

    function onUpdate() {
        if (material) {
            var localOffset = vec(0, 1.5, -1.5),
                worldOffset = VEC3.multiplyQbyV(MyAvatar.orientation, localOffset),
                materialPosition = VEC3.sum(MyAvatar.position, worldOffset);

            Entities.editEntity(material, {
                position: materialPosition
            });
        }
    }

    function animateMaterial() {
        if (currentMaterial) {
            var currentSin = returnSin(currentStep, 0.0, 0.3);
            var currentCos = returnCos(currentStep, 0.0, 0.3);
            
            var materialProps = Entities.getEntityProperties(currentMaterial); 
            // log(LOG_VALUE, "materialProps", materialProps);
    
            var materialData = JSON.parse(materialProps.materialData);
            currentStep += step;
            // var matData = materialData.materials;
            // console.log(matData);
            materialData.emissive = [
                clamp(0, 1.0, currentCos * 444.3),
                clamp(0, 1.0, currentCos * 1),
                clamp(0, 1.0, Math.pow(currentCos, 3333.3))
            ];
            materialData.opacity = 1;
            // materialData.albdo = [
            //     clamp(0, 1.0, currentSin * 0.3),
            //     clamp(0, 1.0, currentSin * 1),
            //     clamp(0, 1.0, Math.pow(currentSin, 3330.3))
            // ];
            // materialData.roughness = currentSin;
            materialData.metallic = 1.0;
            materialData.scattering = 1.0;
            materialData.unlit = false;
            materialData.emissiveMap = image1;
            // materialData.albedoMap = image6;
            // materialData.opacityMap = image1;
    
            materialData.roughnessMap = image2;
            // materialData.glossMap = image1;
    
            // materialData.specularMap = image1;
            // materialData.metallicMap = image1;
    
            // materialData.normalMap = image1;
            // materialData.bumpMap = image1;
    
            // materialData.occlusionMap = image1;
            // materialData.scatteringMap = image1;
            // materialData.lightMap = image1;
            materialData.opacity = 1;
            materialData.roughness = 1;
    
            var properties = {
                materialData: JSON.stringify(materialData),
                materialMappingRot: currentStep,
                materialMappingScale: {x: currentSin * 20, y: currentCos * 20},
                materialMappingPos: {x: clamp(0, 1.0, currentSin), y: clamp(0, 1.0, currentCos)}
            };
        
            Entities.editEntity(currentMaterial, properties);
        }
       
    
    }
    // Tablet
    // /////////////////////////////////////////////////////////////////////////
    var tablet = null,
        buttonName = "Material-Painter",
        tabletButton = null,
        APP_URL = Script.resolvePath('./Tablet/Material-Painter_Tablet.html'),
        EVENT_BRIDGE_OPEN_MESSAGE = "eventBridgeOpen",
        SET_ACTIVE_MESSAGE = "setActive",
        CLOSE_DIALOG_MESSAGE = "closeDialog";


    function onTabletButtonClicked() {
        // Application tablet/toolbar button clicked.
        if (isTabletUIOpen) {
            tablet.gotoHomeScreen();
            log(LOG_ENTER, "deleting material");
            if (material) {
                Entities.deleteEntity(material);
                material = null;
                if (coatTimer !== null) {
                    Script.clearInterval(coatTimer);
                }
            }
            Script.update.disconnect(onUpdate);
        } else {
            log(LOG_ENTER, "addings material");

            material = Entities.addEntity({
                type: "Material",
                name: "test material",
                materialURL: "materialData",
                materialData: "",
                cloneable: true
            });
            Script.update.connect(onUpdate);
            coatTimer = Script.setInterval(animateMaterial, quantizePerMS) 
            // Initial button active state is communicated via URL parameter so that active state is set immediately without 
            // waiting for the event bridge to be established.
            tablet.gotoWebScreen(APP_URL + "?active=" + isAppActive);
        }
    }

    function onTabletScreenChanged(type, url) {
        // Tablet screen changed / desktop dialog changed.
        var wasTabletUIOpen = isTabletUIOpen;

        isTabletUIOpen = url.substring(0, APP_URL.length) === APP_URL; // Ignore URL parameter.
        if (isTabletUIOpen === wasTabletUIOpen) {
            return;
        }

        if (isTabletUIOpen) {
            tablet.webEventReceived.connect(onTabletWebEventReceived);
        } else {
            // setUIUpdating(false);
            tablet.webEventReceived.disconnect(onTabletWebEventReceived);
        }
    }

    function onTabletWebEventReceived(data) {
        // EventBridge message from HTML script.
        var message;
        try {
            message = JSON.parse(data);
        } catch (e) {
            return;
        }

        switch (message.type) {
            case EVENT_BRIDGE_OPEN_MESSAGE:
                doUIUpdate();
                break;
            case SET_ACTIVE_MESSAGE:
                if (isAppActive !== message.value) {
                    tabletButton.editProperties({
                        isActive: message.value
                    });
                    setAppActive(message.value);
                }
                tablet.gotoHomeScreen(); // Automatically close app.
                break;
            case CLOSE_DIALOG_MESSAGE:
                tablet.gotoHomeScreen();
                break;
        }
    }

    // Main
    // /////////////////////////////////////////////////////////////////////////
    // splitDanceUrls();
    setup();
    // animationSTateHandler = MyAvatar.addAnimationStateHandler(function (props) {
    //     var keys = Object.keys(props).filter(function(prop){
    //         return prop.indexOf("anim") > -1;
    //     });
    //     if (keys.length > 0) {
    //         keys.forEach(function(key) {
    //             log(LOG_VALUE, key, props[key]);
    //         });
    //     }
    //     return {};
    // }, null);

    // Cleanup
    // /////////////////////////////////////////////////////////////////////////
    function scriptEnding() {
        console.log("### in script ending");
        if (isAppActive) {
            setAppActive(false);
        }
        if (isTabletUIOpen) {
            tablet.webEventReceived.disconnect(onTabletWebEventReceived);
        }
        if (tabletButton) {
            tabletButton.clicked.disconnect(onTabletButtonClicked);
            tablet.removeButton(tabletButton);
            tabletButton = null;
        }
        tablet = null;

        if (coatTimer !== null) {
            Script.clearInterval(coatTimer);
        }
        // Messages.messageReceived.disconnect(onMessageReceived);
        // Messages.unsubscribe(MESSAGE_CHANNEL);
        // MyAvatar.removeAnimationStateHandler(animationSTateHandler); 
    }

    Script.scriptEnding.connect(scriptEnding);
}());
