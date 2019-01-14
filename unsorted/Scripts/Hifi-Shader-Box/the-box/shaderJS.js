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

    var TWEEN = Script.require('./tween.js');

    DEBUG = false;
    function log(describer, obj) {
        if (!DEBUG) return
        if (typeof obj !== "string" || typeof obj !== "number") {obj = JSON.stringify(obj);}
        print("\n### " + describer + " ::: " + obj );
    }

    // make vector from array
    function mkVFA(array){
        var props = {};
        if (array.length === 1){
            props.x = array[0];
            props.y = array[0];
            props.z = array[0];

        } else {
            props.x = array[0];
            props.y = array[1];
            props.z = array[2];
        }
        return props;
    }
    // make Quat from Array
    function mkQFA(array){
        var vec = mkVFA(array);
        var quat = Quat.fromVec3Degrees(vec);
        return quat;
    }
    // make color from array
    function mkCFA(array){
        var props = {};
        if (array.length === 1){
            props.red = array[0];
            props.green = array[0];
            props.blue = array[0];

        } else {
            props.red = array[0];
            props.green = array[1];
            props.blue = array[2];
        }
        return props;
    }
    // make props for box
    var defaultPropObj = {
        position: mkVFA([0,0,0]),
        dimensions: mkVFA([1,1,1]),
        rotation: mkQFA([0,0,0]),
        registrationPoint: mkVFA([0.5,0.5,0.5]),
        offset: mkVFA([0,0,0]),
        color: mkCFA([25,25,25])
    };
    // delete any invalid key/value
    function delUndefined(obj){
        var keys = Object.keys(obj);
        keys.forEach(function(key){
            if (!obj[key] || obj[key] === "") {delete obj[key];}
        });
        return obj;
    }
    function mkProps(position, dimensions, rotation, registration, offset, color, name){
        if (Array.isArray(position)) {position = mkVFA(position);}
        if (position === "av") {position = MyAvatar.position;}
        if (Array.isArray(dimensions)) {dimensions = mkVFA(dimensions);}
        if (Array.isArray(rotation)) {rotation = mkQFA(rotation);}
        if (Array.isArray(registration)) {registration = mkVFA(registration);}
        if (Array.isArray(offset)) {offset = mkVFA(offset);}
        if (Array.isArray(color)) {color = mkCFA(color);}

        var newProps = {
            name: name,
            position: Vec3.sum(position, offset),
            dimensions: dimensions,
            rotation: rotation,
            registrationPoint: registration,
            color: color
        };
        var finalObj = Object.assign({},defaultPropObj, delUndefined(newProps));
        // log("finalObj",finalObj);
        return finalObj;
    }
    var i = 2;
    var j = 3;
    var colorFrequency = 8;
    var parentID;

    var userData = JSON.stringify({
        ProceduralEntity: {
        version: 2,
        shaderUrl: "http://192.241.189.145:8083/hifi/mat_shiny.fs?1488780575304",
        // shaderUrl: "http://localhost:3001/shader.fs?v=" + Date.now(),
        channels: ["http://localhost:3001/pokerchip-green.jpg"],
        uniforms: {
	      specular_intensity: 0.8,
		        specular_hardness: 380,
		        diffuse_color: [
                    Math.sin(colorFrequency*(i+j) + 0),
                    Math.sin(colorFrequency*(i+j) + 2 * Math.PI/3),
                    Math.sin(colorFrequency*(i+j) + 4 * Math.PI/3)
			       ],
		        emit: -10,
		        iSpeed: Math.random()/4,
		        hide: [0.0,0.0,0.0],
		        specular_color: [
                    Math.sin(colorFrequency*(i+j) + 0),
                    Math.sin(colorFrequency*(i+j) + 2 * Math.PI/3),
                    Math.sin(colorFrequency*(i+j) + 4 * Math.PI/3)
                ]
	      }
       },

    });
    // var userData2 = JSON.stringify({
    //     ProceduralEntity: {
    //         version: 2,
    //         shaderUrl: "http://localhost:3001/shader2.fs?v=" + Date.now(),
    //         channels: ["http://localhost:3001/pokerchip-red.JPG"],
    //         uniforms: {
    //             speed: 0.6
    //         }
    //     },
    // });
    var userData3 = JSON.stringify({
        ProceduralEntity: {
            version: 2,
            shaderUrl: "http://localhost:3001/shaders/shade001.fs?v=" + Date.now(),
            channels: ["http://localhost:3001/pokerchip-red.JPG"],
            uniforms: {
                speed: 0.6
            }
        },
    });
    function tURL(image){
        var base = "http://localhost:3001/images/";
        return base + image;
    }
    var urls = [
        "shade001",
        "shade002",
        "shade003",
        "shade004",
        "shade005",
        "shade006",
        "shade007",
        "shade008",
        "shade009",
        "shade010",
    ]
    var textures = [
        tURL("001.jpg"),
        tURL("pokerchip-red.jpg"),
        tURL("mercurybump.jpg"),
        tURL("moonbump1k.jpg"),

    ]
    var channels = [
        [textures[0]],
        [textures[1]],
        [textures[2]],
        [textures[3]],


    ];
    var uniform = [
        {speed: 0.6},
        {uShine: 0.6, uEmit: 1.0, uSpecular: 0.0, speed: 0.6},


    ];
    function makeFS(url,channels, uniforms){
        return JSON.stringify({
            ProceduralEntity: {
                version: 2,
                shaderUrl: "http://localhost:3001/shaders/" + url + ".fs?v=" + Date.now(),
                channels: channels,
                uniforms: uniforms
            },
        })
    }
    var userDataArray = [
        makeFS(urls[0], channels[1], uniform[0]),
        makeFS(urls[1], channels[1], uniform[0]),
        makeFS(urls[2], channels[2], uniform[0]),
        makeFS(urls[2], channels[3], uniform[0]),
        makeFS(urls[3], channels[3], uniform[0]),
        makeFS(urls[3], channels[2], uniform[0]),
        makeFS(urls[4], channels[2], uniform[1]),
        makeFS(urls[4], channels[0], uniform[1]),
        makeFS(urls[5], channels[1], uniform[1]),
        makeFS(urls[6], channels[1], uniform[1]),
        makeFS(urls[7], channels[1], uniform[1]),
        makeFS(urls[8], channels[0], uniform[1]),
        makeFS(urls[9], channels[0], uniform[1]),



    ];
    var userDataToUse = userDataArray[userDataArray.length-1];
    function mkBox(position, dimensions, rotation, registration, offset, color, name){
        var boxProps = {
            type: "Box",
            userData: userDataToUse,
        };
        var finalProps = Object.assign({}, boxProps, mkProps(position, dimensions, rotation, registration, offset, color, name));
        return Entities.addEntity(finalProps);
    }
    function mkBoxProps(props){
        position = props[0];
        dimensions = props[1];
        rotation = props[2];
        registration = props[3];
        offset = props[4];
        color = props[5];
        name = props[6];

        var boxProps = {
            type: "Box",
            // userData: userData2
        };
        var finalProps = Object.assign({}, boxProps, mkProps(position, dimensions, rotation, registration, offset, color, name));
        log("FINAL PROPS!!!!", finalProps)
        return finalProps
    }
    function mkboxNoShader(position, dimensions, rotation, registration, offset, color, name){
        var boxProps = {
            type: "Box",
            dynamic: false,
            collisionless: true,
            id: parentID,
            visible: false
            // userData: userData
        };
        var finalProps = Object.assign({}, boxProps, mkProps(position, dimensions, rotation, registration, offset, color, name));
        parentID = Entities.addEntity(finalProps);
        return parentID;
    }
    function mkZone(position, dimensions, rotation, registration, offset, color, name){
        var zoneProps = {
            parentID: parentID,
            type: "Zone",
            keyLightMode: "enabled",
            ambientLightMode: "inherit",
            skyboxMode: "inherit",
            hazeMode: "inherit",
            keyLight: {
                ambientIntensity: 0.5,
                ambientURL: "",
                color: {
                    blue: 255,
                    green: 255,
                    red: 255
                },
                direction: {
                    x: 0.3411870300769806,
                    y: -0.9396926164627075,
                    z: -0.023858120664954185
                },
                intensity: 5
            },
            stage: {
                altitude: 0.029999999329447746,
                automaticHourDay: 0,
                day: 60,
                hour: 12,
                latitude: 37.777000427246094,
                longitude: 122.40699768066406,
                sunModelEnabled: 0
            },
            direction: mkVFA([0,-1,0]),

        };
        var finalProps = Object.assign({}, zoneProps, mkProps(position, dimensions, rotation, registration, offset, color, name));
        return Entities.addEntity(finalProps);
    }
    var entitiesGroup = {
        currentIDs: [],
        addEntity: function(entityID){
            this.currentIDs.push(entityID);
        },
        removeEntity: function(id){
            log("in remove entity");

            var index = -1;
            for (var i = 0; i < this.currentIDs.length; i++){
                log("this.currentIDs[i]", this.currentIDs[i]);
                log("id", id);

                if (this.currentIDs[i] === id) {
                    index = i;
                    break;
                }
            }
            log("index", index);
            print(index);

            if (index > -1) {
                this.currentIDs.splice(index,1);
                Entities.deleteEntity(id);
            }
        },
        deleteAllEntities: function(){
            while (this.currentIDs.length > 0){
                this.removeEntity(this.currentIDs[0]);
            }
        },
        getProps: function(index, id){
            log("in get props")

            if (typeof index == "number"){
                log("in index get props");

                return Entities.getEntityProperties(this.currentIDs[index]);
            }
            if (id){
                log("in id get props");
                return Entities.getEntityProperties(id);
            }
        },
        getAllProps: function(){
            log("in get all props")
            log("this.curretIds", this.currentIDs);
            var array = this.currentIDs.map(function(id){
                // log("id", id)
                var props = this.getProps(null,id);
                // log("props", props)
                return props;
            }, this)
            log("array", array);
            return array;
        },
        editProps: function(index, id, props){
            // log("editing props");
            // log("index", index);
            // log("id", id);
            // log("props", props);

            if (typeof index === "number"){
                // log("this.currentIDs[index]", this.currentIDs[index])
                // log("props",props);
                // log("index", index);
                // log("this.currentIDs", this.currentIDs)
                // var boxProps = entitiesGroup.getProps(index).rotation;
                // log("boxPropsPosition", boxProps);
                Entities.editEntity(this.currentIDs[index], props);
                // boxProps = entitiesGroup.getProps(index).rotation;
                // log("boxPropsPosition", boxProps);
            }
            if (id){
                Entities.editEntity(id, props);

            }
        },
        makeParent: function(pID){
            print("in make Parent");
            this.currentIDs.slice(1).forEach(function(id){
                print("id", id);
                Entities.editEntity(id,{
                    parentID: pID
                })
            })
        },
        lastId: function(){
            return this.currentIDs.length-1;
        },
        spin: function(amount){
            var id = this.currentIDs[0];
            Entities.editEntity(id, {
                angularVelocity: {x:amount, y:amount, z: amount}
            });
        },
        speed: function(speed){
            log("speed", speed);
            var newSpeed = lerp (0,127,0.0,2.0,speed);
            var newUserData = JSON.parse(userDataToUse);
            log("newUserData",newUserData);
            newUserData.ProceduralEntity.uniforms.speed = newSpeed
            props = {userData: JSON.stringify(newUserData)};
            // log("props",props);
            this.currentIDs.forEach(function(id) {Entities.editEntity(id, props)});
            // log("newProps", this.getProps(1).userData);
        },
        emit: function(emit){
            log("emit", emit);
            var newEmit = lerp (0,127,0.0,1.0,emit);
            var newUserData = JSON.parse(userDataToUse);
            log("newUserData",newUserData);
            newUserData.ProceduralEntity.uniforms.uEmit = newEmit
            props = {userData: JSON.stringify(newUserData)};
            // log("props",props);
            this.currentIDs.forEach(function(id) {Entities.editEntity(id, props)});
            // log("newProps", this.getProps(1).userData);
        },
        specular: function(specular){
            log("specular", specular);
            var newSpecular = lerp (0,127,0.0,1.0,specular);
            var newUserData = JSON.parse(userDataToUse);
            log("newUserData",newUserData);
            newUserData.ProceduralEntity.uniforms.speed = newSpecular
            props = {userData: JSON.stringify(newUserData)};
            // log("props",props);
            this.currentIDs.forEach(function(id) {Entities.editEntity(id, props)});
            // log("newProps", this.getProps(1).userData);
        },
        shine: function(shine){
            log("shine", shine);
            var newShine = lerp (0,127,0.0,255.0,shine);
            var newUserData = JSON.parse(userDataToUse);
            log("newUserData",newUserData);
            newUserData.ProceduralEntity.uniforms.speed = newShine
            props = {userData: JSON.stringify(newUserData)};
            // log("props",props);
            this.currentIDs.forEach(function(id) {Entities.editEntity(id, props)});
            // log("newProps", this.getProps(1).userData);
        },
        boxLength:2,
        boxWidth:2,
        boxHeight:2,
        boxThickness:0.4,
        distanceApart: [0,0,0],
        length: function(length){
            this.boxLength = length;
            var boxProps = makeNewBoxProps(this.boxLength, this.boxWidth, this.boxHeight,this.boxThickness, this.distanceApart);
            log("boxProps", boxProps)
            var propsGroup = makePropsForBox(0,boxProps);

                log("propsGroup", propsGroup);
            propsGroup.forEach(function(props,index){
                var actuallPropsToSend = mkBoxProps(props);
                log("props",props);
                log("actualPropsToSend", actuallPropsToSend)
                this.editProps(index,null,actuallPropsToSend);
            },this)

        },
        width: function(width){
            this.boxWidth = width;
            var boxProps = makeNewBoxProps(this.boxLength, this.boxWidth, this.boxHeight,this.boxThickness, this.distanceApart);
            log("boxProps", boxProps)
            var propsGroup = makePropsForBox(0,boxProps);

                log("propsGroup", propsGroup);
            propsGroup.forEach(function(props,index){
                var actuallPropsToSend = mkBoxProps(props);
                log("props",props);
                log("actualPropsToSend", actuallPropsToSend)
                this.editProps(index,null,actuallPropsToSend);
            },this)
        },
        height: function(height){
            this.boxHeight = height;
            var boxProps = makeNewBoxProps(this.boxLength, this.boxWidth, this.boxHeight,this.boxThickness, this.distanceApart);
            log("boxProps", boxProps)
            var propsGroup = makePropsForBox(0,boxProps);

                log("propsGroup", propsGroup);
            propsGroup.forEach(function(props,index){
                var actuallPropsToSend = mkBoxProps(props);
                log("props",props);
                log("actualPropsToSend", actuallPropsToSend)
                this.editProps(index,null,actuallPropsToSend);
            },this)
        },
        thickness: function(thickness){
            this.boxThickness = thickness;
            var boxProps = makeNewBoxProps(this.boxLength, this.boxWidth, this.boxHeight,this.boxThickness, this.distanceApart);
            log("boxProps", boxProps)
            var propsGroup = makePropsForBox(0,boxProps);

                log("propsGroup", propsGroup);
            propsGroup.forEach(function(props,index){
                var actuallPropsToSend = mkBoxProps(props);
                log("props",props);
                log("actualPropsToSend", actuallPropsToSend)
                this.editProps(index,null,actuallPropsToSend);
            },this)
        }

    };

    function changeSpeed(newSpeed){
        entitiesGroup.speed(newSpeed);
    }
    function changeEmit(newSpeed){
        entitiesGroup.emit(newSpeed);
    }
    function changeSpecular(newSpeed){
        entitiesGroup.specular(newSpeed);
    }
    function changeShine(newSpeed){
        entitiesGroup.shine(newSpeed);
    }

    function changeLength(length){
        entitiesGroup.length(length);
    }
    function changeWidth(width){
        entitiesGroup.width(width);
    }
    function changeHeight(height){
        entitiesGroup.height(height);
    }
    function changeThickness(thickness){
        entitiesGroup.thickness(thickness);
    }
    function spin(amount){
        entitiesGroup.spin(amount);
    }
    function multScAr(scalar,array){
        log("scalar", scalar)
        log("array", array)
        // if (scalar === 0) return [0,0,0];
        var newArray = array.map(function(index){
            return index * scalar;
        });
        log("new Array", newArray);
        return newArray;
    }
    function addScAr(scalar,array){
        log("scalar", scalar)
        log("array", array)
        if (scalar === 0) return [0,0,0];
        var newArray = array.map(function(index){
            return index + scalar;
        });
        log("new Array", newArray);
        return newArray;
    }
    function howManyTimes(num,functionCallBack, passInProps){
        var counter = 0;

        while (counter < num){
            functionCallBack(counter,passInProps);
            counter++;
        }
    }
    function sumArrays(array1, array2){
        log("array1",array1)
        log("array2",array2)

        var array3 = []
        array3[0] = array1[0] + array2[0];
        array3[1] = array1[1] + array2[1];
        array3[2] = array1[2] + array2[2];
        return array3;
    }
    function makePropsForBox(currentCounter, props){
        var distanceApart = props.distanceApart;
        var length = props.length;
        var width = props.width;
        var height = props.height;
        var wallThickness = props.wallThickness;
        var lengthWithOffset = length + wallThickness;
        var offsetFromCounter = multScAr(currentCounter,distanceApart);
        var floor =[
            "av",
            [lengthWithOffset, wallThickness/2, width + wallThickness*2],
            [ 0, 0, 0],
            [0.5,1.0,0.5],
            sumArrays([0,-height/2,0],offsetFromCounter),
            [50, 250, 250],
            "floor"
        ]
        var ceiling = [
            "av",
            [lengthWithOffset, wallThickness/2, width + wallThickness*2],
            [ 0, 0, 0],
            [0.5,0.0,0.5],
            sumArrays([0,height/2,0],offsetFromCounter),
            [250, 50, 250],
            "ceiling"
        ]
        var wall1 = [
            "av",
            // [lengthWithOffset, width, height + width],
            [length, height, wallThickness],
            [0, 0, 0],
            [0.5 ,0.5, 0.0],
            // sumArrays([0, -length/2, length/2], offsetFromCounter),
            sumArrays([0, 0, width/2], offsetFromCounter),
            [250, 0, 90],
            "wall1"
        ]
        var wall2 = [
            "av",
            [length, height, wallThickness],
            [0, 0, 0],
            [0.5 ,0.5, 1.0],
            sumArrays([0, 0, -width/2], offsetFromCounter),
            [0, 170, 90],
            "wall2"
        ]
        var wall3 = [
            "av",
            [wallThickness/2, height, width + wallThickness*2],
            [0, 0, 0],
            [0.0 ,0.5, 0.5],
            sumArrays([ -lengthWithOffset/2, 0, 0], offsetFromCounter),
            [150, 170, 0],
            "wall3"
        ]
        var wall4 = [
            "av",
            [wallThickness/2, height, width + wallThickness*2],
            [0, 0, 0],
            [1.0 ,0.5, 0.5],
            sumArrays([ lengthWithOffset/2, 0, 0], offsetFromCounter),
            [150, 170, 80],
            "wall4"
        ]
        var zone = [
            "av",
            [length, height, width],
            [0, 0, 0],
            [0.5 ,0.5, 0.5],
            sumArrays([0, 0, 0], offsetFromCounter),
            [50, 0, 255],
            "Zone"


        ]
        var propsGroup = [floor, ceiling, wall1, wall2, wall3, wall4, zone];
        return propsGroup;
    }
    function makeBoxes(currentCounter, props){
        var distanceApart = props.distanceApart;
        var length = props.length;
        var width = props.width;
        var height = props.height;
        var wallThickness = props.wallThickness;
        var lengthWithOffset = length + wallThickness;

        var offsetFromCounter = multScAr(currentCounter,distanceApart);

        // log("offsetFromCounter", offsetFromCounter)

        // position, dimensions, rotations, registration, offset, color, name

        entitiesGroup.addEntity(mkboxNoShader(
            "av",
            [length, height, width],
            [0, 0, 0],
            [0.5 ,0.5, 0.5],
            sumArrays([0, 0, 0], offsetFromCounter),
            [50, 0, 255],
            "Parent"));
        entitiesGroup.addEntity(mkBox(
            "av",
            [lengthWithOffset, wallThickness/2, width + wallThickness*2],
            [ 0, 0, 0],
            [0.5,1.0,0.5],
            sumArrays([0,-height/2,0],offsetFromCounter),
            [50, 250, 250],
            "floor"));
        entitiesGroup.addEntity(mkBox(
            "av",
            [lengthWithOffset, wallThickness/2, width + wallThickness*2],
            [ 0, 0, 0],
            [0.5,0.0,0.5],
            sumArrays([0,height/2,0],offsetFromCounter),
            [250, 50, 250],
            "ceiling"));
        entitiesGroup.addEntity(mkBox(
            "av",
            // [lengthWithOffset, width, height + width],
            [length, height, wallThickness],
            [0, 0, 0],
            [0.5 ,0.5, 0.0],
            // sumArrays([0, -length/2, length/2], offsetFromCounter),
            sumArrays([0, 0, width/2], offsetFromCounter),
            [250, 0, 90],
            "wall1"));
        entitiesGroup.addEntity(mkBox(
            "av",
            [length, height, wallThickness],
            [0, 0, 0],
            [0.5 ,0.5, 1.0],
            sumArrays([0, 0, -width/2], offsetFromCounter),
            [0, 170, 90],
            "wall2"));
        entitiesGroup.addEntity(mkBox(
            "av",
            [wallThickness/2, height, width + wallThickness*2],
            [0, 0, 0],
            [0.0 ,0.5, 0.5],
            sumArrays([ -lengthWithOffset/2, 0, 0], offsetFromCounter),
            [150, 170, 0],
            "wall3"));
        entitiesGroup.addEntity(mkBox(
            "av",
            [wallThickness/2, height, width + wallThickness*2],
            [0, 0, 0],
            [1.0 ,0.5, 0.5],
            sumArrays([ lengthWithOffset/2, 0, 0], offsetFromCounter),
            [150, 170, 80],
            "wall4"));
        entitiesGroup.addEntity(mkZone(
            "av",
            [length, height, width],
            [0, 0, 0],
            [0.5 ,0.5, 0.5],
            sumArrays([0, 0, 0], offsetFromCounter),
            [50, 0, 255],
            "Zone"));

    }

    function updatePosition(obj) {
        log("in update position");
        // log("boxProps",boxProps)

        // var lastId = entitiesGroup.lastId();
        // var currentProps = entitiesGroup.getProps(0).position;
        // log("currentProps", currentProps)
        entitiesGroup.editProps(2,null,obj);
    }
    function tweenStep(){
        log("done with tween");
    }
    var length = 10;
    var width = 10;
    var height = 10; var wallThickness = 0.1;
    var distanceApart = [0.2,0.2,0.4];
    var propsToMakeBox = {
        length: length,
        width: width,
        height: height,
        wallThickness: wallThickness,
        distanceApart: sumArrays([length,width,height],distanceApart)
    };
    function makeNewBoxProps(length, width, height, wallThickness, distanceApart){
        log("distanceApart:::::",distanceApart);
        return {
            length: length,
            width: width,
            height: height,
            wallThickness: wallThickness,
            distanceApart: sumArrays([length,width,height],distanceApart)
        }
    }

    howManyTimes(1, makeBoxes, propsToMakeBox);
    var DELAY_TIME = 250;
    var groupProps = entitiesGroup.getAllProps(); // array of props
    log("groupProps", groupProps)
    var tweenArrays = groupProps.map(function(entity){
        log("###entity", entity.position)
        var qByV = Vec3.multiplyQbyV(MyAvatar.orientation, entity.position);
        var multiply = Vec3.multiply(qByV, 5);
        log("qbyV", multiply);
        var positionToMoveTo = Vec3.sum(entity.position, mkVFA([100,100,100]))
        return new TWEEN.Tween(multiply)
    })
    tweenArrays.forEach(function(tween, index){
        var positionToMoveTo = groupProps[index].position;
        log("groupProps[index].position,", groupProps[index].position)
        log("positionToMoveTo", positionToMoveTo)
        tween
        .to(positionToMoveTo, DELAY_TIME)
        .onUpdate(function(obj){
            // log("obj",obj)
            var props = {
                position: obj
            }
            entitiesGroup.editProps(index,null,props);
        })
        tween.start();
    })
    Script.setTimeout(function(){
        entitiesGroup.makeParent(parentID);
    }, DELAY_TIME)

    function updateTweens() {
        //hook tween updates into our update loop
        TWEEN.update();
    }
    Script.update.connect(updateTweens);

    var circleValue = 0;
    var directionValue = 0;
    var trackValue = 0;
    function circleValueEdit(amount, direction){
        if (direction === 'up'){
            circleValue += amount;
            if (circleValue >= 127) circleValue = 127
            if (circleValue <= 0) circleValue = 0
        } else {
            circleValue -= amount;
            if (circleValue >= 127) circleValue = 127
            if (circleValue <= 0) circleValue = 0
        }
    }
    function directionValueEdit(amount, direction){
        if (direction === 'up'){
            directionValue += amount;
            if (directionValue >= 127) directionValue = 127
            if (directionValue <= 0) directionValue = 0
        } else {
            directionValue -= amount;
            if (directionValue >= 127) directionValue = 127
            if (directionValue <= 0) directionValue = 0
        }
    }
    function trackValueEdit(amount, direction){
        if (direction === 'up'){
            trackValue += amount;
            if (trackValue >= 127) trackValue = 127
            if (trackValue <= 0) trackValue = 0
        } else {
            trackValue -= amount;
            if (trackValue >= 127) trackValue = 127
            if (trackValue <= 0) trackValue = 0
        }
    }
    var novationMap = {
        knob_1: 21,
        knob_2: 22,
        knob_3: 23,
        knob_4: 24,
        knob_5: 25,
        knob_6: 26,
        knob_7: 27,
        knob_8: 28,
        pad_1: 40,
        pad_2: 41,
        pad_3: 42,
        pad_4: 43,
        pad_5: 48,
        pad_6: 49,
        pad_7: 50,
        pad_8: 51,
        pad_9: 36,
        pad_10: 37,
        pad_11: 38,
        pad_12: 39,
        pad_13: 44,
        pad_14: 45,
        pad_15: 46,
        pad_16: 47,
        circle_up: 108,
        circle_down: 109,
        up: 104,
        down: 105,
        track_left: 106,
        track_right: 107
    }

    var midiInDevice = "Launchkey Mini"
    var midiOutDevice = "Launchkey Mini"
    var midiInDeviceId = -1;
    var midiOutDeviceId = -1;
    var midiChannel = 1; // set midi channel
    var midiInDeviceList = [];
    var midiOutDeviceList = [];
    const INPUT = false;
    const OUTPUT = true;
    const ENABLE = true;
    const DISABLE = false;


