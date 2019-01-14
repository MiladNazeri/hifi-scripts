http://typedarray.org/from-microphone-to-wav-with-getusermedia-and-web-audio/
https://github.com/binaryjs/binaryjs

var session = {
    audio: true,
    video: false
};

var recordRTC = null;
navigator.getUserMedia(session, initializeRecorder, onError);

function recorderProcess(e) {
    var left = e.inputBuffer.getChannelData(0);
}

function recorderProcess(e) {
    var left = e.inputBuffer.getChannelData(0);
    window.Stream.write(convertFloat32ToInt16(left));
}

function convertFloat32ToInt16(buffer) {
    l = buffer.length;
    buf = new Int16Array(l);
    while (l--) {
      buf[l] = Math.min(1, buffer[l])*0x7FFF;
    }
    return buf.buffer;
}

function initializeRecorder(stream) {
    var audioContext = window.AudioContext;
    var context = new audioContext();
    var audioInput = context.createMediaStreamSource(stream);
    var bufferSize = 2048;
    // create a javascript node
    var recorder = context.createJavaScriptNode(bufferSize, 1, 1);
    // specify the processing function
    recorder.onaudioprocess = recorderProcess;
    // connect stream to our recorder
    audioInput.connect(recorder);
    // connect our recorder to the previous destination
    recorder.connect(context.destination);
}


var binaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');

var server = binaryServer({port: 9001});

server.on('connection', function(client) {
  ...
});

var fileWriter = null;

client.on('stream', function(stream, meta) {
  var fileWriter = new wav.FileWriter('demo.wav', {
    channels: 1,
    sampleRate: 48000,
    bitDepth: 16
  });
  stream.pipe(fileWriter);
  stream.on('end', function() {
    fileWriter.end();
  });
});

client.on('close', function() {
  if (fileWriter != null) {
    fileWriter.end();
  }
});


// -------------------------------

var myScript = document.querySelector('script');
var myPre = document.querySelector('pre');
var playButton = document.querySelector('button');
      
// Create AudioContext and buffer source
var audioCtx = new AudioContext();
source = audioCtx.createBufferSource();

// Create a ScriptProcessorNode with a bufferSize of 4096 and a single input and output channel
var scriptNode = audioCtx.createScriptProcessor(4096, 1, 1);
console.log(scriptNode.bufferSize);

// load in an audio track via XHR and decodeAudioData

function getData() {
  request = new XMLHttpRequest();
  request.open('GET', 'viper.ogg', true);
  request.responseType = 'arraybuffer';
  request.onload = function() {
    var audioData = request.response;

    audioCtx.decodeAudioData(audioData, function(buffer) {
    myBuffer = buffer;   
    source.buffer = myBuffer;
  },
    function(e){"Error with decoding audio data" + e.err});
  }
  request.send();
}

// Give the node a function to process audio events
scriptNode.onaudioprocess = function(audioProcessingEvent) {
  // The input buffer is the song we loaded earlier
  var inputBuffer = audioProcessingEvent.inputBuffer;

  // The output buffer contains the samples that will be modified and played
  var outputBuffer = audioProcessingEvent.outputBuffer;

  // Loop through the output channels (in this case there is only one)
  for (var channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
    var inputData = inputBuffer.getChannelData(channel);
    var outputData = outputBuffer.getChannelData(channel);

    // Loop through the 4096 samples
    for (var sample = 0; sample < inputBuffer.length; sample++) {
      // make output equal to the same as the input
      outputData[sample] = inputData[sample];

      // add noise to each output sample
      outputData[sample] += ((Math.random() * 2) - 1) * 0.2;         
    }
  }
}

getData();

// wire up play button
playButton.onclick = function() {
  source.connect(scriptNode);
  scriptNode.connect(audioCtx.destination);
  source.start();
}
      
// When the buffer source stops playing, disconnect everything
source.onended = function() {
  source.disconnect(scriptNode);
  scriptNode.disconnect(audioCtx.destination);
}


