# WEB Pilot

**Version:** 1.0  
**Date:** 2025-02-04  
**Author:** Ahmed Rakan

## 1. Introduction

The Next-Generation Research CLI Tool is designed to empower researchers by providing a powerful, flexible, and extensible utilty to automate the browser tasks, crawl the web and perform research from a prompt.

---

## 2. Objectives and Scope

### Objectives

- **Efficiency:** Provide fast access to multiple research data sources from a research query, able to recuersivly search information within the result..
- **Flexibility:** Support a variety of research tasks including data querying, processing, and reporting.
- **User Experience:** Offer a rich and intuitive chat ui/ux.

### Scope

- Integration with database for tasks presistance.
- Integration with local browser both headless for crawling, and headful for browser tasks.
- Output are formated and reported to the user per task.
- Each chat has unique title and thread id.

---

## 3. System Architecture Overview

### 3.1 abstract

The architecture of webpilotai tool is modular, ensuring separation of concerns and ease of maintenance. The tool can perform three main tasks `research`, `crawl` or `browse` :

1. `research` : The tool integrate with <a href="https://tavily.com/">Tavily</a> search engine, the agent will keep requesting the engine for search result until it have enough information to provide the answer. The number of search results is controlled via enviroment variable called `SEARCH_RESULTS`, `SEARCH_DEPTH`.

- `SEARCH_RESULTS` : Will determine the number of results per search query.
- `SEARCH_DEPTH` : basic or deep research.

2. `crawl`: The tool will allow you to crawl websites for specific items. The crawl intensity is determined by the A.I so do not provide lots of links, the A.I will determine the depth of the search on each fetched link, also it will determine how many links to fetch from home page.

1. A: A.I will crawl the content of the two base links.
1. B: A.I will crawl the content of A page links.
1. C: A.I will crawl the content of B page links.
1. Exit and report final answer.

A.I is configured to crawl the following:

1. **Title & Headings** (`<title>`, `<h1>`, `<h2>`)
2. **Body Text** (`<p>`, `<article>`)
3. **Meta Descriptions & Keywords** (`<meta>` tags)
4. **References & Citations** (`<a href>` to research papers, DOIs)

ONLY, we will add more in the future.

4. `browse`: The tool will crawl the website to perform the browser tasks, once the tasks are generated, you will see a brwowser pop up and you will be able to see the Agentic A.I browse for you. The browser for the /browse session will not be clossed until you close it with `/crawl`, `/browse`, `/research` commands.

<img src="./assets/arch.png" width=400 alt="webpilot cli architecture" />

#

---

## 4. Component Design

### 4.1 CLI Interface and Command Parser

- **Technologies:**

  - Langchain, Langgraph, OpenAI
  - NodeJS

- **Responsibilities:**
  - Accept and parse user inputs.
  - Dispatch commands to the appropriate modules.
  - invoke correct graph based on entered command.
  - generate chat thread id for every command invoked.
- **Key Features:**
  - Command aliasing.
  - Data presistance.
  - Great UI/UX

### 4.2 Searcher Agentic AI

- **Responsibilities and Key Features:**
  - Interpret search queries, including natural language and structured queries.
  - Interface with databases/APIs.
  - Presist search history into database.
  - Prompt to research
  - Create research report.

### 4.3 Crawler Agentic AI

- **Responsibilities and Key Features:**
  - Turn a prompt into crawl task
  - Presist crawled data into database.

### 4.4 Brwosser Agentic AI

- **Responsibilities and Key Features:**
  - Turn prompot into browser tasks.
  - Crawl required items from website.
  - perform browser tasks for the user.

### 4.5 Output Formatter and Reporting

- **Responsibilities and Key Features:**
  - Format and present results in various formats (console, JSON, CSV, PDF).
  - Support configurable verbosity and report templates.