function midiEventReceived(eventData) {
    // if (eventData.device != midiInDeviceId || eventData.channel != midiChannel ){
    //     return;
    // }
    log("eventData", eventData)
    // Light Speed
    if (eventData.note == novationMap.knob_1){
        changeSpeed(eventData.velocity);
    }
    if (eventData.note == novationMap.knob_2){
        var newLength = lerp(0,127,2,30,eventData.velocity)
        changeLength(newLength);
    }
    if (eventData.note == novationMap.knob_3){
        var newWidth = lerp(0,127,2,30,eventData.velocity)

        changeWidth(newWidth);
    }
    if (eventData.note == novationMap.knob_4){
        var newHeight = lerp(0,127,2,30,eventData.velocity)

        changeHeight(newHeight);
    }
    if (eventData.note == novationMap.knob_5){
        var newThickness = lerp(0,127,1,20,eventData.velocity)
        changeThickness(newThickness);
    }
    if (eventData.note == novationMap.knob_6){
        changeEmit(eventData.velocity);
    }
    if (eventData.note == novationMap.knob_7){
        changeSpecular(eventData.velocity);
    }
    if (eventData.note == novationMap.knob_8){
        changeShine(eventData.velocity);
    }
    if (eventData.note == novationMap.pad_1){
        var amount = lerp(0,127,1,180,eventData.velocity)

        spin(amount);
    }
}

