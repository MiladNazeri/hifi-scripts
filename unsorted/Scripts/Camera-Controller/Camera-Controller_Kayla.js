(function(){

var position;
var orientation; 

    var MAPPING_NAME = "Kayla-Camera";

    var mapping = Controller.newMapping(MAPPING_NAME);

    mapping.from(Controller.Hardware.Keyboard[1]).to(function(value){ print(value);
        console.log("pressed 1")
        position = {
            x: 100.943,
            y: -0.710865,
            z: 35.4961,
        };
        orientation = {
                x: 0,
                y: 0.0607909,
                z: 0,
                w: 0.998151
        };

        MyAvatar.goToLocation(position, true, orientation);

    });

    mapping.from(Controller.Hardware.Keyboard[2]).to(function(value){ print(value);
        console.log("pressed 2")
        
        position = {
            x: 93.5044,
            y: 0.567804,
            z: 30.6696,
        };
        orientation = {
                x: 0,
                y: -0.591504,
                z: 0,
                w: 0.806302
        };
        MyAvatar.goToLocation(position, true, orientation);

    });

    mapping.from(Controller.Hardware.Keyboard[3]).to(function(value){ print(value);
        console.log("pressed 3")
       
        position = {
            x: 107.132,
            y: 0.168267,
            z: 28.2939
        };
        orientation = {
                x: 0,
                y: 0.775746,
                z: 0,
                w: 0.631046
        };

        MyAvatar.goToLocation(position, true, orientation);

    });

    mapping.from(Controller.Hardware.Keyboard[4]).to(function(value){ print(value);
        console.log("pressed 4")
        
        position = {
            x: 100.019,
            y: 1.61517,
            z: 23.171
        };
        orientation = {
                x: 0,
                y: 0.999951,
                z: 0,
                w: 0.00994885
        };

        MyAvatar.goToLocation(position, true, orientation);
    });

    mapping.from(Controller.Hardware.Keyboard[5]).to(function(value){ print(value);
        console.log("pressed 5")
        
        position = {
            x: 102.839,
            y: -1.09772,
            z: 32.4307
        };
        orientation = {
                x: 0,
                y: -0.840399,
                z: 0,
                w: 0.541968
        };

        MyAvatar.goToLocation(position, true, orientation);
    });

    mapping.from(Controller.Hardware.Keyboard[6]).to(function(value){ print(value);
        console.log("pressed 6")
        
        position = {
            x: 96.9396,
            y: -1.18233,
            z: 33.0687
        };
        orientation = {
                x: 0,
                y: 0.77963,
                z: 0,
                w: 0.62624
        };

        MyAvatar.goToLocation(position, true, orientation);
    });

    mapping.from(Controller.Hardware.Keyboard[7]).to(function(value){ print(value);
        console.log("pressed 7")
        
        position = {
            x: 101.176,
            y: 5.50248,
            z: 58.6676
        };
        orientation = {
                x: 0,
                y: 0.00544461,
                z: 0,
                w: 0.999985
        };

        MyAvatar.goToLocation(position, true, orientation);

        
    });

    mapping.from(Controller.Hardware.Keyboard[8]).to(function(value){ print(value);
        console.log("pressed 8")
        
        position = {
            x: 103.075,
            y: -0.697915,
            z: 32.4449
        };
        orientation = {
                x: 0,
                y: 0.983388,
                z: 0,
                w: 0.181517
        };

        MyAvatar.goToLocation(position, true, orientation);
    });

    mapping.from(Controller.Hardware.Keyboard[9]).to(function(value){ print(value);
        console.log("pressed 9")
        
    });

    Controller.enableMapping(MAPPING_NAME);

    Script.scriptEnding.connect(function(){
        Controller.disableMapping(MAPPING_NAME);
    })
}());


