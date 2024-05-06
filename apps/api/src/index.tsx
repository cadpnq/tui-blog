import express from "express";
import expressWebSocket from "express-ws";
import websocketStream from "websocket-stream";

import { MainPage } from "@blog/tui-components";
import { render } from "ink";
import React from "react";
import { spawn } from "child_process";

const app = express();
expressWebSocket(app, undefined, {});

// @ts-ignore
app.ws("/term", (ws, req) => {
  try {
    console.log("Connected to terminal");

    const stream = websocketStream(ws, {});

    render(<MainPage />, {
      stdin: stream as unknown as NodeJS.ReadStream,
      stdout: stream as unknown as NodeJS.WriteStream,
      patchConsole: false,
    });
  } catch (error) {
    console.error(error);
  }

  // setInterval(() => {
  // 	stream.write("Hello, World! ");
  // }, 500);
});

// @ts-ignore
app.ws('/mud', (ws, req) => {
  const telnet = spawn('telnet', ['95.217.191.11', '4000']);

  telnet.stdout.on('data', (data) => {
    ws.send(data.toString());
  });

  // @ts-ignore
  ws.on('message', (message) => {
    telnet.stdin.write(message.toString());
  });

  telnet.on('exit', () => ws.close());

  telnet.on('error', (error) => {
    console.error(`Telnet error: ${error.message}`);
  });

  // @ts-ignore
  ws.on('error', (error) => {
    console.error(`WebSocket error: ${error.message}`);
  });
});

app.listen(3000);
console.log("Listening on port 3000");