function lerp(InputLow, InputHigh, OutputLow, OutputHigh, Input) {
    return ((Input - InputLow) / (InputHigh - InputLow)) * (OutputHigh - OutputLow) + OutputLow;
}
//lerp (0,127,0,360,eventData.velocity);

function getMidiInputs(){
    var midiInDevices = Midi.listMidiDevices(INPUT);
    midiInDeviceList = midiInDevices;
}

function getMidiOutputs(){
    var midiOutDevices = Midi.listMidiDevices(OUTPUT);
    midiOutDevices.shift(); // Get rind of MS wavetable synth
    midiOutDeviceList = midiOutDevices;
}

function getMidiDeviceIds(){
    for (var i = 0; i < midiInDeviceList.length; i++){
        if (midiInDeviceList[i] == midiInDevice){
            midiInDeviceId = i;
        }
    }
    for (var i = 0; i < midiOutDeviceList.length; i++){
        if (midiOutDeviceList[i] == midiOutDevice){
            midiOutDeviceId = i + 1;
        }
    }
}

// List Midi Input Devices
function listMidiInputs(){
    print("Input Devices:");
    for(var i = 0; i < midiInDeviceList.length; i++) {
        print("(" + i + ") " + midiInDeviceList[i]);
    };
}

// List Midi ouput Devices
function listMidiOutputs(){
    print("Output Devices:");
    for(var i = 0; i < midiOutDeviceList.length; i++) {
        print("(" + (i+1) + ") " + midiOutDeviceList[i]); // Get rid of MS wavetable synth
    };
}

