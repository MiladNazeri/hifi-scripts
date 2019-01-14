"use strict";

(function () {
  (function () {
    var App_Name, HIFI_MIDI_CONTROLS_CHANNEL, log, setUp, tearDown;
    App_Name = "Midi-Lights";
    log = function log(describer, obj) {
      obj = obj || '';
      print(describer);
      return print(JSON.stingify(obj));
    };
    HIFI_MIDI_CONTROLS_CHANNEL = "Hifi-Midi-Controls-Channel";
    setUp = function setUp() {
      var button, tablet;
      tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
      if (!tablet) {
        return;
      }
      button = tablet.addButton({
        icon: APP_ICON_INACTIVE,
        activeIcon: APP_ICON_ACTIVE,
        text: APP_NAME,
        isActive: false
      });
      if (button) {
        button.clicked.connect(onButtonClicked);
      }
      tablet.screenChanged.connect(onTabletScreenChanged);
      tablet.tabletShownChanged.connect(onTabletShownChanged);
      return null;
    };
    tearDown = function tearDown() {};
    setUp();
    return Script.scriptEnding.connect(tearDown);
  });
}).call(undefined);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWFpbi5qcyIsInNvdXJjZVJvb3QiOiIuLiIsInNvdXJjZXMiOlsiY29mZmVlXFxNYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0FBQUEsR0FBQSxZQUNJO1FBQUEsVUFBQSw0QkFBQSxLQUFBLE9BQUE7QUFBQSxlQUFXO0FBRVgsVUFBTSxhQUFBLEFBQUMsV0FBRCxBQUFZO0FBQ2QsWUFBTSxPQUFPO0FBQ2IsWUFBQSxBQUFNO2FBQ04sTUFBTSxBQUFJLEtBQUosQUFBSyxTQUhULEFBR0YsQUFBTSxBQUFjOztBQUV4QixpQ0FBNkI7QUFFN0IsWUFBUSxpQkFDSjtVQUFBLFFBQUE7QUFBQSxlQUFTLEFBQU0sT0FBTixBQUFPLFVBQVAsQUFBaUI7QUFDMUIsVUFBVSxDQUFWLEFBQWMsUUFBZDtBQUFBOztBQUVBLHNCQUFTLEFBQU87QUFDWixjQUFBLEFBQU07QUFDTixvQkFEQSxBQUNZO0FBQ1osY0FGQSxBQUVNO0FBQ04sa0JBSkssQUFDTCxBQUdVO0FBSFYsT0FESyxBQUFNO0FBTWYsVUFBQSxBQUFHO0FBQVksQUFBTSxlQUFDLEFBQU8sUUFBZCxBQUFlLFFBQTlCLEFBQWUsQUFBdUI7O0FBRXRDLEFBQU0sYUFBQyxBQUFhLGNBQXBCLEFBQXFCLFFBQXJCLEFBQTZCO0FBQzdCLEFBQU0sYUFBQyxBQUFrQixtQkFBekIsQUFBMEIsUUFBMUIsQUFBa0M7YUFiOUIsQUFjSjs7QUFFSixlQUFXLG9CQUFBO0FBRVg7V0FDQSxBQUFNLE9BQUMsQUFBWSxhQUFuQixBQUFvQixRQTdCeEIsQUE2QkksQUFBNEI7QUE3QmhDIiwic291cmNlc0NvbnRlbnQiOlsiLT5cclxuICAgIEFwcF9OYW1lID0gXCJNaWRpLUxpZ2h0c1wiXHJcblxyXG4gICAgbG9nID0gKGRlc2NyaWJlciwgb2JqKSAtPlxyXG4gICAgICAgIG9iaiA9IG9iaiB8fCAnJ1xyXG4gICAgICAgIHByaW50IGRlc2NyaWJlclxyXG4gICAgICAgIHByaW50IEpTT04uc3RpbmdpZnkgb2JqXHJcblxyXG4gICAgSElGSV9NSURJX0NPTlRST0xTX0NIQU5ORUwgPSBcIkhpZmktTWlkaS1Db250cm9scy1DaGFubmVsXCJcclxuXHJcbiAgICBzZXRVcCA9IC0+XHJcbiAgICAgICAgdGFibGV0ID0gVGFibGV0LmdldFRhYmxldCBcImNvbS5oaWdoZmlkZWxpdHkuaW50ZXJmYWNlLnRhYmxldC5zeXN0ZW1cIlxyXG4gICAgICAgIHJldHVybiBpZiBub3QgdGFibGV0XHJcblxyXG4gICAgICAgIGJ1dHRvbiA9IHRhYmxldC5hZGRCdXR0b25cclxuICAgICAgICAgICAgaWNvbjogQVBQX0lDT05fSU5BQ1RJVkVcclxuICAgICAgICAgICAgYWN0aXZlSWNvbjogQVBQX0lDT05fQUNUSVZFXHJcbiAgICAgICAgICAgIHRleHQ6IEFQUF9OQU1FXHJcbiAgICAgICAgICAgIGlzQWN0aXZlOiBmYWxzZVxyXG5cclxuICAgICAgICBpZiBidXR0b24gdGhlbiBidXR0b24uY2xpY2tlZC5jb25uZWN0IG9uQnV0dG9uQ2xpY2tlZFxyXG5cclxuICAgICAgICB0YWJsZXQuc2NyZWVuQ2hhbmdlZC5jb25uZWN0IG9uVGFibGV0U2NyZWVuQ2hhbmdlZFxyXG4gICAgICAgIHRhYmxldC50YWJsZXRTaG93bkNoYW5nZWQuY29ubmVjdCBvblRhYmxldFNob3duQ2hhbmdlZFxyXG4gICAgICAgIG51bGxcclxuXHJcbiAgICB0ZWFyRG93biA9IC0+XHJcblxyXG4gICAgc2V0VXAoKTtcclxuICAgIFNjcmlwdC5zY3JpcHRFbmRpbmcuY29ubmVjdCB0ZWFyRG93blxyXG4iXX0=
//# sourceURL=D:\_ROLC\_ROLC\Create\C_Programming\C_VR\High-Fidelity\Scripts\Spot-Light\coffee\Main.coffee