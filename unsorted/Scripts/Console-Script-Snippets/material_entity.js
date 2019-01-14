
 var materialID = Entities.addEntity({ 
     type: "Material", 
     parentID: MyAvatar.sessionUUID, 
     materialURL: "materialData", 
     priority: 1, 
     materialData: JSON.stringify({ 
         materialVersion: 1,
         materials: { 
            "model": "hifi_pbr",
            "albedoMap": "http://cdn.shopify.com/s/files/1/0891/8314/products/Troll_Face_Decal_4ccf767e2e2d9_grande.jpeg?v=1459053675"
               } 
    })
}, true);