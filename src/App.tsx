import { useState, useCallback } from 'react';
import type { GameScreen as GameScreenType, GameResult } from './types/game';
import { useHighScore } from './hooks/useHighScore';
import { TitleScreen } from './components/TitleScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';

function App() {
  const [screen, setScreen] = useState<GameScreenType>('title');
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const { highScore, updateHighScore } = useHighScore();

  const handleGameEnd = useCallback((result: GameResult) => {
    setLastResult(result);
    const isNew = result.score > highScore;
    setIsNewHighScore(isNew);
    updateHighScore(result.score);
    setScreen('result');
  }, [highScore, updateHighScore]);

  const startGame = useCallback(() => {
    setGameKey(k => k + 1);
    setScreen('game');
  }, []);

  const handleBackToTitle = useCallback(() => {
    setScreen('title');
  }, []);

  switch (screen) {
    case 'title':
      return <TitleScreen highScore={highScore} onStart={startGame} />;
    case 'game':
      return <GameScreen key={gameKey} onGameEnd={handleGameEnd} onCancel={handleBackToTitle} />;
    case 'result':
      return (
        <ResultScreen
          result={lastResult!}
          isNewHighScore={isNewHighScore}
          onRetry={startGame}
          onBackToTitle={handleBackToTitle}
        />
      );
  }
}

export default App;
