import express from "express";
import expressWebSocket from "express-ws";
import websocketStream from "websocket-stream";


const app = express();
expressWebSocket(app, undefined, {});

// @ts-ignore
app.ws("/term", function (ws, req) {
  console.log("Connected to terminal");

  const stream = websocketStream(ws, {});
	setInterval(() => {
		stream.write("Hello, World! ");
	}, 500);
});

app.listen(3000)
console.log("Listening on port 3000");