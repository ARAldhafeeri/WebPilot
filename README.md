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

---

### **Running DeepSeek R1 on Your Machine**

For optimal results, choose the best model that your hardware can handle:  
➡️ **[MFdoom DeepSeek R1](https://ollama.com/MFDoom/deepseek-r1-tool-calling)**

---

### **Hardware Requirements**

Below is a table outlining the approximate hardware requirements for running different model sizes using **Ollama** and similar inference setups.

| Model Size | VRAM (GPU) Required         | RAM (CPU) Required | Best Inference Method              |
| ---------- | --------------------------- | ------------------ | ---------------------------------- |
| **1.5B**   | **2GB+**                    | **4GB+**           | GPU or CPU                         |
| **7B**     | **10-12GB+**                | **16GB+**          | GPU (Best) / CPU (Possible)        |
| **8B**     | **12GB+**                   | **16-24GB+**       | GPU (Tight) / CPU (Better)         |
| **14B**    | **24GB+**                   | **32GB+**          | CPU (4-bit) / GPU (A100+)          |
| **32B**    | **48GB+**                   | **64GB+**          | CPU (Not ideal) / GPU (H100)       |
| **70B**    | **80GB+**                   | **128GB+**         | High-end GPU (A100 80GB)           |
| **671B**   | **Multi-GPU (TBs of VRAM)** | **1TB+ RAM**       | Not feasible for consumer hardware |

---

### **Setup Instructions**

#### **1. Get a Tavily API Key**

Sign up and generate your API key here:  
➡️ **[Tavily API Key](https://app.tavily.com/home)**

#### **2. Install and Run Ollama**

Download and install Ollama, then pull the model:

```sh
ollama pull MFDoom/deepseek-r1-tool-calling:14B
```

#### **3. Set Environment Variables**

Configure your environment with the necessary keys and settings:

```sh
API_KEY="ollama"
MODEL_SLUG="MFDoom/deepseek-r1-tool-calling:14B"
PROVIDER_BASE_URL="http://localhost:11434/v1"

TAVILY_API_KEY="tvly-xxx"
SEARCH_RESULTS="3"
SEARCH_DEPTH="deep"
```

#### **4. Start the Application**

Run your application with:

```sh
npm start
```

✅ **You're all set! Enjoy running DeepSeek R1 on your machine.** 🚀

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
