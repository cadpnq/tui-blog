import { Terminal } from "@xterm/xterm";
import { WebglAddon } from "@xterm/addon-webgl";
import { useEffect, useMemo, useRef } from "preact/hooks";
import "../../../../node_modules/@xterm/xterm/css/xterm.css";
import "./Display.styl";
import { generateFisheyeEffectDataUrl } from "../util";
import { rgb } from "d3-color";
import { interpolateRgb } from "d3-interpolate";
import { AttachAddon } from "@xterm/addon-attach";

export interface DisplayTheme {
  background: string;
  foreground: string;
}

export const themes: Record<string, DisplayTheme> = {
  white: {
    background: "rgb(43,43,43)",
    foreground: "white",
  },
  green: {
    background: "rgb(43,43,43)",
    foreground: "green",
  },
  amber: {
    background: "rgb(43,43,43)",
    foreground: "orange",
  },
  blue: {
    background: "rgb(43,43,43)",
    foreground: "blue",
  },
};

export interface DisplayProps {
  theme: keyof typeof themes;
  cols: number;
  rows: number;
  intensity?: number;
  fontSize?: number;
  distortion?: number;
  correction?: number;
  scaleX?: number;
  scaleY?: number;
  socket?: WebSocket;
}

export const Display = ({
  theme,
  rows,
  cols,
  intensity = 0,
  fontSize = 20,
  distortion = 0,
  scaleX = 1,
  scaleY = 1,
  socket,
}: DisplayProps) => {
  const { background, foreground } = themes[theme];

  const bg = rgb(background);
  const fg = rgb(foreground);
  const mixed = interpolateRgb(bg, fg)(Math.max(intensity, 0));

  const w = cols * 10 + 160;
  const h = rows * 19 + 160;

  const distortionFactor = 75;
  const correctionFactor = -75 * distortion;

  const termRef = useRef(null);
  const term = useRef(
    new Terminal({
      //      fontFamily: "Glass TTY VT220",
      fontFamily: "vt220",
      rows,
      cols,
      fontSize,
      allowTransparency: true,
      theme: {
        background: "rgba(0,0,0,0)",
        foreground,
        cursor: foreground,
      },
    })
  );
  const distortionMap = useMemo(() => {
    return generateFisheyeEffectDataUrl(w, h, 128);
  }, []);

  useEffect(() => {
    if (termRef.current) {
      term.current.open(termRef.current);
      document.fonts.ready.then(() => {
        term.current.options.fontSize = 0;
        term.current.options.fontSize = fontSize;
      });
      if (socket) {
        socket.onopen = () => {
          const attach = new AttachAddon(socket);
          term.current.loadAddon(attach);
        };
      }
      const webgl = new WebglAddon();
      term.current.loadAddon(webgl);
      return () => {
        webgl.dispose();
      };
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      term.current.write("Hello, World!");
    }, 300);
    return () => clearInterval(intervalId);
  });

  return (
    <>
      <div className="">
        <div
          className="m-2 overflow-clip rounded-3xl"
          style={{
            background: mixed,
            height: `${h}px`,
            width: `${w}px`,
          }}
        >
          <div className="glass">
            <div className="correct">
              <div className="distort">
                <div
                  className="p-20"
                  style={{
                    background: "transparent",
                    transform: `scaleY(${scaleY}) scaleX(${scaleX})`,
                  }}
                >
                  <div className="vt220 bloom" ref={termRef}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <svg style={{ display: "none" }}>
        <defs>
          <filter
            id="distort"
            width="1"
            height="1"
            x="0"
            y="0"
            color-interpolation-filters="sRGB"
          >
            <feImage
              xlinkHref={distortionMap}
              result="map"
              preserveAspectRatio="none"
            />
            <feDisplacementMap
              in2="map"
              in="SourceGraphic"
              xChannelSelector="R"
              yChannelSelector="G"
              scale={distortionFactor}
            />
            <feComposite operator="in" in2="map"></feComposite>
          </filter>
          <filter
            id="correct"
            width="1"
            height="1"
            x="0"
            y="0"
            color-interpolation-filters="sRGB"
          >
            <feImage
              xlinkHref={distortionMap}
              result="map"
              preserveAspectRatio="none"
            />
            <feDisplacementMap
              in2="map"
              in="SourceGraphic"
              xChannelSelector="R"
              yChannelSelector="G"
              scale={correctionFactor}
            />
            <feComposite operator="in" in2="map"></feComposite>
          </filter>
          <filter id="bloom">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
            <feComposite
              in2="SourceGraphic"
              operator="arithmetic"
              k2={15 * intensity}
              k3="1.1"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
};
