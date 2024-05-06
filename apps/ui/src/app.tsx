import "./index.css";
import { Terminal } from "./components/Terminal";

export function App() {
  const socket = new WebSocket('ws://localhost:3000/mud');
  
  // socket.onmessage = (event) => {
  //   console.log(event.data.toString('hex'));
  // }

  return <div className="bg-black flex items-center justify-center min-h-screen">
    <Terminal socket={socket}/>
    </div>
}
