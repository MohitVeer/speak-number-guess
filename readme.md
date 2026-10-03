# Speak Number Guess

A number-guessing game you play with your voice. The page picks a number between 1 and 100 and starts listening through the microphone as soon as it loads — you say a number out loud, and it tells you whether to guess higher or lower.

## Overview

This is a small experiment with the Web Speech API's `SpeechRecognition` interface: no typing, no buttons to press to submit a guess, just speech in and text feedback out. Recognition restarts automatically after each attempt so you can keep guessing without re-triggering anything.

## Why I Built It

I wanted hands-on practice with a browser API I hadn't used before, specifically the parts that are easy to gloss over in a tutorial: feature detection for an API that isn't implemented everywhere, and handling the asynchronous, event-driven lifecycle of a recognition session (start, result, error, end) instead of a simple request/response call.

## Features

- Random target number generated on load
- Continuous voice input via `SpeechRecognition`, auto-restarting after each guess
- Feedback for higher/lower/correct, plus messages for unparseable or out-of-range input
- A win screen with a "Play Again" button that reloads the page for a new round
- A visible fallback message in browsers without speech recognition support, instead of a crash
- An error message if the microphone can't be used (permission denied, no speech detected, etc.)

## JavaScript Concepts

- Feature detection (`window.SpeechRecognition || window.webkitSpeechRecognition`) before touching an API that doesn't exist in every browser
- Event-driven APIs: `result`, `error`, and `end` listeners on a `SpeechRecognition` instance
- Guarding against an unwanted side effect of an event handler (the `end` handler restarts listening, which had to be suppressed once the round is actually won)
- Basic input validation and coercion (`Number.isNaN`, range checks) on freeform speech transcripts
- `document.body.innerHTML` swaps to render an entirely different screen state

## How It Works

`SpeechRecognition` is normalized across vendor prefixes, and if neither is available the game shows a plain-text message instead of throwing. When supported, recognition starts immediately and its `result` event hands back a transcript, which gets parsed as a number and compared against the target. Because the `end` event is wired to automatically call `recognition.start()` again (so the game keeps listening after each guess), winning has to explicitly flag the round as over and call `recognition.stop()` — otherwise the auto-restart would keep the microphone listening in the background even after the "Congrats" screen replaces the page.

## How to Run

Open `index.html` in a Chromium-based browser (Chrome or Edge) over `http://localhost` or `https`, and allow microphone access when prompted. `SpeechRecognition` isn't implemented in Firefox and some other browsers, and it also generally requires a secure context.

## Technologies

HTML5, CSS3, vanilla JavaScript, Web Speech API (`SpeechRecognition`).

## What I Learned

Browser support for newer Web APIs can't be assumed — skipping feature detection here meant the whole script threw before anything rendered in a browser without `SpeechRecognition`. It was also a good reminder that auto-restart logic tied to a generic lifecycle event (like `end`) needs an explicit exit condition, or it'll keep firing in situations you didn't intend it for, like after the game is already won.

## Future Improvements

- The game starts listening automatically on load with no user gesture involved, which means the microphone permission prompt appears immediately and can feel abrupt. A "Start Listening" button would be a friendlier entry point.
- There's no manual fallback for guessing by typing if speech recognition fails or isn't available beyond the unsupported-browser message.
