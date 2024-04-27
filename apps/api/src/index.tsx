import express from "express";
import expressWebSocket from "express-ws";
import websocketStream from "websocket-stream";

import { MainPage } from "@blog/tui-components";
import { render } from "ink";
import React from "react";

const app = express();
expressWebSocket(app, undefined, {});

// @ts-ignore
app.ws("/term", function (ws, req) {
  try {
    console.log("Connected to terminal");

    const stream = websocketStream(ws, {});

    render(<MainPage />, {
      stdin: stream as unknown as NodeJS.ReadStream,
      stdout: stream as unknown as NodeJS.WriteStream,
    });
  } catch (error) {
    console.error(error);
  }

  // setInterval(() => {
  // 	stream.write("Hello, World! ");
  // }, 500);
});

app.listen(3000);
console.log("Listening on port 3000");
