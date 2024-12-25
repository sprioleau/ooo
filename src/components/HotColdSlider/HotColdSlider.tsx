import React, { useEffect, useState } from "react";
import useMousePosition from "../../hooks/useMousePosition";

import "./index.scss";

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

function getDistanceBetween(mousePosition: Position, solutionPosition: Position) {
	const dy = mousePosition.y - solutionPosition.y;
	const dx = mousePosition.x - solutionPosition.x;

	return Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
}

export default function HotColdSlider({
	solutionId,
	ref,
}: {
	solutionId: number;
	ref: React.RefObject<HTMLUListElement | null>;
}) {
	const [isHotColdSliderVisible, setIsHotColdSliderVisible] = useState(false);
	const [maxDistanceFromCorners, setMaxDistanceFromCorners] = useState<number | null>(null);
	const [distanceFromMousePointer, setDistanceFromMousePointer] = useState<number | null>(null);
	const { x: mouseX, y: mouseY } = useMousePosition();

	useEffect(() => {
		if (!ref.current) {
			return;
		}

		const board = ref.current;
		const solutionElement = board.querySelector(`[data-id="${solutionId}"]`) as HTMLLIElement;

		if (!solutionElement) {
			return;
		}

		const { left, top, width, height } = solutionElement.getBoundingClientRect();

		const solutionElementCenter = {
			x: left + 0.5 * width,
			y: top + 0.5 * height,
		};

		// ---

		const canCalulateDistance = mouseX && mouseY;

		const distanceFromSolution = canCalulateDistance
			? getDistanceBetween(
					{
						x: mouseX,
						y: mouseY,
					},
					{
						x: solutionElementCenter.x,
						y: solutionElementCenter.y,
					}
			  )
			: 0;

		const {
			left: boardLeft,
			top: boardTop,
			width: boardWidth,
			height: boardHeight,
		} = ref.current.getBoundingClientRect();

		/*
			Max distance is the distance from the solution to the furthest 
			corner of the board.
				1. Calculate the distance from the solution to each corner
				2. Find the maximum
		*/
		const corners = [
			{ x: boardLeft, y: boardTop },
			{ x: boardLeft + boardWidth, y: boardTop },
			{ x: boardLeft, y: boardTop + boardHeight },
			{ x: boardLeft + boardWidth, y: boardTop + boardHeight },
		];

		const distanceFromCorners = corners.map(({ x, y }) => {
			const dx = solutionElementCenter.x - x;
			const dy = solutionElementCenter.y - y;
			return Math.sqrt(Math.pow(dy, 2) + Math.pow(dx, 2));
		});

		const computedMaxDistanceFromCorners = Math.max(...distanceFromCorners);

		setMaxDistanceFromCorners(computedMaxDistanceFromCorners);
		setDistanceFromMousePointer(Math.min(computedMaxDistanceFromCorners, distanceFromSolution));
	}, [ref, solutionId, mouseX, mouseY]);

	if (!maxDistanceFromCorners || !distanceFromMousePointer) {
		return null;
	}

	const range = maxDistanceFromCorners - distanceFromMousePointer;
	const rangePercentage = (100 * range) / maxDistanceFromCorners;
	const rangePercentageString = rangePercentage.toFixed(1);
	const temperature = getTemperatureFromDistance(rangePercentage);
	const scaleFactor = 0.75;
	const scale = (1 + (range / maxDistanceFromCorners) * scaleFactor).toFixed(1);
	const symbol = CUTOFFS[temperature].SYMBOL;

	return (
		<section className="hot-cold-slider-wrapper">
			<button
				className="hot-cold-slider-button"
				onClick={() => {
					setIsHotColdSliderVisible((previousState) => !previousState);
				}}
			>
				{isHotColdSliderVisible ? "🙈 Hide" : "🐵 Show"} slider
			</button>

			<div
				className="hot-cold-slider"
				style={
					{
						"--track-color": CUTOFFS[temperature].COLOR,
						"--opacity": isHotColdSliderVisible ? 1 : 0,
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
		</section>
	);
}
