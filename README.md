# WebPilot

An intelligent AI CLI tool prompt to browser automation powered by AI models (OpenAI/DeepSeek).

## Features

- Natural language task processing
- Smart website crawling
- AI-driven action generation
- CLI interface for easy operation
- Session memory and context preservation
- Cross-platform support

## Prerequisites

- Node.js v20+
- AI API key (OpenAI or DeepSeek)

## Supported platforms

- OpenAI
- Deepseek ( coming soon)
- Ollama ( coming soon )

## Installation

```bash
git clone https://github.com/araldhafeeri/webpilot
cd webpilot
npm install
npx playwright install chromium
```

## Configuration

1. Copy `.env.example` to `.env`
2. Add your API keys:

```env
OPENAI_API_KEY=your_key_here
DEEPSEEK_API_KEY=your_key_here
DEFAULT_AI_PROVIDER=openai
```

## Usage

```bash
npm run start -- <command> [options]
```

### Basic Commands

```bash
# Execute a simple task
npm run start -- execute "Book a 7pm reservation for 2 at Best Italian in NYC"

# Crawl website with objective
npm run start -- crawl --url https://example.com --objective "Find contact information"

# Interactive chat mode
npm run start -- chat
```

### Command Options

```
Options:
  -u, --url <url>         Starting URL for the task
  -o, --objective <text>  Task objective description
  -v, --verbose           Show detailed execution logs
  --headless              Run browser in headless mode
  --model <name>          Specify AI model (default: gpt-4)
  --output <format>       Set output format (json/text/csv)
```

## Examples

## Security Considerations

1. Always keep API keys in `.env` file, ignore in .gitignore
2. Use `--headless` mode for server environments
3. Review generated actions before execution
4. Limit access to sensitive browsing sessions

## Development

```bash
# Run in development mode
npm run dev -- execute "Your task here"

# Run tests
npm test

# Build production bundle
npm run build
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Submit PR with detailed description

## License

MIT License ( Ahmed Rakan )

```

```
