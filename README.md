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
    apiKey:  'YOUR_API_KEY',
  });
</script>
```

That's it. The widget handles everything else — UI, chat, API calls, conversation state.

**Get your API key → [acc.kone.vc](https://acc.kone.vc)**

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

    // Required
    apiKey:  'YOUR_API_KEY',

    // Accent color for buttons and UI elements (default: #5b6ef5)
    accentColor: '#5b6ef5',

    // Opening message shown to the user
    greeting: "Hi! 👋 I'm your free personal AI assistant.\n\nAsk me anything!",

    // Quick-question chips on the landing screen (2–6 recommended)
    quickChips: [
      { label: '👟 Cheap shoes UK',   question: 'Where can I buy cheap shoes in the UK?' },
      { label: '🤖 Top AI tools',     question: 'Recommend top AI tools for 2025' },
      { label: '💰 Best deals today', question: 'What are the best online deals today?' },
      { label: '✈️ Cheap travel',    question: 'What are cheap travel destinations right now?' },
      { label: '📱 Budget phones',    question: 'What are the best budget smartphones in 2025?' },
    ],

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
  "api_key":     "YOUR_API_KEY",
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

## Complete widget code

The full source of `kone-widget.js` is in this repository. Here is a minimal standalone version you can copy directly into any page:

```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body>

  <!-- Your page content -->

  <script>
  (function() {
    'use strict';

    var API  = 'https://go.kone.vc/mcp/chat';
    var KEY  = 'YOUR_API_KEY';
    var GREETING = "Hi! 👋 I'm your free personal AI assistant. Ask me anything!";

    var responseId = null;
    var isLoading  = false;
    var isOpen     = false;
    var greeted    = false;

    /* ── Inject styles ── */
    var style = document.createElement('style');
    style.textContent = [
      '#kw-root{font-family:system-ui,sans-serif;--a:#5b6ef5;--bg:#0d0d10;--s1:#141418;--s2:#1c1c22;',
      '--bd:#28282f;--tx:#eeedf2;--tx2:#9896a8;--tx3:#55535f;--g:#3ecf72}',
      '#kw-btn{position:fixed;bottom:24px;right:24px;z-index:2147483647;',
      'display:flex;align-items:center;gap:8px;background:var(--a);color:#fff;border:none;',
      'border-radius:50px;padding:12px 18px;cursor:pointer;font-size:14px;font-weight:600;',
      'box-shadow:0 4px 20px rgba(0,0,0,.4);transition:transform .2s,opacity .2s;font-family:inherit}',
      '#kw-btn:hover{transform:translateY(-2px)}',
      '#kw-btn.hide{opacity:0;pointer-events:none;transform:translateY(12px)}',
      '#kw-panel{position:fixed;bottom:86px;right:24px;z-index:2147483647;width:360px;height:520px;',
      'background:var(--bg);border:1px solid var(--bd);border-radius:14px;',
      'display:flex;flex-direction:column;overflow:hidden;',
      'box-shadow:0 20px 60px rgba(0,0,0,.8);',
      'opacity:0;pointer-events:none;transform:scale(.92) translateY(12px);transform-origin:bottom right;',
      'transition:opacity .2s,transform .2s cubic-bezier(.34,1.56,.64,1)}',
      '#kw-panel.open{opacity:1;pointer-events:auto;transform:scale(1) translateY(0)}',
      '#kw-hdr{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;',
      'border-bottom:1px solid var(--bd);background:var(--s1);flex-shrink:0}',
      '.kw-av{width:30px;height:30px;background:var(--a);border-radius:7px;display:flex;',
      'align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#fff}',
      '.kw-nm{font-size:12px;font-weight:600;color:var(--tx);margin-left:9px}',
      '.kw-x{background:none;border:none;color:var(--tx2);cursor:pointer;font-size:18px;padding:2px 6px}',
      '#kw-msgs{flex:1;overflow-y:auto;padding:10px 12px;display:flex;flex-direction:column;gap:6px}',
      '#kw-msgs::-webkit-scrollbar{width:3px}',
      '#kw-msgs::-webkit-scrollbar-thumb{background:var(--bd);border-radius:3px}',
      '.kw-msg{display:flex;gap:7px;align-items:flex-start;animation:kwUp .18s ease both}',
      '@keyframes kwUp{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}',
      '.kw-a{width:22px;height:22px;background:var(--a);border-radius:5px;flex-shrink:0;',
      'display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:800;color:#fff;margin-top:2px}',
      '.kw-u{background:#252528;border:1px solid var(--bd);color:var(--tx2)}',
      '.kw-txt{font-size:12.5px;line-height:1.65;color:var(--tx);white-space:pre-wrap;word-break:break-word}',
      '.kw-lbl{font-size:9.5px;font-weight:700;color:var(--tx3);text-transform:uppercase;letter-spacing:.04em;margin-bottom:3px}',
      '.kw-dot{display:flex;gap:4px;padding:4px 0}',
      '.kw-d{width:5px;height:5px;background:var(--tx3);border-radius:50%;animation:kwP 1.3s ease-in-out infinite}',
      '.kw-d:nth-child(2){animation-delay:.18s}.kw-d:nth-child(3){animation-delay:.36s}',
      '@keyframes kwP{0%,80%,100%{opacity:.2;transform:scale(.75)}40%{opacity:1;transform:scale(1)}}',
      '#kw-foot{padding:8px 12px 10px;border-top:1px solid var(--bd);background:var(--s1);flex-shrink:0}',
      '#kw-inp{width:100%;background:var(--s2);border:1px solid #333340;border-radius:9px;',
      'padding:9px 42px 9px 12px;color:var(--tx);font-size:12.5px;resize:none;outline:none;',
      'min-height:38px;max-height:100px;font-family:inherit;transition:border-color .15s}',
      '#kw-inp:focus{border-color:var(--a)}',
      '#kw-inp::placeholder{color:var(--tx3)}',
      '#kw-send{position:absolute;right:8px;bottom:8px;width:26px;height:26px;background:var(--a);',
      'border:none;border-radius:6px;cursor:pointer;color:#fff;font-size:14px;',
      'display:flex;align-items:center;justify-content:center}',
      '#kw-send:disabled{opacity:.3;cursor:not-allowed}',
      '.kw-wrap{position:relative}',
      '.kw-hint{font-size:10px;color:var(--tx3);text-align:center;margin-top:5px}',
    ].join('');
    document.head.appendChild(style);

    /* ── Inject HTML ── */
    var root = document.createElement('div');
    root.id = 'kw-root';
    root.innerHTML =
      '<button id="kw-btn">💬 Ask AI</button>' +
      '<div id="kw-panel">' +
        '<div id="kw-hdr">' +
          '<div style="display:flex;align-items:center">' +
            '<div class="kw-av">AI</div>' +
            '<span class="kw-nm">AI Assistant</span>' +
          '</div>' +
          '<button class="kw-x" id="kw-close">×</button>' +
        '</div>' +
        '<div id="kw-msgs"></div>' +
        '<div id="kw-foot">' +
          '<div class="kw-wrap">' +
            '<textarea id="kw-inp" placeholder="Ask me anything…" rows="1" maxlength="512"></textarea>' +
            '<button id="kw-send">↑</button>' +
          '</div>' +
          '<p class="kw-hint">Free personal AI assistant · <a href="https://kone.vc/apps.html" target="_blank" style="color:#9896a8">More AI agents ↗</a></p>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);

    /* ── Logic ── */
    var btn   = document.getElementById('kw-btn');
    var panel = document.getElementById('kw-panel');
    var msgs  = document.getElementById('kw-msgs');
    var inp   = document.getElementById('kw-inp');
    var send  = document.getElementById('kw-send');

    btn.addEventListener('click', function() {
      isOpen = true;
      panel.classList.add('open');
      btn.classList.add('hide');
      if (!greeted) { greeted = true; appendMsg('a', GREETING); }
      setTimeout(function(){ inp.focus(); }, 200);
    });

    document.getElementById('kw-close').addEventListener('click', function() {
      isOpen = false;
      panel.classList.remove('open');
      btn.classList.remove('hide');
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) document.getElementById('kw-close').click();
    });

    send.addEventListener('click', sendMsg);
    inp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(); }
    });
    inp.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });

    function sendMsg() {
      var text = inp.value.trim();
      if (!text || isLoading) return;
      inp.value = ''; inp.style.height = 'auto';
      doSend(text);
    }

    function esc(s) {
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function fmt(s) {
      var o = esc(s);
      o = o.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,'<a href="$2" target="_blank" style="color:#7b8fff">$1</a>');
      o = o.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
      o = o.replace(/^[-*] (.+)$/gm,'<span style="display:flex;gap:5px"><span style="color:#7b8fff">–</span><span>$1</span></span>');
      o = o.replace(/\n/g,'<br>');
      return o;
    }

    function appendMsg(role, text) {
      var isA = role === 'a';
      var row = document.createElement('div');
      row.className = 'kw-msg';
      row.innerHTML =
        '<div class="kw-a' + (isA ? '' : ' kw-u') + '">' + (isA ? 'AI' : 'U') + '</div>' +
        '<div><div class="kw-lbl">' + (isA ? 'AI Assistant' : 'You') + '</div>' +
        '<div class="kw-txt">' + (isA ? fmt(text) : esc(text)) + '</div></div>';
      msgs.appendChild(row);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function showTyping() {
      var row = document.createElement('div');
      row.className = 'kw-msg'; row.id = 'kw-typing';
      row.innerHTML = '<div class="kw-a">AI</div><div><div class="kw-lbl">AI Assistant</div>' +
        '<div class="kw-dot"><div class="kw-d"></div><div class="kw-d"></div><div class="kw-d"></div></div></div>';
      msgs.appendChild(row); msgs.scrollTop = msgs.scrollHeight;
      return row;
    }

    function removeEl(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }

    async function doSend(prompt) {
      isLoading = true; send.disabled = true;
      appendMsg('u', prompt);
      var t = showTyping();
      var payload = { url: SITE, prompt: prompt, api_key: KEY };
      if (responseId) payload.response_id = responseId;
      try {
        var res = await fetch(API, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        removeEl(t);
        if (!res.ok) { appendMsg('a', '⚠️ Error ' + res.status + '. Please try again.'); }
        else {
          var data = null; try { data = await res.json(); } catch(e) {}
          if (data && typeof data === 'object') {
            if (data.response_id) responseId = String(data.response_id);
            appendMsg('a', data.message || data.response || data.text || data.content || JSON.stringify(data));
          } else {
            var raw = ''; try { raw = await res.text(); } catch(e) {}
            appendMsg('a', raw || 'Empty response.');
          }
        }
      } catch(err) { removeEl(t); appendMsg('a', '⚠️ Connection error.\n' + err.message); }
      isLoading = false; send.disabled = false; inp.focus();
    }

  })();
  </script>

</body>
</html>
```

---

## Files in this repository

```
kone-widget.js     Full-featured widget (configurable, modular, UMD)
example.html       Working demo page
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
| **Get API key** | [acc.kone.vc](https://acc.kone.vc) |
| **Support** | [dev@kone.vc](mailto:dev@kone.vc) |
| **More AI agents** | [kone.vc/apps.html](https://kone.vc/apps.html) |
