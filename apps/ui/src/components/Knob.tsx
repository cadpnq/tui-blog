import { useState, useCallback } from "preact/hooks";
import "./Knob.styl";
import { useThrottleCallback } from "../util";

interface KnobProps {
  min?: number;
  max?: number;
  height?: number;
  sensitivity?: number;
  onChange: (value: number) => void;
}

export const Knob = ({
  min = 0,
  max = 1,
  height = 50,
  sensitivity = 1,
  onChange,
}: KnobProps) => {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const updateOffset = useThrottleCallback((delta: number) => {
    setOffset((prevOffset) => {
      const newOffset = prevOffset + delta;
      let newValue = ((newOffset / height) * (max - min) + min) * sensitivity;
      newValue = Math.max(min, Math.min(max, newValue));
      onChange(newValue);

      if (newValue === min || newValue === max) {
        return prevOffset;
      }
      return newOffset;
    });
  }, 5);
  
  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      updateOffset(e.movementX);
    },
    [isDragging, updateOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      updateOffset(e.deltaY);
    },
    [updateOffset]
  );

  const lines = Array.from({ length: 20 }, (_, i) => {
    const x = (i * 10 + offset) % height;
    return (
      <line
        key={i}
        x1={x < 0 ? x + height : x}
        y1="0"
        x2={x < 0 ? x + height : x}
        y2="100"
        stroke="black"
      />
    );
  });

  return (
    <div className="knob">
      <svg
        className="mx-[4px] my-[1px]"
        width={height}
        height="25"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs>
          <linearGradient id="hgradient">
            <stop offset="0%" stop-color="#46381d" />
            <stop offset="50%" stop-color="rgb(225, 210, 180)" />
            <stop offset="100%" stop-color="#46381d" />
          </linearGradient>
          <linearGradient id="vgradient" gradientTransform="rotate(90)">
            <stop offset="0%" stop-color="black" />
            <stop offset="10%" stop-color="rgb(225, 210, 180)" />
            <stop offset="90%" stop-color="rgb(225, 210, 180)" />
            <stop offset="100%" stop-color="black" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#hgradient)" />
        <rect
          width="100%"
          height="100%"
          fill="url(#vgradient)"
          style={{ mixBlendMode: "multiply" }}
        />
        {lines}
      </svg>
    </div>
  );
};
