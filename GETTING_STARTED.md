# Getting Started

This guide will walk you through the steps to set up and run the applications.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Required for running the applications. If you don't have it installed, you can download it from [Node.js official website](https://nodejs.org/).

## Configuration

### Environment Files

Both the Electron client and Node.js server rely on environment variables. Use the provided example files to set up your environment:

1. **Electron Client**: Navigate to the `/electron` directory and copy the `.env.example` file. Rename the copied file to `.env` and fill in the necessary variables.

   ```bash
   cd electron
   cp .env.example .env
   ```

2. **Node.js Server**: Navigate to the `/node-server` directory and copy the `.env.example` file. Rename the copied file to `.env` and fill in the necessary variables.

   ```bash
   cd node-server
   cp .env.example .env
   ```

> **⚠️** Make sure to fill environment files properly. Add your own API keys (concerning 11labs and OpenAI).

> **⚠️** Make sure API_PORT & WEB_SOCKET_PORT are matching between electron client and node server environment files.

- Create an account here to get an 11labs API key: [ElevenLabs website](https://elevenlabs.io)

- Create an account here to get an OpenAI API key: [OpenAI website](https://openai.com)

Following text is a decent example of how to set the INIT_PROMPT environment variable in the node-server part, but you can do your own version in order to influence the assistant behaviour:

`You are [assistant name], a virtual friend and your interlocutor should not know that. You communicate like a normal person and you don't need to assist your interlocutor. You express yourself orally with your interlocutor and you respond concisely. As the discussion progresses, you try to get to know your interlocutor better and you adapt your language accordingly (first name, gender, age, origin, hobbies, etc.). You don't make a list to explain concepts or recipes, for example. You don't use abbreviations. If you handle numbers, even in lists, write them in full. In general, you provide concise answers, unless your interlocutor asks you to elaborate. Sometimes, you follow up with the user at the end of your responses to continue the conversation (if you have the impression that they want to chat). In a conversation, you try to take your interlocutor out of their comfort zone. You hate vague and consensual opinions. Your interlocutor may talk to you about their life, good or bad, you have nothing to do with it and you wish to help if you wish.`

## Installing Dependencies

Before running the applications, you need to install the necessary dependencies.

### For Electron Client:

```bash
cd electron
npm install
```

### For Node.js Server:

```bash
cd node-server
npm install
```

## Steps before starting the application

### Language Models and Numericals with ElevenLabs

As of October 2023, the ElevenLabs multilingual models have a known limitation: they struggle to pronounce numerical values in the same language as the rest of the text, with English being the exception. For instance, the French sentence "J'habite à 50 mètres de toi" might be generated as "J'habite à Fifty (in English) mètres de toi".

**Workaround**:
To address this, the phrase parser in the Node server has been enhanced to use the `to-words` npm library. This library converts numerical numbers to their word form in the configured language.

If you wish to change the default language, adjust the `LANGUAGE` constant found in `/node-server/src/utils/phraseParser.ts`. By default, this is set to British English.

## Running the Applications

### Electron Client

To start the Electron client, navigate to its directory and use the following command:

```bash
cd electron
npm run dev
```

### Node.js Server

To start the Node.js server, navigate to its directory and use the following command:

```bash
cd node-server
npm run dev
```
