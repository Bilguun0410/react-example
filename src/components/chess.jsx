import { useState } from "react";
import { cn } from "../utils/cn";
import { Button } from "./ui/button";

// Filled glyphs for every piece; white pieces get the outline glyph layered on top.
// ︎ forces text (not emoji) presentation.
const FILLED = {
  k: "♚︎",
  q: "♛︎",
  r: "♜︎",
  b: "♝︎",
  n: "♞︎",
  p: "♟︎",
};

const OUTLINE = {
  k: "♔︎",
  q: "♕︎",
  r: "♖︎",
  b: "♗︎",
  n: "♘︎",
  p: "♙︎",
};

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

const createInitialBoard = () => [
  ["r", "n", "b", "q", "k", "b", "n", "r"], // Rank 8
  ["p", "p", "p", "p", "p", "p", "p", "p"], // Rank 7
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["P", "P", "P", "P", "P", "P", "P", "P"], // Rank 2
  ["R", "N", "B", "Q", "K", "B", "N", "R"], // Rank 1
];

const isWhite = (piece) => piece === piece.toUpperCase();
const inBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

const KNIGHT_STEPS = [
  [-2, -1], [-2, 1], [-1, -2], [-1, 2],
  [1, -2], [1, 2], [2, -1], [2, 1],
];
const KING_STEPS = [
  [-1, -1], [-1, 0], [-1, 1], [0, -1],
  [0, 1], [1, -1], [1, 0], [1, 1],
];
const ROOK_DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const BISHOP_DIRS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

// Pseudo-legal moves (no check, castling or en passant).
const getMoves = (board, r, c) => {
  const piece = board[r][c];
  const white = isWhite(piece);
  const isEnemy = (tr, tc) => board[tr][tc] && isWhite(board[tr][tc]) !== white;
  const canLand = (tr, tc) => inBounds(tr, tc) && (!board[tr][tc] || isEnemy(tr, tc));
  const moves = [];

  const step = (offsets) =>
    offsets.forEach(([dr, dc]) => canLand(r + dr, c + dc) && moves.push([r + dr, c + dc]));

  const slide = (dirs) =>
    dirs.forEach(([dr, dc]) => {
      let tr = r + dr;
      let tc = c + dc;
      while (inBounds(tr, tc)) {
        if (!board[tr][tc]) {
          moves.push([tr, tc]);
        } else {
          if (isEnemy(tr, tc)) moves.push([tr, tc]);
          break;
        }
        tr += dr;
        tc += dc;
      }
    });

  switch (piece.toLowerCase()) {
    case "p": {
      const dir = white ? -1 : 1;
      const startRow = white ? 6 : 1;
      if (inBounds(r + dir, c) && !board[r + dir][c]) {
        moves.push([r + dir, c]);
        if (r === startRow && !board[r + 2 * dir][c]) moves.push([r + 2 * dir, c]);
      }
      [-1, 1].forEach((dc) => {
        if (inBounds(r + dir, c + dc) && isEnemy(r + dir, c + dc)) moves.push([r + dir, c + dc]);
      });
      break;
    }
    case "n":
      step(KNIGHT_STEPS);
      break;
    case "k":
      step(KING_STEPS);
      break;
    case "r":
      slide(ROOK_DIRS);
      break;
    case "b":
      slide(BISHOP_DIRS);
      break;
    case "q":
      slide([...ROOK_DIRS, ...BISHOP_DIRS]);
      break;
  }

  return moves;
};

const Piece = ({ piece }) => {
  const type = piece.toLowerCase();

  if (!isWhite(piece)) {
    return <span className="text-piece-dark">{FILLED[type]}</span>;
  }

  return (
    <span className="relative inline-grid">
      <span className="col-start-1 row-start-1 text-piece-light">{FILLED[type]}</span>
      <span className="col-start-1 row-start-1 text-piece-dark">{OUTLINE[type]}</span>
    </span>
  );
};

export const Chess = () => {
  const [board, setBoard] = useState(createInitialBoard);
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState("w");

  const targets = selected ? getMoves(board, selected[0], selected[1]) : [];
  const isTarget = (r, c) => targets.some(([tr, tc]) => tr === r && tc === c);
  const isOwnPiece = (piece) => piece && isWhite(piece) === (turn === "w");

  const handleSquareClick = (r, c) => {
    const piece = board[r][c];

    if (selected && isTarget(r, c)) {
      const [sr, sc] = selected;
      let moving = board[sr][sc];
      // Auto-promote pawns to queens on the last rank.
      if (moving.toLowerCase() === "p" && (r === 0 || r === 7)) {
        moving = isWhite(moving) ? "Q" : "q";
      }
      const next = board.map((row) => [...row]);
      next[r][c] = moving;
      next[sr][sc] = null;
      setBoard(next);
      setSelected(null);
      setTurn((t) => (t === "w" ? "b" : "w"));
      return;
    }

    if (isOwnPiece(piece) && !(selected?.[0] === r && selected?.[1] === c)) {
      setSelected([r, c]);
    } else {
      setSelected(null);
    }
  };

  const handleReset = () => {
    setBoard(createInitialBoard());
    setSelected(null);
    setTurn("w");
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3 p-4 select-none">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 font-medium text-foreground">
          <span
            className={cn(
              "size-3 rounded-full border border-piece-dark",
              turn === "w" ? "bg-piece-light" : "bg-piece-dark",
            )}
          />
          {turn === "w" ? "White" : "Black"} to move
        </span>
        <Button onClick={handleReset} className="py-1">
          Reset
        </Button>
      </div>

      <div className="grid aspect-square w-full grid-cols-8 grid-rows-8 overflow-hidden rounded-lg border border-border shadow-lg">
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const isLight = (rIdx + cIdx) % 2 === 0;
            const isSelected = selected?.[0] === rIdx && selected?.[1] === cIdx;
            const target = isTarget(rIdx, cIdx);
            const clickable = target || isOwnPiece(cell);

            return (
              <button
                key={`${rIdx}-${cIdx}`}
                type="button"
                onClick={() => handleSquareClick(rIdx, cIdx)}
                aria-label={`${FILES[cIdx]}${8 - rIdx}${cell ? ` ${cell}` : ""}`}
                className={cn(
                  "relative flex aspect-square min-h-0 min-w-0 items-center justify-center text-3xl leading-none sm:text-4xl",
                  "focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
                  isLight ? "bg-board-light" : "bg-board-dark",
                  clickable ? "cursor-pointer" : "cursor-default",
                )}
              >
                {isSelected && <span className="absolute inset-0 bg-board-highlight" />}

                {cIdx === 0 && (
                  <span
                    className={cn(
                      "absolute top-0.5 left-1 text-xs font-semibold",
                      isLight ? "text-board-dark" : "text-board-light",
                    )}
                  >
                    {8 - rIdx}
                  </span>
                )}
                {rIdx === 7 && (
                  <span
                    className={cn(
                      "absolute right-1 bottom-0.5 text-xs font-semibold",
                      isLight ? "text-board-dark" : "text-board-light",
                    )}
                  >
                    {FILES[cIdx]}
                  </span>
                )}

                {target &&
                  (cell ? (
                    <span className="absolute inset-1 rounded-full border-4 border-board-highlight" />
                  ) : (
                    <span className="absolute size-1/4 rounded-full bg-board-highlight" />
                  ))}

                {cell && (
                  <span
                    className={cn(
                      "relative transition-transform",
                      clickable && "hover:scale-110 active:scale-95",
                    )}
                  >
                    <Piece piece={cell} />
                  </span>
                )}
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
};
