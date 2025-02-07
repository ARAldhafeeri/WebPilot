# WebPilot

An multi-agent prompt to browser automation , research or crawling the web.

## Features

- Natural language task processing
- Smart website crawling
- AI-driven browser automation

## Prerequisites

- Node.js v20+
- API key (OpenAI)
- API key for trivaly ( for researcher )

## Supported platforms

- OpenAI ( <a href="openai.com" >openai</a> )

Works great with GhatGPT4-mini, better with reasoning models like o1-mini, o3-mini

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


SEARCH_DEPTH =basic
SEARCH_RESULTS=2
```

- dev options: are for integrating with langsmith for development purposes.
- `SEARCH_RESULTS` : Will determine the number of results per search query.
- `SEARCH_DEPTH` : basic or deep

Note: researcher may get stuck in asking clearifying questions, you can always ask him to report the research.

## Usage

```bash
git clone https://github.com/araldhafeeri/webpilot
cd webpilot
npm install
npx playwright install chromium
```

```bash
npm run start
```

then you can enter a thread by typing ( /research or /crawl or /browse) then enter, you can switch thread at any time.

## Contributing

Contribution clossed.

## License

MIT License ( Ahmed Rakan )
