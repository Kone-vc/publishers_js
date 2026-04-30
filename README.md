# Kone AI Publisher Widget

> **Increase monetization of a publisher site** by adding a free personal AI assistant — powered by Kone AI. One script tag. No dependencies. Works on any website.

---

## User flow
  → sees "AI assistant" as 300x600 banner on the right side
  → asks a question
  → AI answers based on the website content, with direct links to the content
  → If relevant, a recommendation sponsored link is added to the answer.

  Demo: 
  - https://dev.kone.vc/ai_assistant/index.html
  - https://dev.kone.vc/special_offers/index.html

---

## Publisher revenue

CPM per 300x600 banner on the right side.

---

## Publisher integration

  → IAB Rich media compatible
  → SafeFrame supported
  → No access to website from the widget.

---

## Files in this repository

```
publishers_js/
├── ai_assistant/           # AI assistant on the publisher's site content
│   ├── index.html          # run the banner in the iFrame
│   ├── kone-widget.js      # banner js code, complied with IAB requirements
│   └── kone-widget.zip     # zip with index.html and kone-widget.js
├── special_offers/         # Actual special offers via natural prompt
│   ├── index.html          # run the banner in the iFrame
│   ├── kone-widget.js      # banner js code, complied with IAB requirements
│   └── kone-widget.zip     # zip with index.html and kone-widget.js
└── README.md
```

---

## Privacy & compliance

- No cookies set by the widget
- No localStorage or sessionStorage used
- No device fingerprinting
- No PII collected — only the user's message text and publisher site URL are sent to the API
- Conversation state lives in JavaScript memory only — cleared on page reload
- Compliant with GDPR, UK GDPR, and CCPA by design.

---

## Support

| | |
|---|---|
| **Support** | [dev@kone.vc](mailto:dev@kone.vc) |
| **More AI agents** | [kone.vc/apps.html](https://kone.vc/apps.html) |
| **More monetization tools** | [Kone-vc github](https://github.com/orgs/Kone-vc/repositories) |
