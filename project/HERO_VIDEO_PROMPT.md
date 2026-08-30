# Vendor-UP Hero Video — Animation Prompt (EN)

**Deliverable:** 1920×1080, 60 fps, ~18.0 s seamless loop, no audio required (sound cues listed as optional sweetener), alpha not required. Source of truth for every layout is the static frame set in `2. Hero Video Frames.dc.html` (13 frames). Do not redesign layouts — animate them.

---

## 0. Before you capture — turn the guide overlay OFF

Every frame in `2. Hero Video Frames.dc.html` carries a violet dashed band across the bottom 432 px labelled **"랜딩 오버레이 영역 · 하단 432px (40%) — 그라데이션 + 카피가 얹힘"**. That band is a **layout guide for the designer only**. It must NOT appear in a single frame of the finished video.

- The band is controlled by the component prop **`showCopyGuide`**. Set it to **`false`** before exporting frames or recording the screen (in the Tweaks panel, or `data-props` default `showCopyGuide: false`).
- If you rebuild these scenes in After Effects / Figma / a generative video tool, simply do not draw the band, the dashed line, or its caption.
- Everything else about the band still applies as a **rule**: keep meaningful UI above y = 648, because the landing page lays its own gradient + headline over the bottom 432 px. The band is how that area is marked in the mockup, not something the video should show.
- Also excluded from the video: the frame labels above each scene (`01 scene01-phone-idle …`), which are part of the mockup document, not the footage.

## 1. Global rules

- **Canvas / safe area.** 1920×1080. Everything that must be readable lives in the **top 648 px (60 %)**. The bottom 432 px is covered on the landing page by a dark gradient + white headline. The phone body deliberately runs off the bottom edge of the frame — do not shrink it to fit.
- **One phone, one position.** All phone shots use the identical transform: centered horizontally, top edge at y = 80, width 487 px, bottom cropped by the frame edge. **There is no camera zoom and no phone reposition anywhere in the video.** Cuts between phone shots must be perfectly registered — if the phone shifts even 2 px, the cut reads as a mistake.
- **No text overlays, no captions, no logos other than the ones already in the frames.** The landing page supplies all copy.
- **Motion language.** Everything is UI motion, not camera motion: elements slide, fade, scale within 3 % , and fill in. Easing: `cubic-bezier(.22,1,.36,1)` (spring-out) for anything entering; `cubic-bezier(.4,0,.2,1)` for state changes; linear only for progress/skeleton shimmer.
- **Rhythm.** Two long dwell shots carry the story (03b = messy order, 05a/05b = clean result). Everything between them is short and quiet. Never animate two things at once in the same shot — one beat per shot.
- **Loop.** Frame 06 dissolves back into frame 01 over 0.5 s. The last 0.5 s and the first 0.5 s must be interchangeable.

---

## 2. Shot list, timing, and what animates

