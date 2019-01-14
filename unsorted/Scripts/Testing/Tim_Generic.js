instrument_testrunner(true);

var testUtils = require_test_utils();

var cleanups = [];

function cleanup() {
    cleanups.splice(0, cleanups.length).forEach(function(fn) {
        fn();
    });
}
Script.scriptEnding.connect(cleanup);

describe("test", function(){
    it("test2", function(){
        expect().toEqual()
        expect().toBeGreaterThan();
        expect().toThrowError();
    })
    xit('notWorking', function(done){

    })
})

function colorizer(varying, index) {
    var position = Vec3.multiply(varying.position, 0.5);
    var color = Vec3.multiply(0.1 + Math.sin(position.y * 20) + Math.cos(position.z * 20), vec3.ONE);
    color.x *= Math.sin(position.x);
    position = Vec3.sum(Vec3.multiply(1,Vec3.multiply(0.15 + color.x * 1,varying.normal)), position);
    return {
        color: color,
        normal: Vec3.normalize(position),
        position: position
    };
}

function precacheThen(url, callback) {
    return precache(url + '#' + Date.now(), function(error, result) {
      if (error) throw error;
      callback(result);
    });
  }

  function precache(url, callback) {
    var res = ModelCache.prefetch(url);
    function once(state) {
        print(res.url, state);
        if (state === Resource.State.FAILED) {
            res.stateChanged.disconnect(once);
            callback(new Error('resource failed: ' + res.url), null);
        }
        if (state === Resource.State.FINISHED) {
            res.stateChanged.disconnect(once);
            callback(null, res);
        }
    }
    res.stateChanged.connect(once);
    res.stateChanged(res.state);
    return res;
}
//--------------------------------------
function run() {}

function instrument_testrunner(force) {
    if (force || typeof describe === 'undefined') {
        var oldPrint = print;
        window = new OverlayWebWindow({
            title: 'graphicsUnitTests.js',
            width: 640,
            height: 128,
            source: 'about:blank',
        });
        window.setPosition(Window.innerWidth - window.size.x, 0);
        Script.scriptEnding.connect(window, 'close');
        ['printed','warning','error','info'].forEach(function(type) {
          Script[type+'Message'].connect(function(msg) {
             window.emitScriptEvent(['<div class='+type+'>'].concat(msg).concat('</div>').join(' ') + '');
          });
        });
        Script.unhandledException.connect(function onUnhandledException(err) {
          Script.unhandledException.disconnect(onUnhandledException);
          print('Unhandled Exception:' + err);
        });
        console.info('logging to test window...');
        window.closed.connect(Script, 'stop');
        // wait for window (ready) and test runner (ran) both to initialize
        var ready = false;
        var ran = false;
        window.webEventReceived.connect(function once(message) {
            // window.webEventReceived.disconnect(once);
            cleanup();
            if (message === 'ready') {
                ready = true;
                maybeRun();
            } else if (message === 'reload') {
                Script.load(Script.resolvePath('').split(/[?#]/)[0] + '#' + Date.now());
                Script.stop();
            }
        });
        run = function() {
            ran = true;
            maybeRun();
        };

        window.setURL([
            'data:text/html;text,',
            '<style>.error {color:red}</style>',
            '<body style="height:100%;width:100%;margin:0;background:#eee;whitespace:pre;font-size:12px;">',
            '<pre id=output></pre><div style="height:2px;"></div>',
            '<body>',
            '<script>(' + function() { /* globals window, EventBridge, output */
                window.addEventListener("DOMContentLoaded", function() {
                    setTimeout(function() {
                        EventBridge.scriptEventReceived.connect(function(msg) {
                            output.innerHTML += msg;
                            window.scrollTo(0, 1e10);
                            document.body.scrollTop = 1e10;
                        });
                        EventBridge.emitWebEvent('ready');
                    }, 1000);
                });
            } + ')();</script>',
            '<button style="position:fixed;top:0;right:0;" onclick="EventBridge.emitWebEvent(\'reload\')">rerun test...</button>'
        ].join('\n'));

        // Include testing library
        Script.include('/~/developer/libraries/jasmine/jasmine.js');
        Script.include('/~/developer/libraries/jasmine/hifi-boot.js');

        function maybeRun() {
            if (!ran || !ready) {
                return oldPrint('doRun -- waiting for both script and web window to become available');
            }
            if (!force) {
                // invoke Script.stop (after any async tests complete)
                jasmine.getEnv().addReporter({
                    jasmineDone: Script.stop
                });
            } else if (!maybeRun.first) {
                maybeRun.first = true;
                jasmine.getEnv().addReporter({
                    jasmineDone: function() {
                        print("JASMINE DONE");
                    }
                });
            }

            // Run the tests
            jasmine.getEnv().execute();
        };
    }
}
run();

