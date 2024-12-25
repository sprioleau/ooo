import { useRef, useState } from "react";
import HotColdSlider from "./components/HotColdSlider/HotColdSlider";
import { generateGameBoard } from "./utils/gameUtils";
import { PUZZLE_PAIRS } from "./constants";
import ReactHowler from "react-howler";
import Board from "./components/Board/Board";
// import Logo from "./components/Logo/Logo";

const MUSIC_SOURCES = {
	GAME: "/sounds/game-music.mp3",
} as const;

const SOUNDS = {
	CORRECT: "/sounds/correct.mp3",
	INCORRECT: "/sounds/incorrect.mp3",
} as const;

export default function App() {
	const [points, setPoints] = useState(0);
	const [activeSoundSource, setActiveSoundSource] = useState<(typeof SOUNDS)[keyof typeof SOUNDS] | undefined>();
	const [activeMusicSource] = useState(MUSIC_SOURCES.GAME);
	const boardRef = useRef<HTMLUListElement>(null);

	const [{ board, size, solutionId, pairIndex }, setGameBoard] = useState(
		generateGameBoard({
			puzzlePairs: PUZZLE_PAIRS,
		})
	);

	function handleSelectPiece({ isSolution }: ReturnType<typeof generateGameBoard>["board"][number]) {
		if (!isSolution) {
			setActiveSoundSource(SOUNDS.INCORRECT);
			return;
		}

		setActiveSoundSource(SOUNDS.CORRECT);
		setPoints((p) => p + 1);
		setGameBoard(
			generateGameBoard({
				puzzlePairs: PUZZLE_PAIRS.filter((_, index) => index !== pairIndex),
			})
		);
	}

	return (
		<div className="app">
			<header>
				<h1 className="title">Odd one out</h1>
				{/* <Logo /> */}
				<p>Points: {points}</p>
			</header>
			<main>
				<Board
					board={board}
					size={size}
					onSelectPiece={handleSelectPiece}
					ref={boardRef}
				/>
				<HotColdSlider
					solutionId={solutionId}
					ref={boardRef}
				/>
			</main>
			<div className="sounds">
				<ReactHowler
					src="/sounds/correct.mp3"
					playing={activeSoundSource !== undefined}
				/>
				<ReactHowler
					src={activeMusicSource}
					volume={0.4}
					html5
					playing
					loop
				/>
			</div>
		</div>
	);
}
