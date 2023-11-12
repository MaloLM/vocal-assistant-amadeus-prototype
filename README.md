# Amadeus Prototype

### Product introduction

Amadeus is a cutting-edge personal assistant prototype, tapping into the recent advancements in the generative AI domain. Designed with a novel human-machine interface (HMI) in mind, this prototype allows users to engage in vocal interactions with a sophisticated AI, specifically a Large Language Model. Amadeus comprises two core components: an Electron client and a Node server. The genesis of this prototype serves as a proof of concept, with ambitions geared towards a broader commercial deployment.

## DEMO VIDEO

[![Watch the product presentation video here](https://img.youtube.com/vi/B64jnq85leU/maxresdefault.jpg)](https://www.youtube.com/watch?v=B64jnq85leU)

## Technical Description

For anyone intrigued by Amadeus prototype and keen on exploring its functionalities, here's a breakdown of how you can interact with the project:

### 1. How prototype Works

![An image describing how the application is working at high level. User reccords what he/she/they says through an electron client, electron client does speach to text thank to OpenAI transcription. Then, electron client shares text to the node server which manages GPT answer and finnaly answer back GPT sentences to the electron client through a web socket. When sentences are received through web socket, client ask elevenlabs api for text to speach. Finally, client plays the generated voice messages in order.](./readme_assets/images/proto-overview.png)

- **Composition:** Amadeus is structured around two primary elements and two external dependencies.
  - **Primary Elements:**
    - An Electron client, developed in JavaScript.
    - A Node server application, developed in TypeScript.
  - **External Dependencies:**
    - GPT from OpenAI.
    - ElevenLabs.

The image above provides a high-level overview of the application's workflow:

1. **User Voice Input**: The user verbally communicates with the Electron client, which captures the spoken content. in version 1.0.0, user press space bar to talk.

2. **Speech-to-Text**: Utilizing OpenAI's transcription capabilities, the Electron client transcribes the user's voice input into text.

3. **Communication with Node Server**: The transcribed text is relayed to the Node server, which interacts with GPT to generate a response.

4. **Receiving the Response**: The Node server sends the GPT-generated sentences back to the Electron client via a WebSocket connection.

5. **Text-to-Speech**: Upon receiving the text response, the Electron client collaborates with the ElevenLabs API to convert the text into spoken words.

6. **Playback**: The Electron client then sequentially plays back the generated voice messages to the user.

## Contributors (GitHub)

- [@MaloLM](https://github.com/MaloLM/)
- [@Kévin Chea](https://github.com/Kevin-Chea/)

## CONTRIBUTE

We welcome contributions from everyone, irrespective of their origin. Here's how you can help:

1. **Understand our Code of Conduct**: Before contributing, please read our [Code of Conduct](./CODE_OF_CONDUCT.md). We expect all our contributors to adhere to it.

2. **Start with your First Issues**: If you're new to the project, we recommend starting with issues labeled inside [the issues guide](./ISSUES_GUIDE.md).

3. **Read the Getting Started guide**: Detailed instructions on setting up the dev environment and contributing can be found in our [Getting started Guide](./GETTING_STARTED.md).

Remember, every contribution, whether it's code, documentation, translations, or even reporting bugs, is valuable to us. Let's make this project better together!

## CONNECT WITH PROJECT OWNER

<div> 
   <a href="https://portfolio.dopee.io/#/contact" target="_blank">
      <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=maildotru&logoColor=white" alt="E-mail" height=40>
   </a>
   
   <a href="https://portfolio.dopee.io" target="_blank">
      <img src="https://img.shields.io/badge/Portefolio-green?style=for-the-badge&logo=vuedotjs&logoColor=white" alt="Portefolio" height=40>
   </a>
   
   <a href="https://www.linkedin.com/in/malo-le-mestre/" target="_blank">
      <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="Linkedin" height=40>
   </a>
</div>