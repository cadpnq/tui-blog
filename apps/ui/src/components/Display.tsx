import { Terminal } from "@xterm/xterm";
import { WebglAddon } from "@xterm/addon-webgl";
import { useEffect, useMemo, useRef } from "preact/hooks";
import "../../../../node_modules/@xterm/xterm/css/xterm.css";
import "./Display.styl";
import { generateFisheyeEffectDataUrl } from "../util";
// import { AttachAddon } from "@xterm/addon-attach";
import { SerialSocket } from "../util/SerialSocket";
import { useSettings } from "../util/Settings";

export interface DisplayProps {
  cols: number;
  rows: number;
  fontSize?: number;
  correction?: number;
  scaleX?: number;
  scaleY?: number;
  socket?: SerialSocket;
  brightness: number;
  contrast: number;
  focus: number;
  hue?: number;
}

export const Display = ({
  rows,
  cols,
  fontSize = 20,
  scaleX = 1,
  scaleY = 1,
  socket,
  correction = 1,
  brightness,
  contrast,
  focus,
  hue = 0,
}: DisplayProps) => {
  brightness = Math.min(1, Math.max(-1, brightness));
  contrast = Math.min(1, Math.max(0, contrast));

  const w = cols * 10 + 160;
  const h = rows * 19 + 160;

  const fisheyeBasepoint = 80;
  const distortionScale = fisheyeBasepoint;
  const correctionScale = -fisheyeBasepoint * correction;

  const bloomStrength = 10 * Math.abs(Math.abs(brightness) + contrast - focus);

  console.log(
    `VALUES:\n\tbrightness: ${brightness}\n\tcontrast: ${contrast}\n\tfocus: ${focus}\n\tcorrection: ${correction}\n\tscaleX: ${scaleX}\n\tscaleY: ${scaleY}\n\thue: ${hue}`
  );

  const termRef = useRef(null);
  const term = useRef(
    new Terminal({
      //      fontFamily: "Glass TTY VT220",
      convertEol: true,
      fontFamily: "vt220",
      rows,
      cols,
      fontSize,
      allowTransparency: true,
      cursorBlink: true,
      theme: {
        background: "rgba(0,0,0,0)",
        foreground: "white",
        cursor: "white",
      },
    })
  );
  const distortionMap = useMemo(() => {
    return generateFisheyeEffectDataUrl(w, h, 64);
  }, []);

  const { settings: {distortScreen, bloomEffect} } = useSettings();

  useEffect(() => {
    console.log('running here');
    if (termRef.current) {
      term.current.open(termRef.current);
      document.fonts.ready.then(() => {
        term.current.options.fontSize = 0;
        term.current.options.fontSize = fontSize;
      });

      const webgl = new WebglAddon();
      term.current.loadAddon(webgl);
      term.current.focus();

      // :(
      const localEcho = term.current.onData((data) => {
        let localData = data;
        if (data.endsWith("\r")) {
          localData += "\n";
        }
        if (data === "\b" || data === "\x7f") {
          localData = "\b \b";
        }
        term.current.write(localData);

        if (socket) {
          socket.send(data);
        }
      });

      if (socket) {
        socket.onData = (data) => {
          term.current.write(data);
        };
      }

      return () => {
        localEcho.dispose();
        webgl.dispose();
        if (socket) {
          socket.close();
        }
      };
    }
  }, [fontSize, socket]);

  return (
    <>
      <div className="glass">
        <div
          className="m-2 overflow-clip"
          style={{
            height: `${h}px`,
            width: `${w}px`,
            borderRadius: "50% 50% 50% 50% / 1% 1% 1% 1%",
          }}
        >
          <div
            className="front"
            style={{
              width: `${w}px`,
              borderRadius: "50% 50% 50% 50% / 1% 1% 1% 1%",
            }}
          ></div>
          <div
            className=""
            style={{
              filter: `hue-rotate(${hue}deg)`,
            }}
          >
            <div className="tint">
              <div className={bloomEffect ? "intensity-bloom" : ""}>
                <div className={bloomEffect ? "beam-bloom" : ""}>
                  <div className={bloomEffect ? "scan-bloom" : ""}>
                    <div className="brightness-contrast">
                      <div className={distortScreen ? "correct" : ""}>
                        <div className={distortScreen ? "distort" : ""}>
                          <div
                            className="p-20"
                            style={{
                              transform: `scaleY(${scaleY}) scaleX(${scaleX})`,
                            }}
                          >
                            <div className="vt220" ref={termRef}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <svg style="position:absolute; height:0">
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
              scale={distortionScale}
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
              scale={correctionScale}
            />
            <feComposite operator="in" in2="map"></feComposite>
          </filter>
          <filter id="scan-bloom">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.1 0" />
          </filter>
          <filter id="beam-bloom">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={`${bloomStrength}`}
            />
          </filter>
          <filter id="brightness-contrast">
            <feComponentTransfer in="SourceGraphic">
              <feFuncG type="linear" slope={contrast} intercept={brightness} />
              <feFuncR type="linear" slope={contrast} intercept={brightness} />
              <feFuncB type="linear" slope={contrast} intercept={brightness} />
              <feFuncA type="identity" />
            </feComponentTransfer>
          </filter>
          <filter id="intensity-bloom">
            <feComponentTransfer in="SourceGraphic" result="clipped">
              <feFuncR type="discrete" tableValues="0 0 0 0 1" />
              <feFuncG type="discrete" tableValues="0 0 0 0 1" />
              <feFuncB type="discrete" tableValues="0 0 0 0 1" />
              <feFuncA type="identity" />
            </feComponentTransfer>
            <feColorMatrix type="luminanceToAlpha" result="luminance" />
            <feComposite
              in="SourceGraphic"
              in2="luminance"
              operator="in"
              result="composited"
            />
            <feGaussianBlur stdDeviation="10" in="composited" result="blur" />
            <feGaussianBlur stdDeviation="10" in="blur" result="blur2" />
            <feBlend
              mode="lighten"
              in="SourceGraphic"
              in2="blur2"
              result="blend"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="blend"
            />
          </filter>
          <filter id="tint">
            <feComponentTransfer
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              in="SourceGraphic"
            >
              <feFuncR type="gamma" amplitude="0.2" exponent="0.6" offset="0" />
              <feFuncG type="gamma" amplitude="1" exponent="0.6" offset="0" />
              <feFuncB type="gamma" amplitude="0.4" exponent="0.6" offset="0" />
              <feFuncA type="identity" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>
    </>
  );
};
