import "./index.css";
import { Terminal } from "./components/Terminal";
import { SerialSocket } from "./util/SerialSocket";

export function App() {
  // const socket = new WebSocket('ws://localhost:3000/mud');

  const slowsocket = new SerialSocket({url: 'ws://localhost:3000/mud', baudRate: 1200});
  
  // socket.onmessage = (event) => {
  //   console.log(event.data.toString('hex'));
  // }

  return <div className="bg-black flex items-center justify-center min-h-screen">
    <Terminal socket={slowsocket}/>
    </div>
}
