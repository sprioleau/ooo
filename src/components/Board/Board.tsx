import { generateGameBoard } from "../../utils/gameUtils";

export default function Board({
	board,
	size,
	onSelectPiece,
}: {
	board: ReturnType<typeof generateGameBoard>["board"];
	size: number; // TODO: could be typed better
	onSelectPiece: (piece: ReturnType<typeof generateGameBoard>["board"][number]) => void;
}) {
	return (
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
					<button onClick={() => onSelectPiece(piece)}>
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
	);
}
