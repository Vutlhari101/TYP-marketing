# SyncCore — Team 46 marketing site

The Projects Day team website. Plain HTML, CSS and JavaScript: no frameworks,
no build step, no package manager, no external requests. Open `index.html` in a
browser and it runs.

```
Team46-Site/
  index.html        the whole page
  css/style.css     all styling
  js/main.js        nav, tabs, reveals, lightbox
  images/           logo, product screenshots, video poster
  video/            demo clip
```

## Colours

White page, SyncCore navy and orange everywhere that is not white. All defined
once at the top of `style.css`:

| Token | Value | Used for |
|---|---|---|
| `--orange` | `#f27a21` | accents, rules, active states, buttons |
| `--orange-dark` | `#c85a12` | button hover |
| `--navy-900` | `#0b1b3a` | dark section base, footer |
| `--navy-800` | `#132b55` | headings, dark gradient |
| `--navy-700` | `#1d3b6f` | borders, secondary accents |
| `--tint` | `#f3f6fa` | alternating section background |

Change a token and it updates everywhere.

## Before submitting

**1. Team member details.** In `index.html`, find `<section id="team">`. Three
members need their full surnames, and the `data-initials` on each avatar should
match. Add emails if you want them shown — the other teams' pages include them.

**2. The demo video.** Currently `video/synccore-demo.mp4` — the clip from the
product's own landing page, standing in until the real recording exists. Two
ways to swap it:

*Keep it self-hosted:* overwrite `video/synccore-demo.mp4`, and regenerate the
still frame as `images/video-poster.jpg` (any frame from the clip, 1280 px wide).

*Use YouTube instead:* in `<section id="demo">` replace the whole
`<div class="video-frame">` block with the iframe shown in the comment directly
above it. Note that a 6.5 MB MP4 is fine to host, but a long recording is better
on YouTube.

**3. Screenshots.** The images in `images/` were taken from the running system.
To swap one, overwrite the file keeping the same name and the layout will not
shift. Keep them under about 200 KB each.

## Hosting on the Projects Day site

Previous teams are published at
`adam.uj.ac.za/projectsday/teamweb/TeamNN/index.html`. Upload the whole folder
with its structure intact — all paths are relative, so it works from any
subdirectory without changes.

## Checked

- Valid HTML structure, balanced CSS, `node --check` clean on the JavaScript
- Every referenced asset resolves
- Responsive at 1320 px, 1000 px and 670 px
- Keyboard accessible: skip link, focusable tabs with arrow-key support,
  Escape closes the lightbox
- Honours `prefers-reduced-motion`
- Readable with JavaScript disabled, and has a print stylesheet
