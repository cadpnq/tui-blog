import { rgb } from "d3-color";
import { useEffect, useState } from "preact/hooks";
import "./LED.styl";

export type LEDShape = "round" | "square";
export type LEDMode = "static" | "blink";

export interface LEDProps {
  shape?: LEDShape;
  height?: number;
  width?: number;
  color?: string;
  on?: boolean;
  mode?: LEDMode;
  blinkRate?: number;
  bloomIntensity?: number;
}

export const LED = ({
  shape = "round",
  height = 10,
  width = 10,
  color = "red",
  on = true,
  mode = "blink",
  blinkRate = 0.25,
}: LEDProps) => {
  const onColor = rgb(color);
  const offColor = onColor.darker(3);

  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (on && mode === "blink") {
      setBlinking(true);
      setTimeout(() => {
        setBlinking(false);
      }, blinkRate * 1000);
    }
  }, [on]);

  const style = {
    width,
    height,
    borderRadius: shape === "round" ? "50%" : "0",
    backgroundColor: offColor.toString(),
    "--on-color": onColor.toString(),
    "--off-color": offColor.toString(),
    animation: (on && mode === "blink") || blinking ? `blink ${blinkRate}s infinite` : "none",
  };

  return <div style={style} />;
};
