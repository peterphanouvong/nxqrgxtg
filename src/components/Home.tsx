import { useState, useCallback, useMemo } from "react";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

type Player = "X" | "O";
type Square = Player | "";

export default function Home() {
  const [board, setBoard] = useState<Square[]>(() => Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");

  const calculateWinner = useCallback((squares: Square[]): Player | null => {
    for (const [a, b, c] of WINNING_COMBINATIONS) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a] as Player;
      }
    }
    return null;
  }, []);

  const winner = useMemo(() => calculateWinner(board), [board, calculateWinner]);
  const isDraw = useMemo(() => !winner && !board.includes(""), [winner, board]);
  const gameOver = useMemo(() => winner || isDraw, [winner, isDraw]);

  const handleSquareClick = useCallback(
    (index: number) => {
      if (board[index] || gameOver) return;

      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[index] = currentPlayer;
        return newBoard;
      });
      setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
    },
    [board, currentPlayer, gameOver]
  );

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(""));
    setCurrentPlayer("X");
  }, []);

  const getStatusMessage = () => {
    if (winner) return `🎉 Player ${winner} wins!`;
    if (isDraw) return "🤝 It's a draw!";
    return `Player ${currentPlayer}'s turn`;
  };

  const Square = ({ index }: { index: number }) => (
    <button
      onClick={() => handleSquareClick(index)}
      disabled={!!board[index] || gameOver}
      className={`
        relative w-20 h-20 bg-white border-2 border-gray-300 rounded-lg
        font-bold text-3xl text-gray-800 transition-all duration-200
        hover:border-blue-400 hover:shadow-md hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:hover:scale-100
        ${board[index] === "X" ? "text-blue-600" : "text-red-500"}
        ${!board[index] && !gameOver ? "hover:bg-gray-50" : ""}
      `}
      aria-label={`Square ${index + 1}, ${board[index] || "empty"}`}
    >
      <span className="drop-shadow-sm">{board[index]}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Tic Tac Toe
        </h1>
        
        <div className="text-center mb-6 p-3 rounded-lg bg-gray-50 border">
          <p className="text-lg font-semibold text-gray-700" aria-live="polite">
            {getStatusMessage()}
          </p>
        </div>

        <div
          role="grid"
          aria-label="Tic Tac Toe game board"
          className="grid grid-cols-3 gap-3 mb-6 p-4 bg-gray-100 rounded-xl"
        >
          {board.map((_, index) => (
            <div key={index} role="gridcell">
              <Square index={index} />
            </div>
          ))}
        </div>

        <button
          onClick={resetGame}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 
                     text-white font-semibold py-3 px-6 rounded-lg shadow-md
                     transition-all duration-200 hover:shadow-lg hover:scale-105
                     focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          aria-label="Reset the game"
        >
          🔄 New Game
        </button>
      </div>
    </div>
  );
}