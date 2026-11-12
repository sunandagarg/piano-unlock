# 30-Day Piano Unlock

A guided piano course for returning players and late beginners: 25 minutes a day, one step at a time, with notation that listens to you play.

This is slice 1, stage 1: the course as a standalone site, with microphone setup and note-by-note melody following.

## What is in the site

- 30 daily sessions across four pieces: Minuet in G, then Drops of Jupiter, This Year's Love and Let It Be, taught as chords and patterns.
- Staff notation with playback, and a keyboard that shows what is played.
- **Listen to me**: on melody steps the page hears your right hand through the microphone, marks each note and counts clean runs as coins.
- A one-time microphone check that measures how your piano is tuned.
- Ear and eye quizzes, a metronome, step timers, and a daily "too easy / too hard" rating.
- Progress stored in the browser, with export and import.

Sound from the microphone is analysed on the device. It is never uploaded or stored.

## Run it locally

No build step. Serve the folder and open it:

    python3 -m http.server 8000

then visit http://localhost:8000. The microphone needs `localhost` or an `https` address; opening `index.html` as a file will not allow it.

## Tests

    node test/listen.test.js

This feeds synthesised piano tones through the note tracker (normal and fast tempo, ringing notes, a noisy room, quiet playing, a flat-tuned piano, repeated notes and octave leaps). It does not replace testing on a real piano.

## Layout

| Path | What it holds |
|---|---|
| `index.html` | Page structure |
| `css/style.css` | Styles and colour tokens for light and dark |
| `js/content.js` | The course: songs, days, steps, quizzes |
| `js/listen.js` | Microphone input and the note tracker |
| `js/app.js` | Progress, sound, notation, listening UI, quizzes, views |
| `vendor/` | VexFlow (notation) and pitchy (pitch detection), with their licences |
| `fonts/` | Self-hosted fonts, with their licences |
| `test/` | Note tracker tests and the piano synthesiser they use |
| `BACKLOG.md` | Ideas and plan |

`vendor/pitchy.js` is pitchy 4.1.0 bundled with esbuild (`--format=iife --global-name=Pitchy`); `test/pitchy.node.js` is the same bundle for Node.

## Content and licences

- Minuet in G (attributed to Christian Petzold, from the Notebook for Anna Magdalena Bach) is in the public domain. The notes were checked against the Mutopia Project edition. The left hand of bars 25, 26 and 29 is slightly simplified.
- The pop songs are named and taught through chords and practice patterns. Their melodies, lyrics and sheet music are not reproduced; learners use their own licensed copy.
- VexFlow, pitchy and fft.js are MIT licensed. Bricolage Grotesque and Source Sans 3 are under the SIL Open Font Licence.
- No licence has been chosen yet for the course content and code in this repository.
