import { useState } from "preact/hooks";

export const Knob = ({
  min = 0,
  max = 1,
  height = 50,
  onChange,
}: {
  min?: number;
  max?: number;
  height?: number;
  onChange: (i: number) => void;
}) => {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.movementX;
    updateOffset(deltaX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    const deltaY = e.deltaY;
    updateOffset(deltaY);
  };

  const updateOffset = (delta: number) => {
    setOffset((prevOffset) => {
      const newOffset = prevOffset + delta;
      const value = (newOffset / height) * (max - min) + min;
      onChange(value);
      return newOffset;
    });
  };

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
    <svg
      width={height}
      height="25"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.5)",
      }}
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
  );
};
