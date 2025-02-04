# WebPilot

An intelligent AI CLI tool prompt to browser automation powered by AI models (OpenAI/DeepSeek).

## Features

- Natural language task processing
- Smart website crawling
- AI-driven browser automation
- CLI interface for easy operation

## Prerequisites

- Node.js v20+
- API key (OpenAI or any other modal via openrouter)
- API key for trivaly ( for researcher )

## Supported platforms

- OpenAI ( <a href="openai.com" >openai</a> )
- Otehrs ( <a href="openrouter.ai">openrouter</a>)

Works great with GhatGPT4-mini, better with reasoning models like o1-mini, o3-mini, r1 (deepseek)

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
API_KEY=your-api-key
PROVIDER_BASE_URL=your-model-api-gateaway-base-url
MODEL_SLUG=your-model-slug
TAVILY_API_KEY=your-tavily-api-key
SEARCH_RESULTS="3"

# dev options
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT="your-lang-smith-url"
LANGSMITH_API_KEY="your-lang-smith-api-key"
LANGSMITH_PROJECT="your-lang-smith-project-name"


SEARCH_RESULTS="3"
SEARCH_DEPTH ="3"

CRAWL_BASE="2"
CRAWL_DEPTH="3"
```

- dev options: are for integrating with langsmith for development purposes.
- `SEARCH_RESULTS` : Will determine the number of results per search query.
- `SEARCH_DEPTH` : Will determine the number of research based on the result of search query, e.g. if research result is 1, dpeth is 2:
  - A : search results 1.
  - B: formulate query and research the search results from A.
  - C: forumulate search query from B results and research the search results from B.
  - Report research from A, B, C.

## Usage

```bash
npm run start
```

### Basic Commands

Inside the chat interface you can do three commands :

1. `/exit` : exit the cli tool.
2. `/research`: start new research chat inside any other chat.
3. `/crawl`: start new crawl chat inside any other chat.
4. `/browse`: start new browse chat inside any other chat.

## Contributing

1. Fork the repository
2. Create feature branch
3. Submit PR with detailed description

## License

MIT License ( Ahmed Rakan )
