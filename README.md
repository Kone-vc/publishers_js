# Kone AI Publisher Widget

> **Increase monetization of your publisher site** by adding a free personal AI assistant — powered by Kone AI. One script tag. No dependencies. Works on any website.

---

## What it does

Adds a floating **"Ask AI"** button to your site. When clicked, a chat panel opens where users can ask anything — deals, tech, travel, health, finance, and more. The AI gives helpful, contextual answers and surfaces relevant product recommendations, generating CPA or CPC revenue for you.

```
User visits your site
  → sees "Ask AI" button (bottom-right)
  → clicks → chat panel opens
  → asks a question
  → AI answers + shows relevant offer
  → you earn revenue (CPA or CPC)
```

---

## Quick start

Paste this before your closing `</body>` tag:

```html
<script src="https://kone.vc/kone-widget.js"></script>
<script>
  KoneWidget.create({
    mode: 'inline' // New mode for IAB compliance
  });
</script>
```

That's it. The widget handles everything else — UI, chat, API calls, conversation state.

---

## Revenue models

| Model | How it works |
|-------|-------------|
| **CPA** | You earn a fixed amount per completed conversion (purchase, signup, etc.) |
| **CPC** | You earn per click on a recommended offer |

Both models are available. Choose during onboarding or switch anytime.

### Example — Fitness app, 100 MAU

20 sessions/month × 2 AI recommendations/session = **4,000 recommendation moments/month**

| Model | Rate | Result | Your 70% |
|-------|------|--------|----------|
| CPA | $20/conversion · 3% CVR | $2,400/month gross | **$1,680/month** |
| CPC | $0.50/click · 8% CTR | $160/month gross | **$112/month** |

At 10,000 MAU the CPA numbers scale to **$168,000/month gross**.

---

## Full configuration

```html
<script src="https://kone.vc/kone-widget.js"></script>
<script>
  KoneWidget.create({

    mode: 'inline' // New mode for IAB compliance

    // Accent color for buttons and UI elements (default: #5b6ef5)
    accentColor: '#5b6ef5',

    // Opening message shown to the user
    greeting: "Hi! 👋 I'm your free personal AI assistant.\n\nAsk me anything!",

  });
</script>
```

---

## How the AI API works

Every user message is sent to the Kone AI endpoint:

```
POST https://go.kone.vc/mcp/chat
Content-Type: application/json

{
  "url":         "YOUR_URL",
  "prompt":      "Where can I buy cheap running shoes?",
  "response_id": "optional-for-conversation-continuity"
}
```

**Response:**

```json
{
  "message":     "Here are the best places to buy cheap running shoes in the UK...",
  "response_id": "abc123"
}
```

The `response_id` is saved in memory and sent with follow-up messages to maintain conversation continuity. No cookies or localStorage are used — the session lives in memory only.

---

## Files in this repository

```
kone-widget.js     Full-featured widget (configurable, modular, UMD)
index.html         Initial html file for a publisher placement
README.md          This file
```

---

## Privacy & compliance

- No cookies set by the widget
- No localStorage or sessionStorage** used
- No device fingerprinting
- No PII collected — only the user's message text and your `siteUrl` are sent to the API
- Conversation state lives in JavaScript memory only — cleared on page reload
- Compliant with GDPR, UK GDPR, and CCPA by design

---

## Support

| | |
|---|---|
| **Support** | [dev@kone.vc](mailto:dev@kone.vc) |
| **More AI agents** | [kone.vc/apps.html](https://kone.vc/apps.html) |
