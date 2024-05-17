import "./index.css";
import { Terminal } from "./components/Terminal";
import { SerialSocket } from "./util/SerialSocket";
import { SettingsProvider } from "./util/Settings";

export function App() {
  // const socket = new WebSocket('ws://localhost:3000/mud');

  // wss://api.cadpnq.nyc/mud
  const slowsocket = new SerialSocket({
    url: "ws://localhost:3000/mud",
    baudRate: 19200,
  });

  return (
    <SettingsProvider>
      <div className="bg-black flex items-center justify-center min-h-screen">
        <Terminal socket={slowsocket} />
      </div>
    </SettingsProvider>
  );
}