| # | Frame id | Dwell | What animates (and only this) | Emphasis beat | Optional sound |
| --- | --- | --- | --- | --- | --- |
| 01 | `scene01-phone-idle` | 1.5 s | Nothing. Lock screen holds dead still (clock 9:41). A 0.3 s 2 % brightness lift on the wallpaper at the very start is allowed to hide the loop seam. | Stillness. This is the "before" state. | — |
| 02a | `scene02-notification-in` | 1.5 s | **Notification banner slides down** from y = −banner height to its resting position over **0.35 s** with a soft overshoot (2 px past, settles back). Banner blur/opacity 0→1 in the first 0.15 s. Lock-screen clock dims 100 %→55 % over 0.4 s as the banner lands. | **THE ARRIVAL.** This is the first of three hero beats. Land the banner on the audio hit, hold 1.1 s so the sender name and the first line of the order are readable. | soft **"ding"** on the landing frame |
| 02b | `scene02-notification-tap` | 0.4 s | Banner **scale 1 → 0.97**, brightness −4 %, 1 px focus ring fades in at 60 % opacity. All in 0.12 s, held 0.28 s. Nothing else moves. | The tap. Small, physical, unmistakable. | subtle tap click |
| 03a | `scene03-chat-arrive` | 1.2 s | Chat room **cross-dissolves in over 0.2 s** (phone stays put). Then: date pill fades in, first bubble ("안녕하세요~ A매장입니다 / 내일 주문 넣을게요") **pops in** (scale .96→1, y +8→0, 0.25 s), then the **typing indicator** appears and its 3 dots pulse in a 0.9 s loop. | The conversation is alive — the typing dots promise more text is coming. | KakaoTalk-style receive tone |
| 03b | `scene03-chat-messy` | **3.0 s** | Typing indicator is **replaced** by the full messy order bubble: indicator scales to .9 + fades out (0.12 s), long bubble pops in in its place (scale .97→1, 0.28 s, spring). Timestamp fades in 0.15 s later. Then **absolute stillness for 2.4 s**. | **THE PROBLEM.** The viewer must have time to actually read the unstructured order. Do not cut early, do not add motion here. | — |
| — | transition 03b → 04a | 0.25 s | **White flash:** full-frame white wipes in over 0.1 s, holds 0.05 s, and the logo state is revealed under it. This is the only strong transition in the piece. | Hard reset from "problem" to "product". | — |
| 04a | `scene04-logo` | 1.0 s | Logo fades in 0→100 % over 0.3 s with a 1.02 → 1.00 scale settle. Holds. | Brand stamp. | optional brand tone |
| 04a-1 | `scene04-app-home` | 0.8 s | Logo **cross-dissolves (0.25 s)** into the phone home screen; the Vendor-UP app icon fades in **0.1 s after** the rest of the grid so the eye finds it. Optional 1 px violet glow pulse on the icon, once, 0.5 s. | "The app is on the phone." | — |
| 04a-2 | `scene04-app-tap` | 0.4 s | Vendor-UP icon **scale 1 → 0.93** + brightness −4 % (0.12 s), a soft radial highlight blooms under the finger position, and every **other** icon and the dock drop to 72 % opacity (0.15 s). | The launch tap. Same physical language as 02b — reuse the exact same curve. | tap click |
| 04a-3 | `scene04-app-entered` | 0.8 s | App UI enters: white screen wipes up from the icon position (0.2 s), top bar + logo settle, then the **"접속 완료" check chip** pops in (scale .9→1, 0.2 s) and the order card rises 12 px into place with skeleton lines already shimmering. | **CONNECTED.** The check mark is the beat — give it its own 0.15 s of nothing else moving. | short confirm blip |
| 04b | `scene04-web-enter` | 1.2 s | Cut (no dissolve) to the desktop screen. Card rises **12 px** and fades in over 0.3 s; the violet status dot begins a 1.2 s soft pulse; skeleton rows shimmer left→right, staggered 0.08 s apart. | "AI is working." Motion is a loop, not a progress bar. | — |
| 05a | `scene05-ai-result` | 2.5 s | Skeletons are **replaced row by row**: each of the 4 table rows wipes in top-down at **0.12 s intervals** (row opacity 0→1 + y −6→0). Item-code chips light up **last**, all four at once, 0.25 s after the final row, with a single 0.3 s violet glow. The "원문" line above the table fades in with row 1. | **THE PAYOFF.** Messy text became a table with our item codes. The chip light-up is the punctuation. | very soft tick per row |
| 05b | `scene05-approve` | 2.5 s | Card **grows downward** (height only — top edge must not move) over 0.3 s to reveal the approval bar; the "승인" button fades in with a 1.03 → 1.00 settle, then **one single glow pulse** (0.6 s, box-shadow spread 0 → 10 px → 0). Hold still afterwards. | **THE APPROVE BUTTON.** One pulse only. A second pulse turns it into an ad. | — |
| 06 | `scene06-split` | 1.2 s | The 05b card **scales to 0.53 and slides right** into its final position (0.4 s, ease-in-out) while the KakaoTalk original **slides in from off-frame left** (0.4 s, same curve, 0.05 s later). The circular arrow **pops in 0.3 s after both land** (scale .8→1, 0.2 s). Both captions fade in with their cards. | The whole story in one frame: unstructured in → structured out. | — |
| — | loop 06 → 01 | 0.5 s | Cross-dissolve straight into 01. Keep the dissolve slow enough that the split frame is still legible at 50 % opacity. | Hide the seam. | — |

