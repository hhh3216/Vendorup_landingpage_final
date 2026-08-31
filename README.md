## 배포 담당자에게 (2026-09-01)

문의하기 / 무료로 시작하기 폼을 **구글 시트 + 알림 메일**로 연결해 두었습니다.
다만 현재 `vendorup.kr`은 S3 정적 호스팅이라 **실제 사이트에서는 아직 접수가 되지 않습니다.**

배포 전에 반드시 읽어주세요 → **[project/INQUIRY_WEBHOOK_SETUP.md](project/INQUIRY_WEBHOOK_SETUP.md)**

- 필요한 환경변수: `INQUIRY_WEBHOOK_URL` (저장소에는 없음, 별도 전달)
- 로컬 실행: `npm install` → `npm run dev`

---

# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read the chat transcripts first.** There are 2 chat transcript(s) in `chats/`. The transcripts show the full back-and-forth between the user and the design assistant — they tell you **what the user actually wants** and **where they landed** after iterating. Don't skip them. The final HTML files are the output, but the chat is where the intent lives.

**Read `project/1. Landing Page.dc.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `README.md` — this file
- `chats/` — conversation transcripts (read these!)
- `project/` — the `영상 목업 수정 및 구체화` project files (HTML prototypes, assets, components)
