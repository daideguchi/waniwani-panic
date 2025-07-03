# 🐊 ワニワニパニック（イタイワニー）ゲーム 🐊

![ワニワニパニック](https://img.shields.io/badge/Game-ワニワニパニック-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8.svg)

Next.js + TypeScript + Tailwind CSS で作成された、可愛らしいワニワニパニック風のゲームです。

## 🎮 ゲーム概要

黒ひげ危機一髪のようなスリル満点のゲーム！順番に歯を押して、ワニに噛まれないよう注意しよう！

### ルール
- 🎯 プレイヤー数：2〜4人
- 🦷 13本の歯を順番にクリック
- ⚠️ 「当たり」の歯を押すとワニに噛まれて脱落
- 🏆 最後に残った1人が勝者
- 👶 対象年齢：4歳以上

## ✨ 特徴

### 🎨 ビジュアル
- **可愛らしいワニのデザイン**：鮮やかな緑色で親しみやすい
- **瞬きアニメーション**：生き生きとした表情
- **レスポンシブ対応**：PC・タブレット・スマホで快適プレイ

### 🔊 効果音システム
- **4種類の効果音**：クリック、ガブッ、ファンファーレ、勝利音
- **Web Audio API**：音声ファイルなしでも高品質な効果音を自動生成
- **ON/OFF切り替え**：右上のボタンで簡単切り替え

### 🎪 ゲーム体験
- **スムーズアニメーション**：CSS transforms による滑らかな動き
- **ハイライト効果**：ホバー時の光るエフェクト
- **直感的UI**：分かりやすいボタンとレイアウト

## 🚀 デモ

🌐 **[オンラインプレイはこちら](https://daideguchi.github.io/waniwani-panic/)**

## 🛠️ 技術スタック

- **⚛️ Next.js 14**: React フレームワーク
- **📘 TypeScript**: 型安全性
- **🎨 Tailwind CSS**: スタイリング
- **🎵 Web Audio API**: 効果音システム
- **🚀 GitHub Pages**: デプロイ

## 📋 セットアップ

### 1. クローン
```bash
git clone https://github.com/daideguchi/waniwani-panic.git
cd waniwani-panic
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 開発サーバーの起動
```bash
npm run dev
```

### 4. ブラウザでアクセス
```
http://localhost:3000
```

## 🏗️ ビルド

### 本番用ビルド
```bash
npm run build
```

### ローカルでプレビュー
```bash
npm start
```

## 🎵 効果音のカスタマイズ

`public/sounds/` フォルダに以下のMP3ファイルを配置できます：

| ファイル名 | 用途 | 説明 |
|---|---|---|
| `click.mp3` | 歯クリック | 軽快なクリック音 |
| `chomp.mp3` | ワニ噛み | ガブッという迫力音 |
| `start.mp3` | ゲーム開始 | ファンファーレ風 |
| `winner.mp3` | 勝利 | キラキラ勝利音 |

> 💡 音声ファイルがない場合も、Web Audio APIによる高品質な代替音声が自動再生されます！

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します！

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 ライセンス

MIT License

## 🎉 楽しんでください！

家族や友達と一緒に楽しいワニワニパニックの時間をお過ごしください！

---

Made with ❤️ using Next.js 