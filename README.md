# Slack /remind コマンド生成

Slack の `/remind` コマンドを、フォーム入力から組み立ててコピーする Web アプリです。

ブラウザだけで動きます。`index.html` を開くか、次でローカル確認できます。

```bash
node remind.test.mjs
python3 -m http.server 8080
```

ブラウザで http://localhost:8080 を開きます。JS を直したあとは、キャッシュが残るのでスーパーリロード（macOS は Cmd+Shift+R）で読み込み直します。

要件は `docs/plans/2026-09-03-001-feat-slack-remind-command-generator-plan.md` にあります。

## 方針（v1）

- ブラウザだけで動く（サーバー・Slack API・ログインなし）
- コマンド構文は英語、本文は日本語可
- 生成結果をコピーして Slack に貼る
- あとから GitHub Pages で静的公開できる形を維持する