**Running total:** 01 1.5 + 02a 1.5 + 02b 0.4 + 03a 1.2 + 03b 3.0 + 04a 1.0 + 04a-1 0.8 + 04a-2 0.4 + 04a-3 0.8 + 04b 1.2 + 05a 2.5 + 05b 2.5 + 06 1.2 ≈ **18.0 s** including the overlapping transitions.

---

## 3. Transition table (exact)

| From → To | Type | Duration | Notes |
| --- | --- | --- | --- |
| 01 → 02a | cut | 0 | Banner animates in after the cut, not across it. |
| 02a → 02b | cut | 0 | Identical banner position; only scale/brightness differ. |
| 02b → 03a | cross-dissolve | 0.2 s | Phone body must be pixel-identical on both sides so only the screen content changes. |
| 03a → 03b | in-shot replacement | 0.28 s | Not a cut. The typing indicator is swapped for the bubble inside the same shot. |
| 03b → 04a | **white flash** | 0.25 s | The only hard transition. |
| 04a → 04a-1 | cross-dissolve | 0.25 s | Logo dissolves; phone frame fades in already at final size. |
| 04a-1 → 04a-2 | cut | 0 | Same wallpaper, same icon grid. |
| 04a-2 → 04a-3 | wipe-up from icon | 0.2 s | Reads as an app opening; do not use a generic fade. |
| 04a-3 → 04b | cut | 0 | Deliberate device change (phone → desktop). Keep it a clean cut; a dissolve here looks like a mistake. |
| 04b → 05a | in-shot fill | 0.6 s | Skeletons become rows; nothing else changes. |
| 05a → 05b | in-shot growth | 0.3 s | Card grows down. Top edge locked. |
| 05b → 06 | move + scale | 0.4 s | Card travels; it is the same card, so never re-fade it. |
| 06 → 01 | cross-dissolve | 0.5 s | Loop seam. |

---

## 4. Three beats that must land

1. **The order arrives** (02a) — banner slide-down + "ding". If a viewer sees only one second of this video, this is the second they should see.
2. **The mess** (03b) — 2.4 s of complete stillness on the unstructured message. Resist any temptation to animate.
3. **The approval** (05a chips → 05b button) — item codes light up, then one glow pulse on 승인. This is the product promise: a human confirms, the machine typed.

---

## 5. Do not

- Do not move, scale, or rotate the phone between shots — no push-ins, no parallax, no tilt.
- Do not add text, arrows, badges, counters, or emoji that are not in the static frames.
- Do not put important UI below y = 648.
- Do not animate the approve button more than once, and never make it blink.
- Do not use a typewriter effect for the KakaoTalk message; it pops in as a whole bubble (a real message arrives at once).
- Do not shimmer or pulse anything during the 2.4 s hold in 03b.
- Do not add background music with a beat that competes with the "ding" at 02a.

---

## 6. Mockup detail reference (design QA pass, 2026-08-30)

Consistency rules the frames now follow — keep them if you re-draw anything:

| Item | Value |
| --- | --- |
| Order received | Fri **8월 28일**, 9:41–9:42 (lock screen, chat date pill, timestamps all agree) |
| Delivery date on every ERP screen | **2026. 8. 29. 배송** ("내일") |
| Customer | **A매장 사장님** (the restaurant sending the order) |
| Our own account in the app | **우리청과 · 전산 담당** |
| Order body (single source of truth) | 양파 10kg 2박스 / 계란 15판 / 대파 5단 / 청상추 2박스 / 세금계산서 발행 요청 |
| Item codes | VG-0142 양파 · EG-0031 계란 · VG-0088 대파 · VG-0210 청상추 |
| Messenger app icon | A **generic** yellow rounded-square icon with a plain speech-bubble glyph. It is deliberately **not** the KakaoTalk logo — do not substitute a real KakaoTalk mark, and do not add any third-party brand logo to the footage. Referring to "카카오톡" in UI text is fine. |
| Phone geometry | one phone, top y = 80, width 487 px, bottom cropped by the frame edge, identical in all 8 phone scenes |
| Deepest readable element per scene | 561 px (03b) / 601 px (05a) / 627 px (06) — all inside the 648 px safe band |

