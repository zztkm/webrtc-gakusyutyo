"use strict";

let WebSocketServer = require('ws').Server;
let wss = new WebSocketServer({ port: 3001 });
console.info('Signaling server started on port 3001');

wss.on('connection', function (ws) {
    console.info('websocket connected');
    ws.on('message', function (message) {
        // 写経元のコードでは、message を直接送信しているが、Blob object として
        // 送信されてしまい、受信側で以下のエラーが発生した。
        // `Uncaught SyntaxError: Unexpected token 'o', "[object Blob]" is not valid JSON
        // なので、JSON parse して一度オブジェクトに変換し、それを文字列に変換して送信するように変更した。
        const jsonData = JSON.parse(message);
        console.info('Received message: ' + jsonData.type);
        wss.clients.forEach(function (client) {
            if (ws !== client && client.readyState === 1) {
                console.info('Send message to client');
                // message を text として送信
                client.send(JSON.stringify(jsonData));
            } else {
                console.info('Client not connected');
            }
        });
    });
    ws.on('close', function () {
        console.info('websocket disconnected');
    });
});
