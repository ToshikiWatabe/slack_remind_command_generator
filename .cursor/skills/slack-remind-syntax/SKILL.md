---
name: slack-remind-syntax
description: この生成アプリ向けの Slack /remind（英語構文）。コマンド組み立て、日時モード、引用符、宛先の実装・変更時に使う。
---

# Slack `/remind` の構文

利用者が Slack に貼る1行を生成する。日時の形が不明なら現行の Slack ヘルプを確認する。受け付けられないフレーズは出さない。

## 形

```text
/remind [who] [what] [when]
```

自分宛てでよく使う英語形:

```text
/remind me to [what] [when]
```

宛先:

- 自分: `me`
- チャンネル: `#channel-name`（空白なし）
- ユーザー: `@username`（利用者が入力したハンドル）

本文:

- 引数は1つにまとめる。空白などで Slack が分割しそうなら二重引用符で囲む。
- 本文は日本語でよい。`me to` 形を使うときは `to` を残す。

日時（v1 のモード。Slack が受け付ける英語フレーズを使う）:

| アプリのモード | よく使う Slack フレーズ |
|---|---|
| 一度きり | `on March 15 at 5:00pm` または当日なら `at 5:00pm` |
| 毎日 | `every day at 9:00am` |
| 平日 | `every weekday at 9:00am` |
| 毎週 | `every Friday at 5:00pm` |
| n週間ごと | `every 3 weeks on Monday at 9:30am`（1週間なら `every Monday at 9:30am`） |
| 毎月 | 出荷前に Slack ヘルプを確認する。安定した書き方がなければ、推測せずモードを出さない。 |

時刻は 12 時間表記（`9:00am` / `5:00pm`）が公式で多い。タイムゾーン ID は付けない。Slack は `/remind` を実行した人の設定を使う。

## 生成しないもの

- コマンド側の日本語日時（when 句に `毎週金曜` など）
- Slack が文書化していない繰り返し
- 複数コマンドや、リマインダーを作る API 呼び出し
