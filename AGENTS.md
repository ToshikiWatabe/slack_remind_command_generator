# エージェント向けメモ

このリポジトリは、Slack の `/remind` コマンドを組み立てる静的 Web アプリです。

- 要件: `docs/plans/2026-09-03-001-feat-slack-remind-command-generator-plan.md`
- ルール: `.cursor/rules/`
- Slack 構文: `.cursor/skills/slack-remind-syntax/SKILL.md`
- エディタ: `.vscode/settings.json`（タブ幅 2、LF）。所有者のグローバルな Cursor 設定は変えない。

バックエンド、Slack API、ログイン、履歴保存は、要件が変わらない限り追加しない。

作業言語は日本語（`.cursor/rules/language.mdc`）。
