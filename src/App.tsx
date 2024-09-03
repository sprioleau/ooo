import React, { useEffect, useState } from "react";
import useMousePosition from "./hooks/useMousePosition";

const backgroundColors = [
  "#ffd074ff",
  "#fba17dff",
  "#ff8b87ff",
  "#ffa6c8ff",
  "#e1aaf2ff",
  "#b7b4f6ff",
];

function getRandomPuzzleSize() {
  const puzzleSizes = [
    { name: "small", size: 8 },
    { name: "medium", size: 10 },
    { name: "large", size: 12 },
  ];

  return pickRandomFromArray(puzzleSizes)["size"];
}

const puzzlePairs = [
  ["M", "W"],
  ["X", "K"],
  ["p", "g"],
  ["8", "&"],
  ["i", "!"],
  ["5", "S"],
  ["6", "9"],
  ["0", "O"],
  ["2", "Z"],
  ["h", "n"],
  ["C", "G"],
  ["😀", "😄"],
  ["😁", "😄"],
  ["😅", "🥲"],
  ["😛", "😜"],
  ["🤪", "😜"],
  ["🤭", "🫢"],
  ["😐", "😑"],
  ["😈", "👿"],
  ["🙈", "🙉"],
  ["🖐️", "🖖"],
  ["🤟", "🤘"],
  ["🐪", "🐫"],
  ["☘️", "🍀"],
  ["🍊", "🍑"],
  ["🌎", "🌍"],
  ["⌛", "⏳"],
  ["⛄", "☃️"],
  ["🔉", "🔊"],
  ["📫", "📪"],
];

function pickRandomFromArray<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateGameBoard({
  pair = pickRandomFromArray(puzzlePairs),
  size = getRandomPuzzleSize(),
}: {
  pair?: string[]; // [string, string]
  size?: number;
}) {
  let selectedPair = pair;

  if (Math.random() > 0.5) {
    selectedPair = [...selectedPair].reverse();
  }

  const solutionSymbol = selectedPair[0];
  const fillerSymbol = selectedPair[1];
  const pieces = size ** 2;

  const board = Array.from({ length: pieces }).map((_: any, index: number) => ({
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

  return { board, size, solutionId };
}

export default function App() {
  const [points, setPoints] = useState(0);
  const [solutionCoordinates, setSolutionCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);
  // const [distance, setDistance] = useState<number | undefined>();
  const [{ board, size, solutionId }, setGameBoard] = useState(
    generateGameBoard({})
  );

  const { x: mouseX, y: mouseY } = useMousePosition();

  const distance =
    solutionCoordinates && mouseX && mouseY
      ? Math.sqrt(
          (mouseY - solutionCoordinates.y) ** 2 +
            (mouseX - solutionCoordinates.x) ** 2
        )
      : null;

  console.log({ distance });

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

    const indicator = document.createElement("div");
    indicator.style.backgroundColor = "red";
    indicator.style.position = "absolute";
    indicator.style.width = 20 + "px";
    indicator.style.height = 20 + "px";
    indicator.style.left = center.x + "px";
    indicator.style.top = center.y + "px";
    indicator.style.transform = "translate(-50%, -50%)";
    indicator.style.borderRadius = "50%";
    indicator.classList.add("center-mark");

    document.body.appendChild(indicator);

    setSolutionCoordinates(center);

    return () => {
      document.body.removeChild(indicator);
    };
  }, [solutionId]);

  function handleSelectPiece({
    isSolution,
  }: ReturnType<typeof generateGameBoard>["board"][number]) {
    if (!isSolution) return;

    setPoints((p) => p + 1);
    setGameBoard(generateGameBoard({}));
  }

  return (
    <div
      className="app"
      style={{
        backgroundColor: pickRandomFromArray(backgroundColors),
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
              //   ...(piece.isSolution && { backgroundColor: "rebeccapurple" }),
              // }}
            >
              <button onClick={() => handleSelectPiece(piece)}>
                <span
                  className="symbol"
                  style={
                    {
                      "--rotation-speed": 12 + Math.ceil(Math.random() * 5),
                      ...(["i", "!"].includes(piece.symbol) &&
                        piece.isSolution && { fontFamily: "serif" }),
                      ...(["6", "9"].includes(piece.symbol) &&
                        piece.isSolution && { fontFamily: "serif" }),
                    } as React.CSSProperties
                  }
                >
                  {piece.symbol}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
