import { useState } from "preact/hooks";
import { Display } from "./Display";
import { Knob } from "./Knob";
import { Sun, MoveVertical, MoveHorizontal, Focus, Power } from "lucide-preact";
import "./Terminal.styl";

export function Terminal({ socket }: { socket?: WebSocket }) {
  const [intensity, setIntensity] = useState(0.1);
  const [distortion, setDistortion] = useState(0.1);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  return (
    <div className="case pb-4 px-10 rounded-lg">
      <div className="bezel flex flex-col p-4 mt-[-20px] mb-4 rounded-lg border-opacity-100 border-[20px]">
        <Display
          rows={24}
          cols={80}
          theme="green"
          intensity={intensity}
          distortion={distortion}
          scaleX={scaleX}
          scaleY={scaleY}
          socket={socket}
        />
      </div>
      <div className="flex flex-row pb-20">
        <div className="px-5 flex flex-col items-center">
          <div className="bg-red-500 rounded-lg ">
            <Power size={50} className="mb-1" />
          </div>
        </div>
        <div className="px-5 flex flex-col items-center">
          <Sun size={25} className="mb-1" />
          <Knob height={100} onChange={setIntensity} />
        </div>
        <div className="px-5 flex flex-col items-center">
          <Focus size={25} className="mb-1" />
          <Knob height={100} onChange={setDistortion} min={-2} max={2} />
        </div>
        <div className="px-5 flex flex-col items-center">
          <MoveHorizontal size={25} className="mb-1" />
          <Knob height={100} onChange={setScaleX} min={1} max={1.5} />
        </div>
        <div className="px-5 flex flex-col items-center">
          <MoveVertical size={25} className="mb-1" />
          <Knob height={100} onChange={setScaleY} min={1} max={1.5} />
        </div>
        <div className="flex flex-col-reverse">
          <div className="bg-black flex flex-row">
            <div className="bg-white text-black my-[0px] flex border-t border-b-[5px] border-black border-opacity-100">
              {"cadpnq".split("").map((char, index, array) => (
                <span
                  className={
                    index < array.length - 1
                      ? "border-r-4 border-black px-[2px]"
                      : "px-[2px]"
                  }
                >
                  {char}
                </span>
              ))}
            </div>
            <div className="bg-black text-red-600 mx-3 my-[0px] border-t border-b-[5px] border-black border-opacity-100">
              <div style={{ textShadow: "0px 2px 2px rgba(150, 150, 150, 1)" }}>
                VT9001
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
