import React, { useEffect, useState } from "react";
import useMousePosition from "../hooks/useMousePosition";

type Position = {
  x: number;
  y: number;
};

function getTemperatureFromDistance(distance: number | null) {
  if (!distance) return "Cold";
  // TODO: Base distances on window width
  //   const { innerWidth, innerHeight } = window;
  //   const minimumWindowDimension = Math.min(innerWidth, innerHeight);

  if (distance >= 200) {
    return "🥶";
  }

  if (distance >= 100) {
    return "👍";
  }

  return "🔥";
}

function getDistanceBetween(
  mousePosition: Position,
  solutionPosition: Position
) {
  const dy = mousePosition.y - solutionPosition.y;
  const dx = mousePosition.x - solutionPosition.x;

  return Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
}

export default function HotColdSlider({ solutionId }: { solutionId: number }) {
  const [solutionPosition, setSolutionPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const { x: mouseX, y: mouseY } = useMousePosition();
  const minimumWindowDimension = Math.min(innerWidth, innerHeight);

  useEffect(() => {
    // TODO: Use a ref instead
    const solutionElement = document.querySelector(
      `[data-id="${solutionId}"]`
    ) as HTMLLIElement;

    if (!solutionElement) return;

    const { left, top, width, height } =
      solutionElement.getBoundingClientRect();

    const center = {
      x: left + 0.5 * width,
      y: top + 0.5 * height,
    };

    setSolutionPosition(center);
  }, [solutionId]);

  if (!solutionPosition || !mouseX || !mouseY) {
    return null;
  }

  const distance = getDistanceBetween(
    {
      x: mouseX,
      y: mouseY,
    },
    {
      x: solutionPosition.x,
      y: solutionPosition.y,
    }
  );

  const temperature = getTemperatureFromDistance(distance);
  const maxDistance = minimumWindowDimension;
  const rangeValue = (maxDistance - distance).toFixed(1);
  const rangePercentage = (
    (100 * (maxDistance - distance)) /
    maxDistance
  ).toFixed(1);
  const scaleFactor = 0.75;
  const scale = (1 + (Number(rangeValue) / maxDistance) * scaleFactor).toFixed(
    1
  );

  return (
    <div className="hot-cold-slider">
      <div
        className="temperature-symbol"
        style={
          {
            "--translateX": `${rangePercentage}%`,
            "--scale": scale,
          } as React.CSSProperties
        }
      >
        {temperature}
      </div>
    </div>
  );
}