// ----------------------------------------
/*
<!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>Audio Streamer</title>

    <link rel="stylesheet" href="bootstrap-3.2.0-dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="style/site.css">

    <link rel="icon" type="image/png"  href="img/icon.png">

    <script src="js/jquery-1.11.1.min.js"></script>
    <script src="js/binary.js"></script>
    <script src="js/re-sampler.js"></script>
    <script src="js/site.js"></script>
</head>
<body>
<div class="container">
    <div class="page-header">
      <h1><span class="glyphicon glyphicon-record"></span> Audio Streamer <small>realtime to node</small></h1>
    </div>

    <button class="btn btn-primary" id="start-rec-btn">Start Recording</button>
    <button class="btn btn-primary" id="stop-rec-btn">Stop Recording</button>

    <div id="canvas-container">
        <canvas width="600" height="100" id="canvas"></canvas>
    </div>
</div>

</body>
</html>
*/
//---------------------------------------------

//https://github.com/notthetup/resampler

function reSample(audioBuffer, targetSampleRate, onComplete) {
    var channel = audioBuffer.numberOfChannels;
    var samples = audioBuffer.length * targetSampleRate / audioBuffer.sampleRate;

    var offlineContext = new OfflineAudioContext(channel, samples, targetSampleRate);
    var bufferSource = offlineContext.createBufferSource();
    bufferSource.buffer = audioBuffer;

    bufferSource.connect(offlineContext.destination);
    bufferSource.start(0);
    offlineContext.startRendering().then(function(renderedBuffer){
        onComplete(renderedBuffer);
    })
}

//---------------------------------------------


$(function () {
    var client,
        recorder,
        context,
        bStream,
        contextSampleRate = (new AudioContext()).sampleRate;
        resampleRate = contextSampleRate,
        worker = new Worker('js/worker/resampler-worker.js');

    worker.postMessage({cmd:"init",from:contextSampleRate,to:resampleRate});

    worker.addEventListener('message', function (e) {
        if (bStream && bStream.writable)
            bStream.write(convertFloat32ToInt16(e.data.buffer));
    }, false);

    $("#start-rec-btn").click(function () {
        close();
        client = new BinaryClient('wss://'+location.host);
        client.on('open', function () {
            bStream = client.createStream({sampleRate: resampleRate});
        });

        if (context) {
            recorder.connect(context.destination);
            return;
        }

        var session = {
            audio: true,
            video: false
        };


        navigator.getUserMedia(session, function (stream) {
            context = new AudioContext();
            var audioInput = context.createMediaStreamSource(stream);
            var bufferSize = 0; // let implementation decide

            recorder = context.createScriptProcessor(bufferSize, 1, 1);

            recorder.onaudioprocess = onAudio;

            audioInput.connect(recorder);

            recorder.connect(context.destination);

        }, function (e) {

        });
    });

    function onAudio(e) {
        var left = e.inputBuffer.getChannelData(0);

        worker.postMessage({cmd: "resample", buffer: left});

        drawBuffer(left);
    }

    function convertFloat32ToInt16(buffer) {
        var l = buffer.length;
        var buf = new Int16Array(l);
        while (l--) {
            buf[l] = Math.min(1, buffer[l]) * 0x7FFF;
        }
        return buf.buffer;
    }

    //https://github.com/cwilso/Audio-Buffer-Draw/blob/master/js/audiodisplay.js
    function drawBuffer(data) {
        var canvas = document.getElementById("canvas"),
            width = canvas.width,
            height = canvas.height,
            context = canvas.getContext('2d');

        context.clearRect (0, 0, width, height);
        var step = Math.ceil(data.length / width);
        var amp = height / 2;
        for (var i = 0; i < width; i++) {
            var min = 1.0;
            var max = -1.0;
            for (var j = 0; j < step; j++) {
                var datum = data[(i * step) + j];
                if (datum < min)
                    min = datum;
                if (datum > max)
                    max = datum;
            }
            context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
        }
    }

    $("#stop-rec-btn").click(function () {
        close();
    });

    function close(){
        console.log('close');
        if(recorder)
            recorder.disconnect();
        if(client)
            client.close();
    }
});

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

// ------------------------------------------------------------------------

/**
 * Created by noam on 12/15/15.
 */

importScripts('resampler.js');

var _resampler;

self.addEventListener('message', function(e) {
    if(e.data.cmd=="init"){
        var info = e.data;
        _resampler = new Resampler({originalSampleRate:info.from,resampledRate:info.to,numberOfChannels:1})
    }
    if(e.data.cmd=="resample"){
        var resampled = _resampler.resample(e.data.buffer,0);
        self.postMessage({buffer:resampled},[resampled.buffer]);
    }
}, false);

