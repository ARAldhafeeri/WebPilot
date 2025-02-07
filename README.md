# WebPilot

An multi-agent prompt to browser automation , research or crawling the web.
## Demo

<a href="https://www.youtube.com/embed/iS45GgGmSZA?si=P_QXYnswkKbRJ5qI"> Demo video </a>
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
- Ollama ( llama3.1)

### Use the tool for free:

note the only thing work well with llama3.1 is the researcher and crawler, the browser, minimal model is chatgpt-4-mini.

1.download ollama 2. run

```
ollama pull llama3.1
```

3. get api key

set env variables like this :

```
API_KEY="ollama"
MODEL_SLUG="llama3.1"
PROVIDER_BASE_URL=http://localhost:11434/v1
```

npm start, and enjoy !

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
