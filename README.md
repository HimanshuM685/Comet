# Comet

AI-powered commit message generator CLI. Reads your staged git changes, understands the context, and generates Conventional Commits messages using Gemini or OpenAI.

## Features

- Generate commit messages from staged diffs
- Interactive selection from multiple suggestions
- Code review of staged changes
- Plain English explanation of changes
- Commit history tracking
- Gemini and OpenAI support
- Conventional Commits format with emoji prefixes

## Install

```bash
npm install -g ai-commit
```

## Quick Start

```bash
# Set your API key
export GEMINI_API_KEY=your_key_here

# Stage changes
git add .

# Generate commit
comet

# Commit and push
comet --push
```

## Commands

| Command | Description |
|---------|-------------|
| `comet` | Generate commit message |
| `comet --push` | Commit and push |
| `comet --dry-run` | Show suggestions only |
| `comet review` | AI code review |
| `comet explain` | Explain changes in plain English |
| `comet config` | Configure settings |
| `comet history` | View commit history |

## Configuration

```bash
comet config
```

Or edit `~/.comet/config.json`:

```json
{
  "provider": "gemini",
  "model": "gemini-2.5-flash",
  "emoji": true,
  "autoCommit": false,
  "theme": "dark"
}
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google Gemini API key |
| `OPENAI_API_KEY` | OpenAI API key |
| `AI_PROVIDER` | Default provider (gemini/openai) |

## Development

```bash
git clone https://github.com/your-username/Comet.git
cd Comet
npm install
npm run dev
```

## License

MIT