function midiHardwareResetReceieved(){
    getMidiInputs();
    getMidiOutputs();
    getMidiDeviceIds();
    //blockAllDevices();
    unblockMidiDevice();
}

function unblockMidiDevice(){
    Midi.unblockMidiDevice(midiOutDevice, OUTPUT);
    Midi.unblockMidiDevice(midiInDevice, INPUT);
}

function midiConfig(){
    Midi.thruModeEnable(DISABLE);
    Midi.broadcastEnable(DISABLE);
    Midi.typeNoteOffEnable(ENABLE);
    Midi.typeNoteOnEnable(ENABLE);
    Midi.typePolyKeyPressureEnable(DISABLE);
    Midi.typeControlChangeEnable(ENABLE);
    Midi.typeProgramChangeEnable(ENABLE);
    Midi.typeChanPressureEnable(DISABLE);
    Midi.typePitchBendEnable(DISABLE);
    Midi.typeSystemMessageEnable(DISABLE);
    midiHardwareResetReceieved();
}

midiConfig();

Midi.midiReset.connect(midiHardwareResetReceieved);
Midi.midiMessage.connect(midiEventReceived);

    Script.scriptEnding.connect(function(){
        entitiesGroup.deleteAllEntities();
        Script.update.disconnect(updateTweens);
    });

}());
