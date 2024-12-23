import React, { useState } from "react";
import HotColdSlider from "./components/HotColdSlider/HotColdSlider";
import { generateGameBoard, pickRandomFromArray } from "./utils/gameUtils";
import { BACKGROUND_COLORS, PUZZLE_PAIRS } from "./constants";

export default function App() {
	const [points, setPoints] = useState(0);
	const [{ board, size, solutionId, pairIndex }, setGameBoard] = useState(
		generateGameBoard({
			puzzlePairs: PUZZLE_PAIRS,
		})
	);

	function handleSelectPiece({ isSolution }: ReturnType<typeof generateGameBoard>["board"][number]) {
		if (!isSolution) return;

		setPoints((p) => p + 1);
		setGameBoard(
			generateGameBoard({
				puzzlePairs: PUZZLE_PAIRS.filter((_, index) => index !== pairIndex),
			})
		);
	}

	return (
		<div
			className="app"
			style={{
				backgroundColor: pickRandomFromArray(BACKGROUND_COLORS).value,
			}}
		>
			<header>
				<h1>Odd one out</h1>
				<p>Points: {points}</p>
			</header>
			<main>
				<ul
					className="pieces"
					style={
						{
							"--columns": size,
						} as React.CSSProperties
					}
				>
					{board.map((piece) => (
						<li
							key={piece.id}
							className="piece"
							data-id={piece.id}
							// style={{
							// 	...(piece.isSolution && { backgroundColor: "rebeccapurple" }),
							// }}
						>
							<button onClick={() => handleSelectPiece(piece)}>
								<span
									className="symbol"
									style={
										{
											"--rotation-speed": 12 + Math.ceil(Math.random() * 5),
											...(["i", "!"].includes(piece.symbol) && piece.isSolution && { fontFamily: "serif" }),
											...(["6", "9"].includes(piece.symbol) && piece.isSolution && { fontFamily: "serif" }),
										} as React.CSSProperties
									}
								>
									{piece.symbol}
								</span>
							</button>
						</li>
					))}
				</ul>
				<section className="hot-cold-slider-wrapper">
					<HotColdSlider solutionId={solutionId} />
				</section>
			</main>
		</div>
	);
}
