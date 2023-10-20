# Issues Guide

This guide is designed to help you navigate through our project's issues based on their difficulty level.

## Table of Contents

1. [Good First Issues](#good-first-issues)
2. [Intermediate Issues](#intermediate-issues)
3. [Advanced Issues](#advanced-issues)
4. [Getting Started](#getting-started)

## Good First Issues

These are beginner-friendly issues that typically require less prior knowledge of the project. They serve as a great starting point for newcomers.

### Issue A - global optimisation/refactor

- Look at the code and the software design and look doing more optimized and good quality code.
- Both client and server could be better designed, espacially about oriented object.

### Issue A1 - improving the user interface

Give free rein to your imagination to improve the UI ! Especially the audio specter animaiton which is low res.

### Issue A2 - make the audio specter animation move when the user speaks

Version 1.0.0 makes the animation move only when the assistant speaks. it could be interesting to get a feedback of the app reccording the user too, but maybe not the same way. 1.0.0 uses a REC button.

## Intermediate Issues

These issues might require a bit more understanding of the project but are still approachable if you have some related experience.

### Issue B - Ability to handle very long reccords for transcription (electron client side)

By default, the Whisper API only supports files that are less than 25 MB. Over 25MB, the API fails. It implies to split audios.

More details here: [OpenAI API documentation](https://platform.openai.com/docs/guides/speech-to-text/longer-inputs)

### Issue C - avoiding saving reccords and 11labs answers as files

Avoiding file saving for user reccordings and 11labs answers should improve response time. Something like cache based save instead ?

Attention to the openAI transcription which currently requires a file path as parameter, perhaps a cache file path works ? As long as it is faster to process, to improve user experience with better response time.

### Isue C1 - refactoring electron client with typescript instead of using javascript

## Advanced Issues

These are challenging issues suitable for contributors who are familiar with the project or have a deep understanding of the relevant technologies.

### Issue D - Ability to handle one chat per client

As this was a prototype, we decided that initiating the node server initiate one chat. It means that every electron client connected to the websocket are using the same chat.

In order to go for a wider solution, it could be great to handle one chat per connected client

### Issue E - use text to speach stream feature from 11Labs API

1.0.0 version uses 11 labs text 2 speach: [documented here](https://docs.elevenlabs.io/api-reference/text-to-speech)

It should be a performance improvmeent to use the stream text 2 speach features available from ElevenLabs API: [here](https://docs.elevenlabs.io/api-reference/text-to-speech-stream)

### Issue F - improve phrase parsing strategy

Phrase parsing strategy is being done at server side. It gets the GPT stream answer (word by word) and split content by sentences/par of sentences to process them faster and respecting the order.

By analysing the assistant behaviour (user experience), improve phrase parser so it split GPT answer more efficiently (looking for better response time / better prononciation...)

### Issue G - Catching user voice without pressing space

Making automatic voice reccord, no need to press space bar anymore to reccord

### Issue H - Allowing the user to interrupt assistant while it speaking

Interrupting the assistant could be a great feature to improve user experience and chat realism.

## Getting Started

1. **Select an Issue**: Browse through the lists above and choose an issue you're interested in.
2. **Inform the project owners**: Comment on the issue expressing your interest. This ensures that multiple contributors aren't working on the same issue simultaneously.
3. **Review the Contributing Guide**: Before starting, familiarize yourself with the [contributing guidelines](./CONTRIBUTING.md) of the project.
4. **Fork, Clone, and Work**: Fork the project repository, clone your fork locally, create a new branch for your chosen issue, and start working! Don't forget to check the [Getting started guide]() to ease your work.
5. **Submit a Pull Request**: Once you've made your changes, push them to your fork and submit a pull request to the main repository.

Thank you for your interest in contributing to this project. Together, we can make this project even better!
