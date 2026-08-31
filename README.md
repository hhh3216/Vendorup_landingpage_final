## 배포 담당자에게 (2026-09-01)

문의하기 / 무료로 시작하기 폼을 **구글 시트 + 알림 메일**로 연결했습니다.
정적 배포(S3) 그대로 동작하도록 브라우저가 구글로 직접 보내는 방식이라 **호스팅은 바꾸지 않아도 됩니다.**

**빌드할 때 아래 환경변수가 반드시 있어야 합니다.** 없으면 폼이 동작하지 않습니다.

```
NEXT_PUBLIC_INQUIRY_WEBHOOK_URL=<Apps Script /exec 주소>
```

저장소에는 값이 없으니 별도로 전달받아 `.env.local`에 넣거나 CI 환경변수로 등록하세요.

자세한 내용 → **[project/INQUIRY_WEBHOOK_SETUP.md](project/INQUIRY_WEBHOOK_SETUP.md)**

```bash
npm install
npm run dev      # 로컬 개발
npm run build    # out/ 생성 → 배포
```

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
