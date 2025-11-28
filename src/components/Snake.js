import React, { useState, useEffect, useCallback, useRef } from "react";

// --- Constants ---
const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
// Define a list of food icons to be chosen randomly
const FRUIT_ICONS = ["🍎", "🍌", "🍇", "🍍", "🥝", "🍓", "🥭", "🍉"];
const INITIAL_FOOD = { x: 5, y: 5, icon: FRUIT_ICONS[0] }; // Initialize with a starting icon
const GAME_SPEED_MS = 150;

// Utility function to generate a random food position and select a random icon
const generateFood = (snake) => {
  let newFood;
  let isSnakeBody;
  do {
    // Generate coordinates within the grid boundaries (0 to GRID_SIZE - 1)
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Check if the new food position overlaps with the snake's body
    isSnakeBody = snake.some(
      (segment) => segment.x === newFood.x && segment.y === newFood.y
    );
  } while (isSnakeBody); // Repeat until a non-snake position is found

  // Select a random icon
  const icon = FRUIT_ICONS[Math.floor(Math.random() * FRUIT_ICONS.length)];

  // Return coordinates AND the selected icon
  return { ...newFood, icon };
};

// --- Main App Component ---
const App = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState("RIGHT");
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Use a ref to store the current direction for the game loop
  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  // Function to move the snake and handle game logic
  const moveSnake = useCallback(() => {
    // Game runs only if started, not over, and not paused
    if (!isGameStarted || isGameOver || isGamePaused) return;

    // 1. Calculate the new head position based on current direction
    const currentDirection = directionRef.current;
    let newHead = { x: snake[0].x, y: snake[0].y };

    switch (currentDirection) {
      case "UP":
        newHead.y -= 1;
        break;
      case "DOWN":
        newHead.y += 1;
        break;
      case "LEFT":
        newHead.x -= 1;
        break;
      case "RIGHT":
        newHead.x += 1;
        break;
      default:
        break;
    }

    // NEW: 2. Implement Wraparound Logic (Torus geometry)
    // If the snake moves past a boundary, wrap it to the opposite side
    if (newHead.x < 0) {
      newHead.x = GRID_SIZE - 1;
    } else if (newHead.x >= GRID_SIZE) {
      newHead.x = 0;
    }
    if (newHead.y < 0) {
      newHead.y = GRID_SIZE - 1;
    } else if (newHead.y >= GRID_SIZE) {
      newHead.y = 0;
    }

    // 3. Check for Self-Collision (Wall collision is now handled by wraparound)
    const hitSelf = snake.some(
      (segment, index) =>
        index !== 0 && segment.x === newHead.x && segment.y === newHead.y
    );

    if (hitSelf) {
      setIsGameOver(true);
      return;
    }

    // 4. Update the snake's body
    const newSnake = [newHead, ...snake];

    // 5. Check for food
    const ateFood = newHead.x === food.x && newHead.y === food.y;

    if (ateFood) {
      // Grow the snake
      setFood(generateFood(newSnake));
      setScore((prevScore) => prevScore + 10);
    } else {
      // Move the snake by removing the tail segment
      newSnake.pop();
    }

    // 6. Commit the new snake position
    setSnake(newSnake);
  }, [isGameStarted, isGameOver, isGamePaused, snake, food]);

  // --- Game Loop (Interval Timer) ---
  useEffect(() => {
    // Only run the interval if the game is actively running
    if (!isGameStarted || isGameOver || isGamePaused) return;

    const gameLoopId = setInterval(moveSnake, GAME_SPEED_MS);

    // Cleanup function
    return () => clearInterval(gameLoopId);
  }, [isGameStarted, isGameOver, isGamePaused, moveSnake]);

  // --- Keyboard Input Handler ---
  const handleKeyDown = useCallback(
    (e) => {
      const key = e.key.toUpperCase();
      const newDir = key.replace("ARROW", "");
      const currentDir = directionRef.current;

      // Prevent immediate reversal
      const isOpposite =
        (currentDir === "UP" && newDir === "DOWN") ||
        (currentDir === "DOWN" && newDir === "UP") ||
        (currentDir === "LEFT" && newDir === "RIGHT") ||
        (currentDir === "RIGHT" && newDir === "LEFT");

      // Only allow direction change if game is started and not over
      if (
        isGameStarted &&
        !isGameOver &&
        ["UP", "DOWN", "LEFT", "RIGHT"].includes(newDir) &&
        !isOpposite
      ) {
        setDirection(newDir);
      }

      // Handle pause/resume with spacebar
      if (e.key === " " && isGameStarted && !isGameOver) {
        e.preventDefault(); // Prevent scrolling on spacebar press
        setIsGamePaused((prev) => !prev);
      }

      // Handle restart with 'R'
      if (key === "R") {
        handleRestart();
      }

      // Handle Start with Enter key
      if (key === "ENTER" && !isGameStarted) {
        handleStart();
      }
    },
    [isGameOver, isGameStarted]
  );

  useEffect(() => {
    // Attach and detach the event listener
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // --- Game Controls ---
  const handleStart = () => {
    if (!isGameStarted) {
      setIsGameStarted(true);
      setIsGameOver(false);
      setIsGamePaused(false);
      setDirection("RIGHT");
      // Ensure the initial food also has an icon
      setFood(generateFood(INITIAL_SNAKE));
    }
  };

  const handleRestart = () => {
    // Reset all game state and start immediately
    setSnake(INITIAL_SNAKE);
    setFood(generateFood(INITIAL_SNAKE));
    setDirection("RIGHT");
    setScore(0);
    setIsGameOver(false);
    setIsGamePaused(false);
    setIsGameStarted(true); // Restart implies immediate start
    directionRef.current = "RIGHT"; // Reset the ref as well
  };

  const togglePause = () => {
    if (isGameStarted && !isGameOver) {
      setIsGamePaused((prev) => !prev);
    }
  };

  // --- Rendering Functions ---

  // Renders the individual cells of the game board
  const renderCell = (x, y) => {
    const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;
    const isHead = snake[0].x === x && snake[0].y === y;

    let classes = "w-full h-full";

    if (isHead) {
      // Head styling: Use a small icon for the face
      classes +=
        " bg-green-700 rounded-sm border-2 border-green-900 shadow-md transition-all duration-100 flex items-center justify-center text-xs";

      // Determine the rotation of the eye/face based on direction
      let faceIcon = "•"; // Simple dot for the face
      let transform = "";

      switch (directionRef.current) {
        case "UP":
          faceIcon = "▲"; // Up arrow for direction hint
          transform = "rotate(0deg)";
          break;
        case "DOWN":
          faceIcon = "▼"; // Down arrow
          transform = "rotate(0deg)";
          break;
        case "LEFT":
          faceIcon = "◀"; // Left arrow
          transform = "rotate(0deg)";
          break;
        case "RIGHT":
        default:
          faceIcon = "▶"; // Right arrow
          transform = "rotate(0deg)";
          break;
      }

      return (
        <div
          className={classes}
          style={{ transform: transform, color: "white" }}
        >
          {faceIcon}
        </div>
      );
    } else if (isSnake) {
      // Body styling
      classes +=
        " bg-green-500 border border-green-800 rounded-sm opacity-90 transition-all duration-100";
    } else if (isFood) {
      // Food styling (uses the dynamic fruit icon)
      classes += " flex items-center justify-center text-lg animate-pulse";
      return <div className={classes}>{food.icon}</div>;
    }

    return <div className={classes} />;
  };

  // Renders the entire grid
  const renderGrid = () => (
    <div
      className="grid p-1 border-4 border-gray-700 rounded-lg shadow-2xl bg-gray-900/90 backdrop-blur-sm"
      style={{
        gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        width: "min(90vw, 500px)",
        height: "min(90vw, 500px)",
        aspectRatio: "1 / 1",
        gap: "1px",
      }}
    >
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
        const x = index % GRID_SIZE;
        const y = Math.floor(index / GRID_SIZE);
        return (
          <div
            key={index}
            className="w-full h-full flex items-center justify-center"
          >
            {renderCell(x, y)}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center p-4 font-mono">
      <h1 className="text-4xl font-bold mb-6 text-green-400 drop-shadow-lg">
        SNAKE React (Wraparound)
      </h1>

      <div className="w-full max-w-lg mb-4 flex justify-between items-center bg-gray-700/50 p-3 rounded-lg shadow-inner">
        <div className="text-lg text-white">
          Score: <span className="font-bold text-yellow-300">{score}</span>
        </div>
        <div className="text-sm text-gray-300">
          Controls: Arrows | Space (Pause) | R (Restart) | Enter (Start)
        </div>
      </div>

      <div className="relative">
        {renderGrid()}

        {/* Start Screen Overlay (Shown when game hasn't started yet) */}
        {!isGameStarted && !isGameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex flex-col items-center justify-center z-20">
            <div className="text-4xl font-extrabold text-green-400 mb-8">
              Ready to Play?
            </div>
            <button
              onClick={handleStart}
              className="px-8 py-4 text-xl font-semibold text-white bg-green-600 rounded-full shadow-xl hover:bg-green-700 transition duration-150 transform hover:scale-105"
            >
              Start Game (Enter)
            </button>
            <div className="mt-4 text-sm text-gray-400">
              You can now pass through walls!
            </div>
          </div>
        )}

        {/* Game Over/Paused Overlay */}
        {(isGameOver || isGamePaused) && isGameStarted && (
          <div className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex flex-col items-center justify-center z-10">
            {isGameOver && (
              <>
                <div className="text-5xl font-extrabold text-red-500 mb-4 animate-bounce">
                  GAME OVER!
                </div>
                <div className="text-xl text-white mb-6">
                  Final Score:{" "}
                  <span className="text-yellow-300 font-bold">{score}</span>
                </div>
              </>
            )}
            {isGamePaused && !isGameOver && (
              <div className="text-4xl font-bold text-yellow-400 mb-6">
                PAUSED
              </div>
            )}
            <button
              onClick={handleRestart}
              className="px-6 py-3 text-lg font-semibold text-white bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition duration-150 transform hover:scale-105"
            >
              Restart Game (R)
            </button>
            {!isGameOver && (
              <button
                onClick={togglePause}
                className="mt-3 px-4 py-2 text-sm text-gray-300 hover:text-white"
              >
                {isGamePaused ? "Resume (Space)" : "Pause (Space)"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleRestart}
          className="bg-red-500 text-white p-3 rounded-full shadow-md hover:bg-red-600 transition"
          disabled={!isGameStarted && !isGameOver}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181-3.182-3.182-3.181m0 0h4.992m-4.992 0v-4.992"
            />
          </svg>
        </button>
        <button
          onClick={togglePause}
          className="bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 transition"
          disabled={isGameOver || !isGameStarted}
        >
          {isGamePaused ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.985V5.653Z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25v13.5m-7.5-13.5v13.5"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default App;
