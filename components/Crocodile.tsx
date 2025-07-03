import React from 'react';
import { ToothState } from '../utils/game';

interface CrocodileProps {
  teeth: ToothState[];
  isMouthClosed: boolean;
  onToothClick: (toothId: number) => void;
  isGameActive: boolean;
}

const Crocodile: React.FC<CrocodileProps> = ({
  teeth,
  isMouthClosed,
  onToothClick,
  isGameActive
}) => {
  return (
    <div className="crocodile-container">
      {/* ワニ本体 */}
      <div className={`crocodile-body ${isMouthClosed ? 'mouth-closed' : 'mouth-open'}`}>
        {/* 上顎 */}
        <div className="upper-jaw">
          <div className="crocodile-eye left-eye">
            <div className="eye-pupil"></div>
          </div>
          <div className="crocodile-eye right-eye">
            <div className="eye-pupil"></div>
          </div>
          
          <div className="crocodile-nostril left-nostril"></div>
          <div className="crocodile-nostril right-nostril"></div>
        </div>

        {/* 口の中（歯が配置される場所） */}
        <div className="mouth-area">
          {/* 舌 */}
          <div className="tongue"></div>
          
          {/* 歯ボタン - 口の中に適切に配置 */}
          <div className="teeth-container">
            {teeth.map((tooth, index) => {
              // 13本の歯を口の幅に合わせて配置
              const containerWidth = 320; // コンテナ幅の約53%程度
              const spacing = containerWidth / 12; // 12個の間隔で13個配置
              const x = (index * spacing) - (containerWidth / 2) + (spacing / 2);
              
              return (
                <button
                  key={tooth.id}
                  className={`tooth-button ${tooth.isPressed ? 'tooth-pressed' : 'tooth-active'}`}
                  style={{
                    position: 'absolute',
                    left: `calc(50% + ${x}px)`,
                    top: '75%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => onToothClick(tooth.id)}
                  disabled={tooth.isPressed || !isGameActive}
                  title={`歯 ${tooth.id}`}
                >
                  {tooth.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* 下顎 */}
        <div className="lower-jaw">
          <div className="jaw-texture"></div>
        </div>
      </div>

      <style jsx>{`
        .crocodile-container {
          position: relative;
          width: 100%;
          max-width: 600px;
          height: 400px;
          margin: 0 auto;
          user-select: none;
          perspective: 1000px;
        }

        .crocodile-body {
          position: relative;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(ellipse at 30% 20%, rgba(255, 255, 255, 0.3), transparent 40%),
            radial-gradient(ellipse at 70% 20%, rgba(255, 255, 255, 0.3), transparent 40%),
            linear-gradient(135deg, #4ade80, #22c55e, #16a34a);
          border-radius: 80px 80px 50px 50px;
          border: 4px solid #15803d;
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            inset 0 8px 16px rgba(255, 255, 255, 0.25),
            inset 0 -8px 16px rgba(0, 0, 0, 0.2),
            0 12px 24px rgba(0, 0, 0, 0.15),
            0 0 0 2px rgba(74, 222, 128, 0.3);
          transform-style: preserve-3d;
        }

        .mouth-open {
          height: 300px;
        }

        .mouth-closed {
          height: 80px;
          border-radius: 50% 50% 50% 50%;
          animation: mouthClosing 0.3s ease-in-out;
        }

        @keyframes mouthClosing {
          0% { height: 300px; }
          50% { height: 150px; }
          100% { height: 80px; }
        }

        .upper-jaw {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 35%;
          background: linear-gradient(145deg, #4ade80, #22c55e, #16a34a);
          border-radius: 60px 60px 0 0;
          z-index: 2;
        }

        .crocodile-eye {
          position: absolute;
          width: 50px;
          height: 50px;
          background: 
            radial-gradient(circle at 35% 25%, #ffffff, #f8f9fa, #e9ecef);
          border-radius: 50%;
          border: 3px solid #15803d;
          top: 10px;
          box-shadow: 
            inset 0 4px 8px rgba(255, 255, 255, 0.9),
            0 4px 12px rgba(0, 0, 0, 0.2);
          animation: eye-blink 6s infinite;
          z-index: 10;
        }

        @keyframes eye-blink {
          0%, 95%, 100% { transform: scaleY(1); }
          97% { transform: scaleY(0.1); }
        }

        .left-eye {
          left: 25%;
        }

        .right-eye {
          right: 25%;
        }

        .eye-pupil {
          position: absolute;
          width: 18px;
          height: 18px;
          background: 
            radial-gradient(circle at 30% 30%, #374151, #111827, #000000);
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .eye-pupil::after {
          content: '';
          position: absolute;
          top: 20%;
          left: 25%;
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
        }

        .crocodile-nostril {
          position: absolute;
          width: 8px;
          height: 6px;
          background: #15803d;
          border-radius: 50%;
          top: 65px;
          box-shadow: 
            inset 0 1px 2px rgba(0, 0, 0, 0.6);
          z-index: 9;
        }

        .left-nostril {
          left: 42%;
        }

        .right-nostril {
          right: 42%;
        }

        .mouth-area {
          position: absolute;
          top: 30%;
          left: 8%;
          right: 8%;
          bottom: 20%;
          background: 
            radial-gradient(ellipse at center, #ef4444, #dc2626, #b91c1c);
          border-radius: 20px 20px 30px 30px;
          overflow: visible;
          z-index: 5;
          box-shadow: 
            inset 0 4px 8px rgba(0, 0, 0, 0.3),
            0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .mouth-closed .mouth-area {
          opacity: 0;
          transform: scaleY(0.1);
          transition: all 0.5s ease;
        }

        .mouth-open .mouth-area {
          opacity: 1;
          transform: scaleY(1);
        }

        .tongue {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 25px;
          background: linear-gradient(145deg, #f87171, #ef4444, #dc2626);
          border-radius: 50px;
          box-shadow: 
            inset 0 2px 4px rgba(0, 0, 0, 0.2);
          z-index: 4;
        }

        .teeth-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .tooth-button {
          width: 36px;
          height: 36px;
          background: 
            radial-gradient(ellipse at 30% 30%, #ffffff, #f8f9fa),
            linear-gradient(145deg, #ffffff, #f1f5f9);
          border: 2px solid #d1d5db;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
          color: #374151;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.1),
            inset 0 1px 2px rgba(255, 255, 255, 0.9);
          z-index: 15;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        }

        .tooth-button:hover:not(:disabled) {
          background: linear-gradient(145deg, #fef3c7, #fed7aa, #fdba74);
          border-color: #f59e0b;
          transform: translate(-50%, -50%) scale(1.15) translateY(-5px);
          box-shadow: 
            0 12px 24px rgba(245, 158, 11, 0.3),
            inset 0 2px 4px rgba(255, 255, 255, 0.9),
            0 0 0 3px rgba(245, 158, 11, 0.4);
          animation: tooth-pulse 1s infinite;
        }

        .tooth-button:active:not(:disabled) {
          transform: translate(-50%, -50%) scale(1.1);
          animation: tooth-click 0.1s ease;
        }

        @keyframes tooth-click {
          0% { transform: translate(-50%, -50%) scale(1.15); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
          100% { transform: translate(-50%, -50%) scale(1.1); }
        }

        @keyframes tooth-pulse {
          0%, 100% { box-shadow: 
            0 12px 24px rgba(245, 158, 11, 0.3),
            inset 0 2px 4px rgba(255, 255, 255, 0.9),
            0 0 0 3px rgba(245, 158, 11, 0.4); }
          50% { box-shadow: 
            0 12px 24px rgba(245, 158, 11, 0.4),
            inset 0 2px 4px rgba(255, 255, 255, 0.9),
            0 0 0 6px rgba(245, 158, 11, 0.6); }
        }

        .tooth-button:active:not(:disabled) {
          transform: translate(-50%, -50%) scale(0.95);
        }

        .tooth-pressed {
          background: linear-gradient(145deg, #ef4444, #dc2626, #b91c1c);
          border-color: #991b1b;
          color: #ffffff;
          cursor: not-allowed;
          transform: translate(-50%, -50%) scale(0.85) rotateX(20deg);
          box-shadow: 
            inset 0 4px 8px rgba(0, 0, 0, 0.4),
            0 2px 4px rgba(0, 0, 0, 0.3);
          animation: none;
        }

        .tooth-active {
          animation: tooth-glow 2s ease-in-out infinite;
        }

        @keyframes tooth-glow {
          0%, 100% { 
            box-shadow: 
              0 3px 6px rgba(0, 0, 0, 0.3),
              inset 0 1px 2px rgba(255, 255, 255, 0.8);
          }
          50% { 
            box-shadow: 
              0 3px 6px rgba(0, 0, 0, 0.3),
              inset 0 1px 2px rgba(255, 255, 255, 0.8),
              0 0 10px rgba(255, 215, 0, 0.5);
          }
        }

        .lower-jaw {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 35%;
          background: linear-gradient(145deg, #22c55e, #16a34a, #15803d);
          border-radius: 0 0 60px 60px;
          z-index: 2;
        }

        .jaw-texture {
          width: 100%;
          height: 100%;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 3px,
            rgba(0, 0, 0, 0.08) 3px,
            rgba(0, 0, 0, 0.08) 6px
          );
          border-radius: 0 0 60px 60px;
        }

        /* レスポンシブ対応 */
        @media (max-width: 768px) {
          .crocodile-container {
            max-width: 500px;
            height: 350px;
          }
          
          .tooth-button {
            width: 42px;
            height: 42px;
            font-size: 14px;
          }

          .crocodile-eye {
            width: 35px;
            height: 35px;
          }
        }

        @media (max-width: 480px) {
          .crocodile-container {
            max-width: 400px;
            height: 300px;
          }
          
          .tooth-button {
            width: 35px;
            height: 35px;
            font-size: 12px;
          }

          .crocodile-eye {
            width: 30px;
            height: 30px;
          }

          .eye-pupil {
            width: 14px;
            height: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default Crocodile; 