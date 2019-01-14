
function log(configGroup) {
    var deBounceGroup = {};
    var deBounceCheck = function(oldTime, newTime, bounceTime) {
        if (newTime - oldTime > bounceTime) {
            return true;
        }
        return false;
    };
    return function (group, title, value, bounce) {
        var printString = "";
        if (configGroup[group]) {
            switch (group) {
                case "Log_Value_EZ":
                    print("IN LOG VALUE EZ")
                    var nameObj = {};
                    nameObj[title] = title;
                    var printTitle = Object.keys(nameObj)[0];
                    print(printTitle);
                    if (value) {
  
                        printString = group + " :: " + value + " :: " + printTitle + " :: " + JSON.stringify(title);
                    } else {
                        printString = group + " :: " + printTitle + " :: " + JSON.stringify(title);
                    }
                    break;
                default:
                    printString = arguments.length === 2 || value === null
                    ? group + " :: " + title
                    : group + " :: " + title + " :: " + JSON.stringify(value);
            }

            if (bounce) {
                var key = group+title+value+bounce;
                
                if (!deBounceGroup[key]) {
                    deBounceGroup[key] = Date.now();
                    console.log(printString);
                } else {
                    if (deBounceCheck(deBounceGroup[key], Date.now(), bounce)) {
                        deBounceGroup[key] = Date.now();
                        console.log(printString);
                    } else {
                        return;
                    }
                }
            } else {
                console.log(printString);
            }
        }
    };
}
