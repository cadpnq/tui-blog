
export const generateFisheyeEffectDataUrl = (
  width: number,
  height: number,
  intensity = 128
): string => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("Unable to get canvas context");
    return "";
  }

  canvas.width = width;
  canvas.height = height;

  const centerX = width / 2;
  const centerY = height / 2;
  const maxMag = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));

  console.log(`centerX: ${centerX}, centerY: ${centerY}, maxMag: ${maxMag}`);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const distanceVecX = x - centerX;
      const distanceVecY = y - centerY;
      const mag = Math.sqrt(
        Math.pow(distanceVecX, 2) + Math.pow(distanceVecY, 2)
      );
      let displacement = (mag - maxMag / 2) / (maxMag / 2);
      displacement /= maxMag / intensity;

      const r = Math.max(0, Math.min(255, displacement * distanceVecX + 128));
      const g = Math.max(0, Math.min(255, displacement * distanceVecY + 128));
      const b = 0;

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  return canvas.toDataURL();
};
