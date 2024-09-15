import React, { useEffect, useState } from "react";
import useMousePosition from "../hooks/useMousePosition";

type Position = {
  x: number;
  y: number;
};

const CUTOFFS = {
  LOW: {
    SYMBOL: "🥶",
    COLOR: "rgb(70, 70, 226)",
    VALUE: 50,
  },
  MEDIUM: {
    SYMBOL: "👍",
    COLOR: "rgb(226, 210, 70)",
    VALUE: 90,
  },
  HIGH: {
    SYMBOL: "🔥",
    COLOR: "rgb(226, 99, 70)",
    VALUE: 100,
  },
} as const;

function getTemperatureFromDistance(
  rangePercentage: number
): keyof typeof CUTOFFS {
  if (rangePercentage <= CUTOFFS.LOW.VALUE) {
    return "LOW";
  }

  if (rangePercentage <= CUTOFFS.MEDIUM.VALUE) {
    return "MEDIUM";
  }

  return "HIGH";
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

  const maxDistance = minimumWindowDimension;
  const rangeValue = (maxDistance - distance).toFixed(1);
  const rangePercentage = (100 * (maxDistance - distance)) / maxDistance;
  const rangePercentageString = rangePercentage.toFixed(1);
  const temperature = getTemperatureFromDistance(rangePercentage);
  const scaleFactor = 0.75;
  const scale = (1 + (Number(rangeValue) / maxDistance) * scaleFactor).toFixed(
    1
  );

  return (
    <div
      className="hot-cold-slider"
      style={
        {
          "--track-color": CUTOFFS[temperature].COLOR,
        } as React.CSSProperties
      }
    >
      <div
        className="temperature-symbol"
        style={
          {
            "--translateX": `${rangePercentageString}%`,
            "--scale": scale,
          } as React.CSSProperties
        }
      >
        {CUTOFFS[temperature].SYMBOL}
      </div>
    </div>
  );
}
