function addComma(number){
    number = (number).toString(2);
    var array = [],
        count = 0;
    for(var i = number.length-1; i >= 0; --i){
        if (count < 4) {
            array.push(number[i]);
            count++ }
        else {
            array.push(" ");
            array.push(number[i]);
            count = 1 } } // for
    return array.reverse().join("");   };
    