//----------------------------------------------

//https://github.com/chris-rudmin/Recorderjs

"use strict";

var Resampler = function( config ){
 this.originalSampleRate = config.originalSampleRate;
 this.numberOfChannels = config.numberOfChannels;
 this.resampledRate = config.resampledRate;
 this.lastSampleCache = [];

 for ( var i = 0; i < this.numberOfChannels; i++ ){
   this.lastSampleCache[i] = [0,0];
 }

 if ( this.resampledRate === this.originalSampleRate ) {
   this.resample = function( buffer ) { return buffer; };
 }
};

// From http://johncostella.webs.com/magic/
Resampler.prototype.magicKernel = function( x ) {
 if ( x < -0.5 ) {
   return 0.5 * ( x + 1.5 ) * ( x + 1.5 );
 }
 else if ( x > 0.5 ) {
   return 0.5 * ( x - 1.5 ) * ( x - 1.5 );
 }
 return 0.75 - ( x * x );
};

Resampler.prototype.resample = function( buffer, channel ) {
 var resampledBufferLength = Math.round( buffer.length * this.resampledRate / this.originalSampleRate );
 var resampleRatio = buffer.length / resampledBufferLength;
 var outputData = new Float32Array( resampledBufferLength );

 for ( var i = 0; i < resampledBufferLength - 1; i++ ) {
   var resampleValue = ( resampleRatio - 1 ) + ( i * resampleRatio );
   var nearestPoint = Math.round( resampleValue );

   for ( var tap = -1; tap < 2; tap++ ) {
     var sampleValue = buffer[ nearestPoint + tap ] || this.lastSampleCache[ channel ][ 1 + tap ] || buffer[ nearestPoint ];
     outputData[ i ] += sampleValue * this.magicKernel( resampleValue - nearestPoint - tap );
   }
 }

 this.lastSampleCache[ channel ][ 0 ] = buffer[ buffer.length - 2 ];
 this.lastSampleCache[ channel ][ 1 ] = outputData[ resampledBufferLength - 1 ] = buffer[ buffer.length - 1 ];

 return outputData;
};

//---------------------------------------------------------------------

//s server

/**
 * Created by noamc on 8/31/14.
 */
var binaryServer = require('binaryjs').BinaryServer,
https = require('https'),
wav = require('wav'),
opener = require('opener'),
fs = require('fs'),
connect = require('connect'),
serveStatic = require('serve-static'),
UAParser = require('./ua-parser'),
CONFIG = require("../config.json"),
lame = require('lame');

var uaParser = new UAParser();

if(!fs.existsSync("recordings"))
fs.mkdirSync("recordings");

var options = {
key:    fs.readFileSync('ssl/server.key'),
cert:   fs.readFileSync('ssl/server.crt'),
};

var app = connect();

app.use(serveStatic('public'));

var server = https.createServer(options,app);
server.listen(9191);

opener("https://localhost:9191");

var server = binaryServer({server:server});

server.on('connection', function(client) {
console.log("new connection...");
var fileWriter = null;
var writeStream = null;

var userAgent  =client._socket.upgradeReq.headers['user-agent'];
uaParser.setUA(userAgent);
var ua = uaParser.getResult();

client.on('stream', function(stream, meta) {

   console.log("Stream Start@" + meta.sampleRate +"Hz");
   var fileName = "recordings/"+ ua.os.name +"-"+ ua.os.version +"_"+ new Date().getTime();
   
   switch(CONFIG.AudioEncoding){
       case "WAV":
           fileWriter = new wav.FileWriter(fileName + ".wav", {
               channels: 1,
               sampleRate: meta.sampleRate,
               bitDepth: 16 });
           stream.pipe(fileWriter);
       break;

       case "MP3":
           writeStream = fs.createWriteStream( fileName + ".mp3" );
           stream.pipe( new lame.Encoder(
           {
               channels: 1, bitDepth: 16, sampleRate: meta.sampleRate, bitRate: 128, outSampleRate: 22050, mode: lame.MONO
           })
           )
           .pipe( writeStream );
       break;
   };

});


client.on('close', function() {
   if ( fileWriter != null ) {
       fileWriter.end();
   } else if ( writeStream != null ) {
       writeStream.end();
   }
   console.log("Connection Closed");
});
});

//-----------------------------------------------------------