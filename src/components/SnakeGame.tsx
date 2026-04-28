import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameState, Direction } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Activity, RefreshCw, Power } from 'lucide-react';

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),
    isGameOver: false,
    isPaused: true,
  });

  const generateFood = useCallback((currentSnake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood!.x && segment.y === newFood!.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    const newFood = generateFood(INITIAL_SNAKE);
    setFood(newFood);
    setGameState(prev => ({
      ...prev,
      score: 0,
      isGameOver: false,
      isPaused: false,
    }));
    onScoreUpdate(0);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'w':
        case 'arrowup':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 's':
        case 'arrowdown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'a':
        case 'arrowleft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'd':
        case 'arrowright':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameState(prev => {
          const newHighScore = Math.max(prev.score, prev.highScore);
          localStorage.setItem('snakeHighScore', newHighScore.toString());
          return { ...prev, isGameOver: true, highScore: newHighScore };
        });
        return;
      }

      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameState(prev => {
          const newHighScore = Math.max(prev.score, prev.highScore);
          localStorage.setItem('snakeHighScore', newHighScore.toString());
          return { ...prev, isGameOver: true, highScore: newHighScore };
        });
        return;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setGameState(prev => ({ ...prev, score: prev.score + 10 }));
        onScoreUpdate(gameState.score + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      setSnake(newSnake);
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [snake, direction, food, gameState.isGameOver, gameState.isPaused, generateFood, onScoreUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = canvas.width / GRID_SIZE;

    // Background - CRT dark green tint
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pixel Grid
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 1;
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            ctx.strokeRect(i * scale, j * scale, scale, scale);
        }
    }

    // Snake - Blocky cyan
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#0ff' : '#0aa';
      ctx.fillRect(
        segment.x * scale + 1,
        segment.y * scale + 1,
        scale - 2,
        scale - 2
      );
      
      // Glitch effect on head
      if (isHead && Math.random() > 0.95) {
          ctx.fillStyle = '#f0f';
          ctx.fillRect(segment.x * scale - 2, segment.y * scale, scale, 2);
      }
    });

    // Food - Flashing pink block
    ctx.fillStyle = Math.random() > 0.1 ? '#f0f' : '#fff';
    ctx.fillRect(
      food.x * scale + 2,
      food.y * scale + 2,
      scale - 4,
      scale - 4
    );
  }, [snake, food]);

  return (
    <div className="relative overflow-hidden group">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="glitch-border cursor-none bg-black"
      />
      
      {/* High Score module */}
      <div className="absolute top-2 right-2 z-20">
        <div className="bg-black/80 border border-cyan-500 px-2 py-1 flex items-center gap-2">
          <Activity className="w-3 h-3 text-magenta-500" />
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
            HI_RECORD: {gameState.highScore}
          </span>
        </div>
      </div>

      {gameState.isPaused && !gameState.isGameOver && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30">
          <h2 className="text-6xl font-bold mb-8 glitch-text text-cyan-500 uppercase tracking-tighter">SUSPENDED</h2>
          <button
            onClick={() => setGameState(prev => ({ ...prev, isPaused: false }))}
            className="flex items-center gap-3 bg-cyan-500 text-black font-bold px-8 py-3 uppercase tracking-widest hover:bg-white transition-colors"
          >
            <Power className="w-5 h-5" />
            RESUME_THREAD
          </button>
        </div>
      )}

      {gameState.isGameOver && (
        <div className="absolute inset-0 bg-magenta-900/90 flex flex-col items-center justify-center z-40 p-8">
          <h2 className="text-7xl font-bold mb-2 glitch-text text-white uppercase italic">CRITICAL_FAIL</h2>
          <div className="mb-10 text-2xl text-cyan-300 font-bold tracking-widest">SCORE_FINAL: {gameState.score}</div>
          <button
            onClick={resetGame}
            className="flex items-center gap-3 bg-white text-black font-bold px-10 py-4 uppercase tracking-widest border-4 border-black hover:bg-cyan-500 transition-all"
          >
            <RefreshCw className="w-6 h-6" />
            RESTART_CORE
          </button>
        </div>
      )}
    </div>
  );
};
