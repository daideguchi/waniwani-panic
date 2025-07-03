// ワニワニパニック（イタイワニー）ゲームロジック

export interface Player {
  id: number;
  name: string;
  isEliminated: boolean;
}

export interface ToothState {
  id: number;
  isPressed: boolean;
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  teeth: ToothState[];
  trapToothId: number;
  gamePhase: 'setup' | 'playing' | 'gameOver';
  winner: Player | null;
  eliminatedPlayers: Player[];
  isMouthClosed: boolean;
}

// プレイヤー名の生成
export const generatePlayerNames = (playerCount: number): string[] => {
  const names = ['P1', 'P2', 'P3', 'P4'];
  return names.slice(0, playerCount);
};

// 歯の初期状態を生成（13本）
export const createInitialTeeth = (): ToothState[] => {
  return Array.from({ length: 13 }, (_, index) => ({
    id: index + 1,
    isPressed: false,
  }));
};

// プレイヤーの初期化
export const createPlayers = (playerCount: number): Player[] => {
  const playerNames = generatePlayerNames(playerCount);
  return playerNames.map((name, index) => ({
    id: index + 1,
    name,
    isEliminated: false,
  }));
};

// ランダムなトラップ歯を設定
export const getRandomTrapTooth = (): number => {
  return Math.floor(Math.random() * 13) + 1;
};

// プレイヤー順をシャッフル
export const shufflePlayers = (players: Player[]): Player[] => {
  const shuffled = [...players];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// 次のプレイヤーのインデックスを取得
export const getNextPlayerIndex = (
  currentIndex: number,
  players: Player[]
): number => {
  const activePlayers = players.filter(p => !p.isEliminated);
  if (activePlayers.length <= 1) return currentIndex;

  let nextIndex = (currentIndex + 1) % players.length;
  while (players[nextIndex].isEliminated) {
    nextIndex = (nextIndex + 1) % players.length;
  }
  return nextIndex;
};

// 残っているプレイヤー数を取得
export const getActivePlayerCount = (players: Player[]): number => {
  return players.filter(p => !p.isEliminated).length;
};

// 勝者を決定
export const determineWinner = (players: Player[]): Player | null => {
  const activePlayers = players.filter(p => !p.isEliminated);
  return activePlayers.length === 1 ? activePlayers[0] : null;
};

// ゲーム初期状態
export const createInitialGameState = (playerCount: number): GameState => {
  const players = shufflePlayers(createPlayers(playerCount));
  return {
    players,
    currentPlayerIndex: 0,
    teeth: createInitialTeeth(),
    trapToothId: getRandomTrapTooth(),
    gamePhase: 'playing',
    winner: null,
    eliminatedPlayers: [],
    isMouthClosed: false,
  };
};

// 音声再生関数
export const playSound = (soundType: 'chomp' | 'click' | 'start' | 'winner'): void => {
  try {
    const audio = new Audio(`/sounds/${soundType}.mp3`);
    audio.volume = 0.5;
    audio.play().catch((error) => {
      console.warn('音声再生に失敗しました:', error);
    });
  } catch (error) {
    console.warn('音声ファイルの読み込みに失敗しました:', error);
  }
};

// Web Audio APIを使用したフォールバック音声
export const playFallbackSound = (soundType: 'chomp' | 'click' | 'start' | 'winner'): void => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    switch (soundType) {
      case 'chomp':
        // ガブッという音（より迫力のある音）
        playChompSound(audioContext);
        break;
      case 'click':
        // クリック音（可愛らしい音）
        playClickSound(audioContext);
        break;
      case 'start':
        // ゲーム開始音（ファンファーレ風）
        playStartSound(audioContext);
        break;
      case 'winner':
        // 勝利音（キラキラ効果音）
        playWinnerSound(audioContext);
        break;
    }
  } catch (error) {
    console.warn('Web Audio APIの使用に失敗しました:', error);
  }
};

// ガブッという音の詳細実装
const playChompSound = (audioContext: AudioContext): void => {
  // 低音のノイズでガブッという音を表現
  const oscillator1 = audioContext.createOscillator();
  const oscillator2 = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  
  oscillator1.type = 'sawtooth';
  oscillator2.type = 'square';
  filter.type = 'lowpass';
  filter.frequency.value = 300;
  
  oscillator1.connect(filter);
  oscillator2.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // 周波数をランダムに変化させて噛む音を表現
  oscillator1.frequency.setValueAtTime(150, audioContext.currentTime);
  oscillator1.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.4);
  oscillator2.frequency.setValueAtTime(200, audioContext.currentTime);
  oscillator2.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.4);
  
  gainNode.gain.setValueAtTime(0.6, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
  
  oscillator1.start(audioContext.currentTime);
  oscillator2.start(audioContext.currentTime);
  oscillator1.stop(audioContext.currentTime + 0.4);
  oscillator2.stop(audioContext.currentTime + 0.4);
};

// 可愛らしいクリック音
const playClickSound = (audioContext: AudioContext): void => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sine';
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.05);
  oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
};

// ゲーム開始のファンファーレ
const playStartSound = (audioContext: AudioContext): void => {
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  
  notes.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'triangle';
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const startTime = audioContext.currentTime + (index * 0.15);
    oscillator.frequency.setValueAtTime(freq, startTime);
    gainNode.gain.setValueAtTime(0.4, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
  });
};

// 勝利のキラキラ音
const playWinnerSound = (audioContext: AudioContext): void => {
  // メロディー: ドレミファソラシド
  const melody = [523, 587, 659, 698, 784, 880, 988, 1047];
  
  melody.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    const startTime = audioContext.currentTime + (index * 0.1);
    oscillator.frequency.setValueAtTime(freq, startTime);
    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
  });
  
  // キラキラ効果音を追加
  setTimeout(() => {
    for (let i = 0; i < 5; i++) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      const startTime = audioContext.currentTime + (i * 0.1);
      const freq = 2000 + Math.random() * 1000;
      oscillator.frequency.setValueAtTime(freq, startTime);
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.2);
    }
  }, 800);
};

// 最適化された音声再生関数
export const playSoundOptimized = (soundType: 'chomp' | 'click' | 'start' | 'winner'): void => {
  // フォールバック音声を使用
  playFallbackSound(soundType);
  
  // HTML5 Audioも試行
  setTimeout(() => {
    playSound(soundType);
  }, 10);
}; 