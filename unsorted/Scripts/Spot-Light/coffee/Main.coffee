->
    App_Name = "Midi-Lights"

    log = (describer, obj) ->
        obj = obj || ''
        print describer
        print JSON.stingify obj

    HIFI_MIDI_CONTROLS_CHANNEL = "Hifi-Midi-Controls-Channel"

    setUp = ->
        tablet = Tablet.getTablet "com.highfidelity.interface.tablet.system"
        return if not tablet

        button = tablet.addButton
            icon: APP_ICON_INACTIVE
            activeIcon: APP_ICON_ACTIVE
            text: APP_NAME
            isActive: false

        if button then button.clicked.connect onButtonClicked

        tablet.screenChanged.connect onTabletScreenChanged
        tablet.tabletShownChanged.connect onTabletShownChanged
        null

    tearDown = ->

    setUp();
    Script.scriptEnding.connect tearDown
