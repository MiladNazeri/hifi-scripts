(function(){
    
    var SEARCH_RADIUS = 100;
    var balloonCage;
    var _this = this;
    
    _this.preload = function(entityID){
        _this.entityID = entityID;
        _this.balloonCage = _this.findBalloonCage();	
			
    };
	
    _this.findBalloonCage = function(){
		
        Entities.findEntities(_this.entityID, SEARCH_RADIUS).forEach(function(element){

            var name = Entities.getEntityProperties(element, 'name').name;
		
            if (name === "Balloon Cage"){
                _this.balloonCage = element;
                print("found my balloonCage");
                // print(element);
                // print(name);
                return;
            }

        });
		
        if (_this.balloonCage === undefined){
            print("No Balloon Cage Found!");
        }			
    };

    _this.triggerInteractedWith = function(){
        print("Interacted with Balloon Cage trigger on " + _this.balloonCage);
		
        if (_this.balloonCage !== undefined){
            Entities.callEntityServerMethod(_this.balloonCage, 'balloonCageInteractedWith');       
        } else {
            print("Finding a new Balloon Cage");
            _this.findBalloonCage();
            Entities.callEntityServerMethod(_this.balloonCage, 'balloonCageInteractedWith'); 
        }
    };
	
    _this.clickDownOnEntity = function(){
        _this.triggerInteractedWith();
    };
	
    _this.startFarTrigger = function(){
        _this.triggerInteractedWith();	
    };
	
    _this.startNearTrigger = function(){
        _this.triggerInteractedWith();		
    };
	
});