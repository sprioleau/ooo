import React, { useEffect, useState } from "react";
import useMousePosition from "../../hooks/useMousePosition";

import "./index.scss";

type Position = {
	x: number;
	y: number;
};

type SolutionPosition = Position & {
	width: number;
	height: number;
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
		VALUE: 85,
	},
	HIGH: {
		SYMBOL: "🔥",
		COLOR: "rgb(226, 99, 70)",
		VALUE: 100,
	},
} as const;

function getTemperatureFromDistance(rangePercentage: number): keyof typeof CUTOFFS {
	if (rangePercentage <= CUTOFFS.LOW.VALUE) {
		return "LOW";
	}

	if (rangePercentage <= CUTOFFS.MEDIUM.VALUE) {
		return "MEDIUM";
	}

	return "HIGH";
}

function getDistanceBetween(mousePosition: Position, solutionPosition: SolutionPosition) {
	const dy = mousePosition.y - (solutionPosition.y + 0.5 * solutionPosition.height);
	const dx = mousePosition.x - (solutionPosition.x + 0.5 * solutionPosition.width);

	return Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
}

export default function HotColdSlider({ solutionId }: { solutionId: number }) {
	const [isHotColdSliderVisible, setIsHotColdSliderVisible] = useState(false);
	const [solutionPosition, setSolutionPosition] = useState<{
		x: number;
		y: number;
		width: number;
		height: number;
	} | null>(null);
	const { x: mouseX, y: mouseY } = useMousePosition();
	const minimumWindowDimension = Math.min(innerWidth, innerHeight);

	useEffect(() => {
		// TODO: Use a ref instead
		const solutionElement = document.querySelector(`[data-id="${solutionId}"]`) as HTMLLIElement;

		if (!solutionElement) return;

		const { left, top, width, height } = solutionElement.getBoundingClientRect();

		const center = {
			x: left + 0.5 * width,
			y: top + 0.5 * height,
			width,
			height,
		};

		setSolutionPosition(center);
	}, [solutionId]);

	const canCalulateDistance = solutionPosition && mouseX && mouseY;

	const distance = canCalulateDistance
		? getDistanceBetween(
				{
					x: mouseX,
					y: mouseY,
				},
				{
					x: solutionPosition.x,
					y: solutionPosition.y,
					width: solutionPosition.width,
					height: solutionPosition.height,
				}
		  )
		: 0;

	const maxDistance = minimumWindowDimension;
	const rangeValue = (maxDistance - distance).toFixed(1);
	const rangePercentage = (100 * (maxDistance - distance)) / maxDistance;
	const rangePercentageString = rangePercentage.toFixed(1);
	const temperature = getTemperatureFromDistance(rangePercentage);
	const scaleFactor = 0.75;
	const scale = (1 + (Number(rangeValue) / maxDistance) * scaleFactor).toFixed(1);
	const symbol = CUTOFFS[temperature].SYMBOL;

	return (
		<>
			<button
				className="hot-cold-slider-button"
				onClick={() => {
					setIsHotColdSliderVisible((previousState) => !previousState);
				}}
			>
				{isHotColdSliderVisible ? "🙈 Hide" : "🐵 Show"} slider
			</button>

			{isHotColdSliderVisible && (
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
						data-temperature={symbol}
					>
						{symbol}
					</div>
				</div>
			)}
		</>
	);
}
