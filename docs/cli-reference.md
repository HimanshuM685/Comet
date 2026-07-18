# CLI Reference

## Commands

### `comet` (default)
Generate AI-powered commit messages.

| Flag | Description |
|------|-------------|
| `-p, --push` | Push after committing |
| `-d, --dry-run` | Show suggestions only |
| `--provider <p>` | Override AI provider |
| `--model <m>` | Override AI model |
| `-n, --count <n>` | Number of suggestions (default: 3) |
| `-m, --message <msg>` | Skip selection, use this message |

### `comet review`
AI-powered code review of staged changes.

### `comet explain`
Explain staged changes in plain English.

### `comet config`
Interactive configuration management.

### `comet history`
View commit history.

| Flag | Description |
|------|-------------|
| `-s, --search <q>` | Search history |
| `--clear` | Clear all history |

## Configuration

Stored in `~/.comet/config.json`:

```json
{
  "provider": "gemini",
  "model": "gemini-2.5-flash",
  "emoji": true,
  "autoCommit": false,
  "theme": "dark",
  "maxLength": 60,
  "language": "en"
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key |
| `OPENAI_API_KEY` | OpenAI API key |
| `AI_PROVIDER` | Override default provider |
