'use strict';

(function () {
  var app, express, path;

  express = require("express");

  app = express();

  path = require('path');

  app.use(express.static(path.join(__dirname, '/dist', '/public')));

  app.listen(3001, function () {
    return console.log("you are listening on 3001");
  });
}).call(undefined);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6Ii4uIiwic291cmNlcyI6WyJjb2ZmZWVcXHNlcnZlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxhQUFBO01BQUEsS0FBQSxTQUFBOztBQUFBLFlBQVUsUUFBUSxBQUFSOztBQUNWLFFBQU07O0FBQ04sU0FBTyxRQUFRLEFBQVI7O0FBRVAsQUFBRyxNQUFDLEFBQUosSUFBUSxBQUFPLFFBQUMsQUFBUixPQUFlLEFBQUksS0FBQyxBQUFMLEtBQVUsQUFBVixXQUFxQixBQUFyQixTQUE4QixBQUE5QixBQUFmLEFBQVI7O0FBRUEsQUFBRyxNQUFDLEFBQUosT0FBVyxBQUFYLE1BQWlCO1dBQ2IsQUFBTyxRQUFDLEFBQVIsSUFBWSxBQUFaLEFBRGE7QUFBakIsQUFOQSIsInNvdXJjZXNDb250ZW50IjpbImV4cHJlc3MgPSByZXF1aXJlIFwiZXhwcmVzc1wiXHJcbmFwcCA9IGV4cHJlc3MoKVxyXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcclxuXHJcbmFwcC51c2UgZXhwcmVzcy5zdGF0aWMgcGF0aC5qb2luIF9fZGlybmFtZSwgJy9kaXN0JywgJy9wdWJsaWMnXHJcblxyXG5hcHAubGlzdGVuIDMwMDEsICgpIC0+XHJcbiAgICBjb25zb2xlLmxvZyBcInlvdSBhcmUgbGlzdGVuaW5nIG9uIDMwMDFcIlxyXG4iXX0=
//# sourceURL=D:\_ROLC\_ROLC\Create\C_Programming\C_VR\High-Fidelity\Scripts\Spot-Light\coffee\server.coffee