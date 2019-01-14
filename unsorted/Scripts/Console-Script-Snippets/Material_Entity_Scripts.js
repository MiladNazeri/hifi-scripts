function clamp(min, max, num) {
    return Math.min(Math.max(num, min), max);
}

var coatName = "material_milad_coat";
var coatID = Entities.findEntitiesByName(coatName,MyAvatar.position,10)[0];
console.log(coatID);
var PI = Math.PI;
var currentStep = 0;
var timeAroundCircle = 250;
var quantizeLevel = 100;
var step = PI / timeAroundCircle; // pi/ms
var quantizePerMS = timeAroundCircle / quantizeLevel;
var coatTimer = null;

function returnSin(radians, offset, multiplier) {
    return Math.sin(radians * multiplier + offset);
}

function returnCos(radians, offset, multiplier) {
    return Math.cos(radians * multiplier + offset);
}

coatTimer = Script.setInterval(function() {
    // console.log(currentStep);
    // var currentSin = Math.abs(returnSin(currentStep, 0.0, 1.0));
    var currentSin = returnSin(currentStep, 0.0, 1.0);
    var currentCos = returnCos(currentStep, 0.0, 1.0);
    // console.log("label : currentSin" + JSON.stringify(currentSin));
    var manipulatedSin = currentSin;
    var clampedSin = clamp(0, 1.0, manipulatedSin);
    // console.log("label : clampedSin" + JSON.stringify(clampedSin));

    var image1 = "http://youthvote.org/wp-content/uploads/2017/10/youth-vote.png";
    var image2 = "https://www.goodtextures.com/cache/bd229a95/av9ba39985c4b3b8b4d99.png"; // rough map
    var image3 = "http://www.tripwiremagazine.com/wp-content/uploads/2014/02/ice-textures-featured.jpg";
    var image4 = "https://creativenerds.co.uk/wp-content/uploads/2018/05/Spray-paint-texture-set-01-680x420.jpg";
    var image5 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCy9xN2szFhXlNz7EZV078sHS5W8E2LW_MiunAjO1W-KuSyXTQ";
    var image6 = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQlg6wFSalAdqhzFt2yKHnwl_o4rEirjvHzJ9iaP1r1F9D3fTi";
    var image7 = "https://hifi-content.s3.amazonaws.com/milad/ROLC/Organize/O_Projects/Hifi/Assets/Images/Studio-Office/zodiac.PNG"
    currentStep += step;
    var materialProperties = {
        materialVersion: 1,
        materials: {
            name: "test material",
            model: "hifi_pbr",
            emissive: [
                clamp(0, 1.0, currentCos * 444.3),
                clamp(0, 1.0, currentCos * 1),
                clamp(0, 1.0, Math.pow(currentCos, 3333.3))
            ],
            opacity: 1,
            albedo: [
                clamp(0, 1.0, currentSin * 0.3),
                clamp(0, 1.0, currentSin * 1),
                clamp(0, 1.0, Math.pow(currentSin, 3330.3))
            ],
            roughness: currentSin,
            metallic: 1.0,
            scattering: 1.0,
            unlit: false,
            emissiveMap: image7,
            albedoMap: image7,
            opacityMap: image1,

            roughnessMap: image7,
            // glossMap: image1,

            metallicMap: image1,
            // specularMap: image1,

            normalMap: image1,
            // bumpMap: image,

            occlusionMap: image1,
            scatteringMap: image1
            // lightMap: image
        }
    }
    var properties = {
        materialData: JSON.stringify(materialProperties)
        // materialMappingRot: currentStep * 12.80,
        // materialMappingScale: {x: currentSin * 13, y: currentCos * 13},
        // materialMappingPos: {x: clamp(0, 1.0, currentSin * 3), y: clamp(0, 1.0, currentCos * 32)}
    };

    Entities.editEntity(coatID,properties);

}, quantizePerMS) 


Script.scriptEnding.connect(function(){
    if (coatTimer !== null) {
        Script.clearInterval(coatTimer);
    }
})