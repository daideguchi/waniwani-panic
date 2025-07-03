import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Crocodile from '../components/Crocodile';
import {
  GameState,
  Player,
  createInitialGameState,
  getNextPlayerIndex,
  getActivePlayerCount,
  determineWinner,
  getRandomTrapTooth,
  createInitialTeeth,
  playSoundOptimized,
} from '../utils/game';

export default function Home() {
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showSetup, setShowSetup] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // ゲーム開始
  const startGame = useCallback((numPlayers: number) => {
    if (soundEnabled) {
      playSoundOptimized('start');
    }
    const initialState = createInitialGameState(numPlayers);
    setGameState(initialState);
    setShowSetup(false);
  }, [soundEnabled]);

  // 歯をクリックした時の処理
  const handleToothClick = useCallback((toothId: number) => {
    if (!gameState || gameState.gamePhase !== 'playing') return;

    // クリック音を再生
    if (soundEnabled) {
      playSoundOptimized('click');
    }

    // 歯を押された状態に更新
    const updatedTeeth = gameState.teeth.map(tooth =>
      tooth.id === toothId ? { ...tooth, isPressed: true } : tooth
    );

    // トラップの歯かどうかチェック
    const isTrapped = toothId === gameState.trapToothId;

    if (isTrapped) {
      // 当たり！プレイヤーを脱落させる
      if (soundEnabled) {
        playSoundOptimized('chomp');
      }
      
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      const updatedPlayers = gameState.players.map(player =>
        player.id === currentPlayer.id ? { ...player, isEliminated: true } : player
      );

      const updatedEliminatedPlayers = [...gameState.eliminatedPlayers, currentPlayer];
      const winner = determineWinner(updatedPlayers);

      if (winner) {
        // ゲーム終了
        if (soundEnabled) {
          setTimeout(() => {
            playSoundOptimized('winner');
          }, 1000);
        }
        
        setGameState(prevState => ({
          ...prevState!,
          players: updatedPlayers,
          eliminatedPlayers: updatedEliminatedPlayers,
          gamePhase: 'gameOver',
          winner,
          teeth: updatedTeeth,
          isMouthClosed: true,
        }));
      } else {
        // 次のラウンドの準備
        const nextPlayerIndex = getNextPlayerIndex(gameState.currentPlayerIndex, updatedPlayers);
        const newTrapTooth = getRandomTrapTooth();
        
        setTimeout(() => {
          setGameState(prevState => ({
            ...prevState!,
            players: updatedPlayers,
            eliminatedPlayers: updatedEliminatedPlayers,
            currentPlayerIndex: nextPlayerIndex,
            teeth: createInitialTeeth(),
            trapToothId: newTrapTooth,
            isMouthClosed: false,
          }));
        }, 2000);

        setGameState(prevState => ({
          ...prevState!,
          players: updatedPlayers,
          eliminatedPlayers: updatedEliminatedPlayers,
          teeth: updatedTeeth,
          isMouthClosed: true,
        }));
      }
    } else {
      // セーフ！次のプレイヤーへ
      const nextPlayerIndex = getNextPlayerIndex(gameState.currentPlayerIndex, gameState.players);
      
      setGameState(prevState => ({
        ...prevState!,
        teeth: updatedTeeth,
        currentPlayerIndex: nextPlayerIndex,
      }));
    }
  }, [gameState, soundEnabled]);

  // 新しいゲームを開始
  const resetGame = useCallback(() => {
    setGameState(null);
    setShowSetup(true);
  }, []);

  // 口を開く処理
  useEffect(() => {
    if (gameState && gameState.isMouthClosed) {
      const timer = setTimeout(() => {
        setGameState(prevState => ({
          ...prevState!,
          isMouthClosed: false,
        }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState?.isMouthClosed]);

  if (showSetup) {
    return (
      <div className="setup-container">
        <Head>
          <title>ワニワニパニック（イタイワニー）</title>
          <meta name="description" content="ワニワニパニック - 黒ひげ危機一髪型ゲーム" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="setup-content">
          <h1 className="game-title">ワニワニパニック</h1>
          <h2 className="game-subtitle">（イタイワニー）</h2>
          
          <div className="setup-section">
            <h3>プレイヤー数を選択</h3>
            <div className="player-buttons">
              {[2, 3, 4].map(count => (
                <button
                  key={count}
                  className={`player-button ${playerCount === count ? 'selected' : ''}`}
                  onClick={() => setPlayerCount(count)}
                >
                  {count}人
                </button>
              ))}
            </div>
            
            <button className="start-button" onClick={() => startGame(playerCount)}>
              ゲーム開始
            </button>
          </div>

          <div className="rules-section">
            <h3>ルール</h3>
            <ul>
              <li>プレイヤーは順番に歯を1本ずつ押します</li>
              <li>「当たり」の歯を押すとワニに噛まれて脱落！</li>
              <li>最後に残った1人が勝者です</li>
              <li>対象年齢：4歳以上</li>
            </ul>
          </div>
        </div>

        <style jsx>{`
          .setup-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            font-family: 'Arial', sans-serif;
          }

          .setup-content {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 500px;
            width: 100%;
          }

          .game-title {
            font-size: 2.5rem;
            color: #4a7c59;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          }

          .game-subtitle {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 30px;
          }

          .setup-section {
            margin-bottom: 30px;
          }

          .setup-section h3 {
            color: #333;
            margin-bottom: 20px;
          }

          .player-buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 35px;
            flex-wrap: wrap;
          }

          .player-button {
            padding: 20px 35px;
            border: 4px solid #10b981;
            background: linear-gradient(145deg, #ffffff, #f9fafb);
            color: #10b981;
            border-radius: 15px;
            font-size: 1.3rem;
            font-weight: 900;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 
              0 6px 12px rgba(16, 185, 129, 0.2),
              inset 0 2px 4px rgba(255, 255, 255, 0.8);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            min-width: 120px;
          }

          .player-button:hover {
            background: linear-gradient(145deg, #ecfdf5, #d1fae5);
            transform: translateY(-4px) scale(1.05);
            box-shadow: 
              0 12px 24px rgba(16, 185, 129, 0.3),
              inset 0 2px 4px rgba(255, 255, 255, 0.8);
          }

          .player-button.selected {
            background: linear-gradient(145deg, #10b981, #059669);
            color: white;
            border-color: #047857;
            transform: scale(1.1);
            box-shadow: 
              0 8px 16px rgba(16, 185, 129, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.2);
          }

          .start-button {
            padding: 20px 50px;
            background: linear-gradient(145deg, #dc2626, #b91c1c);
            color: white;
            border: 4px solid #991b1b;
            border-radius: 15px;
            font-size: 1.5rem;
            font-weight: 900;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 
              0 8px 16px rgba(220, 38, 38, 0.3),
              inset 0 2px 4px rgba(255, 255, 255, 0.2);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            animation: start-button-pulse 2s infinite;
          }

          @keyframes start-button-pulse {
            0%, 100% { 
              transform: scale(1);
              box-shadow: 
                0 8px 16px rgba(220, 38, 38, 0.3),
                inset 0 2px 4px rgba(255, 255, 255, 0.2);
            }
            50% { 
              transform: scale(1.05);
              box-shadow: 
                0 12px 24px rgba(220, 38, 38, 0.4),
                inset 0 2px 4px rgba(255, 255, 255, 0.2);
            }
          }

          .start-button:hover {
            transform: translateY(-4px) scale(1.1);
            box-shadow: 
              0 15px 30px rgba(220, 38, 38, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.2);
            animation: none;
          }

          .rules-section {
            text-align: left;
          }

          .rules-section h3 {
            color: #333;
            text-align: center;
            margin-bottom: 15px;
          }

          .rules-section ul {
            color: #666;
            line-height: 1.6;
          }

          .rules-section li {
            margin-bottom: 8px;
          }

          @media (max-width: 768px) {
            .setup-content {
              padding: 30px 20px;
            }
            
            .game-title {
              font-size: 2rem;
            }
            
            .player-buttons {
              flex-direction: column;
              align-items: center;
            }
            
            .player-button {
              width: 150px;
            }
          }
        `}</style>
      </div>
    );
  }

  if (!gameState) return null;

  return (
    <div className="game-container">
      <Head>
        <title>ワニワニパニック（イタイワニー）</title>
        <meta name="description" content="ワニワニパニック - 黒ひげ危機一髪型ゲーム" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="game-header">
        <div className="header-top">
          <h1 className="game-title">ワニワニパニック</h1>
          <button 
            className="sound-toggle"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? '効果音OFF' : '効果音ON'}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
        
        <div className="game-info">
          <div className="current-player">
            <span className="label">現在のプレイヤー:</span>
            <span className="player-name">
              {gameState.players[gameState.currentPlayerIndex]?.name || ''}
            </span>
          </div>
          
          <div className="remaining-teeth">
            <span className="label">残り歯:</span>
            <span className="teeth-count">
              {gameState.teeth.filter(tooth => !tooth.isPressed).length}本
            </span>
          </div>
        </div>
      </div>

      <div className="game-main">
        <Crocodile
          teeth={gameState.teeth}
          isMouthClosed={gameState.isMouthClosed}
          onToothClick={handleToothClick}
          isGameActive={gameState.gamePhase === 'playing'}
        />
      </div>

      <div className="game-footer">
        <div className="eliminated-players">
          <h3>脱落済みプレイヤー</h3>
          <div className="eliminated-list">
            {gameState.eliminatedPlayers.length > 0 ? (
              gameState.eliminatedPlayers.map(player => (
                <span key={player.id} className="eliminated-player">
                  {player.name}
                </span>
              ))
            ) : (
              <span className="no-eliminated">まだ脱落者はいません</span>
            )}
          </div>
        </div>

        {gameState.gamePhase === 'gameOver' && gameState.winner && (
          <div className="winner-section">
            <h2 className="winner-title">🎉 WINNER 🎉</h2>
            <div className="winner-name">{gameState.winner.name}</div>
            <button className="restart-button" onClick={resetGame}>
              もう一度遊ぶ
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .game-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          flex-direction: column;
          font-family: 'Arial', sans-serif;
        }

        .game-header {
          background: rgba(255, 255, 255, 0.95);
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .header-top {
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          margin-bottom: 15px;
        }

        .sound-toggle {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background: linear-gradient(145deg, #f3f4f6, #e5e7eb);
          border: 2px solid #d1d5db;
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .sound-toggle:hover {
          background: linear-gradient(145deg, #e5e7eb, #d1d5db);
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .sound-toggle:active {
          transform: translateY(-50%) scale(0.95);
        }

        .game-title {
          font-size: 2rem;
          color: #4a7c59;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .game-info {
          display: flex;
          justify-content: center;
          gap: 30px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .current-player, .remaining-teeth {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px 25px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .label {
          font-weight: 600;
          color: #374151;
          font-size: 1rem;
        }

        .player-name {
          color: #ffffff;
          font-size: 1.4rem;
          font-weight: 900;
          padding: 10px 20px;
          background: linear-gradient(145deg, #10b981, #059669);
          border-radius: 25px;
          border: 3px solid #047857;
          box-shadow: 
            0 6px 12px rgba(16, 185, 129, 0.3),
            inset 0 2px 4px rgba(255, 255, 255, 0.2);
          animation: player-glow 2s infinite ease-in-out;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        @keyframes player-glow {
          0%, 100% { 
            box-shadow: 
              0 6px 12px rgba(16, 185, 129, 0.3),
              inset 0 2px 4px rgba(255, 255, 255, 0.2);
          }
          50% { 
            box-shadow: 
              0 8px 16px rgba(16, 185, 129, 0.5),
              inset 0 2px 4px rgba(255, 255, 255, 0.2);
          }
        }

        .teeth-count {
          color: #dc2626;
          font-size: 1.4rem;
          font-weight: 900;
          padding: 8px 16px;
          background: linear-gradient(145deg, #fef3c7, #fed7aa);
          border: 2px solid #f59e0b;
          border-radius: 20px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .game-main {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .game-footer {
          background: rgba(255, 255, 255, 0.95);
          padding: 20px;
          text-align: center;
        }

        .eliminated-players h3 {
          color: #333;
          margin-bottom: 10px;
        }

        .eliminated-list {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
        }

        .eliminated-player {
          padding: 5px 15px;
          background: #f8d7da;
          color: #721c24;
          border-radius: 20px;
          border: 1px solid #f5c6cb;
        }

        .no-eliminated {
          color: #666;
          font-style: italic;
        }

        .winner-section {
          margin-top: 20px;
          padding: 20px;
          background: linear-gradient(145deg, #fff3cd, #ffeaa7);
          border-radius: 15px;
          border: 3px solid #ffc107;
        }

        .winner-title {
          font-size: 2rem;
          color: #856404;
          margin-bottom: 15px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }

        .winner-name {
          font-size: 1.5rem;
          font-weight: bold;
          color: #4a7c59;
          margin-bottom: 20px;
        }

        .restart-button {
          padding: 12px 30px;
          background: linear-gradient(145deg, #4a7c59, #2d5016);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .restart-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 768px) {
          .game-info {
            flex-direction: column;
            gap: 15px;
          }
          
          .game-title {
            font-size: 1.5rem;
          }
          
          .eliminated-list {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
} 