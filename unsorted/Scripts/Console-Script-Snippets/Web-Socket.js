// const WEBSOCKET_PING_URL = "ws://echo.websocket.org";
// const WEBSOCKET_INVALID_URL = "ws://thisisnotavaliddomainname.invalid";
const TEST_MESSAGE = "This is a test message.";
var webSocket = new WebSocket(WEBSOCKET_PING_URL);

webSocket.onmessage = this.registerCallbackFunction(function(event) {
    // _this.assertEquals(TEST_MESSAGE, event.data, "event.data should be '" + TEST_MESSAGE + "'");
    webSocket.close();
});
webSocket.onopen = this.registerCallbackFunction(function(event) {
    // _this.assertEquals(webSocket.OPEN, webSocket.readyState, "readyState should be OPEN");
    webSocket.send(TEST_MESSAGE);
});
webSocket.onclose = this.registerCallbackFunction(function(event) {
    // _this.assertEquals(webSocket.CLOSED, webSocket.readyState, "readyState should be CLOSED");
});


// this.assertEquals(webSocket.CONNECTING, webSocket.readyState, "readyState should be CONNECTING");
// this.assertEquals("blob", webSocket.binaryType, "binaryType should be 'blob'");
// this.assertEquals(0, webSocket.bufferedAmount, "bufferedAmount should be 0");
// this.assertEquals("", webSocket.extensions, "extensions should be an empty string by default");
// this.assertEquals("", webSocket.protocol, "protocol should be an empty string by default");
// this.assertEquals(WEBSOCKET_PING_URL, webSocket.url, "url should be '" + WEBSOCKET_PING_URL + "'");

var _this = this;
var webSocket = new WebSocket(WEBSOCKET_INVALID_URL);
var hadError = false;

webSocket.onerror = this.registerCallbackFunction(function() {
    hadError = true;
});
webSocket.onclose = this.registerCallbackFunction(function(event) {
    // _this.assertEquals(webSocket.CLOSED, webSocket.readyState, "readyState should be CLOSED");
});

// this.assertEquals(webSocket.CONNECTING, webSocket.readyState, "readyState should be CONNECTING");
// this.assertEquals(WEBSOCKET_INVALID_URL, webSocket.url, "url should be '" + WEBSOCKET_INVALID_URL + "'");

const NUMBER_OF_CLIENTS = 3;
var connectedClients = 0;
var respondedClients = 0;
var webSocketServer = new WebSocketServer();

// _this.assertEquals(true, webSocketServer.listening, "listening should be true");

webSocketServer.newConnection.connect(this.registerCallbackFunction(function(newClient) {
    connectedClients++;
    newClient.onmessage = _this.registerCallbackFunction(function(event) {
        var data = JSON.parse(event.data);
        // _this.assertEquals(TEST_MESSAGE, data.message, "data.message should be '" + TEST_MESSAGE + "'");
        respondedClients++;
        if (respondedClients === NUMBER_OF_CLIENTS) {
            webSocketServer.close();
            // _this.assertEquals(false, webSocketServer.listening, "listening should be false");
            // _this.done();
        }
    });
    newClient.send(JSON.stringify({message: TEST_MESSAGE, client: connectedClients}));
}));

var newSocket1 = new WebSocket(webSocketServer.url);
newSocket1.onmessage = this.registerCallbackFunction(function(event) {
    newSocket1.send(event.data);
});
var newSocket2 = new WebSocket(webSocketServer.url);
newSocket2.onmessage = this.registerCallbackFunction(function(event) {
    newSocket2.send(event.data);
});
var newSocket3 = new WebSocket(webSocketServer.url);
newSocket3.onmessage = this.registerCallbackFunction(function(event) {
    newSocket3.send(event.data);
});

