---
name: slack-remind-syntax
description: Slack /remind English command syntax for this generator. Use when implementing or changing command assembly, when-modes, quoting, or destination formatting.
---

# Slack /remind syntax

Generate one line the user pastes into Slack. Verify against current Slack help if a cadence is uncertain. Do not emit unsupported phrases.

## Shape

```text
/remind [who] [what] [when]
```

Common English form for a self reminder:

```text
/remind me to [what] [when]
```

Who:

- Self: `me`
- Channel: `#channel-name` (no spaces)
- User: `@username` (workspace display name / handle the user typed)

What:

- Prefer a single argument. If the message has spaces or would split parsing, wrap it in double quotes.
- Body may contain Japanese. Keep `to` when using the `me to` form.

When (v1 modes — use a Slack-accepted English phrase):

| App mode | Typical Slack phrase |
|---|---|
| One-shot | `on March 15 at 5:00pm` or `at 5:00pm` (same day) |
| Every day | `every day at 9:00am` |
| Every weekday | `every weekday at 9:00am` |
| Every week | `every Friday at 5:00pm` |
| Every other week | `every other Friday at 5:00pm` |
| Every month | Check Slack help before shipping. If Slack has no stable monthly form, hide the mode rather than guessing. |

Times: 12-hour `9:00am` / `5:00pm` is the usual documented form. Do not append timezone IDs; Slack uses the person who runs `/remind`.

## Do not generate

- Natural-language Japanese time phrases in the command shell (`毎週金曜` as the when-clause)
- Recurrence Slack does not document
- Multiple commands, or API calls that create reminders
