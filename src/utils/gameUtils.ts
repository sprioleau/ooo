import { PUZZLE_PAIRS } from "../constants";

function getRandomPuzzleSize() {
	const puzzleSizes = [
		{ name: "small", size: 8 },
		{ name: "medium", size: 10 },
		{ name: "large", size: 12 },
	];

	return pickRandomFromArray(puzzleSizes).value["size"];
}

export function pickRandomFromArray<T>(array: T[]): { index: number; value: T } {
	const randomIndex = Math.floor(Math.random() * array.length);
	return {
		index: randomIndex,
		value: array[randomIndex],
	};
}

export function generateGameBoard({
	puzzlePairs,
	size = getRandomPuzzleSize(),
}: {
	puzzlePairs: typeof PUZZLE_PAIRS;
	size?: number;
}) {
	const selectedPairObject = pickRandomFromArray(puzzlePairs);
	let selectedPair = selectedPairObject.value;

	if (Math.random() > 0.5) {
		selectedPair = [...selectedPair].reverse();
	}

	const solutionSymbol = selectedPair[0];
	const fillerSymbol = selectedPair[1];
	const pieces = size ** 2;

	const board = Array.from({ length: pieces }).map((_, index) => ({
		id: index,
		symbol: fillerSymbol,
		isSolution: false,
	}));

	// Select solution piece and add property to uniquely identify it
	const solutionId = Math.floor(Math.random() * pieces);
	board[solutionId] = {
		...board[solutionId],
		symbol: solutionSymbol,
		isSolution: true,
	};

	return {
		board,
		size,
		solutionId,
		pairIndex: selectedPairObject.index,
	};
}
