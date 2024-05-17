import { useState } from "preact/hooks";
import { Display } from "./Display";
import { Knob } from "./Knob";
// @ts-ignore
import {
  Sun,
  Contrast,
  MoveVertical,
  MoveHorizontal,
  Focus,
  Fullscreen,
  Blend,
} from "lucide-preact";
import "./Terminal.styl";
import { SerialSocket } from "../util/SerialSocket";
import { LED } from "./LED";
import { useSettings } from "../util/Settings";
import { useEffect } from "react";
import { SideMenu } from "./Menu";

/*
VALUES:
	brightness: -0.013333333333333308
	contrast: 0.76
	focus: 0.7333333333333333
	correction: 0.6000000000000005
	scaleX: 1.1066666666666667
	scaleY: 1.2533333333333334
	hue: 90

VALUES:
	brightness: 0.01333333333333342
	contrast: 0.88
	focus: 0.8533333333333334
	correction: 1
	scaleX: 1.1066666666666667
	scaleY: 1.2533333333333334
	hue: 90


VALUES:
	brightness: 0.01333333333333342
	contrast: 0.72
	focus: 0.8
	correction: 0.1
	scaleX: 1.1066666666666667
	scaleY: 1.2533333333333334
	hue: 90

*/

export function Terminal({ socket }: { socket?: SerialSocket }) {
  const [correction, setCorrection] = useState(0.1);
  const [brightness, setBrightness] = useState(0.01333333333333342);
  const [contrast, setContrast] = useState(0.72);
  const [focus, setFocus] = useState(0.8);
  const [hue, setHue] = useState(90);
  const [scaleX, setScaleX] = useState(1.1066666666666667);
  const [scaleY, setScaleY] = useState(1.2533333333333334);

  const [tx, setTx] = useState<boolean>(false);
  const [rx, setRx] = useState<boolean>(false);

  const { settings } = useSettings();

  useEffect(() => {
    if (socket) {
      if (settings.blinkLights) {
        socket.onTransmitStart = () => {
          console.log("transmit start");
          setTx(true);
        };

        socket.onTransmitEnd = () => {
          console.log("transmit end");
          setTx(false);
        };

        socket.onReceiveStart = () => {
          console.log("receive start");
          setRx(true);
        };

        socket.onReceiveEnd = () => {
          console.log("receive end");
          setRx(false);
        };
      } else {
        socket.onTransmitStart = () => {};
        socket.onTransmitEnd = () => {};
        socket.onReceiveStart = () => {};
        socket.onReceiveEnd = () => {};
        setTx(false);
        setRx(false);
      }
    }
  }, [socket, settings.blinkLights]);

  return (
    <>
      <SideMenu />
      <div className="case pb-4 px-10 rounded-lg">
        <div className="bezel flex flex-col p-4 mt-[-20px] mb-4 rounded-lg border-opacity-100 border-[20px] z-10">
          <div className="">
            <Display
              rows={24}
              cols={80}
              correction={correction}
              scaleX={scaleX}
              scaleY={scaleY}
              socket={socket}
              brightness={brightness}
              contrast={contrast}
              focus={focus}
              hue={hue}
            />
          </div>
        </div>
        <div className="flex flex-row pb-20 relative z-10">
          <div className="px-3 flex flex-col items-center">
            <Sun size={25} className="icon mb-1" />
            <Knob height={75} min={-1} max={1} onChange={setBrightness} />
          </div>
          <div className="px-3 flex flex-col items-center">
            <Contrast size={25} className="icon mb-1" />
            <Knob height={75} min={0} max={1} onChange={setContrast} />
          </div>
          <div className="px-3 flex flex-col items-center">
            <Focus size={25} className="icon mb-1" />
            <Knob height={75} onChange={setFocus} />
          </div>
          <div className="px-3 flex flex-col items-center">
            <Fullscreen size={25} className="icon mb-1" />
            <Knob height={75} onChange={setCorrection} min={-5} max={5} />
          </div>
          <div className="px-3 flex flex-col items-center">
            <MoveHorizontal size={25} className="icon mb-1" />
            <Knob height={75} onChange={setScaleX} min={1} max={2} />
          </div>
          <div className="px-3 flex flex-col items-center">
            <MoveVertical size={25} className="icon mb-1" />
            <Knob height={75} onChange={setScaleY} min={1} max={2} />
          </div>
          <div className="px-3 flex flex-col items-center">
            <Blend size={25} className="icon mb-1" />
            <Knob height={75} onChange={setHue} min={-90} max={90} />
          </div>
          <div className="pl-3 pr-1 flex flex-col items-center justify-center">
            <span>RX</span>
            <LED shape="round" on={rx} />
            {/* {rx ? (
              <div className="w-5 h-5 rounded-full bg-green-500"></div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-red-500"></div>
            )} */}
          </div>
          <div className="px-1 flex flex-col items-center justify-center">
            <span>TX</span>
            <LED shape="round" on={tx} />
            {/* {tx ? (
              <div className="w-5 h-5 rounded-full bg-green-500"></div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-red-500"></div>
            )} */}
          </div>
          <div className="flex flex-grow"></div>
          <div className="flex flex-col-reverse">
            <div
              className="bg-black flex flex-row select-none"
              style={{
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="bg-white text-black my-[0px] flex border-t border-b-[1px] border-black border-opacity-100">
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
                <div
                  style={{ textShadow: "0px 2px 2px rgba(150, 150, 150, 1)" }}
                >
                  VT9001
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <svg style={{ display: "none" }}>
        <defs>
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.5"
              numOctaves="1"
              result="turbulence"
            />
            <feColorMatrix
              in="turbulence"
              mode="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .1 0"
              result="grayscale-turbulence"
            />
            <feBlend
              in="SourceGraphic"
              in2="grayscale-turbulence"
              mode="multiply"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
}
